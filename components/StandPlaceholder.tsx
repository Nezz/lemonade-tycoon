import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C, PIXEL_FONT, F, pixelBevel } from "@/theme/pixel";

/**
 * Placeholder component for the lemonade stand visualization — pixel art style.
 */
export default function StandPlaceholder() {
  return (
    <View style={styles.container}>
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
