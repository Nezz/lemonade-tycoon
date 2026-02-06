import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "../../store/gameStore";
import StatRow from "../../components/StatRow";
import GameButton from "../../components/GameButton";
import { formatMoney } from "../../utils/format";
import { deleteSave } from "../../utils/storage";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "../../theme/pixel";

export default function GameOverScreen() {
  const router = useRouter();
  const stats = useGameStore((s) => s.stats);
  const day = useGameStore((s) => s.day);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleRestart = async () => {
    await deleteSave();
    resetGame();
    router.replace("/(game)/day");
  };

  const handleMainMenu = async () => {
    await deleteSave();
    resetGame();
    router.replace("/");
  };

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>💸</Text>
          <Text style={styles.title}>BANKRUPT!</Text>
          <Text style={styles.subtitle}>
            Your lemonade stand has gone out of business.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>FINAL STATS</Text>
          <StatRow label="Days" value={`${day}`} />
          <StatRow label="Revenue" value={formatMoney(stats.totalRevenue)} />
          <StatRow label="Cups Sold" value={`${stats.totalCupsSold}`} />
          {stats.dayResults.length > 0 && (
            <StatRow
              label="Best Day"
              value={formatMoney(
                Math.max(...stats.dayResults.map((r) => r.profit)),
              )}
            />
          )}
        </View>

        <View style={styles.buttonSection}>
          <GameButton title="TRY AGAIN" onPress={handleRestart} />
          <GameButton
            title="MAIN MENU"
            onPress={handleMainMenu}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: C.redDark,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 20,
  },
  titleSection: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: 60,
    color: C.redLight,
  },
  subtitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: '#FFB0B0',
    textAlign: "center",
    marginTop: 10,
    lineHeight: 36,
  },
  card: {
    ...pixelPanel,
    backgroundColor: '#2A0808',
    borderColor: C.red,
    borderTopColor: C.redLight,
    borderLeftColor: C.redLight,
    borderBottomColor: '#500000',
    borderRightColor: '#500000',
  },
  cardTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.redLight,
    marginBottom: 6,
  },
  buttonSection: {
    gap: 10,
  },
});
