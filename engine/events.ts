import {
  GameEventId,
  GameEventDefinition,
  ActiveEvent,
  EventEffects,
  SupplyId,
  type Recipe,
} from "@/engine/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Random float between min and max (inclusive), rounded to 2 decimals. */
function randBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

/** Random integer between min and max (inclusive). */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Default (neutral) effects ────────────────────────────────────────────────

const NEUTRAL_EFFECTS: EventEffects = {
  demandMultiplier: 1.0,
  supplyCostMultiplier: 1.0,
  reputationEffect: 0,
  destroysIce: false,
  sugarPreferenceShift: 0,
};

// ── Event Definitions ────────────────────────────────────────────────────────
//
// For events with randomized values, the definition stores *template* effects.
// The actual resolved values are produced by the resolver functions below.

export const EVENT_DEFINITIONS: Record<GameEventId, GameEventDefinition> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PLANNED EVENTS (23) — shown on day screen before simulation
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Existing (kept) ────────────────────────────────────────────────────────

  heatWave: {
    id: "heatWave",
    name: "Heat Wave",
    emoji: "🌡️",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.4 },
  },
  streetFair: {
    id: "streetFair",
    name: "Street Fair",
    emoji: "🎪",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.6 },
  },
  construction: {
    id: "construction",
    name: "Construction Nearby",
    emoji: "🚧",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.7 },
  },
  schoolFieldTrip: {
    id: "schoolFieldTrip",
    name: "School Field Trip",
    emoji: "🎒",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.25,
      sugarPreferenceShift: 2,
    },
  },
  competingStand: {
    id: "competingStand",
    name: "Competing Stand",
    emoji: "🏪",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.8 },
  },

  // ── Per-item price surges (planned) ────────────────────────────────────────

  lemonShortage: {
    id: "lemonShortage",
    name: "Lemon Shortage",
    emoji: "📈",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { lemons: 1.75 },
    },
  },
  sugarShortage: {
    id: "sugarShortage",
    name: "Sugar Shortage",
    emoji: "📈",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { sugar: 1.6 },
    },
  },
  iceTruckDelay: {
    id: "iceTruckDelay",
    name: "Ice Truck Delay",
    emoji: "🚛",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { ice: 1.75 },
    },
  },
  cupShortage: {
    id: "cupShortage",
    name: "Cup Shortage",
    emoji: "📦",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { cups: 1.5 },
    },
  },
  citrusBlight: {
    id: "citrusBlight",
    name: "Citrus Blight",
    emoji: "🦠",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { lemons: 1.55 },
    },
  },

  // ── Per-item discounts (planned) ───────────────────────────────────────────

  lemonGlut: {
    id: "lemonGlut",
    name: "Lemon Glut",
    emoji: "🍋",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { lemons: 0.725 },
    },
  },
  iceSale: {
    id: "iceSale",
    name: "Ice Sale",
    emoji: "🧊",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { ice: 0.675 },
    },
  },
  sugarSurplus: {
    id: "sugarSurplus",
    name: "Sugar Surplus",
    emoji: "🍬",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { sugar: 0.725 },
    },
  },
  cupPromo: {
    id: "cupPromo",
    name: "Cup Promo",
    emoji: "🥤",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      supplyCostMultipliers: { cups: 0.775 },
    },
  },

  // ── Demand (planned) ───────────────────────────────────────────────────────

  localSportsGame: {
    id: "localSportsGame",
    name: "Local Sports Game",
    emoji: "⚽",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.275,
      sugarPreferenceShift: -1,
    },
  },
  charityMarathon: {
    id: "charityMarathon",
    name: "Charity Marathon",
    emoji: "🏃",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.225 },
  },
  neighborhoodGarageSale: {
    id: "neighborhoodGarageSale",
    name: "Garage Sale Day",
    emoji: "🏷️",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.15 },
  },
  lemonadeDay: {
    id: "lemonadeDay",
    name: "National Lemonade Day",
    emoji: "🎉",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.3 },
  },
  rivalClosed: {
    id: "rivalClosed",
    name: "Rival Closed Today",
    emoji: "🔒",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.15 },
  },
  parkConcert: {
    id: "parkConcert",
    name: "Park Concert",
    emoji: "🎸",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.2 },
  },
  roadClosure: {
    id: "roadClosure",
    name: "Road Closure",
    emoji: "🚫",
    timing: "planned",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.85 },
  },

  // ── Preference / mixed (planned) ───────────────────────────────────────────

  churchPicnic: {
    id: "churchPicnic",
    name: "Vappu Picnic",
    emoji: "⛪",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.125,
      sugarPreferenceShift: 1,
    },
  },
  dietTrend: {
    id: "dietTrend",
    name: "Diet Trend Article",
    emoji: "🥗",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.075,
      sugarPreferenceShift: -1,
    },
  },

  // ── Zero-ingredient beneficial (planned) ────────────────────────────────

  healthCraze: {
    id: "healthCraze",
    name: "Health Craze",
    emoji: "🥦",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.15,
      sugarPreferenceShift: -2,
      zeroIngredientBonuses: { sugar: true },
    },
  },
  citrusAllergyScare: {
    id: "citrusAllergyScare",
    name: "Citrus Allergy Scare",
    emoji: "🤧",
    timing: "planned",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.1,
      zeroIngredientBonuses: { lemons: true },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SURPRISE EVENTS (16) — revealed as toasts during simulation
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Existing (moved to surprise) ───────────────────────────────────────────

  healthInspector: {
    id: "healthInspector",
    name: "Health Inspector",
    emoji: "🔬",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS }, // rep calculated dynamically
  },
  newspaperFeature: {
    id: "newspaperFeature",
    name: "Newspaper Feature",
    emoji: "📰",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.2,
      reputationEffect: 3,
    },
  },
  powerOutage: {
    id: "powerOutage",
    name: "Power Outage",
    emoji: "⚡",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, destroysIce: true },
  },
  celebritySighting: {
    id: "celebritySighting",
    name: "Celebrity Sighting",
    emoji: "⭐",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.8,
      reputationEffect: 5,
    },
  },
  rainSurprise: {
    id: "rainSurprise",
    name: "Surprise Rain",
    emoji: "🌦️",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.65 },
  },

  // ── Demand surprises ───────────────────────────────────────────────────────

  touristBus: {
    id: "touristBus",
    name: "Tourist Bus",
    emoji: "🚌",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 1.175 },
  },
  waterMainBreak: {
    id: "waterMainBreak",
    name: "Water Main Break",
    emoji: "💧",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.85 },
  },
  beeSighting: {
    id: "beeSighting",
    name: "Bee Sighting",
    emoji: "🐝",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.875 },
  },
  parkingLotClosed: {
    id: "parkingLotClosed",
    name: "Parking Lot Closed",
    emoji: "🅿️",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, demandMultiplier: 0.885 },
  },
  heatBurst: {
    id: "heatBurst",
    name: "Overnight Heat Burst",
    emoji: "🔥",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      destroysIce: true,
      demandMultiplier: 1.2,
    },
  },

  // ── Reputation surprises ───────────────────────────────────────────────────

  foodBlogReview: {
    id: "foodBlogReview",
    name: "Food Blog Review",
    emoji: "📝",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.1,
      reputationEffect: 2,
    },
  },
  badOnlineReview: {
    id: "badOnlineReview",
    name: "Bad Online Review",
    emoji: "👎",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 0.925,
      reputationEffect: -2,
    },
  },
  viralVideo: {
    id: "viralVideo",
    name: "Viral Video",
    emoji: "📱",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.15,
      reputationEffect: 3,
    },
  },
  lostDogReunion: {
    id: "lostDogReunion",
    name: "Lost Dog Reunion",
    emoji: "🐕",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, reputationEffect: 2 },
  },

  // ── Ice destruction surprises ──────────────────────────────────────────────

  fridgeMalfunction: {
    id: "fridgeMalfunction",
    name: "Fridge Malfunction",
    emoji: "🔧",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, destroysIce: true },
  },

  // ── Preference surprises ───────────────────────────────────────────────────

  gymClassField: {
    id: "gymClassField",
    name: "Gym Class Outing",
    emoji: "💪",
    timing: "surprise",
    effects: { ...NEUTRAL_EFFECTS, sugarPreferenceShift: -1 },
  },

  // ── Zero-ingredient beneficial (surprise) ─────────────────────────────

  warmDrinkTrend: {
    id: "warmDrinkTrend",
    name: "Warm Drinks Trending",
    emoji: "☕",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 1.1,
      zeroIngredientBonuses: { ice: true },
    },
  },

  // ── Zero-ingredient complaints (recipe-triggered, not in random pool) ──

  noLemonComplaint: {
    id: "noLemonComplaint",
    name: "Where's the Lemon?!",
    emoji: "😡",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 0.7,
      reputationEffect: -5,
    },
  },
  noSugarComplaint: {
    id: "noSugarComplaint",
    name: "Too Sour!",
    emoji: "😡",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 0.85,
      reputationEffect: -3,
    },
  },
  noIceComplaint: {
    id: "noIceComplaint",
    name: "It's Warm!",
    emoji: "😡",
    timing: "surprise",
    effects: {
      ...NEUTRAL_EFFECTS,
      demandMultiplier: 0.9,
      reputationEffect: -2,
    },
  },
};

// ── Event Pools ──────────────────────────────────────────────────────────────

const ALL_EVENT_IDS = Object.keys(EVENT_DEFINITIONS) as GameEventId[];

const PLANNED_EVENT_IDS = ALL_EVENT_IDS.filter(
  (id) => EVENT_DEFINITIONS[id].timing === "planned",
);

const SURPRISE_EVENT_IDS = ALL_EVENT_IDS.filter(
  (id) => EVENT_DEFINITIONS[id].timing === "surprise",
);

/** Chance each surprise slot fires (rolled twice independently). */
const SURPRISE_CHANCE = 1;

// ── Description Generators ───────────────────────────────────────────────────
//
// Each event gets a description based on its resolved effect values.
// This allows randomized percentages to appear in the text.

type DescriptionFn = (effects: EventEffects) => string;

function pctUp(mult: number): number {
  return Math.round((mult - 1) * 100);
}

function pctDown(mult: number): number {
  return Math.round((1 - mult) * 100);
}

function supplyPctUp(effects: EventEffects, supply: SupplyId): number {
  const m = effects.supplyCostMultipliers?.[supply] ?? 1;
  return Math.round((m - 1) * 100);
}

function supplyPctDown(effects: EventEffects, supply: SupplyId): number {
  const m = effects.supplyCostMultipliers?.[supply] ?? 1;
  return Math.round((1 - m) * 100);
}

const DESCRIPTIONS: Record<GameEventId, DescriptionFn> = {
  // Planned — existing
  heatWave: () => "Scorching temperatures! Everyone wants cold drinks.",
  streetFair: () => "A street fair brings huge crowds to the area!",
  construction: () => "Road construction is driving away foot traffic.",
  schoolFieldTrip: () =>
    "Kids love sweet lemonade! Extra demand for sweet recipes.",
  competingStand: () => "A rival lemonade stand opened nearby!",

  // Planned — per-item surges
  lemonShortage: (e) =>
    `Supply chain issues! Lemons cost ${supplyPctUp(e, "lemons")}% more today.`,
  sugarShortage: (e) =>
    `Sugar supplies are low! Sugar costs ${supplyPctUp(e, "sugar")}% more today.`,
  iceTruckDelay: (e) =>
    `The ice truck broke down! Ice costs ${supplyPctUp(e, "ice")}% more today.`,
  cupShortage: (e) =>
    `Cup manufacturer delays! Cups cost ${supplyPctUp(e, "cups")}% more today.`,
  citrusBlight: (e) =>
    `Citrus blight hit local groves! Lemons cost ${supplyPctUp(e, "lemons")}% more.`,

  // Planned — per-item discounts
  lemonGlut: (e) =>
    `Bumper lemon harvest! Lemons are ${supplyPctDown(e, "lemons")}% cheaper today.`,
  iceSale: (e) =>
    `Ice supplier clearance! Ice is ${supplyPctDown(e, "ice")}% cheaper today.`,
  sugarSurplus: (e) =>
    `Warehouse overstock! Sugar is ${supplyPctDown(e, "sugar")}% cheaper today.`,
  cupPromo: (e) =>
    `Cup manufacturer promo! Cups are ${supplyPctDown(e, "cups")}% cheaper today.`,

  // Planned — demand
  localSportsGame: (e) =>
    `The big game nearby brings ${pctUp(e.demandMultiplier)}% more thirsty fans!`,
  charityMarathon: (e) =>
    `A charity marathon brings ${pctUp(e.demandMultiplier)}% more thirsty runners!`,
  neighborhoodGarageSale: (e) =>
    `Garage sales bring ${pctUp(e.demandMultiplier)}% more foot traffic.`,
  lemonadeDay: (e) =>
    `It's National Lemonade Day! ${pctUp(e.demandMultiplier)}% more demand!`,
  rivalClosed: (e) =>
    `The competing stand is closed! ${pctUp(e.demandMultiplier)}% more customers for you.`,
  parkConcert: (e) =>
    `Outdoor concert in the park! ${pctUp(e.demandMultiplier)}% more visitors.`,
  roadClosure: (e) =>
    `Road closure detour! ${pctDown(e.demandMultiplier)}% fewer pedestrians.`,

  // Planned — preference / mixed
  churchPicnic: () => "It's Vappu! Families prefer sweeter lemonade.",
  dietTrend: () =>
    "A diet trend article boosts demand — people prefer less sugar.",

  // Planned — zero-ingredient beneficial
  healthCraze: () =>
    "Health craze sweeping the city! Sugar-free drinks are all the rage.",
  citrusAllergyScare: () =>
    "Citrus allergy scare in the news! Lemon-free drinks are the safe choice.",

  // Surprise — existing
  healthInspector: () =>
    "Health inspector visiting! High satisfaction = bonus rep.",
  newspaperFeature: () => "Your stand was featured in the local paper!",
  powerOutage: () => "A power outage overnight melted all your ice!",
  celebritySighting: () =>
    "A celebrity was spotted near your stand! Huge crowds!",
  rainSurprise: () => "The forecast was wrong! Unexpected rain today.",

  // Surprise — demand
  touristBus: (e) =>
    `A tour bus just pulled up! ${pctUp(e.demandMultiplier)}% more customers.`,
  waterMainBreak: (e) =>
    `A water main broke nearby. ${pctDown(e.demandMultiplier)}% fewer people around.`,
  beeSighting: (e) =>
    `Bees spotted near your stand! ${pctDown(e.demandMultiplier)}% fewer visitors.`,
  parkingLotClosed: (e) =>
    `Nearby parking lot closed! ${pctDown(e.demandMultiplier)}% less foot traffic.`,
  heatBurst: (e) =>
    `Overnight heat burst melted your ice — but ${pctUp(e.demandMultiplier)}% more demand!`,

  // Surprise — reputation
  foodBlogReview: () => "A food blogger just featured your stand!",
  badOnlineReview: () => "Someone left a harsh 1-star review online.",
  viralVideo: (e) =>
    `Your stand went viral on social media! ${pctUp(e.demandMultiplier)}% more demand.`,
  lostDogReunion: () =>
    "A lost dog was reunited with its owner at your stand! Heartwarming press.",

  // Surprise — ice
  fridgeMalfunction: () => "Your fridge broke overnight! All your ice melted.",

  // Surprise — preference
  gymClassField: () => "A gym class stopped by! They prefer less sugar.",

  // Surprise — zero-ingredient beneficial
  warmDrinkTrend: () =>
    "Warm drinks trending on social media! Ice-free is the hot new thing.",

  // Surprise — zero-ingredient complaints
  noLemonComplaint: () =>
    "Customers are furious — this isn't lemonade without lemons!",
  noSugarComplaint: () =>
    "Customers grimace at the sourness — way too bitter without sugar!",
  noIceComplaint: () =>
    "Customers complain their drinks are lukewarm — where's the ice?",
};

// ── Effect Resolvers (randomization) ─────────────────────────────────────────
//
// Events without a resolver use the static effects from EVENT_DEFINITIONS.
// Events with a resolver get freshly randomized values each time they fire.

type ResolverFn = () => EventEffects;

const RESOLVERS: Partial<Record<GameEventId, ResolverFn>> = {
  // Per-item surges — randomized percentage
  lemonShortage: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { lemons: randBetween(1.5, 2.0) },
  }),
  sugarShortage: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { sugar: randBetween(1.4, 1.8) },
  }),
  iceTruckDelay: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { ice: randBetween(1.5, 2.0) },
  }),
  cupShortage: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { cups: randBetween(1.3, 1.6) },
  }),
  citrusBlight: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { lemons: randBetween(1.4, 1.7) },
  }),

  // Per-item discounts — randomized percentage
  lemonGlut: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { lemons: randBetween(0.65, 0.8) },
  }),
  iceSale: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { ice: randBetween(0.6, 0.75) },
  }),
  sugarSurplus: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { sugar: randBetween(0.65, 0.8) },
  }),
  cupPromo: () => ({
    ...NEUTRAL_EFFECTS,
    supplyCostMultipliers: { cups: randBetween(0.7, 0.85) },
  }),

  // Demand events — randomized multiplier
  localSportsGame: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.2, 1.35),
    sugarPreferenceShift: -1,
  }),
  charityMarathon: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.15, 1.3),
  }),
  neighborhoodGarageSale: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.2),
  }),
  lemonadeDay: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.25, 1.35),
  }),
  rivalClosed: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.2),
  }),
  parkConcert: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.15, 1.25),
  }),
  roadClosure: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(0.8, 0.9),
  }),
  churchPicnic: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.15),
    sugarPreferenceShift: randInt(1, 2),
  }),
  dietTrend: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.05, 1.1),
    sugarPreferenceShift: -1,
  }),

  // Surprise demand — randomized
  touristBus: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.25),
  }),
  waterMainBreak: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(0.8, 0.9),
  }),
  beeSighting: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(0.85, 0.9),
  }),
  parkingLotClosed: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(0.85, 0.92),
  }),
  heatBurst: () => ({
    ...NEUTRAL_EFFECTS,
    destroysIce: true,
    demandMultiplier: randBetween(1.15, 1.25),
  }),

  // Surprise reputation — randomized
  foodBlogReview: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.05, 1.15),
    reputationEffect: 2,
  }),
  badOnlineReview: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(0.9, 0.95),
    reputationEffect: randInt(-3, -2),
  }),
  viralVideo: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.2),
    reputationEffect: randInt(3, 4),
  }),
  lostDogReunion: () => ({
    ...NEUTRAL_EFFECTS,
    reputationEffect: randInt(2, 3),
  }),

  // Surprise preference — randomized
  gymClassField: () => ({
    ...NEUTRAL_EFFECTS,
    sugarPreferenceShift: randInt(-2, -1),
  }),

  // Zero-ingredient beneficial — randomized
  healthCraze: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.1, 1.2),
    sugarPreferenceShift: -2,
    zeroIngredientBonuses: { sugar: true },
  }),
  citrusAllergyScare: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.05, 1.15),
    zeroIngredientBonuses: { lemons: true },
  }),
  warmDrinkTrend: () => ({
    ...NEUTRAL_EFFECTS,
    demandMultiplier: randBetween(1.05, 1.15),
    zeroIngredientBonuses: { ice: true },
  }),
};

// ── Resolve an event into an ActiveEvent ─────────────────────────────────────

function resolveEvent(eventId: GameEventId): ActiveEvent {
  const def = EVENT_DEFINITIONS[eventId];
  const resolver = RESOLVERS[eventId];
  const effects = resolver ? resolver() : { ...def.effects };
  const description = DESCRIPTIONS[eventId](effects);

  return {
    id: def.id,
    name: def.name,
    description,
    emoji: def.emoji,
    timing: def.timing,
    effects,
  };
}

// ── Rolling Functions ────────────────────────────────────────────────────────

/**
 * Roll a planned event. Always returns exactly one event.
 */
export function rollPlannedEvent(): ActiveEvent {
  const idx = Math.floor(Math.random() * PLANNED_EVENT_IDS.length);
  return resolveEvent(PLANNED_EVENT_IDS[idx]);
}

/**
 * Roll surprise events. Returns 0–2 events (each slot has a 25% chance).
 * No duplicate event IDs within a single roll.
 */
export function rollSurpriseEvents(): ActiveEvent[] {
  const result: ActiveEvent[] = [];
  const usedIds = new Set<GameEventId>();

  for (let slot = 0; slot < 2; slot++) {
    if (Math.random() > SURPRISE_CHANCE) {
      continue;
    }

    // Pick a random surprise event that hasn't been used yet
    const available = SURPRISE_EVENT_IDS.filter((id) => !usedIds.has(id));
    if (available.length === 0) {
      break;
    }

    const idx = Math.floor(Math.random() * available.length);
    const eventId = available[idx];
    usedIds.add(eventId);
    result.push(resolveEvent(eventId));
  }

  return result;
}

// ── Effect Combination ───────────────────────────────────────────────────────

/**
 * Combine effects from multiple events into a single aggregated EventEffects.
 * - demandMultiplier: multiply
 * - supplyCostMultiplier: multiply
 * - supplyCostMultipliers: multiply per-supply
 * - reputationEffect: add
 * - destroysIce: OR
 * - sugarPreferenceShift: add
 */
export function combineEventEffects(events: ActiveEvent[]): EventEffects {
  const combined: EventEffects = { ...NEUTRAL_EFFECTS };

  for (const event of events) {
    const e = event.effects;
    combined.demandMultiplier *= e.demandMultiplier;
    combined.supplyCostMultiplier *= e.supplyCostMultiplier;
    combined.reputationEffect += e.reputationEffect;
    combined.destroysIce = combined.destroysIce || e.destroysIce;
    combined.sugarPreferenceShift += e.sugarPreferenceShift;

    // Per-supply multipliers: multiply into combined
    if (e.supplyCostMultipliers) {
      if (!combined.supplyCostMultipliers) {
        combined.supplyCostMultipliers = {};
      }
      for (const [key, mult] of Object.entries(e.supplyCostMultipliers)) {
        const supplyId = key as SupplyId;
        combined.supplyCostMultipliers[supplyId] =
          (combined.supplyCostMultipliers[supplyId] ?? 1) * mult;
      }
    }

    // Zero-ingredient bonuses: OR together
    if (e.zeroIngredientBonuses) {
      if (!combined.zeroIngredientBonuses) {
        combined.zeroIngredientBonuses = {};
      }
      if (e.zeroIngredientBonuses.lemons) {
        combined.zeroIngredientBonuses.lemons = true;
      }
      if (e.zeroIngredientBonuses.sugar) {
        combined.zeroIngredientBonuses.sugar = true;
      }
      if (e.zeroIngredientBonuses.ice) {
        combined.zeroIngredientBonuses.ice = true;
      }
    }
  }

  return combined;
}

// ── Recipe-Triggered Events ──────────────────────────────────────────────────

/**
 * Generate complaint events for zero-ingredient recipes.
 * Skips the complaint when a matching beneficial event is active
 * (e.g. health craze suppresses the no-sugar complaint).
 */
export function rollRecipeEvents(
  recipe: Recipe,
  combinedEffects: EventEffects,
): ActiveEvent[] {
  const result: ActiveEvent[] = [];
  const bonuses = combinedEffects.zeroIngredientBonuses;

  if (recipe.lemonsPerCup === 0 && !bonuses?.lemons) {
    result.push(resolveEvent("noLemonComplaint"));
  }
  if (recipe.sugarPerCup === 0 && !bonuses?.sugar) {
    result.push(resolveEvent("noSugarComplaint"));
  }
  if (recipe.icePerCup === 0 && !bonuses?.ice) {
    result.push(resolveEvent("noIceComplaint"));
  }

  return result;
}

/**
 * Get the full event definition for an event ID.
 * Useful for looking up static metadata (timing, emoji, etc.).
 */
export function getEventDefinition(eventId: GameEventId): GameEventDefinition {
  return EVENT_DEFINITIONS[eventId];
}
