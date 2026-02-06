import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/store/gameStore";
import StatRow from "@/components/StatRow";
import GameButton from "@/components/GameButton";
import { formatMoney } from "@/utils/format";
import { VICTORY_REVENUE_GOAL } from "@/engine/constants";
import { C, PIXEL_FONT, F, pixelPanel } from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";

export default function VictoryScreen() {
  const router = useRouter();
  const stats = useGameStore((s) => s.stats);
  const day = useGameStore((s) => s.day);
  const money = useGameStore((s) => s.money);
  const continueAfterVictory = useGameStore((s) => s.continueAfterVictory);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleContinue = () => {
    continueAfterVictory();
    router.replace("/(game)/results");
  };

  const handleNewGame = () => {
    resetGame();
    router.replace("/(game)/day");
  };

  return (
    <StripedBackground color1="#007F2E" color2="#006424">
      <SafeAreaView style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.emoji}>👑</Text>
          <Text style={styles.title}>TYCOON!</Text>
          <Text style={styles.subtitle}>
            You reached {formatMoney(VICTORY_REVENUE_GOAL)} in total revenue!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>VICTORY STATS</Text>
          <StatRow label="Days" value={`${day}`} />
          <StatRow
            label="Revenue"
            value={formatMoney(stats.totalRevenue)}
            highlight
            color={C.greenLight}
          />
          <StatRow label="Cups Sold" value={`${stats.totalCupsSold}`} />
          <StatRow label="Balance" value={formatMoney(money)} />
        </View>

        <View style={styles.buttonSection}>
          <GameButton title="KEEP PLAYING" onPress={handleContinue} />
          <GameButton
            title="NEW GAME"
            onPress={handleNewGame}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 66,
    color: C.goldBright,
  },
  subtitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.greenLight,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 36,
  },
  card: {
    ...pixelPanel,
    backgroundColor: "#009730",
    borderColor: C.green,
    borderTopColor: C.greenLight,
    borderLeftColor: C.greenLight,
    borderBottomColor: "#007F2E",
    borderRightColor: "#007F2E",
  },
  cardTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.greenLight,
    marginBottom: 6,
  },
  buttonSection: {
    gap: 10,
  },
});
