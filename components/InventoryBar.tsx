import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Inventory } from "@/engine/types";
import { SUPPLY_DEFINITIONS, SUPPLY_IDS } from "@/engine/constants";
import PixelIcon from "@/components/PixelIcon";
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
            <PixelIcon emoji={def.emoji} size={38} />
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
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  item: {
    alignItems: "center",
    gap: 4,
  },
  count: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
});
