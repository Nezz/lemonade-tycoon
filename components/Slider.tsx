import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { C, PIXEL_FONT, F } from "@/theme/pixel";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

/**
 * Simple discrete step slider using tap buttons — pixel art style.
 */
export default function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: SliderProps) {
  const steps: number[] = [];
  for (let i = min; i <= max; i += step) {
    steps.push(Math.round(i * 100) / 100);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowBtn, value <= min && styles.arrowBtnDisabled]}
        onPress={() =>
          onChange(Math.max(min, Math.round((value - step) * 100) / 100))
        }
        disabled={value <= min}
      >
        <Text style={[styles.arrow, value <= min && styles.arrowDisabled]}>
          {"<"}
        </Text>
      </TouchableOpacity>

      <View style={styles.track}>
        {steps.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.dot, s <= value && styles.dotActive]}
            onPress={() => onChange(s)}
          >
            <View
              style={[styles.dotInner, s === value && styles.dotSelected]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.arrowBtn, value >= max && styles.arrowBtnDisabled]}
        onPress={() =>
          onChange(Math.min(max, Math.round((value + step) * 100) / 100))
        }
        disabled={value >= max}
      >
        <Text style={[styles.arrow, value >= max && styles.arrowDisabled]}>
          {">"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: C.border,
    backgroundColor: C.panelDark,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBtnDisabled: {
    opacity: 0.4,
  },
  arrow: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  arrowDisabled: {
    color: C.textMuted,
  },
  track: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 32,
    backgroundColor: C.bgLight,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 0,
    paddingHorizontal: 4,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    backgroundColor: C.greenDark,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  dotSelected: {
    backgroundColor: C.green,
  },
});
