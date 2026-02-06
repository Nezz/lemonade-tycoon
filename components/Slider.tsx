import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

/**
 * Simple discrete step slider using tap buttons.
 * Avoids needing @react-native-community/slider dependency.
 */
export default function Slider({ value, min, max, step, onChange }: SliderProps) {
  const steps = [];
  for (let i = min; i <= max; i += step) {
    steps.push(Math.round(i * 100) / 100);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowBtn}
        onPress={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        disabled={value <= min}
      >
        <Text style={[styles.arrow, value <= min && styles.arrowDisabled]}>-</Text>
      </TouchableOpacity>

      <View style={styles.track}>
        {steps.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.dot, s <= value && styles.dotActive]}
            onPress={() => onChange(s)}
          >
            <View style={[styles.dotInner, s === value && styles.dotSelected]} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.arrowBtn}
        onPress={() => onChange(Math.min(max, Math.round((value + step) * 100) / 100))}
        disabled={value >= max}
      >
        <Text style={[styles.arrow, value >= max && styles.arrowDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '700',
    color: '#44403C',
  },
  arrowDisabled: {
    color: '#D6D3D1',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    backgroundColor: '#F5F5F4',
    borderRadius: 18,
    paddingHorizontal: 8,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: '#D9F99D',
  },
  dotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  dotSelected: {
    backgroundColor: '#84CC16',
  },
});
