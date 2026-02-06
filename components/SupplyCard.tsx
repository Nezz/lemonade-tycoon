import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SupplyId } from '../engine/types';
import { SUPPLY_DEFINITIONS } from '../engine/constants';
import { formatMoney } from '../utils/format';
import GameButton from './GameButton';

interface SupplyCardProps {
  supplyId: SupplyId;
  currentStock: number;
  totalInventory: number;
  maxInventory: number;
  money: number;
  onBuy: (supplyId: SupplyId, packs: number) => boolean;
}

export default function SupplyCard({
  supplyId,
  currentStock,
  totalInventory,
  maxInventory,
  money,
  onBuy,
}: SupplyCardProps) {
  const [packs, setPacks] = useState(1);
  const def = SUPPLY_DEFINITIONS[supplyId];
  const totalCost = def.packCost * packs;
  const totalUnits = def.packSize * packs;
  const canAfford = totalCost <= money;
  const wouldExceedMax = totalInventory + totalUnits > maxInventory;
  const isFull = totalInventory >= maxInventory;

  const handleBuy = () => {
    const success = onBuy(supplyId, packs);
    if (success) setPacks(1);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{def.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{def.label}</Text>
          <Text style={styles.packInfo}>
            {def.packSize} {def.unit} / pack
          </Text>
        </View>
        <Text style={styles.stock}>
          {currentStock}
        </Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setPacks(Math.max(1, packs - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{packs}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setPacks(packs + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.costInfo}>
          <Text style={styles.costLabel}>
            +{totalUnits} {def.unit}
          </Text>
          <Text style={[styles.cost, !canAfford && styles.costRed]}>
            {formatMoney(totalCost)}
          </Text>
        </View>

        <GameButton
          title={isFull ? 'Full' : wouldExceedMax ? 'Over' : 'Buy'}
          onPress={handleBuy}
          disabled={!canAfford || wouldExceedMax}
          small
          style={styles.buyBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
  },
  packInfo: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 1,
  },
  stock: {
    fontSize: 14,
    fontWeight: '600',
    color: '#57534E',
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#44403C',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    minWidth: 28,
    textAlign: 'center',
  },
  costInfo: {
    flex: 1,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    color: '#78716C',
  },
  cost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
  },
  costRed: {
    color: '#DC2626',
  },
  buyBtn: {
    minWidth: 64,
  },
});
