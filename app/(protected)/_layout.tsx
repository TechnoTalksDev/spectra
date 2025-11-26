import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useSupabase } from "@/hooks/useSupabase";
import { useProfile } from "@/hooks/useProfile";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SpectraColors } from "@/constants/theme";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function ProtectedLayout() {
  const { session, isLoaded: authLoaded } = useSupabase();
  const { profile, loading: profileLoading, hasProfile } = useProfile();
  const router = useRouter();
  const segments = useSegments();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!authLoaded) return;

    // If no session, redirect to sign-in
    if (!session) {
      router.replace("/(public)/sign-in");
      return;
    }

    // Wait for profile to load
    if (profileLoading) return;

    // If profile doesn't exist and not on onboarding page, redirect to onboarding
    const inOnboarding = segments[segments.length - 1] === "onboarding";
    const inEditProfile = segments[segments.length - 1] === "edit-profile";
    
    if (!hasProfile && !inOnboarding && !inEditProfile) {
      router.replace("/(protected)/onboarding");
    } else if (hasProfile && inOnboarding) {
      // If profile exists and somehow on onboarding, redirect to tabs
      router.replace("/(protected)/(tabs)");
    }

    setIsChecking(false);
  }, [authLoaded, session, profileLoading, hasProfile, segments]);

  // Show loading screen while checking auth and profile status
  if (!authLoaded || profileLoading || isChecking) {
    return (
      <AnimatedBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SpectraColors.primary.main} />
        </View>
      </AnimatedBackground>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="help-support"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
