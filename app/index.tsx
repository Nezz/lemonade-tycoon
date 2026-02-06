import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameButton from '../components/GameButton';
import { useGameStore } from '../store/gameStore';
import { hasSavedGame, loadGame } from '../utils/storage';

export default function TitleScreen() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const loadState = useGameStore((s) => s.loadState);
  const [saveExists, setSaveExists] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    hasSavedGame().then((exists) => {
      setSaveExists(exists);
      setChecking(false);
    });
  }, []);

  const handleNewGame = () => {
    resetGame();
    router.replace('/(game)/day');
  };

  const handleContinue = async () => {
    const saved = await loadGame();
    if (saved) {
      loadState(saved);
      if (saved.phase === 'gameover') {
        router.replace('/(game)/gameover');
      } else if (saved.phase === 'victory') {
        router.replace('/(game)/victory');
      } else if (saved.phase === 'results') {
        router.replace('/(game)/results');
      } else {
        router.replace('/(game)/day');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#FDE047', '#FEF9C3', '#FFFBEB']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>🍋</Text>
          <Text style={styles.title}>Lemonade</Text>
          <Text style={styles.subtitle}>Tycoon</Text>
          <Text style={styles.tagline}>Build your lemonade empire!</Text>
        </View>

        <View style={styles.buttonSection}>
          <GameButton
            title="New Game"
            onPress={handleNewGame}
            style={styles.button}
          />
          <GameButton
            title="Continue"
            onPress={handleContinue}
            variant="secondary"
            disabled={checking || !saveExists}
            style={styles.button}
          />
        </View>

        <Text style={styles.version}>v1.0</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#78350F',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#92400E',
    marginTop: -6,
  },
  tagline: {
    fontSize: 16,
    color: '#A16207',
    marginTop: 12,
    fontWeight: '500',
  },
  buttonSection: {
    width: '100%',
    gap: 14,
  },
  button: {
    width: '100%',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#D4D4D4',
  },
});
