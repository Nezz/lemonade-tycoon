import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherType } from '../engine/types';
import { WEATHER_DATA } from '../engine/constants';
import { C, PIXEL_FONT, F } from '../theme/pixel';

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
    backgroundColor: C.panel,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: C.border,
    gap: 6,
  },
  badgeSmall: {
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  emoji: {
    fontSize: 16,
  },
  emojiSmall: {
    fontSize: 12,
  },
  text: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  textSmall: {
    fontSize: F.tiny,
  },
});
