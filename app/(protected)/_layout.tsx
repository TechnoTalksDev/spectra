import { AnimatedBackground } from "@/components/ui/animated-background";
import { SpectraColors } from "@/constants/theme";
import { useProfile } from "@/hooks/useProfile";
import { useSupabase } from "@/hooks/useSupabase";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function ProtectedLayout() {
  const { session, isLoaded: authLoaded } = useSupabase();
  const { profile, loading: profileLoading, hasProfile } = useProfile();
  const router = useRouter();
  const segments = useSegments();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('[Protected Layout] useEffect triggered', {
      authLoaded,
      hasSession: !!session,
      profileLoading,
      hasProfile,
      segments,
      profile,
    });

    if (!authLoaded) {
      console.log('[Protected Layout] Auth not loaded yet, waiting...');
      return;
    }

    // If no session, redirect to sign-in
    if (!session) {
      console.log('[Protected Layout] No session, redirecting to sign-in');
      router.replace("/(public)/sign-in");
      return;
    }

    // Wait for profile to load
    if (profileLoading) {
      console.log('[Protected Layout] Profile still loading, waiting...');
      return;
    }

    // If profile doesn't exist and not on onboarding page, redirect to onboarding
    const inOnboarding = segments[segments.length - 1] === "onboarding";
    console.log('[Protected Layout] Navigation check:', { hasProfile, inOnboarding });
    
    if (!hasProfile && !inOnboarding) {
      console.log('[Protected Layout] No profile and not on onboarding, redirecting to onboarding');
      router.replace("/(protected)/onboarding");
    } else if (hasProfile && inOnboarding) {
      // If profile exists and somehow on onboarding, redirect to tabs
      console.log('[Protected Layout] Profile exists and on onboarding, redirecting to tabs!');
      router.replace("/(protected)/(tabs)");
    } else {
      console.log('[Protected Layout] No redirect needed');
    }

    setIsChecking(false);
  }, [authLoaded, session, profileLoading, hasProfile, segments, profile]);

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
