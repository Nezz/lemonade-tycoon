import { WeatherType, Recipe, UpgradeId, ActiveEvent } from "@/engine/types";
import {
  WEATHER_DATA,
  BASE_DEMAND,
  DEMAND_GROWTH_PER_DAY,
} from "@/engine/constants";
import { getEventDefinition } from "@/engine/events";
import { AggregatedEffects, aggregateEffects } from "@/engine/upgrades";

/**
 * Clamp a number between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Score how well a single ingredient value fits within an ideal range.
 * Returns 1.0 for perfect match, lower for deviation.
 */
function ingredientScore(value: number, ideal: [number, number]): number {
  const [lo, hi] = ideal;
  if (value >= lo && value <= hi) {
    return 1.0;
  }
  const distance = value < lo ? lo - value : value - hi;
  return Math.max(0.3, 1.0 - distance * 0.2);
}

/**
 * Calculate recipe quality based on weather conditions.
 * Uses aggregated recipeQuality bonus from effects.
 */
export function recipeQuality(
  recipe: Recipe,
  weather: WeatherType,
  event: ActiveEvent | null,
  effects?: AggregatedEffects,
): number {
  const info = WEATHER_DATA[weather];

  // Apply event sugar preference shift
  let sugarIdeal: [number, number] = info.idealSugar;
  if (event) {
    const eventDef = getEventDefinition(event.id);
    if (eventDef.sugarPreferenceShift !== 0) {
      sugarIdeal = [
        clamp(sugarIdeal[0] + eventDef.sugarPreferenceShift, 1, 6),
        clamp(sugarIdeal[1] + eventDef.sugarPreferenceShift, 1, 6),
      ];
    }
  }

  const lemonScore = ingredientScore(recipe.lemonsPerCup, info.idealLemons);
  const sugarScore = ingredientScore(recipe.sugarPerCup, sugarIdeal);
  const iceScore = ingredientScore(recipe.icePerCup, info.idealIce);

  // Weighted average: ice matters more in hot weather, sugar in cold
  const iceWeight = weather === "hot" || weather === "sunny" ? 0.4 : 0.25;
  const sugarWeight = weather === "rainy" || weather === "stormy" ? 0.4 : 0.25;
  const lemonWeight = 1.0 - iceWeight - sugarWeight;

  let quality =
    lemonScore * lemonWeight + sugarScore * sugarWeight + iceScore * iceWeight;

  // Scale to 0.3-1.3 range
  quality = clamp(quality * 1.3, 0.3, 1.3);

  // Apply aggregated recipe quality bonus
  if (effects && effects.recipeQuality > 0) {
    quality *= 1 + effects.recipeQuality;
  }

  return quality;
}

/**
 * Calculate the demand modifier from price.
 * Cheaper prices attract more customers, expensive ones repel.
 */
export function priceModifier(pricePerCup: number): number {
  return clamp(1.5 - pricePerCup * 0.5, 0.2, 1.5);
}

/**
 * Calculate the demand modifier from reputation.
 */
export function reputationModifier(reputation: number): number {
  return 0.5 + reputation / 200;
}

/**
 * Calculate the demand bonus from upgrades via aggregated effects.
 * Handles weather penalty reduction as continuous scaling.
 */
export function upgradeBonus(
  effects: AggregatedEffects,
  weather: WeatherType,
): number {
  let bonus = 1.0;

  // Awareness bonus (from signage, marketing, staff, specials)
  bonus += effects.awareness;

  // Weather penalty reduction (continuous scaling, capped)
  const weatherMult = WEATHER_DATA[weather].demandMultiplier;
  if (weatherMult < 1.0) {
    const penalty = 1.0 - weatherMult;
    if (weather === "rainy" || weather === "stormy") {
      // Rain reduction applies to rainy/stormy weather
      bonus += penalty * effects.rainReduction;
    } else if (weather === "cloudy") {
      // Cold reduction applies to cloudy weather
      bonus += penalty * effects.coldReduction;
    }
  }

  return bonus;
}

/**
 * Calculate satisfaction bonus from aggregated effects.
 */
export function satisfactionBonus(effects: AggregatedEffects): number {
  return 1.0 + effects.satisfaction;
}

/**
 * Calculate total customer demand for a day, including event effects.
 */
export function calculateDemand(
  day: number,
  weather: WeatherType,
  pricePerCup: number,
  recipe: Recipe,
  reputation: number,
  upgrades: Record<UpgradeId, boolean>,
  event: ActiveEvent | null,
): number {
  const effects = aggregateEffects(upgrades);

  const base = BASE_DEMAND + day * DEMAND_GROWTH_PER_DAY;
  const weatherMod = WEATHER_DATA[weather].demandMultiplier;
  const priceMod = priceModifier(pricePerCup);
  const qualityMod = recipeQuality(recipe, weather, event, effects);
  const repMod = reputationModifier(reputation);
  const upgMod = upgradeBonus(effects, weather);

  // Max served bonus from speed/staff upgrades
  const maxServedMult = 1 + effects.maxServedBonus;

  // Event demand modifier
  let eventMod = 1.0;
  if (event) {
    const eventDef = getEventDefinition(event.id);
    eventMod = eventDef.demandMultiplier;

    // Amplify positive events, reduce negative events via effects
    if (eventDef.demandMultiplier > 1.0 && effects.eventBonusMult > 0) {
      const bonus = eventDef.demandMultiplier - 1.0;
      eventMod = 1.0 + bonus * (1 + effects.eventBonusMult);
    } else if (
      eventDef.demandMultiplier < 1.0 &&
      effects.eventPenaltyReduction > 0
    ) {
      const penalty = 1.0 - eventDef.demandMultiplier;
      eventMod = 1.0 - penalty * (1 - effects.eventPenaltyReduction);
    }
  }

  const rawDemand =
    base * weatherMod * priceMod * qualityMod * repMod * upgMod * eventMod;

  // maxServedBonus caps max demand (like having more capacity)
  return Math.floor(rawDemand * maxServedMult);
}

/**
 * Calculate how many cups can be made from current inventory & recipe.
 */
export function cupsFromInventory(
  inventory: { lemons: number; sugar: number; ice: number; cups: number },
  recipe: Recipe,
): number {
  if (
    recipe.lemonsPerCup === 0 ||
    recipe.sugarPerCup === 0 ||
    recipe.icePerCup === 0
  ) {
    return 0;
  }

  const fromLemons = Math.floor(inventory.lemons / recipe.lemonsPerCup);
  const fromSugar = Math.floor(inventory.sugar / recipe.sugarPerCup);
  const fromIce = Math.floor(inventory.ice / recipe.icePerCup);
  const fromCups = inventory.cups;

  return Math.min(fromLemons, fromSugar, fromIce, fromCups);
}

/**
 * Calculate satisfaction score (0-100) based on recipe quality, price fairness,
 * and aggregated upgrade bonuses.
 */
export function calculateSatisfaction(
  recipe: Recipe,
  weather: WeatherType,
  pricePerCup: number,
  event: ActiveEvent | null,
  effects?: AggregatedEffects,
): number {
  const quality = recipeQuality(recipe, weather, event, effects);
  const priceFairness = clamp(1.5 - pricePerCup * 0.4, 0.3, 1.2);

  let raw = quality * 0.7 + priceFairness * 0.3;

  // Apply satisfaction bonus from aggregated effects
  if (effects) {
    raw *= satisfactionBonus(effects);
  }

  return Math.round(clamp(raw * 77, 0, 100));
}
