import { NativeTabs, Label } from "expo-router/unstable-native-tabs";
import { SpectraColors } from "@/constants/theme";
import { AppIcon } from "@/components/ui/app-icon";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <AppIcon name="home" size={24} color={SpectraColors.primary.main} />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="vision">
        <Label>Vision</Label>
        <AppIcon name="eye" size={24} color={SpectraColors.primary.main} />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <AppIcon name="person" size={24} color={SpectraColors.primary.main} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
