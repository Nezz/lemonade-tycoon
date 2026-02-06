import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Inventory, Recipe, SupplyId } from "@/engine/types";
import { SUPPLY_DEFINITIONS, SUPPLY_IDS } from "@/engine/constants";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

const RECIPE_KEY: Partial<Record<SupplyId, keyof Recipe>> = {
  lemons: "lemonsPerCup",
  sugar: "sugarPerCup",
  ice: "icePerCup",
};

interface InventoryBarProps {
  inventory: Inventory;
  recipe: Recipe;
}

export default function InventoryBar({ inventory, recipe }: InventoryBarProps) {
  return (
    <View style={styles.container}>
      {SUPPLY_IDS.map((id) => {
        const def = SUPPLY_DEFINITIONS[id];
        const recipeKey = RECIPE_KEY[id];
        const perCup = recipeKey ? recipe[recipeKey] : null;
        return (
          <View key={id} style={styles.item}>
            <View style={styles.iconRow}>
              {perCup != null && <Text style={styles.recipe}>{perCup}</Text>}
              <PixelIcon emoji={def.emoji} size={38} />
            </View>
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
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  recipe: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.textLight,
  },
  count: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
});
