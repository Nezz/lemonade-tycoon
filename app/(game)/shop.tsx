import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import MoneyDisplay from '../../components/MoneyDisplay';
import InventoryBar from '../../components/InventoryBar';
import SupplyCard from '../../components/SupplyCard';
import EventBanner from '../../components/EventBanner';
import { SUPPLY_IDS, SUPPLY_DEFINITIONS, MAX_INVENTORY_BASE } from '../../engine/constants';
import { getEventDefinition } from '../../engine/events';
import { aggregateEffects } from '../../engine/upgrades';

export default function ShopScreen() {
  const money = useGameStore((s) => s.money);
  const inventory = useGameStore((s) => s.inventory);
  const inventoryBatches = useGameStore((s) => s.inventoryBatches);
  const day = useGameStore((s) => s.day);
  const buySupply = useGameStore((s) => s.buySupply);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const upgrades = useGameStore((s) => s.upgrades);
  const effects = aggregateEffects(upgrades);
  const maxInventory = MAX_INVENTORY_BASE + effects.inventoryBonus;

  // Check if there's a supply cost event
  const hasSupplyEvent = activeEvent
    ? getEventDefinition(activeEvent.id).supplyCostMultiplier !== 1.0
    : false;

  const totalInventory = Object.values(inventory).reduce((sum, v) => sum + v, 0);
  const fillRatio = Math.min(totalInventory / maxInventory, 1);
  const isFull = totalInventory >= maxInventory;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <MoneyDisplay amount={money} />

        {activeEvent && hasSupplyEvent && <EventBanner event={activeEvent} />}

        <InventoryBar inventory={inventory} />

        {/* Total Capacity Bar */}
        <View style={styles.capacityCard}>
          <View style={styles.capacityHeader}>
            <Text style={styles.capacityLabel}>📦 Storage</Text>
            <Text style={[styles.capacityCount, isFull && styles.capacityFull]}>
              {totalInventory} / {maxInventory}
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
          if (!def.shelfLife || def.meltsOvernight) return null;
          const batches = inventoryBatches[id];
          const expiringToday = batches.filter(
            (b) => day - b.purchasedOnDay >= def.shelfLife! - 1
          );
          const expiringAmount = expiringToday.reduce((sum, b) => sum + b.amount, 0);
          if (expiringAmount === 0) return null;
          return (
            <View key={`spoil-${id}`} style={styles.spoilWarning}>
              <Text style={styles.spoilText}>
                {def.emoji} {expiringAmount} {def.unit} expiring soon!
              </Text>
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
          />
        ))}

        {/* Shelf life info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Shelf Life</Text>
          {SUPPLY_IDS.map((id) => {
            const def = SUPPLY_DEFINITIONS[id];
            let lifeText: string;
            if (def.meltsOvernight) {
              const bonus = effects.iceShelfBonus;
              lifeText = bonus > 0 ? `${1 + bonus} days` : 'Melts overnight';
            } else if (def.shelfLife) {
              const bonus = id === 'lemons' ? effects.lemonShelfBonus
                : id === 'sugar' ? effects.sugarShelfBonus : 0;
              lifeText = `${def.shelfLife + bonus} days`;
            } else {
              lifeText = 'Never spoils';
            }
            return (
              <View key={id} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{def.emoji} {def.label}</Text>
                <Text style={styles.infoValue}>{lifeText}</Text>
              </View>
            );
          })}
        </View>
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
    gap: 12,
    paddingBottom: 32,
  },
  capacityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  capacityCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  capacityFull: {
    color: '#DC2626',
  },
  capacityTrack: {
    height: 8,
    backgroundColor: '#F5F5F4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#65A30D',
    borderRadius: 4,
  },
  capacityFillWarn: {
    backgroundColor: '#F59E0B',
  },
  capacityFillFull: {
    backgroundColor: '#DC2626',
  },
  spoilWarning: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  spoilText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#57534E',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
});
