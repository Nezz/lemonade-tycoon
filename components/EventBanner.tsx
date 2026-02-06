import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveEvent } from '../engine/types';

interface EventBannerProps {
  event: ActiveEvent;
}

export default function EventBanner({ event }: EventBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>{event.emoji}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{event.name}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 10,
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  description: {
    fontSize: 13,
    color: '#A16207',
    marginTop: 2,
  },
});
