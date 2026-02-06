import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UpgradeId, UpgradeCategory } from '../engine/types';
import { UPGRADE_DEFINITIONS } from '../engine/constants';
import { formatMoney } from '../utils/format';
import GameButton from './GameButton';

const CATEGORY_LABELS: Record<UpgradeCategory, string> = {
  stand: 'Stand',
  signage: 'Signage',
  cooling: 'Cooling',
  storage: 'Storage',
  recipe: 'Recipe',
  weather: 'Weather',
  marketing: 'Marketing',
  experience: 'Experience',
  supply: 'Supply Chain',
  speed: 'Speed',
  staff: 'Staff',
  technology: 'Technology',
  decor: 'Decor',
  special: 'Special',
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
  const isStand = def.category === 'stand';

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
        <Text style={[styles.emoji, locked && styles.emojiLocked, isStand && styles.emojiStand]}>
          {locked ? '🔒' : def.emoji}
        </Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, locked && styles.nameLocked, isStand && styles.nameStand]}>
              {def.name}
            </Text>
            <View style={[styles.categoryBadge, isStand && styles.categoryBadgeStand]}>
              <Text style={[styles.categoryText, isStand && styles.categoryTextStand]}>
                {CATEGORY_LABELS[def.category]}
              </Text>
            </View>
          </View>
          <Text style={[styles.desc, locked && styles.descLocked]}>{def.description}</Text>
          {locked && requiresNames.length > 0 && (
            <Text style={styles.requiresText}>
              Requires: {requiresNames.join(', ')}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.right}>
        {owned ? (
          <View style={[styles.ownedBadge, isStand && styles.ownedBadgeStand]}>
            <Text style={styles.ownedText}>Owned</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 10,
  },
  cardOwned: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  cardLocked: {
    backgroundColor: '#F5F5F4',
    borderColor: '#D6D3D1',
    opacity: 0.75,
  },
  cardStand: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 2,
  },
  cardStandOwned: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  emojiLocked: {
    opacity: 0.5,
  },
  emojiStand: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
  },
  nameLocked: {
    color: '#78716C',
  },
  nameStand: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
  },
  categoryBadge: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeStand: {
    backgroundColor: '#FEF3C7',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#78716C',
  },
  categoryTextStand: {
    color: '#92400E',
  },
  desc: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 2,
  },
  descLocked: {
    color: '#A8A29E',
  },
  requiresText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 3,
    fontStyle: 'italic',
  },
  right: {
    marginLeft: 12,
  },
  ownedBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  ownedBadgeStand: {
    backgroundColor: '#FEF3C7',
  },
  ownedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  lockedBadge: {
    backgroundColor: '#E7E5E4',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A8A29E',
  },
});
