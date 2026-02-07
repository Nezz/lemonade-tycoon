import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SupplyId } from "@/engine/types";
import { SUPPLY_DEFINITIONS } from "@/engine/constants";
import { formatMoney } from "@/utils/format";
import GameButton from "@/components/GameButton";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

interface SupplyCardProps {
  supplyId: SupplyId;
  currentStock: number;
  totalInventory: number;
  maxInventory: number;
  money: number;
  costMultiplier: number;
  onBuy: (supplyId: SupplyId, packs: number) => boolean;
  onDiscard: (supplyId: SupplyId, amount: number) => boolean;
}

export default function SupplyCard({
  supplyId,
  currentStock,
  totalInventory,
  maxInventory,
  money,
  costMultiplier,
  onBuy,
  onDiscard,
}: SupplyCardProps) {
  const [packs, setPacks] = useState(1);
  const def = SUPPLY_DEFINITIONS[supplyId];
  const totalCost =
    Math.round(def.packCost * packs * costMultiplier * 100) / 100;
  const totalUnits = def.packSize * packs;
  const canAfford = totalCost <= money;
  const isFull = totalInventory >= maxInventory;
  const spaceLeft = maxInventory - totalInventory;
  const unitsKept = Math.min(totalUnits, spaceLeft);
  const discardAmount = Math.min(totalUnits, currentStock);

  const handleBuy = () => {
    const success = onBuy(supplyId, packs);
    if (success) {
      setPacks(1);
    }
  };

  const handleDiscard = () => {
    const success = onDiscard(supplyId, discardAmount);
    if (success) {
      setPacks(1);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <PixelIcon emoji={def.emoji} size={30} style={styles.iconMargin} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{def.label}</Text>
          <Text style={styles.packInfo}>
            {def.packSize} {def.unit}/pack
          </Text>
        </View>
        <View style={styles.stockBadge}>
          <Text style={styles.stock}>{currentStock}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setPacks(Math.max(1, packs - 1))}
          >
            <Text style={styles.qtyBtnText}>[-]</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{packs}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setPacks(packs + 1)}
          >
            <Text style={styles.qtyBtnText}>[+]</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.costInfo}>
          <Text style={styles.costLabel}>
            +{unitsKept}
            {unitsKept < totalUnits ? `/${totalUnits}` : ""} {def.unit}
          </Text>
          <Text
            style={[
              styles.cost,
              costMultiplier > 1 && styles.costUp,
              costMultiplier < 1 && styles.costDown,
              !canAfford && styles.costRed,
            ]}
          >
            {formatMoney(totalCost)}
          </Text>
        </View>

        {isFull ? (
          <GameButton
            title="DUMP"
            onPress={handleDiscard}
            disabled={currentStock === 0}
            variant="danger"
            haptic
            small
            style={styles.buyBtn}
          />
        ) : (
          <GameButton
            title="BUY"
            onPress={handleBuy}
            disabled={!canAfford}
            haptic
            small
            style={styles.buyBtn}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...pixelPanel,
    ...pixelBevel,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconMargin: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  packInfo: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    marginTop: 2,
  },
  stockBadge: {
    backgroundColor: C.panelDark,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stock: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  qtyBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyBtnText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  qtyText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    minWidth: 20,
    textAlign: "center",
  },
  costInfo: {
    flex: 1,
    alignItems: "center",
  },
  costLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
  cost: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.gold,
  },
  costUp: {
    color: C.red,
  },
  costDown: {
    color: C.green,
  },
  costRed: {
    color: C.red,
  },
  buyBtn: {
    minWidth: 60,
  },
});
