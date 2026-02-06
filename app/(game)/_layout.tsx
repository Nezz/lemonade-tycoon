import { Stack, useRouter } from "expo-router";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { C, PIXEL_FONT, F } from "../../theme/pixel";

const modalOptions = {
  presentation: "modal" as const,
  animation: "slide_from_bottom" as const,
  headerLeft: () => null,
  headerRight: () => <CloseButton />,
};

function CloseButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(game)/day");
        }
      }}
      style={styles.closeBtn}
    >
      <Text style={styles.closeText}>[X]</Text>
    </Pressable>
  );
}

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: C.headerBg },
        headerTintColor: C.text,
        headerTitleStyle: { fontFamily: PIXEL_FONT, fontSize: F.small, color: C.text },
        contentStyle: { backgroundColor: C.bg },
        animation: "slide_from_right",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="day"
        options={{
          headerBackVisible: false,
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerEmoji}>🍋</Text>
              <Text style={styles.headerTitleText}>LEMONADE TYCOON</Text>
            </View>
          ),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="shop"
        options={{ title: "SUPPLY SHOP", ...modalOptions }}
      />
      <Stack.Screen
        name="recipe"
        options={{ title: "RECIPE LAB", ...modalOptions }}
      />
      <Stack.Screen
        name="upgrades"
        options={{ title: "UPGRADES", ...modalOptions }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: "DAY RESULTS",
          headerBackVisible: false,
          gestureEnabled: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="stats"
        options={{ title: "STATISTICS", ...modalOptions }}
      />
      <Stack.Screen
        name="achievements"
        options={{ title: "ACHIEVEMENTS", ...modalOptions }}
      />
      <Stack.Screen
        name="gameover"
        options={{
          title: "GAME OVER",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="victory"
        options={{
          title: "VICTORY!",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerEmoji: {
    fontSize: F.small,
  },
  headerTitleText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  closeBtn: {
    paddingLeft: 16,
    paddingVertical: 4,
  },
  closeText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
});
