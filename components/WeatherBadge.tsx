import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherType } from '../engine/types';
import { WEATHER_DATA } from '../engine/constants';

interface WeatherBadgeProps {
  weather: WeatherType;
  label?: string;
  small?: boolean;
}

export default function WeatherBadge({ weather, label, small = false }: WeatherBadgeProps) {
  const info = WEATHER_DATA[weather];

  return (
    <View style={[styles.badge, small && styles.badgeSmall]}>
      <Text style={[styles.emoji, small && styles.emojiSmall]}>{info.emoji}</Text>
      <Text style={[styles.text, small && styles.textSmall]}>
        {label ?? info.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  badgeSmall: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  emoji: {
    fontSize: 20,
  },
  emojiSmall: {
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  textSmall: {
    fontSize: 12,
  },
});
