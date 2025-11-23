import { Tabs } from "expo-router";
import { SpectraColors } from "@/constants/theme";
import { AppIcon } from "@/components/ui/app-icon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: SpectraColors.primary.main,
        tabBarInactiveTintColor: SpectraColors.text.light,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="vision"
        options={{
          title: "Vision",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="eye" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
