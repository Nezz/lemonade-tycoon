import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatMoney } from '../utils/format';

interface MoneyDisplayProps {
  amount: number;
}

export default function MoneyDisplay({ amount }: MoneyDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Balance</Text>
      <Text style={styles.amount}>{formatMoney(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#166534',
  },
});
