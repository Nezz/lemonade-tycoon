import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useGameStore } from "@/store/gameStore";
import StandPlaceholder from "@/components/StandPlaceholder";

import MoneyDisplay from "@/components/MoneyDisplay";
import InventoryBar from "@/components/InventoryBar";
import GameButton from "@/components/GameButton";
import AchievementToast from "@/components/AchievementToast";
import StripedBackground from "@/components/StripedBackground";
import { cupsFromInventory } from "@/engine/customers";
import { WEATHER_DATA, getRentForDay } from "@/engine/constants";
import { formatMoney } from "@/utils/format";
import { aggregateEffects } from "@/engine/upgrades";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

export default function DayScreen() {
  const router = useRouter();
  const day = useGameStore((s) => s.day);
  const money = useGameStore((s) => s.money);
  const weather = useGameStore((s) => s.weather);
  const forecast = useGameStore((s) => s.forecast);
  const forecastExtended = useGameStore((s) => s.forecastExtended);
  const inventory = useGameStore((s) => s.inventory);
  const recipe = useGameStore((s) => s.recipe);
  const pricePerCup = useGameStore((s) => s.pricePerCup);
  const upgrades = useGameStore((s) => s.upgrades);
  const plannedEvent = useGameStore((s) => s.plannedEvent);
  const startDay = useGameStore((s) => s.startDay);
  const newlyUnlockedAchievements = useGameStore(
    (s) => s.newlyUnlockedAchievements,
  );

  const weatherInfo = WEATHER_DATA[weather];
  const forecastInfo = WEATHER_DATA[forecast];
  const forecastExtendedInfo = WEATHER_DATA[forecastExtended];
  const cupsMakeable = cupsFromInventory(inventory, recipe);
  const canStart = cupsMakeable > 0;
  const rent = getRentForDay(day, upgrades);
  const effects = aggregateEffects(upgrades);
  const passiveIncome = effects.passiveIncome;
  const freeLemons = Math.floor(effects.freeLemons);

  const [expanded, setExpanded] = useState<"weather" | "event" | null>(null);
  const toggleExpanded = (panel: "weather" | "event") =>
    setExpanded((v) => (v === panel ? null : panel));

  const handleStartDay = () => {
    startDay();
    router.push("/(game)/simulation");
  };

  return (
    <StripedBackground>
      {/* Achievement Toast */}
      <AchievementToast achievementIds={newlyUnlockedAchievements} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Day & Weather Header */}
        <View style={styles.header}>
          <View style={styles.dayInfo}>
            <View style={styles.dayLeft}>
              <Pressable
                onPress={() => router.push("/(game)/achievements")}
                style={styles.trophyBtn}
              >
                <PixelIcon emoji="🏆" size={22} />
              </Pressable>
              <Text style={styles.dayLabel}>DAY {day}</Text>
            </View>
            <MoneyDisplay amount={money} />
          </View>
          <View style={styles.weatherRow}>
            {/* Weather tile — always tappable */}
            <Pressable
              onPress={() => toggleExpanded("weather")}
              style={[
                styles.weatherTile,
                expanded === "weather" && styles.weatherTileActive,
              ]}
            >
              <PixelIcon emoji={weatherInfo.emoji} size={28} />
              <Text style={styles.weatherTileText}>
                {weather.charAt(0).toUpperCase() + weather.slice(1)}
              </Text>
            </Pressable>
            {/* Event tile */}
            <Pressable
              onPress={() => toggleExpanded("event")}
              style={[
                styles.weatherTile,
                expanded === "event" && styles.weatherTileActive,
              ]}
            >
              <PixelIcon emoji={plannedEvent.emoji} size={28} />
              <Text style={styles.weatherTileText} numberOfLines={1}>
                {plannedEvent.name}
              </Text>
            </Pressable>
          </View>
          {/* Expanded weather details */}
          {expanded === "weather" && (
            <Pressable
              onPress={() => setExpanded(null)}
              style={styles.forecastDetail}
            >
              <View style={styles.forecastRow}>
                <PixelIcon emoji={weatherInfo.emoji} size={20} />
                <Text style={styles.forecastDetailText}>
                  Today: {weatherInfo.label}
                </Text>
              </View>
              <View style={styles.forecastRow}>
                {effects.showForecast ? (
                  <>
                    <PixelIcon emoji={forecastInfo.emoji} size={20} />
                    <Text style={styles.forecastDetailText}>
                      Tomorrow: {forecastInfo.label}
                    </Text>
                  </>
                ) : (
                  <>
                    <PixelIcon emoji="❓" size={20} />
                    <Text style={styles.forecastDetailTextLocked}>
                      Tomorrow: ???
                    </Text>
                  </>
                )}
              </View>
              <View style={styles.forecastRow}>
                {effects.showExtendedForecast ? (
                  <>
                    <PixelIcon emoji={forecastExtendedInfo.emoji} size={20} />
                    <Text style={styles.forecastDetailText}>
                      Day after: {forecastExtendedInfo.label}
                    </Text>
                  </>
                ) : (
                  <>
                    <PixelIcon emoji="❓" size={20} />
                    <Text style={styles.forecastDetailTextLocked}>
                      Day after: ???
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          )}
          {/* Expanded event details */}
          {expanded === "event" && (
            <Pressable
              onPress={() => setExpanded(null)}
              style={styles.forecastDetail}
            >
              <View style={styles.forecastRow}>
                <PixelIcon emoji={plannedEvent.emoji} size={20} />
                <Text style={styles.forecastDetailText}>
                  {plannedEvent.name}
                </Text>
              </View>
              <View style={styles.forecastRow}>
                <Text style={styles.forecastDetailTextLocked}>
                  {plannedEvent.description}
                </Text>
              </View>
            </Pressable>
          )}
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
            <Text style={styles.summaryLabel}>CAN MAKE</Text>
            <Text style={styles.summaryValue}>{cupsMakeable} cups</Text>
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
                <Text style={styles.summaryValueGreen}>
                  +{formatMoney(passiveIncome)}
                </Text>
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
              onPress={() => router.push("/(game)/shop")}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="RECIPE"
              onPress={() => router.push("/(game)/recipe")}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <View style={styles.actionRow}>
            <GameButton
              title="UPGRADES"
              onPress={() => router.push("/(game)/upgrades")}
              variant="secondary"
              style={styles.actionBtn}
            />
            <GameButton
              title="STATS"
              onPress={() => router.push("/(game)/stats")}
              variant="secondary"
              style={styles.actionBtn}
            />
          </View>
          <GameButton
            title={canStart ? "OPEN FOR BUSINESS!" : "NEED SUPPLIES!"}
            onPress={handleStartDay}
            disabled={!canStart}
            style={styles.fullBtn}
          />
        </View>
      </ScrollView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 32,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginBottom: 6,
  },
  dayInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.gold,
  },
  dayLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trophyBtn: {
    ...pixelPanel,
    ...pixelBevel,
    paddingHorizontal: 10,
    paddingVertical: 6,
    cursor: "pointer" as any,
  },
  weatherRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  weatherTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.panel,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: C.border,
    gap: 6,
    cursor: "pointer" as any,
  },
  weatherTileActive: {
    borderColor: C.gold,
  },
  weatherTileText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  forecastDetail: {
    backgroundColor: C.panel,
    padding: 10,
    marginTop: 6,
    borderWidth: 3,
    borderColor: C.border,
    ...pixelBevel,
    borderTopColor: C.borderLight,
    borderLeftColor: C.borderLight,
    borderBottomColor: C.borderDark,
    borderRightColor: C.borderDark,
    gap: 6,
    cursor: "pointer" as any,
  },
  forecastRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  forecastDetailText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  forecastDetailTextLocked: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    ...pixelPanel,
    ...pixelBevel,
    marginTop: 8,
    padding: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
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
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  fullBtn: {
    width: "100%",
  },
});
