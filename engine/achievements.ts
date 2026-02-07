import {
  AchievementId,
  AchievementDefinition,
  GameState,
  DayResult,
  UpgradeId,
} from "@/engine/types";
import { UPGRADE_IDS, WEATHER_TYPES } from "@/engine/constants";

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

  // ── Milestones ──────────────────────────────────────────────────────────────

  thousandaire: {
    id: "thousandaire",
    name: "Thousandaire",
    description: "Accumulate $1,000 lifetime revenue",
    emoji: "💰",
  },
  lemonEmperor: {
    id: "lemonEmperor",
    name: "Lemon Emperor",
    description: "Sell 1,000 cups lifetime",
    emoji: "👸",
  },
  marathon: {
    id: "marathon",
    name: "Marathon Runner",
    description: "Reach day 50",
    emoji: "🏃",
  },
  centenarian: {
    id: "centenarian",
    name: "Centenarian",
    description: "Reach day 100",
    emoji: "🎂",
  },
  fatCat: {
    id: "fatCat",
    name: "Fat Cat",
    description: "Have $250+ in savings",
    emoji: "🐱",
  },

  // ── Reputation ──────────────────────────────────────────────────────────────

  fiveStars: {
    id: "fiveStars",
    name: "Five Stars",
    description: "Reach max reputation",
    emoji: "⭐",
  },
  rockBottom: {
    id: "rockBottom",
    name: "Rock Bottom",
    description: "Hit 0 reputation",
    emoji: "📉",
  },

  // ── Weather & Recipe ────────────────────────────────────────────────────────

  stormChaser: {
    id: "stormChaser",
    name: "Storm Chaser",
    description: "Sell 20+ cups on a stormy day",
    emoji: "🌪️",
  },
  sugarRush: {
    id: "sugarRush",
    name: "Sugar Rush",
    description: "Serve lemonade with max sugar (6/cup) and sell some",
    emoji: "🍬",
  },
  sourPower: {
    id: "sourPower",
    name: "Sour Power",
    description: "Serve with 6 lemons per cup and sell 10+ cups",
    emoji: "😖",
  },
  mostlyWater: {
    id: "mostlyWater",
    name: "Mostly Water",
    description: "Serve with 1 lemon, 1 sugar, and 6 ice per cup",
    emoji: "💧",
  },
  allWeatherPro: {
    id: "allWeatherPro",
    name: "All-Weather Pro",
    description: "Profit in all 6 weather types",
    emoji: "🌈",
  },

  // ── Events ──────────────────────────────────────────────────────────────────

  famousLemonade: {
    id: "famousLemonade",
    name: "Famous",
    description: "Get a celebrity sighting or newspaper feature",
    emoji: "📸",
  },
  doubleWhammy: {
    id: "doubleWhammy",
    name: "Double Whammy",
    description: "Experience 2+ surprise events in one day",
    emoji: "⚡",
  },
  healthNut: {
    id: "healthNut",
    name: "Clean Bill of Health",
    description: "Pass the health inspector with 80+ satisfaction",
    emoji: "✅",
  },

  // ── Funny ───────────────────────────────────────────────────────────────────

  highwayRobbery: {
    id: "highwayRobbery",
    name: "Highway Robbery",
    description: "Sell lemonade at $5/cup and still find a buyer",
    emoji: "🤑",
  },
  bargainBin: {
    id: "bargainBin",
    name: "Practically Free",
    description: "Sell lemonade at $0.25 per cup",
    emoji: "🏷️",
  },
  frozenAssets: {
    id: "frozenAssets",
    name: "Frozen Assets",
    description: "Have 100+ ice in inventory",
    emoji: "🧊",
  },
  ghostStand: {
    id: "ghostStand",
    name: "Ghost Stand",
    description: "Open shop and somehow sell nothing",
    emoji: "👻",
  },
  spoilAlert: {
    id: "spoilAlert",
    name: "Spoil Alert",
    description: "Lose 20+ supplies to spoilage in one day",
    emoji: "🤢",
  },
  byAThread: {
    id: "byAThread",
    name: "By a Thread",
    description: "Start a day with less than $5 and still profit",
    emoji: "🪶",
  },

  // ── Skill / Streaks ─────────────────────────────────────────────────────────

  hotStreak: {
    id: "hotStreak",
    name: "Hot Streak",
    description: "10 consecutive profitable days",
    emoji: "🔥",
  },
  crowdPleaser: {
    id: "crowdPleaser",
    name: "Crowd Pleaser",
    description: "5 consecutive days with 80+ satisfaction",
    emoji: "😊",
  },
  zeroWaste: {
    id: "zeroWaste",
    name: "Zero Waste",
    description: "Complete a day with no spoilage (after day 5)",
    emoji: "♻️",
  },
  profitMachine: {
    id: "profitMachine",
    name: "Profit Machine",
    description: "Earn $100+ profit in a single day",
    emoji: "🏧",
  },

  // ── Zero-ingredient ────────────────────────────────────────────────────────

  holdTheLemons: {
    id: "holdTheLemons",
    name: "Hold the Lemons",
    description: "Sell 'lemonade' with 0 lemons per cup",
    emoji: "🚫",
  },
  sugarFree: {
    id: "sugarFree",
    name: "Sugar-Free",
    description: "Serve completely unsweetened lemonade and sell some",
    emoji: "🦷",
  },
  lukewarm: {
    id: "lukewarm",
    name: "Lukewarm",
    description: "Serve lemonade with 0 ice and sell some",
    emoji: "🥵",
  },
  madScientist: {
    id: "madScientist",
    name: "Mad Scientist",
    description: "Sell cups with 2+ ingredients at zero",
    emoji: "🧪",
  },
  justCups: {
    id: "justCups",
    name: "Just Cups",
    description: "Sell empty cups — all 3 ingredients at zero",
    emoji: "🫗",
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
  const negativeEvents: string[] = [
    "construction",
    "competingStand",
    "rainSurprise",
    "lemonShortage",
    "powerOutage",
    "roadClosure",
    "waterMainBreak",
    "beeSighting",
    "parkingLotClosed",
    "badOnlineReview",
    "fridgeMalfunction",
    "heatBurst",
  ];
  const allEvents = [result.plannedEvent, ...result.surpriseEvents];
  const hasNegativeEvent = allEvents.some((e) => negativeEvents.includes(e.id));
  check("eventSurvivor", hasNegativeEvent && result.profit > 0);

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

  // ── Milestones ──────────────────────────────────────────────────────────────

  // Thousandaire: $1,000 lifetime revenue
  check("thousandaire", stats.totalRevenue + result.revenue >= 1000);

  // Lemon Emperor: 1,000 cups lifetime
  check("lemonEmperor", stats.totalCupsSold + result.cupsSold >= 1000);

  // Marathon Runner: reach day 50
  check("marathon", result.day >= 50);

  // Centenarian: reach day 100
  check("centenarian", result.day >= 100);

  // Fat Cat: $250+ in savings (post-day balance)
  check("fatCat", money + result.profit >= 250);

  // ── Reputation ──────────────────────────────────────────────────────────────

  const newReputation = state.reputation + result.reputationChange;

  // Five Stars: hit max reputation
  check("fiveStars", newReputation >= 100);

  // Rock Bottom: hit 0 reputation
  check("rockBottom", newReputation <= 0);

  // ── Weather & Recipe ────────────────────────────────────────────────────────

  // Storm Chaser: sell 20+ cups on a stormy day
  check("stormChaser", result.weather === "stormy" && result.cupsSold >= 20);

  // Sugar Rush: max sugar per cup and sold some
  check("sugarRush", state.recipe.sugarPerCup >= 6 && result.cupsSold > 0);

  // Sour Power: 6 lemons per cup and sold 10+
  check("sourPower", state.recipe.lemonsPerCup >= 6 && result.cupsSold >= 10);

  // Mostly Water: 1 lemon, 1 sugar, 6 ice and sold some
  check(
    "mostlyWater",
    state.recipe.lemonsPerCup === 1 &&
      state.recipe.sugarPerCup === 1 &&
      state.recipe.icePerCup >= 6 &&
      result.cupsSold > 0,
  );

  // All-Weather Pro: profit in all 6 weather types
  const profitableWeathers = new Set<string>();
  for (const r of allResults) {
    if (r.profit > 0) {
      profitableWeathers.add(r.weather);
    }
  }
  check(
    "allWeatherPro",
    WEATHER_TYPES.every((w) => profitableWeathers.has(w)),
  );

  // ── Events ──────────────────────────────────────────────────────────────────

  // Famous: celebrity sighting or newspaper feature
  const hasFameEvent = allEvents.some(
    (e) => e.id === "celebritySighting" || e.id === "newspaperFeature",
  );
  check("famousLemonade", hasFameEvent);

  // Double Whammy: 2+ surprise events in one day
  check("doubleWhammy", result.surpriseEvents.length >= 2);

  // Clean Bill of Health: pass health inspector with 80+ satisfaction
  const hasHealthInspector = result.surpriseEvents.some(
    (e) => e.id === "healthInspector",
  );
  check("healthNut", hasHealthInspector && result.satisfaction >= 80);

  // ── Funny ───────────────────────────────────────────────────────────────────

  // Highway Robbery: sell at max price ($5) and still get buyers
  check("highwayRobbery", state.pricePerCup >= 5.0 && result.cupsSold > 0);

  // Practically Free: sell at min price ($0.25)
  check("bargainBin", state.pricePerCup <= 0.25 && result.cupsSold > 0);

  // Frozen Assets: 100+ ice in inventory
  check("frozenAssets", state.inventory.ice >= 100);

  // Ghost Stand: sell nothing (after day 1)
  check("ghostStand", result.cupsSold === 0 && result.day > 1);

  // Spoil Alert: 20+ supplies lost to spoilage
  const totalSpoiled =
    result.spoiledSupplies.lemons +
    result.spoiledSupplies.sugar +
    result.spoiledSupplies.ice +
    result.spoiledSupplies.cups;
  check("spoilAlert", totalSpoiled >= 20);

  // By a Thread: start day with < $5 and still profit
  check("byAThread", money < 5 && result.profit > 0);

  // ── Skill / Streaks ─────────────────────────────────────────────────────────

  // Hot Streak: 10 consecutive profitable days
  if (allResults.length >= 10) {
    const last10 = allResults.slice(-10);
    check(
      "hotStreak",
      last10.every((r) => r.profit > 0),
    );
  }

  // Crowd Pleaser: 5 consecutive days with 80+ satisfaction
  if (allResults.length >= 5) {
    const last5 = allResults.slice(-5);
    check(
      "crowdPleaser",
      last5.every((r) => r.satisfaction >= 80),
    );
  }

  // Zero Waste: no spoilage on a day (after day 5)
  check(
    "zeroWaste",
    result.day > 5 &&
      result.iceMelted === 0 &&
      result.spoiledSupplies.lemons === 0 &&
      result.spoiledSupplies.sugar === 0 &&
      result.spoiledSupplies.ice === 0 &&
      result.spoiledSupplies.cups === 0,
  );

  // Profit Machine: $100+ profit in one day
  check("profitMachine", result.profit >= 100);

  // ── Zero-ingredient ──────────────────────────────────────────────────────

  const { lemonsPerCup, sugarPerCup, icePerCup } = state.recipe;
  const zeroCount =
    (lemonsPerCup === 0 ? 1 : 0) +
    (sugarPerCup === 0 ? 1 : 0) +
    (icePerCup === 0 ? 1 : 0);

  // Hold the Lemons: sell with 0 lemons
  check("holdTheLemons", lemonsPerCup === 0 && result.cupsSold > 0);

  // Sugar-Free: sell with 0 sugar
  check("sugarFree", sugarPerCup === 0 && result.cupsSold > 0);

  // Lukewarm: sell with 0 ice
  check("lukewarm", icePerCup === 0 && result.cupsSold > 0);

  // Mad Scientist: sell with 2+ ingredients at zero
  check("madScientist", zeroCount >= 2 && result.cupsSold > 0);

  // Just Cups: sell with all 3 ingredients at zero
  check("justCups", zeroCount === 3 && result.cupsSold > 0);

  return newly;
}
