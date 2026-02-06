import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Empty placeholder area where the user will implement
 * their own lemonade stand visualization.
 */
export default function StandPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Lemonade Stand</Text>
      <Text style={styles.hint}>Implement your stand view here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#D4D4D4',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAF9',
    marginVertical: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A8A29E',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#D6D3D1',
  },
});
