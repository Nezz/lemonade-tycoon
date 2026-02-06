import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@/components/Slider";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F } from "@/theme/pixel";

interface RecipeSliderProps {
  label: string;
  emoji: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  onChange: (value: number) => void;
}

export default function RecipeSlider({
  label,
  emoji,
  value,
  min,
  max,
  step = 1,
  unit = "",
  hint,
  onChange,
}: RecipeSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PixelIcon emoji={emoji} size={16} style={styles.iconMargin} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  iconMargin: {
    marginRight: 6,
  },
  label: {
    flex: 1,
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  value: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.green,
    minWidth: 40,
    textAlign: "right",
  },
  hint: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.green,
    marginBottom: 4,
    marginLeft: 22,
  },
});
