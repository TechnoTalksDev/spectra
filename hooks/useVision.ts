import { useState } from 'react';
import { geminiVision, VisionAnalysis } from '@/services/gemini-vision';
import * as Speech from 'expo-speech';

export const useVision = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VisionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const analyze = async (
    base64Image: string,
    mode: 'quick' | 'detailed' | 'accessibility' | 'continuous' = 'quick'
  ) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const analysis = await geminiVision.analyzeImage(base64Image, mode);
      setResult(analysis);
      return analysis;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze image';
      setError(errorMessage);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeWithQuestion = async (base64Image: string, question: string) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await geminiVision.analyzeImageWithContext(base64Image, question);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze image';
      setError(errorMessage);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  const speak = async (text: string, rate: number = 1.0) => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    
    try {
      await Speech.speak(text, {
        rate,
        pitch: 1.0,
        language: 'en-US',
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch (err) {
      console.error('Speech error:', err);
      setSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return {
    analyze,
    analyzeWithQuestion,
    speak,
    stopSpeaking,
    analyzing,
    result,
    error,
    speaking,
  };
};
