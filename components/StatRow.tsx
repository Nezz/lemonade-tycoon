import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, PIXEL_FONT, F } from '../theme/pixel';

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
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowHighlight: {
    backgroundColor: C.greenDark,
    borderBottomWidth: 0,
    marginTop: 4,
    padding: 6,
  },
  label: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textLight,
    flex: 1,
  },
  labelHighlight: {
    color: C.white,
  },
  value: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  valueHighlight: {
    fontSize: F.body,
    color: C.greenLight,
  },
});
