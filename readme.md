# Spectra

## Introduction

**Spectra** is a premium AI-powered visual assistance app designed to help vision-impaired users navigate and understand their surroundings with confidence. Built with cutting-edge technology and a beautiful, accessible interface.

### ✨ Features

- 🎨 **Premium Glassmorphic UI** - Beautiful, modern design with smooth animations
- 👆 **Haptic Feedback** - Tactile responses for better accessibility
- 🔐 **Secure Authentication** - Email verification with Supabase
- 📱 **Native Feel** - Built with React Native and Expo for iOS and Android
- 🎯 **AI Vision** - Visual assistance powered by GPT-4 Vision
- 🎙️ **Voice Interaction** - Real-time voice conversations with GPT-4 Realtime API using WebRTC

## Get Started

1. **Update environment variables**
   
   Create a `.env` file in the root directory with:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_KEY=your_supabase_key
   EXPO_PUBLIC_OPENAI_REALTIME_ENDPOINT=https://api.openai.com/v1/realtime
   EXPO_PUBLIC_OPENAI_REALTIME_KEY=your_openai_api_key
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start the Expo development server**

   ```bash
   bunx expo start
   ```

## Architecture

### Tech Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: Custom glassmorphic components
- **Animations**: React Native Reanimated
- **Authentication**: Supabase
- **Haptics**: Expo Haptics
- **State Management**: React Context

### Project Structure

```
app/
  (public)/          # Public routes (welcome, sign-in, sign-up)
  (protected)/       # Protected routes (home, vision, profile)
    (tabs)/          # Tab navigation
components/
  ui/                # Reusable UI components
    glass-card.tsx
    glass-button.tsx
    glass-input.tsx
    animated-background.tsx
constants/
  theme.ts           # Color palette and theme config
```

## Design System

### Color Palette

```
Primary:     #7371fc (Vibrant Periwinkle)
Card:        #e6d9f2 (Soft Lavender)
Background:  #f4effe (Ultra-light Lavender)
```

### Components

See [UI Components Documentation](./docs/UI_COMPONENTS.md) for detailed usage.

## Development Roadmap

- [x] Authentication (Sign In/Sign Up)
- [x] Protected Routes
- [x] Premium UI with Glassmorphism
- [x] Haptic Feedback Integration
- [x] Home Dashboard
- [x] Profile Page
- [x] AI Vision Implementation (GPT-4 Vision)
- [x] Real-time Camera Feed
- [x] Realtime Voice Interaction (GPT-4 Realtime API)
- [ ] Object Recognition Enhancement
- [ ] Custom Email Templates (Supabase)

## Docs

- [NativeWind](https://www.nativewind.dev/docs)
- [Reusables](https://reactnativereusables.com/docs)
- [Expo](https://docs.expo.dev/versions/latest/)
- [Supabase](https://supabase.com/docs)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
