import { GlassButton } from "@/components/ui/glass-button";
import { SpectraColors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(public)/sign-up");
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(public)/sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/spectra.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Spectra</Text>
          <Text style={styles.subtitle}>
            AI-powered visual assistance for a clearer world
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <GlassButton
          title="Get Started"
          variant="primary"
          size="large"
          onPress={handleGetStarted}
          style={styles.button}
        />
        <GlassButton
          title="Sign In"
          variant="secondary"
          size="large"
          onPress={handleSignIn}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SpectraColors.background.main,
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: SpectraColors.primary.main,
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500",
    color: SpectraColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
