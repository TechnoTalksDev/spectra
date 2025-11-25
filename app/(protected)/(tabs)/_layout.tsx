import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  const createTabBarIcon = (iconName: any, focused: boolean, color: string) => {
    const scaleAnim = React.useRef(new Animated.Value(focused ? 1 : 0.9)).current;
    const opacityAnim = React.useRef(new Animated.Value(focused ? 1 : 0.6)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: focused ? 1 : 0.9,
          useNativeDriver: true,
          tension: 300,
          friction: 20,
        }),
        Animated.timing(opacityAnim, {
          toValue: focused ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, [focused]);

    return (
      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Ionicons
            name={focused ? iconName : `${iconName}-outline`}
            size={focused ? 32 : 30}
            color={focused ? colors.primary.main : color}
          />
        </Animated.View>
      </View>
    );
  };

  const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
      <View style={styles.tabBarContainer}>
        <BlurView
        
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={styles.blurView}
          experimentalBlurMethod="dimezisBlurView"
        >
          <View
            style={[
              styles.tabBar,
              {
                borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              },
            ]}
          >
            <View
              style={[
                styles.topHighlight,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.8)",
                },
              ]}
            />

            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                  activeOpacity={0.7}
                >
                  {options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? colors.primary.main : colors.text.secondary,
                  })}
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => createTabBarIcon("home", focused, color),
        }}
      />

      <Tabs.Screen
        name="vision"
        options={{
          title: "Vision",
          tabBarIcon: ({ color, focused }) => createTabBarIcon("eye", focused, color),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => createTabBarIcon("compass", focused, color),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => createTabBarIcon("pulse", focused, color),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => createTabBarIcon("person", focused, color),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurView: {
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 88,
    paddingBottom: 28,
    paddingTop: 12,
    borderTopWidth: 0.5,
    position: "relative",
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    minHeight: 56,
  },
  tabButtonActive: {},
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
