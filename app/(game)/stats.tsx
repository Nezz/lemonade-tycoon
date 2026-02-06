import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useGameStore } from "@/store/gameStore";
import StatRow from "@/components/StatRow";
import MiniBarChart from "@/components/MiniBarChart";
import { formatMoney } from "@/utils/format";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";

export default function StatsScreen() {
  const stats = useGameStore((s) => s.stats);
  const money = useGameStore((s) => s.money);
  const reputation = useGameStore((s) => s.reputation);
  const day = useGameStore((s) => s.day);

  const results = stats.dayResults;

  const chartData = results.slice(-14).map((r) => ({
    label: `D${r.day}`,
    value: r.profit,
  }));

  const bestDay =
    results.length > 0
      ? results.reduce((best, r) => (r.profit > best.profit ? r : best))
      : null;
  const worstDay =
    results.length > 0
      ? results.reduce((worst, r) => (r.profit < worst.profit ? r : worst))
      : null;

  let currentStreak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].profit > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  const avgSatisfaction =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.satisfaction, 0) / results.length,
        )
      : 0;

  return (
    <StripedBackground>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Profit Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PROFIT HISTORY</Text>
          <MiniBarChart data={chartData} height={130} />
        </View>

        {/* All-time Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ALL-TIME STATS</Text>
          <StatRow label="Days" value={`${day}`} />
          <StatRow label="Revenue" value={formatMoney(stats.totalRevenue)} />
          <StatRow label="Cups Sold" value={`${stats.totalCupsSold}`} />
          <StatRow label="Balance" value={formatMoney(money)} />
          <StatRow label="Rep" value={`${reputation}/100`} />
          <StatRow label="Avg Sat." value={`${avgSatisfaction}/100`} />
          <StatRow label="Streak" value={`${currentStreak} days`} />
          {bestDay && (
            <StatRow
              label="Best Day"
              value={`D${bestDay.day}: ${formatMoney(bestDay.profit)}`}
              color={C.green}
            />
          )}
          {worstDay && (
            <StatRow
              label="Worst Day"
              value={`D${worstDay.day}: ${formatMoney(worstDay.profit)}`}
              color={C.red}
            />
          )}
        </View>

        {/* Day-by-Day Log */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DAY LOG</Text>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>NO DATA YET</Text>
          ) : (
            [...results].reverse().map((r) => (
              <View key={r.day} style={styles.logRow}>
                <View style={styles.logLeft}>
                  <Text style={styles.logDay}>Day {r.day}</Text>
                  <Text style={styles.logDetail}>
                    {r.cupsSold} cups | {r.weather}
                    {r.event ? ` | ${r.event.emoji}` : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.logProfit,
                    { color: r.profit >= 0 ? C.green : C.red },
                  ]}
                >
                  {formatMoney(r.profit)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    ...pixelPanel,
    ...pixelBevel,
  },
  cardTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    marginBottom: 10,
  },
  emptyText: {
    fontFamily: PIXEL_FONT,
    color: C.textMuted,
    fontSize: F.body,
    textAlign: "center",
    paddingVertical: 12,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logLeft: {
    flex: 1,
  },
  logDay: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  logDetail: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    marginTop: 2,
  },
  logProfit: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
  },
});
