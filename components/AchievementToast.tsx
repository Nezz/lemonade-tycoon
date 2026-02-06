import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { AchievementId } from "../engine/types";
import { ACHIEVEMENT_DEFINITIONS } from "../engine/achievements";
import { C, PIXEL_FONT, F } from "../theme/pixel";

interface AchievementToastProps {
  achievementIds: AchievementId[];
}

export default function AchievementToast({
  achievementIds,
}: AchievementToastProps) {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (achievementIds.length > 0) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [achievementIds]);

  if (achievementIds.length === 0) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {achievementIds.map((id) => {
        const def = ACHIEVEMENT_DEFINITIONS[id];
        return (
          <View key={id} style={styles.toast}>
            <Text style={styles.emoji}>{def.emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.unlocked}>ACHIEVEMENT!</Text>
              <Text style={styles.name}>{def.name}</Text>
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 8,
    left: 12,
    right: 12,
    zIndex: 100,
    gap: 6,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.warning,
    borderRadius: 0,
    padding: 10,
    borderWidth: 3,
    borderTopColor: C.borderLight,
    borderLeftColor: C.borderLight,
    borderBottomColor: C.borderDark,
    borderRightColor: C.borderDark,
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  unlocked: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.gold,
    letterSpacing: 1,
  },
  name: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    marginTop: 2,
  },
});
