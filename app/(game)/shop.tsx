import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGameStore } from "@/store/gameStore";
import MoneyDisplay from "@/components/MoneyDisplay";
import InventoryBar from "@/components/InventoryBar";
import SupplyCard from "@/components/SupplyCard";
import EventBanner from "@/components/EventBanner";
import {
  SUPPLY_IDS,
  SUPPLY_DEFINITIONS,
  MAX_INVENTORY_BASE,
} from "@/engine/constants";
import { getEventDefinition } from "@/engine/events";
import { aggregateEffects } from "@/engine/upgrades";
import PixelIcon from "@/components/PixelIcon";
import {
  C,
  PIXEL_FONT,
  F,
  pixelPanel,
  pixelBevel,
  pixelTrack,
  pixelFill,
} from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";

export default function ShopScreen() {
  const money = useGameStore((s) => s.money);
  const inventory = useGameStore((s) => s.inventory);
  const inventoryBatches = useGameStore((s) => s.inventoryBatches);
  const day = useGameStore((s) => s.day);
  const buySupply = useGameStore((s) => s.buySupply);
  const discardSupply = useGameStore((s) => s.discardSupply);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const upgrades = useGameStore((s) => s.upgrades);
  const effects = aggregateEffects(upgrades);
  const maxInventory = MAX_INVENTORY_BASE + effects.inventoryBonus;

  const hasSupplyEvent = activeEvent
    ? getEventDefinition(activeEvent.id).supplyCostMultiplier !== 1.0
    : false;

  const totalInventory = Object.values(inventory).reduce(
    (sum, v) => sum + v,
    0,
  );
  const fillRatio = Math.min(totalInventory / maxInventory, 1);
  const isFull = totalInventory >= maxInventory;

  return (
    <StripedBackground>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <MoneyDisplay amount={money} />

        {activeEvent && hasSupplyEvent && <EventBanner event={activeEvent} />}

        <InventoryBar inventory={inventory} />

        {/* Total Capacity Bar */}
        <View style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>STORAGE</Text>
            <Text style={[styles.capacityCount, isFull && styles.capacityFull]}>
              {totalInventory}/{maxInventory}
            </Text>
          </View>
          <View style={styles.capacityTrack}>
            <View
              style={[
                styles.capacityFill,
                { width: `${fillRatio * 100}%` as any },
                fillRatio > 0.9 && styles.capacityFillWarn,
                isFull && styles.capacityFillFull,
              ]}
            />
          </View>
        </View>

        {/* Spoilage Warning */}
        {SUPPLY_IDS.map((id) => {
          const def = SUPPLY_DEFINITIONS[id];
          if (!def.shelfLife || def.meltsOvernight) {
            return null;
          }
          const batches = inventoryBatches[id];
          const expiringToday = batches.filter(
            (b) => day - b.purchasedOnDay >= def.shelfLife! - 1,
          );
          const expiringAmount = expiringToday.reduce(
            (sum, b) => sum + b.amount,
            0,
          );
          if (expiringAmount === 0) {
            return null;
          }
          return (
            <View key={`spoil-${id}`} style={styles.spoilWarning}>
              <View style={styles.spoilRow}>
                <PixelIcon emoji={def.emoji} size={14} />
                <Text style={styles.spoilText}>
                  {expiringAmount} {def.unit} EXPIRING!
                </Text>
              </View>
            </View>
          );
        })}

        {SUPPLY_IDS.map((id) => (
          <SupplyCard
            key={id}
            supplyId={id}
            currentStock={inventory[id]}
            totalInventory={totalInventory}
            maxInventory={maxInventory}
            money={money}
            onBuy={buySupply}
            onDiscard={discardSupply}
          />
        ))}

        {/* Shelf life info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>SHELF LIFE</Text>
          {SUPPLY_IDS.map((id) => {
            const def = SUPPLY_DEFINITIONS[id];
            let lifeText: string;
            if (def.meltsOvernight) {
              const bonus = effects.iceShelfBonus;
              lifeText = bonus > 0 ? `${1 + bonus} days` : "Melts overnight";
            } else if (def.shelfLife) {
              const bonus =
                id === "lemons"
                  ? effects.lemonShelfBonus
                  : id === "sugar"
                    ? effects.sugarShelfBonus
                    : 0;
              lifeText = `${def.shelfLife + bonus} days`;
            } else {
              lifeText = "Never spoils";
            }
            return (
              <View key={id} style={styles.infoRow}>
                <View style={styles.infoLabelRow}>
                  <PixelIcon emoji={def.emoji} size={14} />
                  <Text style={styles.infoLabel}>{def.label}</Text>
                </View>
                <Text style={styles.infoValue}>{lifeText}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 12,
    gap: 8,
    paddingBottom: 32,
  },
  capacityCard: {
    ...pixelPanel,
    ...pixelBevel,
    padding: 10,
  },
  capacityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  capacityLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  capacityCount: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  capacityFull: {
    color: C.red,
  },
  capacityTrack: {
    ...pixelTrack,
  },
  capacityFill: {
    ...pixelFill,
  },
  capacityFillWarn: {
    backgroundColor: C.gold,
  },
  capacityFillFull: {
    backgroundColor: C.red,
  },
  spoilWarning: {
    backgroundColor: C.redDark,
    borderRadius: 0,
    padding: 8,
    borderWidth: 2,
    borderColor: C.red,
  },
  spoilRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  spoilText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.redLight,
    textAlign: "center",
  },
  infoCard: {
    ...pixelPanel,
    ...pixelBevel,
  },
  infoTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textLight,
  },
  infoValue: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
});
