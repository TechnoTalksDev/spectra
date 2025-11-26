import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpSupportPage() {
  const insets = useSafeAreaInsets();
  
  const faqs: FAQ[] = [
    {
      question: 'How do I use AI Vision?',
      answer: 'The AI Vision feature is coming soon! It will allow you to point your camera at objects and get real-time AI-powered descriptions and assistance.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard encryption and security practices. Your data is stored securely and we never share it with third parties without your consent.',
    },
    {
      question: 'How do I update my profile?',
      answer: 'Go to Profile > Edit Profile to update your name and other information. Changes are saved automatically.',
    },
    {
      question: 'Can I change my email?',
      answer: 'Email changes are currently managed through your account settings. Contact support if you need assistance.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'You can delete your account from Profile > Privacy & Security > Delete Account. This action is permanent and cannot be undone.',
    },
  ];

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleEmailSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = 'naman@spectra.com';
    const subject = 'Spectra Support Request';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Email Not Available', 'Please email us at naman@spectra.com');
      }
    } catch (error) {
      Alert.alert('Contact Support', 'Please reach out to us at:\nnaman@spectra.com');
    }
  };

  const handleOpenDocs = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Documentation', 'Documentation portal coming soon!');
  };

  const handleOpenCommunity = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Community', 'Community forum coming soon!');
  };

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleFAQ = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <AppIcon name="arrow-back" size={24} color={SpectraColors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Contact Card */}
        <GlassCard variant="surface" style={styles.contactCard}>
          <View style={styles.contactIconContainer}>
            <AppIcon name="chatbubbles" size={48} color={SpectraColors.primary.main} />
          </View>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactDescription}>
            Our support team is here to assist you
          </Text>
          <GlassButton
            title="Email Support"
            variant="primary"
            size="large"
            onPress={handleEmailSupport}
            style={styles.contactButton}
          />
          <Text style={styles.contactEmail}>naman@spectra.com</Text>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <GlassCard variant="surface" style={styles.card}>
          <TouchableOpacity style={styles.actionItem} onPress={handleOpenDocs}>
            <View style={styles.actionIconContainer}>
              <AppIcon name="document-text" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Documentation</Text>
              <Text style={styles.actionDescription}>Browse our guides and tutorials</Text>
            </View>
            <AppIcon name="chevron-forward" size={20} color={SpectraColors.text.light} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleOpenCommunity}>
            <View style={styles.actionIconContainer}>
              <AppIcon name="people" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Community</Text>
              <Text style={styles.actionDescription}>Connect with other users</Text>
            </View>
            <AppIcon name="chevron-forward" size={20} color={SpectraColors.text.light} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('App Version', 'Spectra v1.0.0\n\nYou\'re running the latest version!');
            }}
          >
            <View style={styles.actionIconContainer}>
              <AppIcon name="information-circle" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>About</Text>
              <Text style={styles.actionDescription}>Version 1.0.0</Text>
            </View>
            <AppIcon name="chevron-forward" size={20} color={SpectraColors.text.light} />
          </TouchableOpacity>
        </GlassCard>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <GlassCard variant="surface" style={styles.card}>
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <AppIcon
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={SpectraColors.text.secondary}
                  />
                </View>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
              {index < faqs.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </GlassCard>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Can't find what you're looking for?
          </Text>
          <TouchableOpacity onPress={handleEmailSupport}>
            <Text style={styles.footerLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.text.primary,
  },
  headerSpacer: {
    width: 44,
  },
  contactCard: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 24,
  },
  contactIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(115, 113, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  contactButton: {
    width: '100%',
    marginBottom: 12,
  },
  contactEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: SpectraColors.primary.main,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 24,
    padding: 0,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SpectraColors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: SpectraColors.surface.accent,
    marginHorizontal: 16,
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
    marginTop: 12,
  },
  footerInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: SpectraColors.primary.main,
  },
});
