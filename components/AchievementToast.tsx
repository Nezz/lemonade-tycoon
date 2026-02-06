import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AchievementId } from '../engine/types';
import { ACHIEVEMENT_DEFINITIONS } from '../engine/achievements';

interface AchievementToastProps {
  achievementIds: AchievementId[];
}

export default function AchievementToast({ achievementIds }: AchievementToastProps) {
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
              <Text style={styles.unlocked}>Achievement Unlocked!</Text>
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
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 100,
    gap: 6,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  unlocked: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A16207',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F',
  },
});
