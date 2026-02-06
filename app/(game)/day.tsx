import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import StandPlaceholder from '../../components/StandPlaceholder';
import WeatherBadge from '../../components/WeatherBadge';
import MoneyDisplay from '../../components/MoneyDisplay';
import InventoryBar from '../../components/InventoryBar';
import GameButton from '../../components/GameButton';
import EventBanner from '../../components/EventBanner';
import AchievementToast from '../../components/AchievementToast';
import { cupsFromInventory } from '../../engine/customers';
import { getRentForDay } from '../../engine/constants';
import { formatMoney } from '../../utils/format';
import { aggregateEffects } from '../../engine/upgrades';

export default function DayScreen() {
  const router = useRouter();
  const day = useGameStore((s) => s.day);
  const money = useGameStore((s) => s.money);
  const weather = useGameStore((s) => s.weather);
  const forecast = useGameStore((s) => s.forecast);
  const inventory = useGameStore((s) => s.inventory);
  const recipe = useGameStore((s) => s.recipe);
  const pricePerCup = useGameStore((s) => s.pricePerCup);
  const upgrades = useGameStore((s) => s.upgrades);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const startDay = useGameStore((s) => s.startDay);
  const phase = useGameStore((s) => s.phase);
  const newlyUnlockedAchievements = useGameStore((s) => s.newlyUnlockedAchievements);

  const cupsMakeable = cupsFromInventory(inventory, recipe);
  const canStart = cupsMakeable > 0;
  const rent = getRentForDay(day, upgrades);
  const effects = aggregateEffects(upgrades);
  const passiveIncome = effects.passiveIncome;
  const freeLemons = Math.floor(effects.freeLemons);

  const handleStartDay = () => {
    const result = startDay();
    const currentPhase = useGameStore.getState().phase;
    if (currentPhase === 'victory') {
      router.push('/(game)/victory');
    } else if (currentPhase === 'gameover') {
      router.push('/(game)/gameover');
    } else {
      router.push('/(game)/results');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Achievement Toast */}
      <AchievementToast achievementIds={newlyUnlockedAchievements} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Event Banner */}
        {activeEvent && <EventBanner event={activeEvent} />}

        {/* Day & Weather Header */}
        <View style={styles.header}>
          <View style={styles.dayInfo}>
            <Text style={styles.dayLabel}>Day {day}</Text>
            <MoneyDisplay amount={money} />
          </View>
          <View style={styles.weatherRow}>
            <WeatherBadge weather={weather} label={`Today: ${weather.charAt(0).toUpperCase() + weather.slice(1)}`} />
            {effects.showForecast && <WeatherBadge weather={forecast} label="Tomorrow" small />}
          </View>
        </View>

        {/* Lemonade Stand Placeholder */}
        <StandPlaceholder />

        {/* Inventory */}
        <InventoryBar inventory={inventory} />

        {/* Current Settings Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price/Cup</Text>
            <Text style={styles.summaryValue}>${pricePerCup.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Can Make</Text>
            <Text style={styles.summaryValue}>{cupsMakeable} cups</Text>
          </View>
          {rent > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Daily Rent</Text>
                <Text style={styles.summaryValueRent}>{formatMoney(rent)}</Text>
              </View>
            </>
          )}
          {passiveIncome > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Passive $</Text>
                <Text style={styles.summaryValueGreen}>+{formatMoney(passiveIncome)}</Text>
              </View>
            </>
          )}
          {freeLemons > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Free 🍋</Text>
                <Text style={styles.summaryValueGreen}>+{freeLemons}/day</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <View style={styles.actionRow}>
            <GameButton
              title="Supply Shop"
              onPress={() => router.push('/(game)/shop')}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="Recipe Lab"
              onPress={() => router.push('/(game)/recipe')}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <View style={styles.actionRow}>
            <GameButton
              title="Upgrades"
              onPress={() => router.push('/(game)/upgrades')}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="Stats"
              onPress={() => router.push('/(game)/stats')}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <GameButton
            title="Achievements"
            onPress={() => router.push('/(game)/achievements')}
            variant="secondary"
            style={styles.fullBtn}
          />
          <GameButton
            title={canStart ? 'Open for Business!' : 'Need Supplies!'}
            onPress={handleStartDay}
            disabled={!canStart}
            style={styles.fullBtn}
          />
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 8,
  },
  dayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: '#78350F',
  },
  weatherRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E7E5E4',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78716C',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  summaryValueRent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  summaryValueGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#166534',
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
  },
  fullBtn: {
    width: '100%',
  },
});
