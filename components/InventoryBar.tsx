import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inventory } from '../engine/types';
import { SUPPLY_DEFINITIONS, SUPPLY_IDS } from '../engine/constants';

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
            <Text style={styles.emoji}>{def.emoji}</Text>
            <Text style={styles.count}>{inventory[id]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  item: {
    alignItems: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 20,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    color: '#44403C',
  },
});
