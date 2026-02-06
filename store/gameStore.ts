import { create } from "zustand";
import {
  GameState,
  SupplyId,
  UpgradeId,
  Recipe,
  DayResult,
  AchievementId,
} from "@/engine/types";
import {
  INITIAL_GAME_STATE,
  SUPPLY_DEFINITIONS,
  UPGRADE_DEFINITIONS,
  MAX_INVENTORY_BASE,
  SUPPLY_IDS,
  VICTORY_REVENUE_GOAL,
  BANKRUPTCY_THRESHOLD,
  FORECAST_ACCURACY,
} from "@/engine/constants";
import { generateWeather, generateForecast } from "@/engine/weather";
import { rollEvent, getEventDefinition } from "@/engine/events";
import { runDay, batchTotal, inventoryFromBatches } from "@/engine/simulation";
import { checkAchievements } from "@/engine/achievements";
import { aggregateEffects } from "@/engine/upgrades";
import { saveGame } from "@/utils/storage";

interface GameActions {
  // ── Supply Actions ──────────────────────────────────────────────────
  buySupply: (supplyId: SupplyId, packs: number) => boolean;

  // ── Recipe Actions ──────────────────────────────────────────────────
  setRecipe: (recipe: Partial<Recipe>) => void;
  setPrice: (price: number) => void;

  // ── Upgrade Actions ─────────────────────────────────────────────────
  buyUpgrade: (upgradeId: UpgradeId) => boolean;

  // ── Day Actions ─────────────────────────────────────────────────────
  startDay: () => DayResult;
  nextDay: () => void;

  // ── Game Actions ────────────────────────────────────────────────────
  resetGame: () => void;
  loadState: (state: GameState) => void;
  getLastResult: () => DayResult | null;
  continueAfterVictory: () => void;

  // ── Tracking ────────────────────────────────────────────────────────
  totalSpentToday: number;
  newlyUnlockedAchievements: AchievementId[];
}

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_GAME_STATE,
  totalSpentToday: 0,
  newlyUnlockedAchievements: [],

  // ── Buy Supplies ──────────────────────────────────────────────────────

  buySupply: (supplyId: SupplyId, packs: number) => {
    const state = get();
    const def = SUPPLY_DEFINITIONS[supplyId];
    const effects = aggregateEffects(state.upgrades);

    // Apply event supply cost multiplier
    let costMultiplier = 1.0;
    if (state.activeEvent) {
      const eventDef = getEventDefinition(state.activeEvent.id);
      costMultiplier = eventDef.supplyCostMultiplier;
    }

    // Apply aggregated cost reduction from supply chain upgrades
    if (effects.costReduction > 0) {
      costMultiplier *= 1 - effects.costReduction;
    }

    const totalCost =
      Math.round(def.packCost * packs * costMultiplier * 100) / 100;
    const totalUnits = def.packSize * packs;

    if (totalCost > state.money) {
      return false;
    }

    // Max inventory is a shared total across all supply types
    const maxInv = MAX_INVENTORY_BASE + effects.inventoryBonus;
    const totalInventory = Object.values(state.inventory).reduce(
      (sum, v) => sum + v,
      0,
    );

    if (totalInventory + totalUnits > maxInv) {
      return false;
    }
    const currentAmount = state.inventory[supplyId];

    // Add batch tracking
    const newBatch = { amount: totalUnits, purchasedOnDay: state.day };
    const updatedBatches = {
      ...state.inventoryBatches,
      [supplyId]: [...state.inventoryBatches[supplyId], newBatch],
    };

    set({
      money: Math.round((state.money - totalCost) * 100) / 100,
      inventory: {
        ...state.inventory,
        [supplyId]: currentAmount + totalUnits,
      },
      inventoryBatches: updatedBatches,
      totalSpentToday:
        Math.round((state.totalSpentToday + totalCost) * 100) / 100,
    });

    return true;
  },

  // ── Set Recipe ────────────────────────────────────────────────────────

  setRecipe: (recipe: Partial<Recipe>) => {
    const state = get();
    set({
      recipe: { ...state.recipe, ...recipe },
    });
  },

  // ── Set Price ─────────────────────────────────────────────────────────

  setPrice: (price: number) => {
    set({ pricePerCup: Math.round(price * 100) / 100 });
  },

  // ── Buy Upgrade ───────────────────────────────────────────────────────

  buyUpgrade: (upgradeId: UpgradeId) => {
    const state = get();
    const def = UPGRADE_DEFINITIONS[upgradeId];

    // Already owned
    if (state.upgrades[upgradeId]) {
      return false;
    }

    // Check prerequisites
    for (const reqId of def.requires) {
      if (!state.upgrades[reqId]) {
        return false;
      }
    }

    // Check cost
    if (def.cost > state.money) {
      return false;
    }

    set({
      money: Math.round((state.money - def.cost) * 100) / 100,
      upgrades: {
        ...state.upgrades,
        [upgradeId]: true,
      },
      totalSpentToday:
        Math.round((state.totalSpentToday + def.cost) * 100) / 100,
    });

    return true;
  },

  // ── Start Day (Run Simulation) ────────────────────────────────────────

  startDay: () => {
    const state = get();
    const { result, newInventory, newInventoryBatches, newReputation } =
      runDay(state);

    // Add passive income and free lemons are handled in runDay via effects
    const newMoney = Math.round((state.money + result.profit) * 100) / 100;

    // Check achievements
    const newlyUnlocked = checkAchievements(
      state,
      result,
      state.totalSpentToday,
    );
    result.achievementsUnlocked = newlyUnlocked;

    // Update achievements record
    const updatedAchievements = { ...state.achievements };
    for (const id of newlyUnlocked) {
      updatedAchievements[id] = true;
    }

    // Check win/lose conditions
    const newTotalRevenue =
      Math.round((state.stats.totalRevenue + result.revenue) * 100) / 100;
    let newPhase: GameState["phase"] = "results";

    if (!state.freePlay && newTotalRevenue >= VICTORY_REVENUE_GOAL) {
      newPhase = "victory";
    }

    set({
      money: newMoney,
      inventory: newInventory,
      inventoryBatches: newInventoryBatches,
      reputation: newReputation,
      phase: newPhase,
      achievements: updatedAchievements,
      newlyUnlockedAchievements: newlyUnlocked,
      stats: {
        totalRevenue: newTotalRevenue,
        totalCupsSold: state.stats.totalCupsSold + result.cupsSold,
        dayResults: [...state.stats.dayResults, result],
      },
    });

    // Check bankruptcy AFTER updating money
    const updatedMoney = get().money;
    const updatedInventory = get().inventory;
    const hasInventoryValue = SUPPLY_IDS.some((id) => updatedInventory[id] > 0);
    if (updatedMoney < BANKRUPTCY_THRESHOLD && !hasInventoryValue) {
      set({ phase: "gameover" });
    }

    // Auto-save
    const updatedState = get();
    saveGame({
      day: updatedState.day,
      money: updatedState.money,
      inventory: updatedState.inventory,
      inventoryBatches: updatedState.inventoryBatches,
      recipe: updatedState.recipe,
      pricePerCup: updatedState.pricePerCup,
      weather: updatedState.weather,
      forecast: updatedState.forecast,
      reputation: updatedState.reputation,
      upgrades: updatedState.upgrades,
      activeEvent: updatedState.activeEvent,
      achievements: updatedState.achievements,
      stats: updatedState.stats,
      phase: updatedState.phase,
      freePlay: updatedState.freePlay,
    });

    return result;
  },

  // ── Next Day ──────────────────────────────────────────────────────────

  nextDay: () => {
    const state = get();
    const effects = aggregateEffects(state.upgrades);

    // Forecast accuracy from technology upgrades (or base 80%)
    const accuracy =
      effects.forecastAccuracy > 0
        ? effects.forecastAccuracy
        : FORECAST_ACCURACY;

    const newWeather = generateWeather(state.forecast, accuracy);
    const newForecast = generateForecast();
    const newEvent = rollEvent();

    // Add free lemons from lemon garden / vertical farm
    let newBatches = { ...state.inventoryBatches };
    let newInventory = { ...state.inventory };
    if (effects.freeLemons > 0) {
      const freeAmount = Math.floor(effects.freeLemons);
      const newBatch = { amount: freeAmount, purchasedOnDay: state.day + 1 };
      newBatches = {
        ...newBatches,
        lemons: [...newBatches.lemons, newBatch],
      };
      newInventory = {
        ...newInventory,
        lemons: newInventory.lemons + freeAmount,
      };
    }

    set({
      day: state.day + 1,
      weather: newWeather,
      forecast: newForecast,
      activeEvent: newEvent,
      phase: "planning",
      totalSpentToday: 0,
      newlyUnlockedAchievements: [],
      inventoryBatches: newBatches,
      inventory: newInventory,
    });
  },

  // ── Reset Game ────────────────────────────────────────────────────────

  resetGame: () => {
    const weather = generateWeather(null);
    const forecast = generateForecast();
    const event = rollEvent();

    set({
      ...INITIAL_GAME_STATE,
      inventory: { ...INITIAL_GAME_STATE.inventory },
      inventoryBatches: {
        lemons: [],
        sugar: [],
        ice: [],
        cups: [],
      },
      recipe: { ...INITIAL_GAME_STATE.recipe },
      upgrades: { ...INITIAL_GAME_STATE.upgrades },
      achievements: { ...INITIAL_GAME_STATE.achievements },
      activeEvent: event,
      stats: { totalRevenue: 0, totalCupsSold: 0, dayResults: [] },
      weather,
      forecast,
      freePlay: false,
      totalSpentToday: 0,
      newlyUnlockedAchievements: [],
    });
  },

  // ── Load State ────────────────────────────────────────────────────────

  loadState: (state: GameState) => {
    set({ ...state, totalSpentToday: 0, newlyUnlockedAchievements: [] });
  },

  // ── Get Last Result ───────────────────────────────────────────────────

  getLastResult: () => {
    const state = get();
    const results = state.stats.dayResults;
    return results.length > 0 ? results[results.length - 1] : null;
  },

  // ── Continue After Victory ────────────────────────────────────────────

  continueAfterVictory: () => {
    set({ freePlay: true, phase: "results" });
  },
}));
