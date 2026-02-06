import React from "react";
import { View, Text, StyleSheet, type ViewStyle } from "react-native";
import { C, PIXEL_FONT, F, pixelBevel } from "@/theme/pixel";

interface StandPlaceholderProps {
  style?: ViewStyle;
}

/**
 * Placeholder component for the lemonade stand visualization — pixel art style.
 */
export default function StandPlaceholder({ style }: StandPlaceholderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>YOUR LEMONADE STAND</Text>
      <Text style={styles.hint}>* Build your stand here *</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 180,
    borderWidth: 3,
    borderColor: C.border,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bgLight,
    marginVertical: 8,
    ...pixelBevel,
  },
  label: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.gold,
    marginBottom: 6,
  },
  hint: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
});
