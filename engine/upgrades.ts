import { UpgradeId } from "@/engine/types";
import { UPGRADE_IDS, UPGRADE_DEFINITIONS } from "@/engine/constants";

/**
 * Aggregated effects from all owned upgrades.
 * All numeric fields are resolved to final values (with caps applied).
 */
export interface AggregatedEffects {
  // Demand
  awareness: number;
  maxServedBonus: number;

  // Quality / Satisfaction
  recipeQuality: number;
  satisfaction: number;

  // Reputation
  reputationGain: number;

  // Weather (capped)
  rainReduction: number; // capped at 0.85
  coldReduction: number; // capped at 0.85
  forecastAccuracy: number; // highest value, default 0.8

  // Shelf life (additive days)
  iceShelfBonus: number;
  lemonShelfBonus: number;
  sugarShelfBonus: number;

  // Economy
  costReduction: number; // capped at 0.40
  inventoryBonus: number;
  rentPerDay: number; // highest value
  revenueBonus: number;
  passiveIncome: number;
  freeLemons: number;

  // Events
  eventBonusMult: number;
  eventPenaltyReduction: number; // capped at 0.75

  // UI unlocks
  showRecipeHints: boolean;
  showProfitPerCup: boolean;
  showForecast: boolean;
  showExtendedForecast: boolean;
}

// Caps for continuous effects
const RAIN_REDUCTION_CAP = 0.85;
const COLD_REDUCTION_CAP = 0.85;
const COST_REDUCTION_CAP = 0.4;
const EVENT_PENALTY_REDUCTION_CAP = 0.75;

/**
 * Sum all owned upgrade effects into a single aggregate, applying caps.
 */
export function aggregateEffects(
  upgrades: Record<UpgradeId, boolean>,
): AggregatedEffects {
  const agg: AggregatedEffects = {
    awareness: 0,
    maxServedBonus: 0,
    recipeQuality: 0,
    satisfaction: 0,
    reputationGain: 0,
    rainReduction: 0,
    coldReduction: 0,
    forecastAccuracy: 0, // will use default from constants if 0
    iceShelfBonus: 0,
    lemonShelfBonus: 0,
    sugarShelfBonus: 0,
    costReduction: 0,
    inventoryBonus: 0,
    rentPerDay: 0,
    revenueBonus: 0,
    passiveIncome: 0,
    freeLemons: 0,
    eventBonusMult: 0,
    eventPenaltyReduction: 0,
    showRecipeHints: false,
    showProfitPerCup: false,
    showForecast: false,
    showExtendedForecast: false,
  };

  for (const id of UPGRADE_IDS) {
    if (!upgrades[id]) {
      continue;
    }
    const fx = UPGRADE_DEFINITIONS[id].effects;

    // Additive fields
    if (fx.awareness) {
      agg.awareness += fx.awareness;
    }
    if (fx.maxServedBonus) {
      agg.maxServedBonus += fx.maxServedBonus;
    }
    if (fx.recipeQuality) {
      agg.recipeQuality += fx.recipeQuality;
    }
    if (fx.satisfaction) {
      agg.satisfaction += fx.satisfaction;
    }
    if (fx.reputationGain) {
      agg.reputationGain += fx.reputationGain;
    }
    if (fx.rainReduction) {
      agg.rainReduction += fx.rainReduction;
    }
    if (fx.coldReduction) {
      agg.coldReduction += fx.coldReduction;
    }
    if (fx.iceShelfBonus) {
      agg.iceShelfBonus += fx.iceShelfBonus;
    }
    if (fx.lemonShelfBonus) {
      agg.lemonShelfBonus += fx.lemonShelfBonus;
    }
    if (fx.sugarShelfBonus) {
      agg.sugarShelfBonus += fx.sugarShelfBonus;
    }
    if (fx.costReduction) {
      agg.costReduction += fx.costReduction;
    }
    if (fx.inventoryBonus) {
      agg.inventoryBonus += fx.inventoryBonus;
    }
    if (fx.revenueBonus) {
      agg.revenueBonus += fx.revenueBonus;
    }
    if (fx.passiveIncome) {
      agg.passiveIncome += fx.passiveIncome;
    }
    if (fx.freeLemons) {
      agg.freeLemons += fx.freeLemons;
    }
    if (fx.eventBonusMult) {
      agg.eventBonusMult += fx.eventBonusMult;
    }
    if (fx.eventPenaltyReduction) {
      agg.eventPenaltyReduction += fx.eventPenaltyReduction;
    }

    // Max fields
    if (fx.rentPerDay !== undefined && fx.rentPerDay > agg.rentPerDay) {
      agg.rentPerDay = fx.rentPerDay;
    }
    if (
      fx.forecastAccuracy !== undefined &&
      fx.forecastAccuracy > agg.forecastAccuracy
    ) {
      agg.forecastAccuracy = fx.forecastAccuracy;
    }

    // Boolean OR fields
    if (fx.showRecipeHints) {
      agg.showRecipeHints = true;
    }
    if (fx.showProfitPerCup) {
      agg.showProfitPerCup = true;
    }
    if (fx.showForecast) {
      agg.showForecast = true;
    }
    if (fx.showExtendedForecast) {
      agg.showExtendedForecast = true;
    }
  }

  // Apply caps
  agg.rainReduction = Math.min(agg.rainReduction, RAIN_REDUCTION_CAP);
  agg.coldReduction = Math.min(agg.coldReduction, COLD_REDUCTION_CAP);
  agg.costReduction = Math.min(agg.costReduction, COST_REDUCTION_CAP);
  agg.eventPenaltyReduction = Math.min(
    agg.eventPenaltyReduction,
    EVENT_PENALTY_REDUCTION_CAP,
  );

  return agg;
}
