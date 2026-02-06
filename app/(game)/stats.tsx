import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import StatRow from '../../components/StatRow';
import MiniBarChart from '../../components/MiniBarChart';
import { formatMoney } from '../../utils/format';

export default function StatsScreen() {
  const stats = useGameStore((s) => s.stats);
  const money = useGameStore((s) => s.money);
  const reputation = useGameStore((s) => s.reputation);
  const day = useGameStore((s) => s.day);

  const results = stats.dayResults;

  // Profit chart: last 14 days
  const chartData = results.slice(-14).map((r) => ({
    label: `D${r.day}`,
    value: r.profit,
  }));

  // Best and worst days
  const bestDay = results.length > 0
    ? results.reduce((best, r) => (r.profit > best.profit ? r : best))
    : null;
  const worstDay = results.length > 0
    ? results.reduce((worst, r) => (r.profit < worst.profit ? r : worst))
    : null;

  // Consecutive profit streak
  let currentStreak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].profit > 0) currentStreak++;
    else break;
  }

  // Average satisfaction
  const avgSatisfaction = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.satisfaction, 0) / results.length)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Profit Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profit History</Text>
          <MiniBarChart data={chartData} height={140} />
        </View>

        {/* All-time Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All-Time Stats</Text>
          <StatRow label="Days Played" value={`${day}`} />
          <StatRow label="Total Revenue" value={formatMoney(stats.totalRevenue)} />
          <StatRow label="Total Cups Sold" value={`${stats.totalCupsSold}`} />
          <StatRow label="Current Balance" value={formatMoney(money)} />
          <StatRow label="Reputation" value={`${reputation}/100`} />
          <StatRow label="Avg Satisfaction" value={`${avgSatisfaction}/100`} />
          <StatRow label="Profit Streak" value={`${currentStreak} days`} />
          {bestDay && (
            <StatRow
              label="Best Day"
              value={`Day ${bestDay.day}: ${formatMoney(bestDay.profit)}`}
              color="#166534"
            />
          )}
          {worstDay && (
            <StatRow
              label="Worst Day"
              value={`Day ${worstDay.day}: ${formatMoney(worstDay.profit)}`}
              color="#DC2626"
            />
          )}
        </View>

        {/* Day-by-Day Log */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Day-by-Day Log</Text>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>No days completed yet</Text>
          ) : (
            [...results].reverse().map((r) => (
              <View key={r.day} style={styles.logRow}>
                <View style={styles.logLeft}>
                  <Text style={styles.logDay}>Day {r.day}</Text>
                  <Text style={styles.logDetail}>
                    {r.cupsSold} cups | {r.weather}
                    {r.event ? ` | ${r.event.emoji}` : ''}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.logProfit,
                    { color: r.profit >= 0 ? '#166534' : '#DC2626' },
                  ]}
                >
                  {formatMoney(r.profit)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
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
    marginBottom: 12,
  },
  emptyText: {
    color: '#A8A29E',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  logLeft: {
    flex: 1,
  },
  logDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1917',
  },
  logDetail: {
    fontSize: 12,
    color: '#78716C',
    marginTop: 1,
  },
  logProfit: {
    fontSize: 15,
    fontWeight: '700',
  },
});
