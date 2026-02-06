import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENT_DEFINITIONS, ACHIEVEMENT_IDS } from '../../engine/achievements';

export default function AchievementsScreen() {
  const achievements = useGameStore((s) => s.achievements);

  const unlocked = ACHIEVEMENT_IDS.filter((id) => achievements[id]);
  const locked = ACHIEVEMENT_IDS.filter((id) => !achievements[id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            {unlocked.length} / {ACHIEVEMENT_IDS.length}
          </Text>
          <Text style={styles.progressLabel}>Achievements Unlocked</Text>
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
            <Text style={styles.sectionTitle}>Unlocked</Text>
            {unlocked.map((id) => {
              const def = ACHIEVEMENT_DEFINITIONS[id];
              return (
                <View key={id} style={styles.achievementCard}>
                  <Text style={styles.achievementEmoji}>{def.emoji}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{def.name}</Text>
                    <Text style={styles.achievementDesc}>{def.description}</Text>
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
            <Text style={styles.sectionTitle}>Locked</Text>
            {locked.map((id) => {
              const def = ACHIEVEMENT_DEFINITIONS[id];
              return (
                <View key={id} style={[styles.achievementCard, styles.lockedCard]}>
                  <Text style={[styles.achievementEmoji, styles.lockedEmoji]}>?</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  progressText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#78350F',
  },
  progressLabel: {
    fontSize: 14,
    color: '#78716C',
    marginTop: 4,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F5F5F4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#84CC16',
    borderRadius: 4,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 12,
  },
  lockedCard: {
    backgroundColor: '#F5F5F4',
    borderColor: '#E7E5E4',
  },
  achievementEmoji: {
    fontSize: 24,
    width: 36,
    textAlign: 'center',
  },
  lockedEmoji: {
    color: '#A8A29E',
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#57534E',
    marginTop: 2,
  },
  lockedText: {
    color: '#A8A29E',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
});
