import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UpgradeId, UpgradeCategory } from "@/engine/types";
import { UPGRADE_DEFINITIONS } from "@/engine/constants";
import { formatMoney } from "@/utils/format";
import GameButton from "@/components/GameButton";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

const CATEGORY_LABELS: Record<UpgradeCategory, string> = {
  stand: "Stand",
  signage: "Signage",
  cooling: "Cooling",
  storage: "Storage",
  recipe: "Recipe",
  weather: "Weather",
  marketing: "Marketing",
  experience: "Experience",
  supply: "Supply Chain",
  speed: "Speed",
  staff: "Staff",
  technology: "Technology",
  decor: "Decor",
  special: "Special",
};

interface UpgradeCardProps {
  upgradeId: UpgradeId;
  owned: boolean;
  locked: boolean;
  money: number;
  requiresNames: string[];
  onBuy: (upgradeId: UpgradeId) => boolean;
}

export default function UpgradeCard({
  upgradeId,
  owned,
  locked,
  money,
  requiresNames,
  onBuy,
}: UpgradeCardProps) {
  const def = UPGRADE_DEFINITIONS[upgradeId];
  const canAfford = def.cost <= money;
  const isStand = def.category === "stand";

  return (
    <View
      style={[
        styles.card,
        owned && styles.cardOwned,
        locked && styles.cardLocked,
        isStand && !locked && !owned && styles.cardStand,
        isStand && owned && styles.cardStandOwned,
      ]}
    >
      <View style={styles.left}>
        {locked ? (
          <Text style={[styles.emoji, styles.emojiLocked]}>?</Text>
        ) : (
          <PixelIcon emoji={def.emoji} size={22} style={styles.iconMargin} />
        )}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                locked && styles.nameLocked,
                isStand && styles.nameStand,
              ]}
            >
              {def.name}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                isStand && styles.categoryBadgeStand,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  isStand && styles.categoryTextStand,
                ]}
              >
                {CATEGORY_LABELS[def.category]}
              </Text>
            </View>
          </View>
          <Text style={[styles.desc, locked && styles.descLocked]}>
            {def.description}
          </Text>
          {locked && requiresNames.length > 0 && (
            <Text style={styles.requiresText}>
              Needs: {requiresNames.join(", ")}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        {owned ? (
          <View style={[styles.ownedBadge, isStand && styles.ownedBadgeStand]}>
            <Text style={styles.ownedText}>OK</Text>
          </View>
        ) : locked ? (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>{formatMoney(def.cost)}</Text>
          </View>
        ) : (
          <GameButton
            title={formatMoney(def.cost)}
            onPress={() => onBuy(upgradeId)}
            disabled={!canAfford}
            small
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...pixelPanel,
    ...pixelBevel,
    marginBottom: 6,
    padding: 10,
  },
  cardOwned: {
    backgroundColor: C.achievePanel,
    borderColor: C.greenDark,
  },
  cardLocked: {
    backgroundColor: C.lockedPanel,
    borderColor: C.lockedBorder,
    opacity: 0.65,
  },
  cardStand: {
    backgroundColor: C.warning,
    borderColor: C.gold,
    borderWidth: 3,
  },
  cardStandOwned: {
    backgroundColor: C.panelDark,
    borderColor: C.gold,
    borderWidth: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emoji: {
    fontSize: 22,
    marginRight: 10,
  },
  emojiLocked: {
    opacity: 0.4,
  },
  iconMargin: {
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  nameLocked: {
    color: C.textMuted,
  },
  nameStand: {
    fontSize: F.body,
    color: C.gold,
  },
  categoryBadge: {
    backgroundColor: C.panelDark,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 0,
  },
  categoryBadgeStand: {
    backgroundColor: C.warning,
    borderColor: C.gold,
  },
  categoryText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
  categoryTextStand: {
    color: C.gold,
  },
  desc: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textLight,
    marginTop: 3,
    lineHeight: 30,
  },
  descLocked: {
    color: C.textMuted,
  },
  requiresText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.red,
    marginTop: 3,
  },
  right: {
    marginLeft: 8,
  },
  ownedBadge: {
    backgroundColor: C.greenDark,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: C.green,
    borderRadius: 0,
  },
  ownedBadgeStand: {
    backgroundColor: C.gold,
    borderColor: C.btnPrimaryLo,
  },
  ownedText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.white,
  },
  lockedBadge: {
    backgroundColor: C.lockedPanel,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: C.lockedBorder,
    borderRadius: 0,
  },
  lockedText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
  },
});
