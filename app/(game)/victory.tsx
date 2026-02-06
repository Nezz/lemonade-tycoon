import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import StatRow from '../../components/StatRow';
import GameButton from '../../components/GameButton';
import { formatMoney } from '../../utils/format';
import { VICTORY_REVENUE_GOAL } from '../../engine/constants';

export default function VictoryScreen() {
  const router = useRouter();
  const stats = useGameStore((s) => s.stats);
  const day = useGameStore((s) => s.day);
  const money = useGameStore((s) => s.money);
  const continueAfterVictory = useGameStore((s) => s.continueAfterVictory);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleContinue = () => {
    continueAfterVictory();
    router.replace('/(game)/results');
  };

  const handleNewGame = () => {
    resetGame();
    router.replace('/(game)/day');
  };

  return (
    <LinearGradient colors={['#FDE047', '#BEF264', '#86EFAC']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>👑</Text>
          <Text style={styles.title}>Tycoon!</Text>
          <Text style={styles.subtitle}>
            You reached {formatMoney(VICTORY_REVENUE_GOAL)} in total revenue!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Victory Stats</Text>
          <StatRow label="Days to Victory" value={`${day}`} />
          <StatRow label="Total Revenue" value={formatMoney(stats.totalRevenue)} highlight color="#166534" />
          <StatRow label="Total Cups Sold" value={`${stats.totalCupsSold}`} />
          <StatRow label="Final Balance" value={formatMoney(money)} />
        </View>

        <View style={styles.buttonSection}>
          <GameButton title="Keep Playing (Free Play)" onPress={handleContinue} />
          <GameButton title="New Game" onPress={handleNewGame} variant="secondary" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  titleSection: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#14532D',
  },
  subtitle: {
    fontSize: 16,
    color: '#166534',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 8,
  },
  buttonSection: {
    gap: 12,
  },
});
