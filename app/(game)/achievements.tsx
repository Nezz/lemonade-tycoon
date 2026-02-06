import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGameStore } from "@/store/gameStore";
import {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_IDS,
} from "@/engine/achievements";
import PixelIcon from "@/components/PixelIcon";
import {
  C,
  PIXEL_FONT,
  F,
  pixelPanel,
  pixelBevel,
  pixelTrack,
  pixelFill,
} from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";

export default function AchievementsScreen() {
  const achievements = useGameStore((s) => s.achievements);

  const unlocked = ACHIEVEMENT_IDS.filter((id) => achievements[id]);
  const locked = ACHIEVEMENT_IDS.filter((id) => !achievements[id]);

  return (
    <StripedBackground>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            {unlocked.length}/{ACHIEVEMENT_IDS.length}
          </Text>
          <Text style={styles.progressLabel}>ACHIEVEMENTS</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(unlocked.length / ACHIEVEMENT_IDS.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UNLOCKED</Text>
            {unlocked.map((id) => {
              const def = ACHIEVEMENT_DEFINITIONS[id];
              return (
                <View key={id} style={styles.achievementCard}>
                  <View style={styles.achievementIconWrap}>
                    <PixelIcon emoji={def.emoji} size={40} />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{def.name}</Text>
                    <Text style={styles.achievementDesc}>
                      {def.description}
                    </Text>
                  </View>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCKED</Text>
            {locked.map((id) => {
              const def = ACHIEVEMENT_DEFINITIONS[id];
              return (
                <View
                  key={id}
                  style={[styles.achievementCard, styles.lockedCard]}
                >
                  <View
                    style={[styles.achievementIconWrap, styles.lockedIconWrap]}
                  >
                    <Text style={styles.lockedEmoji}>?</Text>
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementName, styles.lockedText]}>
                      {def.name}
                    </Text>
                    <Text style={[styles.achievementDesc, styles.lockedText]}>
                      {def.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
    gap: 10,
  },
  progressCard: {
    ...pixelPanel,
    ...pixelBevel,
    padding: 16,
    alignItems: "center",
  },
  progressText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.title,
    color: C.gold,
  },
  progressLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
    marginTop: 4,
    marginBottom: 10,
  },
  progressBar: {
    ...pixelTrack,
    width: "100%",
  },
  progressFill: {
    ...pixelFill,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.textLight,
    marginBottom: 2,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.achievePanel,
    borderRadius: 0,
    padding: 10,
    borderWidth: 2,
    borderColor: C.greenDark,
    gap: 10,
  },
  lockedCard: {
    backgroundColor: C.lockedPanel,
    borderColor: C.lockedBorder,
  },
  achievementIconWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedIconWrap: {
    opacity: 0.5,
  },
  lockedEmoji: {
    fontFamily: PIXEL_FONT,
    color: C.textMuted,
    fontSize: F.heading,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  achievementDesc: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textLight,
    marginTop: 3,
    lineHeight: 30,
  },
  lockedText: {
    color: C.textMuted,
  },
  checkmark: {
    fontFamily: PIXEL_FONT,
    fontSize: F.title,
    color: C.green,
  },
});
