import {
  AchievementId,
  AchievementDefinition,
  GameState,
  DayResult,
  UpgradeId,
} from "@/engine/types";
import { UPGRADE_IDS } from "@/engine/constants";

export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementId,
  AchievementDefinition
> = {
  firstSale: {
    id: "firstSale",
    name: "First Sale",
    description: "Sell your very first cup of lemonade",
    emoji: "🥤",
  },
  centurion: {
    id: "centurion",
    name: "Centurion",
    description: "Sell 100 cups lifetime",
    emoji: "💯",
  },
  rainyDayFund: {
    id: "rainyDayFund",
    name: "Rainy Day Fund",
    description: "Have $100 or more in savings",
    emoji: "🏦",
  },
  perfectDay: {
    id: "perfectDay",
    name: "Perfect Day",
    description: "Achieve 100% customer satisfaction",
    emoji: "🌟",
  },
  entrepreneur: {
    id: "entrepreneur",
    name: "Entrepreneur",
    description: "Earn $50+ profit in a single day",
    emoji: "💼",
  },
  weatherproof: {
    id: "weatherproof",
    name: "Weatherproof",
    description: "Sell 10+ cups on a stormy day",
    emoji: "⛈️",
  },
  upgradeCollector: {
    id: "upgradeCollector",
    name: "Upgrade Collector",
    description: "Own all 111 upgrades",
    emoji: "🏆",
  },
  survivor: {
    id: "survivor",
    name: "Survivor",
    description: "Reach day 30",
    emoji: "📅",
  },
  tycoon: {
    id: "tycoon",
    name: "Tycoon",
    description: "Accumulate $500 lifetime revenue",
    emoji: "👑",
  },
  pennyPincher: {
    id: "pennyPincher",
    name: "Penny Pincher",
    description: "Earn profit 7 consecutive days",
    emoji: "🪙",
  },
  eventSurvivor: {
    id: "eventSurvivor",
    name: "Event Survivor",
    description: "Profit on a day with a negative event",
    emoji: "🛡️",
  },
  bigSpender: {
    id: "bigSpender",
    name: "Big Spender",
    description: "Spend $50+ on supplies in one shopping trip",
    emoji: "💸",
  },
  lemonKing: {
    id: "lemonKing",
    name: "Lemon King",
    description: "Sell 500 cups lifetime",
    emoji: "🍋",
  },
  comebackKid: {
    id: "comebackKid",
    name: "Comeback Kid",
    description: "Profit after a day where you lost money",
    emoji: "💪",
  },
  fullHouse: {
    id: "fullHouse",
    name: "Full House",
    description: "Sell every cup you could make (20+ cups)",
    emoji: "🏠",
  },
};

export const ACHIEVEMENT_IDS: AchievementId[] = Object.keys(
  ACHIEVEMENT_DEFINITIONS,
) as AchievementId[];

/**
 * Check which achievements were newly unlocked after a day result.
 * Returns only the IDs of achievements that were NOT previously unlocked.
 */
export function checkAchievements(
  state: GameState,
  result: DayResult,
  totalSpentToday: number,
): AchievementId[] {
  const newly: AchievementId[] = [];
  const { achievements, stats, money, upgrades } = state;

  function check(id: AchievementId, condition: boolean) {
    if (!achievements[id] && condition) {
      newly.push(id);
    }
  }

  // First Sale: sold at least 1 cup ever
  check("firstSale", result.cupsSold > 0);

  // Centurion: 100 cups lifetime
  check("centurion", stats.totalCupsSold + result.cupsSold >= 100);

  // Rainy Day Fund: have $100+
  check("rainyDayFund", money >= 100);

  // Perfect Day: 100 satisfaction
  check("perfectDay", result.satisfaction >= 100);

  // Entrepreneur: $50+ profit in one day
  check("entrepreneur", result.profit >= 50);

  // Weatherproof: 10+ cups on stormy day
  check("weatherproof", result.weather === "stormy" && result.cupsSold >= 10);

  // Upgrade Collector: all upgrades
  check(
    "upgradeCollector",
    UPGRADE_IDS.every((id: UpgradeId) => upgrades[id]),
  );

  // Survivor: reach day 30
  check("survivor", result.day >= 30);

  // Tycoon: $500 lifetime revenue
  check("tycoon", stats.totalRevenue + result.revenue >= 500);

  // Penny Pincher: 7 consecutive profitable days
  const allResults = [...stats.dayResults, result];
  if (allResults.length >= 7) {
    const last7 = allResults.slice(-7);
    check(
      "pennyPincher",
      last7.every((r) => r.profit > 0),
    );
  }

  // Event Survivor: profit on a negative-demand event day
  const negativeEvents = [
    "construction",
    "competingStand",
    "rainSurprise",
    "lemonShortage",
    "powerOutage",
  ];
  check(
    "eventSurvivor",
    result.event !== null &&
      negativeEvents.includes(result.event.id) &&
      result.profit > 0,
  );

  // Big Spender: $50+ spent on supplies today
  check("bigSpender", totalSpentToday >= 50);

  // Lemon King: 500 cups lifetime
  check("lemonKing", stats.totalCupsSold + result.cupsSold >= 500);

  // Comeback Kid: profit after a loss
  if (stats.dayResults.length > 0) {
    const prevResult = stats.dayResults[stats.dayResults.length - 1];
    check("comebackKid", prevResult.profit < 0 && result.profit > 0);
  }

  // Full House: sold all makeable cups, at least 20
  check(
    "fullHouse",
    result.cupsSold >= 20 && result.cupsSold >= result.maxDemand,
  );

  return newly;
}
