import { WeatherType, Recipe, UpgradeId, EventEffects } from "@/engine/types";
import {
  WEATHER_DATA,
  BASE_DEMAND,
  DEMAND_GROWTH_PER_DAY,
} from "@/engine/constants";
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
 * Zero = missing ingredient: 0.0 penalty, or 1.2 bonus if a beneficial event is active.
 */
function ingredientScore(
  value: number,
  ideal: [number, number],
  hasZeroBonus: boolean = false,
): number {
  if (value === 0) {
    return hasZeroBonus ? 1.2 : 0.0;
  }
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
 * `eventEffects` is the combined EventEffects from all active events.
 */
export function recipeQuality(
  recipe: Recipe,
  weather: WeatherType,
  eventEffects: EventEffects | null,
  effects?: AggregatedEffects,
): number {
  const info = WEATHER_DATA[weather];

  // Apply event sugar preference shift
  let sugarIdeal: [number, number] = info.idealSugar;
  if (eventEffects && eventEffects.sugarPreferenceShift !== 0) {
    sugarIdeal = [
      clamp(sugarIdeal[0] + eventEffects.sugarPreferenceShift, 1, 6),
      clamp(sugarIdeal[1] + eventEffects.sugarPreferenceShift, 1, 6),
    ];
  }

  // Check zero-ingredient bonuses from beneficial events
  const zeroBonuses = eventEffects?.zeroIngredientBonuses;

  const lemonScore = ingredientScore(
    recipe.lemonsPerCup,
    info.idealLemons,
    zeroBonuses?.lemons ?? false,
  );
  const sugarScore = ingredientScore(
    recipe.sugarPerCup,
    sugarIdeal,
    zeroBonuses?.sugar ?? false,
  );
  const iceScore = ingredientScore(
    recipe.icePerCup,
    info.idealIce,
    zeroBonuses?.ice ?? false,
  );

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
 * Calculate total customer demand for a day, including combined event effects.
 * `eventEffects` is the pre-combined EventEffects from all active events.
 */
export function calculateDemand(
  day: number,
  weather: WeatherType,
  pricePerCup: number,
  recipe: Recipe,
  reputation: number,
  upgrades: Record<UpgradeId, boolean>,
  eventEffects: EventEffects | null,
): number {
  const effects = aggregateEffects(upgrades);

  const base = BASE_DEMAND + day * DEMAND_GROWTH_PER_DAY;
  const weatherMod = WEATHER_DATA[weather].demandMultiplier;
  const priceMod = priceModifier(pricePerCup);
  const qualityMod = recipeQuality(recipe, weather, eventEffects, effects);
  const repMod = reputationModifier(reputation);
  const upgMod = upgradeBonus(effects, weather);

  // Max served bonus from speed/staff upgrades
  const maxServedMult = 1 + effects.maxServedBonus;

  // Event demand modifier (already combined from all events)
  let eventMod = 1.0;
  if (eventEffects) {
    eventMod = eventEffects.demandMultiplier;

    // Amplify positive events, reduce negative events via upgrade effects
    if (eventMod > 1.0 && effects.eventBonusMult > 0) {
      const bonus = eventMod - 1.0;
      eventMod = 1.0 + bonus * (1 + effects.eventBonusMult);
    } else if (eventMod < 1.0 && effects.eventPenaltyReduction > 0) {
      const penalty = 1.0 - eventMod;
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
 * An ingredient set to 0 per cup means it's skipped (not used).
 */
export function cupsFromInventory(
  inventory: { lemons: number; sugar: number; ice: number; cups: number },
  recipe: Recipe,
): number {
  const fromLemons =
    recipe.lemonsPerCup > 0
      ? Math.floor(inventory.lemons / recipe.lemonsPerCup)
      : Infinity;
  const fromSugar =
    recipe.sugarPerCup > 0
      ? Math.floor(inventory.sugar / recipe.sugarPerCup)
      : Infinity;
  const fromIce =
    recipe.icePerCup > 0
      ? Math.floor(inventory.ice / recipe.icePerCup)
      : Infinity;
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
  eventEffects: EventEffects | null,
  effects?: AggregatedEffects,
): number {
  const quality = recipeQuality(recipe, weather, eventEffects, effects);
  const priceFairness = clamp(1.5 - pricePerCup * 0.4, 0.3, 1.2);

  let raw = quality * 0.7 + priceFairness * 0.3;

  // Apply satisfaction bonus from aggregated effects
  if (effects) {
    raw *= satisfactionBonus(effects);
  }

  return Math.round(clamp(raw * 77, 0, 100));
}
