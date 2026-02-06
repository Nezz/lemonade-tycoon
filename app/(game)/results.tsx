import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useGameStore } from "@/store/gameStore";
import WeatherBadge from "@/components/WeatherBadge";
import EventBanner from "@/components/EventBanner";
import StatRow from "@/components/StatRow";
import GameButton from "@/components/GameButton";
import { formatMoney } from "@/utils/format";
import { ACHIEVEMENT_DEFINITIONS } from "@/engine/achievements";
import PixelIcon from "@/components/PixelIcon";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";

function SatisfactionStars({ satisfaction }: { satisfaction: number }) {
  const filled = Math.round(satisfaction / 20);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < filled ? "*" : ".",
  ).join(" ");

  return (
    <View style={starStyles.container}>
      <Text style={starStyles.stars}>{stars}</Text>
      <Text style={starStyles.label}>{satisfaction}/100</Text>
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 6,
  },
  stars: {
    fontFamily: PIXEL_FONT,
    fontSize: F.title + 4,
    color: C.gold,
    letterSpacing: 4,
  },
  label: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
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
    router.replace("/(game)/day");
  };

  if (!result) {
    return (
      <StripedBackground>
        <View style={styles.center}>
          <Text style={styles.noResult}>NO RESULTS YET</Text>
          <GameButton
            title="BACK"
            onPress={() => router.replace("/(game)/day")}
          />
        </View>
      </StripedBackground>
    );
  }

  const profitColor = result.profit >= 0 ? C.green : C.red;
  const repChangeStr =
    result.reputationChange > 0
      ? `+${result.reputationChange}`
      : `${result.reputationChange}`;
  const repColor =
    result.reputationChange > 0
      ? C.green
      : result.reputationChange < 0
        ? C.red
        : C.textMuted;

  const hasSpoilage =
    result.spoiledSupplies.lemons > 0 ||
    result.spoiledSupplies.sugar > 0 ||
    result.spoiledSupplies.cups > 0;

  const hasAchievements = result.achievementsUnlocked.length > 0;

  return (
    <StripedBackground>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Day header */}
        <View style={styles.header}>
          <Text style={styles.dayTitle}>DAY {result.day}</Text>
          <WeatherBadge weather={result.weather} />
        </View>

        {/* All events — planned + surprises */}
        <EventBanner event={result.plannedEvent} />
        {result.surpriseEvents.map((evt) => (
          <EventBanner key={evt.id} event={evt} />
        ))}

        {/* Satisfaction */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SATISFACTION</Text>
          <SatisfactionStars satisfaction={result.satisfaction} />
        </View>

        {/* Sales Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SALES REPORT</Text>
          <StatRow
            label="Cups Sold"
            value={`${result.cupsSold}/${result.maxSellable}`}
          />
          <StatRow label="Revenue" value={formatMoney(result.revenue)} />
          <StatRow label="Cost" value={formatMoney(result.costOfGoods)} />
          {result.rent > 0 && (
            <StatRow
              label="Rent"
              value={`-${formatMoney(result.rent)}`}
              color={C.red}
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
          <Text style={styles.cardTitle}>OVERNIGHT</Text>
          <StatRow label="Reputation" value={repChangeStr} color={repColor} />
          {result.iceMelted > 0 && (
            <StatRow
              label="Ice Melted"
              value={`-${result.iceMelted}`}
              color={C.red}
            />
          )}
          {hasSpoilage && (
            <>
              {result.spoiledSupplies.lemons > 0 && (
                <StatRow
                  label="Lemons Spoiled"
                  value={`-${result.spoiledSupplies.lemons}`}
                  color={C.red}
                />
              )}
              {result.spoiledSupplies.sugar > 0 && (
                <StatRow
                  label="Sugar Spoiled"
                  value={`-${result.spoiledSupplies.sugar}`}
                  color={C.red}
                />
              )}
              {result.spoiledSupplies.cups > 0 && (
                <StatRow
                  label="Cups Spoiled"
                  value={`-${result.spoiledSupplies.cups}`}
                  color={C.red}
                />
              )}
            </>
          )}
          <StatRow
            label="Balance"
            value={formatMoney(money)}
            highlight
            color={C.green}
          />
        </View>

        {/* Achievements */}
        {hasAchievements && (
          <View style={styles.achievementCard}>
            <Text style={styles.cardTitle}>ACHIEVEMENTS!</Text>
            {result.achievementsUnlocked.map((id) => {
              const def = ACHIEVEMENT_DEFINITIONS[id];
              return (
                <View key={id} style={styles.achievementRow}>
                  <PixelIcon emoji={def.emoji} size={22} />
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{def.name}</Text>
                    <Text style={styles.achievementDesc}>
                      {def.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Next Day */}
        <GameButton
          title="START NEXT DAY"
          onPress={handleNextDay}
          style={styles.nextBtn}
        />
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
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  noResult: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.textMuted,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.gold,
  },
  card: {
    ...pixelPanel,
    ...pixelBevel,
  },
  cardTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    marginBottom: 6,
  },
  achievementCard: {
    ...pixelPanel,
    backgroundColor: C.warning,
    borderColor: C.warningBorder,
    borderTopColor: C.borderLight,
    borderLeftColor: C.borderLight,
    borderBottomColor: C.borderDark,
    borderRightColor: C.borderDark,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  achievementDesc: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textMuted,
    marginTop: 1,
  },
  nextBtn: {
    marginTop: 4,
  },
});
