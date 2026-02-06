import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WeatherType } from "@/engine/types";
import { WEATHER_DATA } from "@/engine/constants";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F } from "@/theme/pixel";

interface WeatherBadgeProps {
  weather: WeatherType;
  label?: string;
  small?: boolean;
}

export default function WeatherBadge({
  weather,
  label,
  small = false,
}: WeatherBadgeProps) {
  const info = WEATHER_DATA[weather];

  return (
    <View style={[styles.badge, small && styles.badgeSmall]}>
      <PixelIcon emoji={info.emoji} size={small ? 12 : 16} />
      <Text style={[styles.text, small && styles.textSmall]}>
        {label ?? info.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
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
  text: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  textSmall: {
    fontSize: F.tiny,
  },
});
