import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatMoney } from '../utils/format';
import { C, PIXEL_FONT, F } from '../theme/pixel';

interface MoneyDisplayProps {
  amount: number;
}

export default function MoneyDisplay({ amount }: MoneyDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>BALANCE</Text>
      <Text style={styles.amount}>{formatMoney(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    letterSpacing: 1,
  },
  amount: {
    fontFamily: PIXEL_FONT,
    fontSize: F.title,
    color: C.greenLight,
    marginTop: 2,
  },
});
