import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/store/gameStore";
import StandPlaceholder from "@/components/StandPlaceholder";
import StripedBackground from "@/components/StripedBackground";
import PixelIcon from "@/components/PixelIcon";
import { WEATHER_DATA } from "@/engine/constants";
import type { DayResult } from "@/engine/types";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_HOURS = 8;
const START_HOUR = 8; // 8 AM
const MS_PER_HOUR = 3000;
const TOTAL_DURATION_MS = TOTAL_HOURS * MS_PER_HOUR;
const CLOCK_TICK_MS = 100;
const ICON_FLOAT_DURATION = 2500;
const ICON_SIZE = 36;
const NAV_DELAY_AFTER_CLOSE = 1500;

// ── Clock helpers ────────────────────────────────────────────────────────────

/** Format a fractional 24-hour value (e.g. 13.5) as "1:30 PM". */
function formatGameTime(hour24: number): string {
  const h = Math.floor(hour24);
  const m = Math.floor((hour24 - h) * 60);
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Self-contained clock that ticks continuously from 8 AM to CLOSED.
 * Isolated in its own component so frequent re-renders don't affect the
 * parent's floating-icon layer.
 */
function SimulationClock() {
  const [display, setDisplay] = useState(() => formatGameTime(START_HOUR));

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= TOTAL_DURATION_MS) {
        setDisplay("CLOSED");
        clearInterval(interval);
        return;
      }
      const gameHours = (elapsed / TOTAL_DURATION_MS) * TOTAL_HOURS;
      setDisplay(formatGameTime(START_HOUR + gameHours));
    }, CLOCK_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.clockText}>{display}</Text>;
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ScheduledIcon {
  emoji: string;
  spawnTimeMs: number;
  x: number;
}

interface ActiveIcon {
  id: number;
  emoji: string;
  x: number;
  translateY: Animated.Value;
  opacity: Animated.Value;
}

// ── Schedule Builder ─────────────────────────────────────────────────────────

/**
 * Build a chronological list of icon spawns based on the day's results.
 * Icons are spread across the 8-hour window (24 real seconds).
 */
function buildSchedule(result: DayResult): ScheduledIcon[] {
  const schedule: ScheduledIcon[] = [];
  const rx = () => 10 + Math.random() * 80;
  const weatherEmoji = WEATHER_DATA[result.weather].emoji;

  // ── Hour 0 (8 AM): Opening ──
  schedule.push({ emoji: weatherEmoji, spawnTimeMs: 400, x: rx() });
  if (result.event) {
    schedule.push({ emoji: result.event.emoji, spawnTimeMs: 1400, x: rx() });
  }

  // ── Hours 1–6 (9 AM – 2 PM): Selling ──
  const sellingStart = MS_PER_HOUR;
  const sellingEnd = 7 * MS_PER_HOUR;
  const sellingDuration = sellingEnd - sellingStart;

  // Cups sold — one icon per ~2 cups, capped at 30
  const cupCount = Math.min(Math.ceil(result.cupsSold / 2), 30);
  for (let i = 0; i < cupCount; i++) {
    const t = sellingStart + (i / Math.max(cupCount - 1, 1)) * sellingDuration;
    schedule.push({ emoji: "🥤", spawnTimeMs: t, x: rx() });
  }

  // Money — one icon per $0.50 revenue, capped at 15
  const moneyCount = Math.min(Math.ceil(result.revenue / 0.5), 15);
  for (let i = 0; i < moneyCount; i++) {
    const t =
      sellingStart +
      150 +
      (i / Math.max(moneyCount - 1, 1)) * (sellingDuration - 150);
    schedule.push({ emoji: "💸", spawnTimeMs: t, x: rx() });
  }

  // Customers — one icon per 3 cups sold, capped at 10
  const customerCount = Math.min(Math.ceil(result.cupsSold / 3), 10);
  for (let i = 0; i < customerCount; i++) {
    const t =
      sellingStart +
      300 +
      (i / Math.max(customerCount - 1, 1)) * (sellingDuration - 300);
    schedule.push({ emoji: "👤", spawnTimeMs: t, x: rx() });
  }

  // Unmet demand — sad faces if customers were turned away
  if (result.maxDemand > result.cupsSold && result.cupsSold > 0) {
    const unmetCount = Math.min(
      Math.ceil((result.maxDemand - result.cupsSold) / 5),
      5,
    );
    // Place in the later selling hours (hours 4–6)
    const lateStart = 4 * MS_PER_HOUR;
    const lateDuration = sellingEnd - lateStart;
    for (let i = 0; i < unmetCount; i++) {
      const t = lateStart + (i / Math.max(unmetCount - 1, 1)) * lateDuration;
      schedule.push({ emoji: "👋", spawnTimeMs: t, x: rx() });
    }
  }

  // Weather reminders at hours 3 and 5
  schedule.push({
    emoji: weatherEmoji,
    spawnTimeMs: 3 * MS_PER_HOUR + 1000,
    x: rx(),
  });
  schedule.push({
    emoji: weatherEmoji,
    spawnTimeMs: 5 * MS_PER_HOUR + 1500,
    x: rx(),
  });

  // Event reminder at hour 4
  if (result.event) {
    schedule.push({
      emoji: result.event.emoji,
      spawnTimeMs: 4 * MS_PER_HOUR + 800,
      x: rx(),
    });
  }

  // ── Hour 7 (3 PM): Closing ──
  const closingStart = 7 * MS_PER_HOUR;

  if (result.iceMelted > 0) {
    const count = Math.min(Math.ceil(result.iceMelted / 3), 5);
    for (let i = 0; i < count; i++) {
      schedule.push({
        emoji: "🧊",
        spawnTimeMs: closingStart + 400 + i * 400,
        x: rx(),
      });
    }
  }
  if (result.spoiledSupplies.lemons > 0) {
    schedule.push({
      emoji: "🍋",
      spawnTimeMs: closingStart + 1000,
      x: rx(),
    });
  }
  if (result.spoiledSupplies.sugar > 0) {
    schedule.push({
      emoji: "🍬",
      spawnTimeMs: closingStart + 1500,
      x: rx(),
    });
  }

  return schedule.sort((a, b) => a.spawnTimeMs - b.spawnTimeMs);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SimulationScreen() {
  const router = useRouter();
  const getLastResult = useGameStore((s) => s.getLastResult);

  const result = getLastResult();
  const [activeIcons, setActiveIcons] = useState<ActiveIcon[]>([]);
  const nextId = useRef(0);
  const floatHeight = useRef(350);

  useEffect(() => {
    if (!result) {
      router.replace("/(game)/day");
      return;
    }

    const schedule = buildSchedule(result);

    // Schedule each icon spawn
    const iconTimeouts = schedule.map((item) =>
      setTimeout(() => {
        const id = nextId.current++;
        const translateY = new Animated.Value(0);
        const opacity = new Animated.Value(0);

        const icon: ActiveIcon = {
          id,
          emoji: item.emoji,
          x: item.x,
          translateY,
          opacity,
        };

        setActiveIcons((prev) => [...prev, icon]);

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -floatHeight.current,
            duration: ICON_FLOAT_DURATION,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(ICON_FLOAT_DURATION - 800),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setActiveIcons((prev) => prev.filter((i) => i.id !== id));
        });
      }, item.spawnTimeMs),
    );

    // Navigate away after all hours + a short pause
    const navTimeout = setTimeout(() => {
      const currentPhase = useGameStore.getState().phase;
      if (currentPhase === "victory") {
        router.replace("/(game)/victory");
      } else if (currentPhase === "gameover") {
        router.replace("/(game)/gameover");
      } else {
        router.replace("/(game)/results");
      }
    }, TOTAL_DURATION_MS + NAV_DELAY_AFTER_CLOSE);

    return () => {
      iconTimeouts.forEach(clearTimeout);
      clearTimeout(navTimeout);
    };
  }, [result, router]);

  if (!result) {
    return null;
  }

  return (
    <StripedBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header: Day label + Clock */}
        <View style={styles.header}>
          <Text style={styles.dayLabel}>DAY {result.day}</Text>
          <View style={styles.clockPanel}>
            <SimulationClock />
          </View>
        </View>

        {/* Stand area with floating icons */}
        <View
          style={styles.standArea}
          onLayout={(e) => {
            floatHeight.current = e.nativeEvent.layout.height * 0.75;
          }}
        >
          <StandPlaceholder style={styles.standFull} />

          {/* Floating icon overlay */}
          {activeIcons.map((icon) => (
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
      </SafeAreaView>
    </StripedBackground>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dayLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.gold,
  },
  clockPanel: {
    ...pixelPanel,
    ...pixelBevel,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  clockText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  standArea: {
    flex: 1,
    position: "relative",
  },
  standFull: {
    marginVertical: 0,
    minHeight: 0,
  },
  floatingIcon: {
    position: "absolute",
    bottom: 40,
    marginLeft: -ICON_SIZE / 2,
  },
});
