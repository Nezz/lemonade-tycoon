import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from './Slider';

interface RecipeSliderProps {
  label: string;
  emoji: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  onChange: (value: number) => void;
}

export default function RecipeSlider({
  label,
  emoji,
  value,
  min,
  max,
  step = 1,
  unit = '',
  hint,
  onChange,
}: RecipeSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1917',
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: '#84CC16',
    minWidth: 40,
    textAlign: 'right',
  },
  hint: {
    fontSize: 12,
    color: '#84CC16',
    fontWeight: '500',
    marginBottom: 4,
    marginLeft: 28,
  },
});
