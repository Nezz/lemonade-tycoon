import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import MoneyDisplay from '../../components/MoneyDisplay';
import UpgradeCard from '../../components/UpgradeCard';
import { UPGRADE_IDS, UPGRADE_DEFINITIONS, TIER_NAMES, TIER_COUNT } from '../../engine/constants';
import { UpgradeId } from '../../engine/types';
import { C, PIXEL_FONT, F, pixelTrack, pixelFill } from '../../theme/pixel';
import StripedBackground from '../../components/StripedBackground';

const TIER_COLORS: Record<number, string> = {
  1: C.tierGray,
  2: C.tierBlue,
  3: C.tierPurple,
  4: C.tierOrange,
  5: C.tierRed,
  6: C.tierViolet,
  7: C.tierPink,
};

export default function UpgradesScreen() {
  const money = useGameStore((s) => s.money);
  const upgrades = useGameStore((s) => s.upgrades);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  const tiers = Array.from({ length: TIER_COUNT }, (_, i) => i + 1);

  const tierGroups = useMemo(() => {
    const groups: Record<number, UpgradeId[]> = {};
    for (const tier of tiers) {
      const tierIds = UPGRADE_IDS.filter((id) => UPGRADE_DEFINITIONS[id].tier === tier);
      const standIds = tierIds.filter((id) => UPGRADE_DEFINITIONS[id].category === 'stand');
      const otherIds = tierIds.filter((id) => UPGRADE_DEFINITIONS[id].category !== 'stand');
      groups[tier] = [...otherIds, ...standIds];
    }
    return groups;
  }, []);

  const tierOwnedCounts = useMemo(() => {
    const counts: Record<number, { owned: number; total: number }> = {};
    for (const tier of tiers) {
      const tierIds = tierGroups[tier] || [];
      counts[tier] = {
        owned: tierIds.filter((id) => upgrades[id]).length,
        total: tierIds.length,
      };
    }
    return counts;
  }, [upgrades, tierGroups]);

  const ownedCount = UPGRADE_IDS.filter((id) => upgrades[id]).length;

  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (const tier of tiers) {
      initial[tier] = tier <= 2;
    }
    return initial;
  });

  const toggleTier = (tier: number) => {
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  const isLocked = (upgradeId: UpgradeId): boolean => {
    const def = UPGRADE_DEFINITIONS[upgradeId];
    return def.requires.some((reqId) => !upgrades[reqId]);
  };

  const getMissingPrereqNames = (upgradeId: UpgradeId): string[] => {
    const def = UPGRADE_DEFINITIONS[upgradeId];
    return def.requires
      .filter((reqId) => !upgrades[reqId])
      .map((reqId) => UPGRADE_DEFINITIONS[reqId].name);
  };

  return (
    <StripedBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <MoneyDisplay amount={money} />

        {/* Overall Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(ownedCount / UPGRADE_IDS.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {ownedCount}/{UPGRADE_IDS.length}
          </Text>
        </View>

        {tiers.map((tier) => {
          const tierUpgrades = tierGroups[tier];
          if (!tierUpgrades || tierUpgrades.length === 0) return null;

          const isExpanded = expandedTiers[tier];
          const { owned, total } = tierOwnedCounts[tier];
          const allOwned = owned === total;

          return (
            <View key={tier} style={styles.tierSection}>
              <TouchableOpacity
                style={[styles.tierHeader, { borderColor: TIER_COLORS[tier] }]}
                onPress={() => toggleTier(tier)}
                activeOpacity={0.7}
              >
                <View style={styles.tierHeaderLeft}>
                  <View style={[styles.tierBadge, { backgroundColor: TIER_COLORS[tier] }]}>
                    <Text style={styles.tierBadgeText}>{tier}</Text>
                  </View>
                  <Text style={styles.tierTitle}>{TIER_NAMES[tier]}</Text>
                </View>
                <View style={styles.tierHeaderRight}>
                  <Text style={[styles.tierProgress, allOwned && styles.tierProgressComplete]}>
                    {owned}/{total}
                  </Text>
                  <Text style={styles.chevron}>{isExpanded ? 'v' : '>'}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && tierUpgrades.map((id) => (
                <UpgradeCard
                  key={id}
                  upgradeId={id}
                  owned={upgrades[id]}
                  locked={isLocked(id)}
                  money={money}
                  requiresNames={getMissingPrereqNames(id)}
                  onBuy={buyUpgrade}
                />
              ))}
            </View>
          );
        })}
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
    paddingBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  progressBarBg: {
    ...pixelTrack,
    flex: 1,
  },
  progressBarFill: {
    ...pixelFill,
    backgroundColor: C.gold,
  },
  progressText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textLight,
  },
  tierSection: {
    marginBottom: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 4,
    borderWidth: 2,
    borderRadius: 0,
    backgroundColor: C.bgLight,
  },
  tierHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    width: 22,
    height: 22,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadgeText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.white,
  },
  tierTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textLight,
  },
  tierProgress: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
  },
  tierProgressComplete: {
    color: C.greenLight,
  },
  chevron: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
  },
});
