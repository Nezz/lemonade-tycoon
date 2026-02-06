import { GameEventId, GameEventDefinition, ActiveEvent } from "@/engine/types";
import { EVENT_CHANCE } from "@/engine/constants";

export const EVENT_DEFINITIONS: Record<GameEventId, GameEventDefinition> = {
  heatWave: {
    id: "heatWave",
    name: "Heat Wave",
    description: "Scorching temperatures! Everyone wants cold drinks.",
    emoji: "🌡️",
    demandMultiplier: 1.4,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  streetFair: {
    id: "streetFair",
    name: "Street Fair",
    description: "A street fair brings huge crowds to the area!",
    emoji: "🎪",
    demandMultiplier: 1.6,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  construction: {
    id: "construction",
    name: "Construction Nearby",
    description: "Road construction is driving away foot traffic.",
    emoji: "🚧",
    demandMultiplier: 0.7,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  healthInspector: {
    id: "healthInspector",
    name: "Health Inspector",
    description: "Health inspector visiting! High satisfaction = bonus rep.",
    emoji: "🔬",
    demandMultiplier: 1.0,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0, // calculated dynamically based on satisfaction
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  lemonShortage: {
    id: "lemonShortage",
    name: "Lemon Shortage",
    description: "Supply chain issues! Lemons cost double today.",
    emoji: "📈",
    demandMultiplier: 1.0,
    supplyCostMultiplier: 2.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  newspaperFeature: {
    id: "newspaperFeature",
    name: "Newspaper Feature",
    description: "Your stand was featured in the local paper!",
    emoji: "📰",
    demandMultiplier: 1.2,
    supplyCostMultiplier: 1.0,
    reputationEffect: 3,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  powerOutage: {
    id: "powerOutage",
    name: "Power Outage",
    description: "A power outage overnight melted all your ice!",
    emoji: "⚡",
    demandMultiplier: 1.0,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: true,
    sugarPreferenceShift: 0,
  },
  schoolFieldTrip: {
    id: "schoolFieldTrip",
    name: "School Field Trip",
    description: "Kids love sweet lemonade! Extra demand for sweet recipes.",
    emoji: "🎒",
    demandMultiplier: 1.25,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 2,
  },
  competingStand: {
    id: "competingStand",
    name: "Competing Stand",
    description: "A rival lemonade stand opened nearby!",
    emoji: "🏪",
    demandMultiplier: 0.8,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  bulkDiscount: {
    id: "bulkDiscount",
    name: "Bulk Supplier Discount",
    description: "Your supplier is running a 50% off sale today!",
    emoji: "🏷️",
    demandMultiplier: 1.0,
    supplyCostMultiplier: 0.5,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  rainSurprise: {
    id: "rainSurprise",
    name: "Surprise Rain",
    description: "The forecast was wrong! Unexpected rain today.",
    emoji: "🌦️",
    demandMultiplier: 0.65,
    supplyCostMultiplier: 1.0,
    reputationEffect: 0,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
  celebritySighting: {
    id: "celebritySighting",
    name: "Celebrity Sighting",
    description: "A celebrity was spotted near your stand! Huge crowds!",
    emoji: "⭐",
    demandMultiplier: 1.8,
    supplyCostMultiplier: 1.0,
    reputationEffect: 5,
    destroysIce: false,
    sugarPreferenceShift: 0,
  },
};

const ALL_EVENT_IDS: GameEventId[] = Object.keys(
  EVENT_DEFINITIONS,
) as GameEventId[];

/**
 * Roll for a random event. Returns null if no event fires (~65% of the time).
 */
export function rollEvent(): ActiveEvent | null {
  if (Math.random() > EVENT_CHANCE) {
    return null;
  }

  const idx = Math.floor(Math.random() * ALL_EVENT_IDS.length);
  const eventId = ALL_EVENT_IDS[idx];
  const def = EVENT_DEFINITIONS[eventId];

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    emoji: def.emoji,
  };
}

/**
 * Get the full event definition for an active event.
 */
export function getEventDefinition(eventId: GameEventId): GameEventDefinition {
  return EVENT_DEFINITIONS[eventId];
}
