import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/store/gameStore";
import StandPlaceholder from "@/components/StandPlaceholder";
import StripedBackground from "@/components/StripedBackground";
import PixelIcon from "@/components/PixelIcon";
import { WEATHER_DATA } from "@/engine/constants";
import type { ActiveEvent, DayResult } from "@/engine/types";
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

// Surprise toast timing
const TOAST_DURATION_MS = 3500;
const TOAST_FADE_MS = 400;

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
 * Clock that ticks continuously from 8 AM.
 * Shows "SOLD OUT!" if stock ran out early, then "CLOSED" at the end.
 * Isolated in its own component so frequent re-renders don't affect the
 * parent's floating-icon layer.
 */
function SimulationClock({
  effectiveTotalMs,
  soldOutAtMs,
}: {
  effectiveTotalMs: number;
  soldOutAtMs: number | null;
}) {
  const [display, setDisplay] = useState(() => formatGameTime(START_HOUR));
  const isSoldOut = display === "SOLD OUT!";

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= effectiveTotalMs) {
        setDisplay("CLOSED");
        clearInterval(interval);
        return;
      }
      if (soldOutAtMs !== null && elapsed >= soldOutAtMs) {
        setDisplay("SOLD OUT!");
        return;
      }
      const gameHours = elapsed / MS_PER_HOUR;
      setDisplay(formatGameTime(START_HOUR + gameHours));
    }, CLOCK_TICK_MS);
    return () => clearInterval(interval);
  }, [effectiveTotalMs, soldOutAtMs]);

  return (
    <Text style={[styles.clockText, isSoldOut && styles.soldOutText]}>
      {display}
    </Text>
  );
}

// ── Surprise Event Toast ─────────────────────────────────────────────────────

function SurpriseToast({
  event,
  delayMs,
}: {
  event: ActiveEvent;
  delayMs: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: TOAST_FADE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: TOAST_FADE_MS,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold, then fade out
        setTimeout(
          () => {
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: TOAST_FADE_MS,
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: -20,
                duration: TOAST_FADE_MS,
                useNativeDriver: true,
              }),
            ]).start();
          },
          TOAST_DURATION_MS - TOAST_FADE_MS * 2,
        );
      });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, opacity, translateY]);

  return (
    <Animated.View
      style={[styles.toastBanner, { opacity, transform: [{ translateY }] }]}
    >
      <PixelIcon emoji={event.emoji} size={20} />
      <View style={styles.toastTextContainer}>
        <Text style={styles.toastName}>{event.name}</Text>
        <Text style={styles.toastDescription} numberOfLines={2}>
          {event.description}
        </Text>
      </View>
    </Animated.View>
  );
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

interface Schedule {
  icons: ScheduledIcon[];
  effectiveTotalMs: number;
  /** Real-time ms when stock ran out. null if stock lasted all day. */
  soldOutAtMs: number | null;
}

/**
 * Build a chronological list of icon spawns based on the day's results.
 * If the player ran out of stock before demand was met, the selling window
 * is shortened proportionally and the shop closes early.
 */
function buildSchedule(result: DayResult): Schedule {
  const schedule: ScheduledIcon[] = [];
  const rx = () => 10 + Math.random() * 80;
  const weatherEmoji = WEATHER_DATA[result.weather].emoji;

  // Did we run out of stock before meeting demand?
  const ranOutOfStock =
    result.cupsSold > 0 && result.maxSellable < result.maxDemand;
  const sellFraction = ranOutOfStock ? result.cupsSold / result.maxDemand : 1;

  // ── Timing ──
  const sellingStart = MS_PER_HOUR;
  const fullSellingDuration = 6 * MS_PER_HOUR;
  // Ensure at least 2 game-hours of selling animation
  const effectiveSellingDuration = Math.max(
    2 * MS_PER_HOUR,
    sellFraction * fullSellingDuration,
  );
  const effectiveSellingEnd = sellingStart + effectiveSellingDuration;
  const soldOutGapMs = ranOutOfStock ? MS_PER_HOUR : 0;
  const closingStart = effectiveSellingEnd + soldOutGapMs;
  const effectiveTotalMs = closingStart + MS_PER_HOUR;
  const soldOutAtMs = ranOutOfStock ? effectiveSellingEnd : null;

  // ── Hour 0 (8 AM): Opening ──
  schedule.push({ emoji: weatherEmoji, spawnTimeMs: 400, x: rx() });
  schedule.push({
    emoji: result.plannedEvent.emoji,
    spawnTimeMs: 1400,
    x: rx(),
  });

  // ── Selling period (compressed when stock runs out early) ──

  // Cups sold — one icon per ~2 cups, capped at 30
  const cupCount = Math.min(Math.ceil(result.cupsSold / 2), 30);
  for (let i = 0; i < cupCount; i++) {
    const t =
      sellingStart + (i / Math.max(cupCount - 1, 1)) * effectiveSellingDuration;
    schedule.push({ emoji: "🥤", spawnTimeMs: t, x: rx() });
  }

  // Money — one icon per $0.50 revenue, capped at 15
  const moneyCount = Math.min(Math.ceil(result.revenue / 0.5), 15);
  for (let i = 0; i < moneyCount; i++) {
    const t =
      sellingStart +
      150 +
      (i / Math.max(moneyCount - 1, 1)) * (effectiveSellingDuration - 150);
    schedule.push({ emoji: "💸", spawnTimeMs: t, x: rx() });
  }

  // Customers — one icon per 3 cups sold, capped at 10
  const customerCount = Math.min(Math.ceil(result.cupsSold / 3), 10);
  for (let i = 0; i < customerCount; i++) {
    const t =
      sellingStart +
      300 +
      (i / Math.max(customerCount - 1, 1)) * (effectiveSellingDuration - 300);
    schedule.push({ emoji: "👤", spawnTimeMs: t, x: rx() });
  }

  // Unmet demand — wave icons right after selling ends when sold out
  if (ranOutOfStock) {
    const unmetCount = Math.min(
      Math.ceil((result.maxDemand - result.cupsSold) / 5),
      5,
    );
    for (let i = 0; i < unmetCount; i++) {
      const t = effectiveSellingEnd + 200 + i * 400;
      schedule.push({ emoji: "👋", spawnTimeMs: t, x: rx() });
    }
  }

  // Weather reminders — only if they fall within the selling window
  if (3 * MS_PER_HOUR + 1000 < effectiveSellingEnd) {
    schedule.push({
      emoji: weatherEmoji,
      spawnTimeMs: 3 * MS_PER_HOUR + 1000,
      x: rx(),
    });
  }
  if (5 * MS_PER_HOUR + 1500 < effectiveSellingEnd) {
    schedule.push({
      emoji: weatherEmoji,
      spawnTimeMs: 5 * MS_PER_HOUR + 1500,
      x: rx(),
    });
  }

  // Planned event reminder — only if it falls within the selling window
  if (4 * MS_PER_HOUR + 800 < effectiveSellingEnd) {
    schedule.push({
      emoji: result.plannedEvent.emoji,
      spawnTimeMs: 4 * MS_PER_HOUR + 800,
      x: rx(),
    });
  }

  // Surprise event emoji floats — staggered during selling period
  for (let i = 0; i < result.surpriseEvents.length; i++) {
    const evt = result.surpriseEvents[i];
    const t = sellingStart + (i + 1) * 2 * MS_PER_HOUR + 500;
    if (t < effectiveSellingEnd) {
      schedule.push({ emoji: evt.emoji, spawnTimeMs: t, x: rx() });
    }
  }

  // ── Closing (moved earlier when sold out) ──

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

  return {
    icons: schedule.sort((a, b) => a.spawnTimeMs - b.spawnTimeMs),
    effectiveTotalMs,
    soldOutAtMs,
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SimulationScreen() {
  const router = useRouter();
  const getLastResult = useGameStore((s) => s.getLastResult);

  const result = getLastResult();
  const [activeIcons, setActiveIcons] = useState<ActiveIcon[]>([]);
  const nextId = useRef(0);
  const floatHeight = useRef(350);

  const scheduleRef = useRef<Schedule | null>(null);
  if (result && !scheduleRef.current) {
    scheduleRef.current = buildSchedule(result);
  }
  const schedule = scheduleRef.current;

  useEffect(() => {
    if (!result || !schedule) {
      router.replace("/(game)/day");
      return;
    }

    // Schedule each icon spawn
    const iconTimeouts = schedule.icons.map((item) =>
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
      if (currentPhase === "gameover") {
        router.replace("/(game)/gameover");
      } else if (currentPhase === "bailout") {
        router.replace("/(game)/bailout");
      } else {
        router.replace("/(game)/results");
      }
    }, schedule.effectiveTotalMs + NAV_DELAY_AFTER_CLOSE);

    return () => {
      iconTimeouts.forEach(clearTimeout);
      clearTimeout(navTimeout);
    };
  }, [result, schedule, router]);

  if (!result) {
    return null;
  }

  // Surprise toasts are staggered: first at ~2 game-hours, second at ~4 game-hours
  const surpriseDelays = [2 * MS_PER_HOUR, 4 * MS_PER_HOUR];

  return (
    <StripedBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header: Day label + Clock */}
        <View style={styles.header}>
          <Text style={styles.dayLabel}>DAY {result.day}</Text>
          <View style={styles.clockPanel}>
            <SimulationClock
              effectiveTotalMs={schedule?.effectiveTotalMs ?? TOTAL_DURATION_MS}
              soldOutAtMs={schedule?.soldOutAtMs ?? null}
            />
          </View>
        </View>

        {/* Surprise Event Toasts */}
        <View style={styles.toastContainer}>
          {result.surpriseEvents.map((evt, idx) => (
            <SurpriseToast
              key={evt.id}
              event={evt}
              delayMs={surpriseDelays[idx] ?? (idx + 1) * 2 * MS_PER_HOUR}
            />
          ))}
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
  soldOutText: {
    color: C.red,
  },
  // Surprise event toasts
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 12,
    right: 12,
    zIndex: 100,
    gap: 6,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.warning,
    borderRadius: 0,
    padding: 10,
    borderWidth: 3,
    borderColor: C.warningBorder,
    ...pixelBevel,
    borderTopColor: C.borderLight,
    borderLeftColor: C.borderLight,
    borderBottomColor: C.borderDark,
    borderRightColor: C.borderDark,
    gap: 8,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastName: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  toastDescription: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textLight,
    marginTop: 2,
    lineHeight: 24,
  },
  // Stand area
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
