import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Inventory } from "@/engine/types";
import { SUPPLY_DEFINITIONS, SUPPLY_IDS } from "@/engine/constants";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

interface InventoryBarProps {
  inventory: Inventory;
}

export default function InventoryBar({ inventory }: InventoryBarProps) {
  return (
    <View style={styles.container}>
      {SUPPLY_IDS.map((id) => {
        const def = SUPPLY_DEFINITIONS[id];
        return (
          <View key={id} style={styles.item}>
            <Text style={styles.emoji}>{def.emoji}</Text>
            <Text style={styles.count}>{inventory[id]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    ...pixelPanel,
    ...pixelBevel,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  item: {
    alignItems: "center",
    gap: 2,
  },
  emoji: {
    fontSize: 18,
  },
  count: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
});
