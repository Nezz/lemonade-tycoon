import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import GameButton from "@/components/GameButton";
import PixelIcon from "@/components/PixelIcon";
import { useGameStore } from "@/store/gameStore";
import { hasSavedGame, loadGame } from "@/utils/storage";
import { C, PIXEL_FONT, F } from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";
import ConfirmDialog from "@/components/ConfirmDialog";

// ── Floating emoji config ────────────────────────────────────────────────────

const FLOAT_EMOJIS = ["🍋", "🥤", "💰", "☀️", "🧊", "🍬", "💸", "👤"];
const FLOAT_DURATION = 3500;
const SPAWN_INTERVAL = 600;
const ICON_SIZE = 32;

interface FloatingIcon {
  id: number;
  emoji: string;
  x: number;
  translateY: Animated.Value;
  opacity: Animated.Value;
}

function FloatingEmojis() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const nextId = useRef(0);
  const containerHeight = useRef(500);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      const emoji = FLOAT_EMOJIS[id % FLOAT_EMOJIS.length];
      const x = 5 + Math.random() * 90;
      const translateY = new Animated.Value(0);
      const opacity = new Animated.Value(0);

      const icon: FloatingIcon = { id, emoji, x, translateY, opacity };
      setIcons((prev) => [...prev, icon]);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -containerHeight.current,
          duration: FLOAT_DURATION,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(FLOAT_DURATION - 1000),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setIcons((prev) => prev.filter((i) => i.id !== id));
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={styles.floatLayer}
      pointerEvents="none"
      onLayout={(e) => {
        containerHeight.current = e.nativeEvent.layout.height;
      }}
    >
      {icons.map((icon) => (
        <Animated.View
          key={icon.id}
          style={[
            styles.floatingIcon,
            {
              left: `${icon.x}%`,
              transform: [{ translateY: icon.translateY }],
              opacity: icon.opacity,
            },
          ]}
        >
          <PixelIcon emoji={icon.emoji} size={ICON_SIZE} />
        </Animated.View>
      ))}
    </View>
  );
}

// ── Title Screen ─────────────────────────────────────────────────────────────

export default function TitleScreen() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const loadState = useGameStore((s) => s.loadState);
  const [saveExists, setSaveExists] = useState(false);
  const [checking, setChecking] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    hasSavedGame().then((exists) => {
      setSaveExists(exists);
      setChecking(false);
    });
  }, []);

  const startNewGame = () => {
    setConfirmVisible(false);
    resetGame();
    router.replace("/(game)/day");
  };

  const handleNewGame = () => {
    if (saveExists) {
      setConfirmVisible(true);
    } else {
      startNewGame();
    }
  };

  const handleContinue = async () => {
    const saved = await loadGame();
    if (saved) {
      loadState(saved);
      if (saved.phase === "gameover") {
        router.replace("/(game)/gameover");
      } else if (saved.phase === "bailout") {
        router.replace("/(game)/bailout");
      } else if (saved.phase === "results") {
        router.replace("/(game)/results");
      } else {
        router.replace("/(game)/day");
      }
    }
  };

  return (
    <StripedBackground>
      <FloatingEmojis />
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <PixelIcon emoji="🍋" size={64} />
          <Text style={styles.title}>LEMONADE</Text>
          <Text style={styles.subtitle}>TYCOON</Text>
          <View style={styles.taglineBox}>
            <Text style={styles.tagline}>Build your lemonade empire!</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <GameButton
            title="CONTINUE"
            onPress={handleContinue}
            disabled={checking || !saveExists}
            style={styles.button}
          />
          <GameButton
            title="NEW GAME"
            onPress={handleNewGame}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <Text style={styles.version}>v1.0</Text>
      </SafeAreaView>

      <ConfirmDialog
        visible={confirmVisible}
        title="Start New Game?"
        message="This will overwrite your existing save. Are you sure?"
        confirmLabel="NEW GAME"
        cancelLabel="CANCEL"
        onConfirm={startNewGame}
        onCancel={() => setConfirmVisible(false)}
      />
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: 72,
    color: C.goldBright,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 54,
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
    color: C.textLight,
    textAlign: "center",
  },
  buttonSection: {
    width: "100%",
    maxWidth: 400,
    gap: 12,
  },
  button: {
    width: "100%",
  },
  version: {
    position: "absolute",
    bottom: 40,
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
  },
  // Floating emoji layer
  floatLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  floatingIcon: {
    position: "absolute",
    bottom: 0,
    marginLeft: -ICON_SIZE / 2,
  },
});
