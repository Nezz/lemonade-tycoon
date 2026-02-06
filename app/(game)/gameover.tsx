import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import StatRow from '../../components/StatRow';
import GameButton from '../../components/GameButton';
import { formatMoney } from '../../utils/format';
import { deleteSave } from '../../utils/storage';

export default function GameOverScreen() {
  const router = useRouter();
  const stats = useGameStore((s) => s.stats);
  const day = useGameStore((s) => s.day);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleRestart = async () => {
    await deleteSave();
    resetGame();
    router.replace('/(game)/day');
  };

  const handleMainMenu = async () => {
    await deleteSave();
    resetGame();
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#FEE2E2', '#FECACA', '#FCA5A5']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>💸</Text>
          <Text style={styles.title}>Bankrupt!</Text>
          <Text style={styles.subtitle}>Your lemonade stand has gone out of business.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Final Stats</Text>
          <StatRow label="Days Survived" value={`${day}`} />
          <StatRow label="Total Revenue" value={formatMoney(stats.totalRevenue)} />
          <StatRow label="Total Cups Sold" value={`${stats.totalCupsSold}`} />
          {stats.dayResults.length > 0 && (
            <StatRow
              label="Best Day"
              value={formatMoney(
                Math.max(...stats.dayResults.map((r) => r.profit))
              )}
            />
          )}
        </View>

        <View style={styles.buttonSection}>
          <GameButton title="Try Again" onPress={handleRestart} />
          <GameButton title="Main Menu" onPress={handleMainMenu} variant="secondary" />
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
    color: '#991B1B',
  },
  subtitle: {
    fontSize: 16,
    color: '#B91C1C',
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
