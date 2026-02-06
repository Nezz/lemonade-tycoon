import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import MoneyDisplay from '../../components/MoneyDisplay';
import UpgradeCard from '../../components/UpgradeCard';
import { UPGRADE_IDS, UPGRADE_DEFINITIONS, TIER_NAMES, TIER_COUNT } from '../../engine/constants';
import { UpgradeId } from '../../engine/types';

const TIER_COLORS: Record<number, string> = {
  1: '#A8A29E',
  2: '#60A5FA',
  3: '#A78BFA',
  4: '#F59E0B',
  5: '#EF4444',
  6: '#8B5CF6',
  7: '#EC4899',
};

export default function UpgradesScreen() {
  const money = useGameStore((s) => s.money);
  const upgrades = useGameStore((s) => s.upgrades);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  // Group upgrades by tier
  const tiers = Array.from({ length: TIER_COUNT }, (_, i) => i + 1);

  const tierGroups = useMemo(() => {
    const groups: Record<number, UpgradeId[]> = {};
    for (const tier of tiers) {
      // Put stand upgrade first, then the rest
      const tierIds = UPGRADE_IDS.filter((id) => UPGRADE_DEFINITIONS[id].tier === tier);
      const standIds = tierIds.filter((id) => UPGRADE_DEFINITIONS[id].category === 'stand');
      const otherIds = tierIds.filter((id) => UPGRADE_DEFINITIONS[id].category !== 'stand');
      groups[tier] = [...otherIds, ...standIds];
    }
    return groups;
  }, []);

  // Count owned per tier
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

  // Total owned
  const ownedCount = UPGRADE_IDS.filter((id) => upgrades[id]).length;

  // Find the current tier (highest tier where the stand is owned, or 1 if none)
  const currentTier = useMemo(() => {
    let highest = 1;
    for (const tier of tiers) {
      const tierIds = tierGroups[tier] || [];
      const standId = tierIds.find((id) => UPGRADE_DEFINITIONS[id].category === 'stand');
      if (standId && upgrades[standId]) {
        highest = tier + 1; // next tier is "current" (what they're working towards)
      }
    }
    return Math.min(highest, TIER_COUNT);
  }, [upgrades, tierGroups]);

  // Collapsible state: current tier starts expanded
  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (const tier of tiers) {
      initial[tier] = tier <= 2; // expand tier 1 and 2 by default
    }
    return initial;
  });

  const toggleTier = (tier: number) => {
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  // Check if an upgrade is locked (prerequisites not met)
  const isLocked = (upgradeId: UpgradeId): boolean => {
    const def = UPGRADE_DEFINITIONS[upgradeId];
    return def.requires.some((reqId) => !upgrades[reqId]);
  };

  // Get missing prerequisite names
  const getMissingPrereqNames = (upgradeId: UpgradeId): string[] => {
    const def = UPGRADE_DEFINITIONS[upgradeId];
    return def.requires
      .filter((reqId) => !upgrades[reqId])
      .map((reqId) => UPGRADE_DEFINITIONS[reqId].name);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
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
                style={styles.tierHeader}
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
                  <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E7E5E4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  tierSection: {
    marginBottom: 12,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 4,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#44403C',
  },
  tierProgress: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  tierProgressComplete: {
    color: '#166534',
  },
  chevron: {
    fontSize: 12,
    color: '#A8A29E',
  },
});
