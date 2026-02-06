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
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from '../../theme/pixel';

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
            <Text style={styles.dayLabel}>DAY {day}</Text>
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
            <Text style={styles.summaryLabel}>PRICE</Text>
            <Text style={styles.summaryValue}>${pricePerCup.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>CUPS</Text>
            <Text style={styles.summaryValue}>{cupsMakeable}</Text>
          </View>
          {rent > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>RENT</Text>
                <Text style={styles.summaryValueRent}>{formatMoney(rent)}</Text>
              </View>
            </>
          )}
          {passiveIncome > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>PASSIVE</Text>
                <Text style={styles.summaryValueGreen}>+{formatMoney(passiveIncome)}</Text>
              </View>
            </>
          )}
          {freeLemons > 0 && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>FREE</Text>
                <Text style={styles.summaryValueGreen}>+{freeLemons}</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <View style={styles.actionRow}>
            <GameButton
              title="SHOP"
              onPress={() => router.push('/(game)/shop')}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="RECIPE"
              onPress={() => router.push('/(game)/recipe')}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <View style={styles.actionRow}>
            <GameButton
              title="UPGRADES"
              onPress={() => router.push('/(game)/upgrades')}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="STATS"
              onPress={() => router.push('/(game)/stats')}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <GameButton
            title="ACHIEVEMENTS"
            onPress={() => router.push('/(game)/achievements')}
            variant="secondary"
            style={styles.fullBtn}
          />
          <GameButton
            title={canStart ? 'OPEN FOR BUSINESS!' : 'NEED SUPPLIES!'}
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
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 6,
  },
  dayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.gold,
  },
  weatherRow: {
    flexDirection: 'row',
    gap: 6,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    ...pixelPanel,
    ...pixelBevel,
    marginTop: 8,
    padding: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 2,
    height: 24,
    backgroundColor: C.border,
  },
  summaryLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  summaryValueRent: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.red,
  },
  summaryValueGreen: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.green,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  fullBtn: {
    width: '100%',
  },
});
