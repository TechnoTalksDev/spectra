import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/context/theme-context';
import { useVision } from '@/hooks/useVision';
import { useVisionHistory } from '@/hooks/useVisionHistory';

const { height, width } = Dimensions.get('window');

type VisionMode = 'quick' | 'detailed' | 'accessibility' | 'continuous';

export default function VisionPage() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { analyze, analyzeWithQuestion, speak, stopSpeaking, analyzing, result, error, speaking } = useVision();
  const { saveToHistory } = useVisionHistory();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [mode, setMode] = useState<VisionMode>('quick');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Vision Error', error);
    }
  }, [error]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsProcessing(true);
      
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      
      if (photo?.base64) {
        setCapturedImage(photo.uri);
        const analysisResult = await analyze(photo.base64, mode);
        
        // Save to history
        if (analysisResult) {
          await saveToHistory(analysisResult, mode, photo.uri);
        }
      }
    } catch (err) {
      Alert.alert('Capture Failed', 'Could not take photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGalleryPick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setCapturedImage(result.assets[0].uri);
        setIsProcessing(true);
        const analysisResult = await analyze(result.assets[0].base64, mode);
        
        // Save to history
        if (analysisResult) {
          await saveToHistory(analysisResult, mode, result.assets[0].uri);
        }
        
        setIsProcessing(false);
      }
    } catch (err) {
      Alert.alert('Gallery Error', 'Could not pick image');
    }
  };

  const handleSpeak = () => {
    if (result?.description && !speaking) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      speak(result.description);
    } else if (speaking) {
      stopSpeaking();
    }
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCapturedImage(null);
  };

  const toggleCamera = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.main }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.main, paddingTop: insets.top }]}>
        <View style={styles.permissionContainer}>
          <AppIcon name="camera" size={64} color={colors.primary.main} />
          <Text style={[styles.permissionTitle, { color: colors.text.primary }]}>Camera Permission Required</Text>
          <Text style={[styles.permissionText, { color: colors.text.secondary }]}>
            We need access to your camera to provide AI vision assistance.
          </Text>
          <GlassButton 
            title="Grant Permission" 
            variant="primary" 
            onPress={requestPermission} 
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      {/* Camera/Image View */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={cameraType}
          />
        )}

        {/* Top Bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <View style={[styles.modeIndicator, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)' }]}>
            <AppIcon 
              name={mode === 'quick' ? 'flash' : mode === 'detailed' ? 'search' : mode === 'accessibility' ? 'eye' : 'scan'} 
              size={18} 
              color="#fff" 
            />
            <Text style={styles.modeText}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</Text>
          </View>

          <View style={styles.topRightButtons}>
            {!capturedImage && (
              <TouchableOpacity onPress={toggleCamera} style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)' }]}>
                <AppIcon name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push('/(protected)/vision-history')} style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)' }]}>
              <AppIcon name="time" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Processing Overlay */}
        {(analyzing || isProcessing) && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingText}>Analyzing...</Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Mode Selector */}
        {!capturedImage && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeSelector}
          >
            {(['quick', 'detailed', 'accessibility', 'continuous'] as VisionMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMode(m);
                }}
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: mode === m ? colors.primary.main : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                  }
                ]}
              >
                <Text style={[styles.modeButtonText, { color: mode === m ? '#fff' : colors.text.secondary }]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Result Card */}
        {result && (
          <GlassCard variant="surface" style={styles.resultCard}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.resultScroll}>
              <Text style={[styles.resultTitle, { color: colors.text.primary }]}>Analysis</Text>
              <Text style={[styles.resultText, { color: colors.text.secondary }]}>{result.description}</Text>

              {result.objects.length > 0 && (
                <View style={styles.objectsContainer}>
                  <Text style={[styles.objectsTitle, { color: colors.text.primary }]}>Objects Detected</Text>
                  <View style={styles.objectsList}>
                    {result.objects.map((obj, idx) => (
                      <View key={idx} style={[styles.objectTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Text style={[styles.objectText, { color: colors.text.secondary }]}>{obj}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {result.accessibility && (
                <View style={styles.accessibilityContainer}>
                  <Text style={[styles.accessibilityTitle, { color: colors.text.primary }]}>Accessibility</Text>
                  <Text style={[styles.accessibilityText, { color: colors.text.secondary }]}>{result.accessibility}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.resultActions}>
              <GlassButton
                title={speaking ? "Stop" : "Speak"}
                variant="primary"
                onPress={handleSpeak}
                style={styles.speakButton}
              />
              <GlassButton
                title="Retake"
                variant="secondary"
                onPress={handleRetake}
                style={styles.retakeButton}
              />
            </View>
          </GlassCard>
        )}

        {/* Capture Controls */}
        {!capturedImage && (
          <View style={styles.captureControls}>
            <TouchableOpacity onPress={handleGalleryPick} style={[styles.galleryButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)' }]}>
              <AppIcon name="images" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleCapture} 
              style={styles.captureButton}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={{ width: 56 }} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  modeSelector: {
    gap: 10,
    paddingVertical: 12,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
  },
  resultCard: {
    maxHeight: height * 0.5,
  },
  resultScroll: {
    maxHeight: height * 0.35,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  objectsContainer: {
    marginBottom: 16,
  },
  objectsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  objectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  objectTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  objectText: {
    fontSize: 13,
    fontWeight: '500',
  },
  accessibilityContainer: {
    marginBottom: 16,
  },
  accessibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  accessibilityText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  speakButton: {
    flex: 1,
  },
  retakeButton: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 8,
  },
});
