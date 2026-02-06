import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameButton from '../components/GameButton';
import { useGameStore } from '../store/gameStore';
import { hasSavedGame, loadGame } from '../utils/storage';
import { C, PIXEL_FONT, F } from '../theme/pixel';

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
    <View style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>🍋</Text>
          <Text style={styles.title}>LEMONADE</Text>
          <Text style={styles.subtitle}>TYCOON</Text>
          <View style={styles.taglineBox}>
            <Text style={styles.tagline}>Build your lemonade empire!</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <GameButton
            title="NEW GAME"
            onPress={handleNewGame}
            style={styles.button}
          />
          <GameButton
            title="CONTINUE"
            onPress={handleContinue}
            variant="secondary"
            disabled={checking || !saveExists}
            style={styles.button}
          />
        </View>

        <Text style={styles.version}>v1.0</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: C.bg,
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
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: 48,
    color: C.goldBright,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 36,
    color: C.gold,
    marginTop: 4,
  },
  taglineBox: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: C.border,
    backgroundColor: C.bgLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tagline: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.panel,
    textAlign: 'center',
  },
  buttonSection: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
});
