import {
  GameState,
  DayResult,
  Inventory,
  InventoryBatches,
  SupplyId,
  SpoiledSupplies,
} from "@/engine/types";
import {
  SUPPLY_DEFINITIONS,
  SUPPLY_IDS,
  REPUTATION_MAX,
  REPUTATION_MIN,
  REPUTATION_DECAY_RATE,
  getRentForDay,
} from "@/engine/constants";
import { getEventDefinition } from "@/engine/events";
import {
  calculateDemand,
  cupsFromInventory,
  calculateSatisfaction,
} from "@/engine/customers";
import { aggregateEffects } from "@/engine/upgrades";

/**
 * Calculate the cost of ingredients consumed per cup.
 * Applies aggregated costReduction from supply chain upgrades.
 */
function costPerCup(
  recipe: { lemonsPerCup: number; sugarPerCup: number; icePerCup: number },
  costReduction: number = 0,
): number {
  const lemonCostPerUnit =
    SUPPLY_DEFINITIONS.lemons.packCost / SUPPLY_DEFINITIONS.lemons.packSize;
  const sugarCostPerUnit =
    SUPPLY_DEFINITIONS.sugar.packCost / SUPPLY_DEFINITIONS.sugar.packSize;
  const iceCostPerUnit =
    SUPPLY_DEFINITIONS.ice.packCost / SUPPLY_DEFINITIONS.ice.packSize;
  const cupCostPerUnit =
    SUPPLY_DEFINITIONS.cups.packCost / SUPPLY_DEFINITIONS.cups.packSize;

  let cost =
    recipe.lemonsPerCup * lemonCostPerUnit +
    recipe.sugarPerCup * sugarCostPerUnit +
    recipe.icePerCup * iceCostPerUnit +
    cupCostPerUnit;

  // Apply cost reduction from supply chain upgrades (capped at 40%)
  if (costReduction > 0) {
    cost *= 1 - costReduction;
  }

  return cost;
}

/**
 * Get total count from batches for a supply type.
 */
export function batchTotal(
  batches: InventoryBatches,
  supplyId: SupplyId,
): number {
  return batches[supplyId].reduce((sum, b) => sum + b.amount, 0);
}

/**
 * Rebuild flat inventory counts from batches.
 */
export function inventoryFromBatches(batches: InventoryBatches): Inventory {
  return {
    lemons: batchTotal(batches, "lemons"),
    sugar: batchTotal(batches, "sugar"),
    ice: batchTotal(batches, "ice"),
    cups: batchTotal(batches, "cups"),
  };
}

/**
 * Consume `amount` units from batches (oldest first - FIFO).
 */
function consumeFromBatches(
  batches: { amount: number; purchasedOnDay: number }[],
  amount: number,
): { amount: number; purchasedOnDay: number }[] {
  let remaining = amount;
  const newBatches: { amount: number; purchasedOnDay: number }[] = [];

  for (const batch of batches) {
    if (remaining <= 0) {
      newBatches.push({ ...batch });
      continue;
    }
    if (batch.amount <= remaining) {
      remaining -= batch.amount;
    } else {
      newBatches.push({
        amount: batch.amount - remaining,
        purchasedOnDay: batch.purchasedOnDay,
      });
      remaining = 0;
    }
  }

  return newBatches;
}

/**
 * Remove expired batches for a supply type.
 * `shelfLifeBonus` adds extra days from cooling upgrades.
 */
function removeExpiredBatches(
  batches: { amount: number; purchasedOnDay: number }[],
  currentDay: number,
  shelfLife: number | null,
  shelfLifeBonus: number = 0,
): {
  newBatches: { amount: number; purchasedOnDay: number }[];
  spoiled: number;
} {
  if (shelfLife === null) {
    return { newBatches: [...batches], spoiled: 0 };
  }

  const effectiveShelfLife = shelfLife + shelfLifeBonus;
  let spoiled = 0;
  const newBatches: { amount: number; purchasedOnDay: number }[] = [];

  for (const batch of batches) {
    const age = currentDay - batch.purchasedOnDay;
    if (age >= effectiveShelfLife) {
      spoiled += batch.amount;
    } else {
      newBatches.push({ ...batch });
    }
  }

  return { newBatches, spoiled };
}

/**
 * Run a full day simulation. Returns the DayResult and updated state.
 */
export function runDay(state: GameState): {
  result: DayResult;
  newInventory: Inventory;
  newInventoryBatches: InventoryBatches;
  newReputation: number;
} {
  const {
    day,
    weather,
    recipe,
    pricePerCup,
    inventoryBatches,
    reputation,
    upgrades,
    activeEvent,
  } = state;

  // Aggregate all upgrade effects once
  const effects = aggregateEffects(upgrades);

  // 0. Apply event: power outage destroys ice
  let workingBatches: InventoryBatches = {
    lemons: [...inventoryBatches.lemons.map((b) => ({ ...b }))],
    sugar: [...inventoryBatches.sugar.map((b) => ({ ...b }))],
    ice: [...inventoryBatches.ice.map((b) => ({ ...b }))],
    cups: [...inventoryBatches.cups.map((b) => ({ ...b }))],
  };

  if (activeEvent) {
    const eventDef = getEventDefinition(activeEvent.id);
    if (eventDef.destroysIce) {
      workingBatches.ice = [];
    }
  }

  const workingInventory = inventoryFromBatches(workingBatches);

  // 1. Calculate demand (uses aggregated effects internally)
  const maxDemand = calculateDemand(
    day,
    weather,
    pricePerCup,
    recipe,
    reputation,
    upgrades,
    activeEvent,
  );

  // 2. Calculate how many cups we can actually make
  const makeable = cupsFromInventory(workingInventory, recipe);
  const cupsSold = Math.min(maxDemand, makeable);

  // 3. Calculate financials with aggregated cost reduction & revenue bonus
  const revenue = cupsSold * pricePerCup * (1 + effects.revenueBonus);
  const cogs = cupsSold * costPerCup(recipe, effects.costReduction);
  const rent = getRentForDay(day, upgrades);
  const passiveIncome = effects.passiveIncome;
  const profit = revenue - cogs - rent + passiveIncome;

  // 4. Deduct consumed supplies from batches (FIFO)
  workingBatches = {
    lemons: consumeFromBatches(
      workingBatches.lemons,
      cupsSold * recipe.lemonsPerCup,
    ),
    sugar: consumeFromBatches(
      workingBatches.sugar,
      cupsSold * recipe.sugarPerCup,
    ),
    ice: consumeFromBatches(workingBatches.ice, cupsSold * recipe.icePerCup),
    cups: consumeFromBatches(workingBatches.cups, cupsSold),
  };

  // 5. Ice melts overnight unless cooling upgrades extend shelf life
  let iceMelted = 0;
  if (effects.iceShelfBonus <= 0) {
    // No cooling upgrades: all ice melts
    iceMelted = batchTotal(workingBatches, "ice");
    workingBatches.ice = [];
  } else {
    // With cooling: ice has extended shelf life, handle via spoilage
    // (ice base shelfLife is 1, cooling extends it)
  }

  // 6. Spoilage overnight: remove expired batches with shelf life bonuses
  const spoiledSupplies: SpoiledSupplies = {
    lemons: 0,
    sugar: 0,
    ice: 0,
    cups: 0,
  };
  for (const supplyId of SUPPLY_IDS) {
    if (supplyId === "ice" && effects.iceShelfBonus <= 0) {
      continue;
    } // handled by melt
    const def = SUPPLY_DEFINITIONS[supplyId];

    let bonus = 0;
    if (supplyId === "ice") {
      bonus = effects.iceShelfBonus;
    } else if (supplyId === "lemons") {
      bonus = effects.lemonShelfBonus;
    } else if (supplyId === "sugar") {
      bonus = effects.sugarShelfBonus;
    }

    const { newBatches, spoiled } = removeExpiredBatches(
      workingBatches[supplyId],
      day,
      def.shelfLife,
      bonus,
    );
    workingBatches[supplyId] = newBatches;
    spoiledSupplies[supplyId] = spoiled;
  }

  // 7. Calculate satisfaction & reputation change
  const satisfaction =
    cupsSold > 0
      ? calculateSatisfaction(
          recipe,
          weather,
          pricePerCup,
          activeEvent,
          effects,
        )
      : 0;

  let reputationChange = 0;
  if (cupsSold > 0) {
    if (satisfaction >= 70) {
      reputationChange = Math.ceil((satisfaction - 60) / 10);
    } else if (satisfaction < 40) {
      reputationChange = -Math.ceil((40 - satisfaction) / 8);
    }
    if (maxDemand > makeable && makeable > 0) {
      reputationChange -= 1;
    }
  } else {
    if (reputation > 50) {
      reputationChange = -REPUTATION_DECAY_RATE;
    } else if (reputation < 50) {
      reputationChange = REPUTATION_DECAY_RATE;
    }
  }

  // Apply aggregated reputation gain bonus (only to positive gains)
  if (reputationChange > 0 && effects.reputationGain > 0) {
    reputationChange = Math.ceil(
      reputationChange * (1 + effects.reputationGain),
    );
  }

  // Event reputation effects
  if (activeEvent) {
    const eventDef = getEventDefinition(activeEvent.id);
    if (activeEvent.id === "healthInspector") {
      if (satisfaction >= 60) {
        reputationChange += 5;
      } else {
        reputationChange -= 10;
      }
    } else {
      reputationChange += eventDef.reputationEffect;
    }
  }

  const newReputation = Math.min(
    REPUTATION_MAX,
    Math.max(REPUTATION_MIN, reputation + reputationChange),
  );

  const newInventory = inventoryFromBatches(workingBatches);

  const result: DayResult = {
    day,
    weather,
    cupsSold,
    maxDemand,
    revenue: Math.round(revenue * 100) / 100,
    costOfGoods: Math.round(cogs * 100) / 100,
    rent: Math.round(rent * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    satisfaction,
    reputationChange,
    iceMelted,
    spoiledSupplies,
    event: activeEvent,
    achievementsUnlocked: [],
  };

  return {
    result,
    newInventory,
    newInventoryBatches: workingBatches,
    newReputation,
  };
}

export { costPerCup };
