import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}

export default function StatRow({ label, value, highlight = false, color }: StatRowProps) {
  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <Text style={[styles.label, highlight && styles.labelHighlight]}>{label}</Text>
      <Text
        style={[
          styles.value,
          highlight && styles.valueHighlight,
          color ? { color } : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  rowHighlight: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderBottomWidth: 0,
    marginTop: 4,
  },
  label: {
    fontSize: 15,
    color: '#57534E',
  },
  labelHighlight: {
    fontWeight: '700',
    color: '#1C1917',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1917',
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: '800',
  },
});
