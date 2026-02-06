import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import WeatherBadge from '../../components/WeatherBadge';
import EventBanner from '../../components/EventBanner';
import StatRow from '../../components/StatRow';
import GameButton from '../../components/GameButton';
import { formatMoney } from '../../utils/format';

function SatisfactionStars({ satisfaction }: { satisfaction: number }) {
  const filled = Math.round(satisfaction / 20);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < filled ? '★' : '☆'
  ).join('');

  return (
    <View style={starStyles.container}>
      <Text style={starStyles.stars}>{stars}</Text>
      <Text style={starStyles.label}>{satisfaction}/100</Text>
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  stars: {
    fontSize: 32,
    color: '#F59E0B',
    letterSpacing: 4,
  },
  label: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 4,
  },
});

export default function ResultsScreen() {
  const router = useRouter();
  const getLastResult = useGameStore((s) => s.getLastResult);
  const nextDay = useGameStore((s) => s.nextDay);
  const money = useGameStore((s) => s.money);

  const result = getLastResult();

  const handleNextDay = () => {
    nextDay();
    router.replace('/(game)/day');
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.noResult}>No results yet</Text>
          <GameButton title="Back" onPress={() => router.replace('/(game)/day')} />
        </View>
      </SafeAreaView>
    );
  }

  const profitColor = result.profit >= 0 ? '#166534' : '#DC2626';
  const repChangeStr = result.reputationChange > 0
    ? `+${result.reputationChange}`
    : `${result.reputationChange}`;
  const repColor = result.reputationChange > 0
    ? '#166534'
    : result.reputationChange < 0
      ? '#DC2626'
      : '#78716C';

  const hasSpoilage =
    result.spoiledSupplies.lemons > 0 ||
    result.spoiledSupplies.sugar > 0 ||
    result.spoiledSupplies.cups > 0;

  const hasAchievements = result.achievementsUnlocked.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {/* Day header */}
        <View style={styles.header}>
          <Text style={styles.dayTitle}>Day {result.day} Results</Text>
          <WeatherBadge weather={result.weather} />
        </View>

        {/* Event that was active */}
        {result.event && <EventBanner event={result.event} />}

        {/* Satisfaction */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Satisfaction</Text>
          <SatisfactionStars satisfaction={result.satisfaction} />
        </View>

        {/* Sales Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales Report</Text>
          <StatRow
            label="Cups Sold"
            value={`${result.cupsSold} / ${result.maxDemand} demand`}
          />
          <StatRow
            label="Revenue"
            value={formatMoney(result.revenue)}
          />
          <StatRow
            label="Cost of Goods"
            value={formatMoney(result.costOfGoods)}
          />
          {result.rent > 0 && (
            <StatRow
              label="Rent"
              value={`-${formatMoney(result.rent)}`}
              color="#DC2626"
            />
          )}
          <StatRow
            label="Net Profit"
            value={formatMoney(result.profit)}
            highlight
            color={profitColor}
          />
        </View>

        {/* Overnight Report */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Overnight Report</Text>
          <StatRow
            label="Reputation"
            value={repChangeStr}
            color={repColor}
          />
          {result.iceMelted > 0 && (
            <StatRow
              label="Ice Melted"
              value={`-${result.iceMelted} cubes`}
              color="#DC2626"
            />
          )}
          {hasSpoilage && (
            <>
              {result.spoiledSupplies.lemons > 0 && (
                <StatRow
                  label="Lemons Spoiled"
                  value={`-${result.spoiledSupplies.lemons}`}
                  color="#DC2626"
                />
              )}
              {result.spoiledSupplies.sugar > 0 && (
                <StatRow
                  label="Sugar Spoiled"
                  value={`-${result.spoiledSupplies.sugar}`}
                  color="#DC2626"
                />
              )}
              {result.spoiledSupplies.cups > 0 && (
                <StatRow
                  label="Cups Spoiled"
                  value={`-${result.spoiledSupplies.cups}`}
                  color="#DC2626"
                />
              )}
            </>
          )}
          <StatRow
            label="Balance"
            value={formatMoney(money)}
            highlight
            color="#166534"
          />
        </View>

        {/* Achievements */}
        {hasAchievements && (
          <View style={styles.achievementCard}>
            <Text style={styles.cardTitle}>Achievements Unlocked!</Text>
            {result.achievementsUnlocked.map((id) => (
              <Text key={id} style={styles.achievementText}>
                {id}
              </Text>
            ))}
          </View>
        )}

        {/* Next Day */}
        <GameButton
          title="Start Next Day"
          onPress={handleNextDay}
          style={styles.nextBtn}
        />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  noResult: {
    fontSize: 16,
    color: '#78716C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#78350F',
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
  achievementCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  achievementText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    paddingVertical: 2,
  },
  nextBtn: {
    marginTop: 4,
  },
});
