/**
 * Predefined save states for different stages of the game.
 * Used via the React Native dev menu (shake / Cmd+D).
 */
import { GameState } from "@/engine/types";
import {
  DEFAULT_UPGRADES,
  DEFAULT_ACHIEVEMENTS,
  INITIAL_GAME_STATE,
} from "@/engine/constants";

export interface DevSave {
  label: string;
  description: string;
  state: GameState;
}

// ── Helper to build upgrades map with some unlocked ──────────────────────────

function withUpgrades(...ids: string[]): Record<string, boolean> {
  const map = { ...DEFAULT_UPGRADES };
  for (const id of ids) {
    (map as any)[id] = true;
  }
  return map as any;
}

function withAchievements(...ids: string[]): Record<string, boolean> {
  const map = { ...DEFAULT_ACHIEVEMENTS };
  for (const id of ids) {
    (map as any)[id] = true;
  }
  return map as any;
}

// ── Save States ──────────────────────────────────────────────────────────────

const freshStart: DevSave = {
  label: "🌱 Fresh Start",
  description: "Day 1, $20, nothing bought yet",
  state: { ...INITIAL_GAME_STATE },
};

const earlyGame: DevSave = {
  label: "🏪 Early Game (Day 4)",
  description: "A few days in with basic supplies and a couple upgrades",
  state: {
    ...INITIAL_GAME_STATE,
    day: 4,
    money: 32.5,
    inventory: { lemons: 24, sugar: 18, ice: 20, cups: 30 },
    inventoryBatches: {
      lemons: [{ amount: 24, purchasedOnDay: 3 }],
      sugar: [{ amount: 18, purchasedOnDay: 3 }],
      ice: [{ amount: 20, purchasedOnDay: 3 }],
      cups: [{ amount: 30, purchasedOnDay: 3 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 3 },
    pricePerCup: 1.25,
    weather: "sunny",
    forecast: "warm",
    reputation: 55,
    upgrades: withUpgrades("signCardboardSign", "standWoodenStand") as any,
    achievements: withAchievements("firstSale") as any,
    stats: {
      totalRevenue: 18.75,
      totalCupsSold: 15,
      dayResults: [],
    },
    phase: "planning",
    freePlay: false,
  },
};

const midGame: DevSave = {
  label: "📈 Mid Game (Day 12)",
  description: "Decent cash, several upgrades, business growing",
  state: {
    ...INITIAL_GAME_STATE,
    day: 12,
    money: 95.0,
    inventory: { lemons: 60, sugar: 45, ice: 50, cups: 60 },
    inventoryBatches: {
      lemons: [{ amount: 60, purchasedOnDay: 11 }],
      sugar: [{ amount: 45, purchasedOnDay: 11 }],
      ice: [{ amount: 50, purchasedOnDay: 11 }],
      cups: [{ amount: 60, purchasedOnDay: 11 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 4 },
    pricePerCup: 1.75,
    weather: "warm",
    forecast: "hot",
    reputation: 68,
    upgrades: withUpgrades(
      "standWoodenStand",
      "standMarketCart",
      "signCardboardSign",
      "signChalkboardSign",
      "coolStyrofoamBox",
      "coolBasicCooler",
      "storExtraCrate",
      "recpRecipeNotebook",
      "mktgFlyers",
      "techWeatherRadio",
    ) as any,
    achievements: withAchievements(
      "firstSale",
      "centurion",
      "entrepreneur",
    ) as any,
    stats: {
      totalRevenue: 185.0,
      totalCupsSold: 112,
      dayResults: [],
    },
    phase: "planning",
    freePlay: false,
  },
};

const lateGame: DevSave = {
  label: "🚀 Late Game (Day 25)",
  description: "Closing in on victory, lots of upgrades",
  state: {
    ...INITIAL_GAME_STATE,
    day: 25,
    money: 180.0,
    inventory: { lemons: 90, sugar: 75, ice: 80, cups: 100 },
    inventoryBatches: {
      lemons: [{ amount: 90, purchasedOnDay: 24 }],
      sugar: [{ amount: 75, purchasedOnDay: 24 }],
      ice: [{ amount: 80, purchasedOnDay: 24 }],
      cups: [{ amount: 100, purchasedOnDay: 24 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 4 },
    pricePerCup: 2.25,
    weather: "hot",
    forecast: "sunny",
    reputation: 82,
    upgrades: withUpgrades(
      "standWoodenStand",
      "standMarketCart",
      "standGardenBooth",
      "signCardboardSign",
      "signChalkboardSign",
      "signWoodenSign",
      "signNeonSign",
      "coolStyrofoamBox",
      "coolBasicCooler",
      "coolInsulatedCooler",
      "coolIceMachine",
      "storExtraCrate",
      "storStorageShelf",
      "storStorageRack",
      "recpRecipeNotebook",
      "recpQualityLemons",
      "recpOrganicSugar",
      "weatPoncho",
      "weatUmbrella",
      "weatPopUpCanopy",
      "mktgFlyers",
      "mktgBusinessCards",
      "mktgLocalPaperAd",
      "expPaperNapkins",
      "expCupSleeves",
      "supPriceComparison",
      "supBulkBuying",
      "spdSharpKnife",
      "spdPrepStation",
      "stfTipJar",
      "stfHelpWantedSign",
      "techWeatherRadio",
      "techCalculator",
      "techPriceBoard",
      "decoTablecloth",
      "decoFlowerPot",
      "specFreeSamples",
    ) as any,
    achievements: withAchievements(
      "firstSale",
      "centurion",
      "entrepreneur",
      "rainyDayFund",
      "weatherproof",
      "upgradeCollector",
      "bigSpender",
    ) as any,
    stats: {
      totalRevenue: 420.0,
      totalCupsSold: 310,
      dayResults: [],
    },
    phase: "planning",
    freePlay: false,
  },
};

const nearBankrupt: DevSave = {
  label: "💸 Near Bankruptcy",
  description: "Day 10, almost broke, desperate times",
  state: {
    ...INITIAL_GAME_STATE,
    day: 10,
    money: 1.5,
    inventory: { lemons: 4, sugar: 3, ice: 2, cups: 5 },
    inventoryBatches: {
      lemons: [{ amount: 4, purchasedOnDay: 9 }],
      sugar: [{ amount: 3, purchasedOnDay: 9 }],
      ice: [{ amount: 2, purchasedOnDay: 9 }],
      cups: [{ amount: 5, purchasedOnDay: 9 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 3 },
    pricePerCup: 0.75,
    weather: "rainy",
    forecast: "stormy",
    reputation: 28,
    upgrades: withUpgrades("signCardboardSign") as any,
    achievements: withAchievements("firstSale") as any,
    stats: {
      totalRevenue: 35.0,
      totalCupsSold: 28,
      dayResults: [],
    },
    phase: "planning",
    freePlay: false,
  },
};

const stacked: DevSave = {
  label: "👑 Fully Stacked",
  description: "$999, tons of upgrades, max reputation",
  state: {
    ...INITIAL_GAME_STATE,
    day: 15,
    money: 999.0,
    inventory: { lemons: 200, sugar: 200, ice: 200, cups: 200 },
    inventoryBatches: {
      lemons: [{ amount: 200, purchasedOnDay: 14 }],
      sugar: [{ amount: 200, purchasedOnDay: 14 }],
      ice: [{ amount: 200, purchasedOnDay: 14 }],
      cups: [{ amount: 200, purchasedOnDay: 14 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 4 },
    pricePerCup: 2.5,
    weather: "hot",
    forecast: "hot",
    reputation: 100,
    upgrades: withUpgrades(
      // Stand chain
      "standWoodenStand",
      "standMarketCart",
      "standGardenBooth",
      "standCornerShop",
      "standDowntownStore",
      "standFoodTruckFleet",
      // Signage
      "signCardboardSign",
      "signChalkboardSign",
      "signWoodenSign",
      "signNeonSign",
      "signLedDisplay",
      "signDigitalBillboard",
      "signHolographicDisplay",
      // Cooling
      "coolStyrofoamBox",
      "coolBasicCooler",
      "coolInsulatedCooler",
      "coolIceMachine",
      "coolIndustrialFreezer",
      "coolColdStorage",
      "coolCryogenicChiller",
      // Storage
      "storExtraCrate",
      "storStorageShelf",
      "storStorageRack",
      "storMiniWarehouse",
      "storFullWarehouse",
      "storDistributionHub",
      "storSupplyNetwork",
      // Recipe
      "recpRecipeNotebook",
      "recpQualityLemons",
      "recpOrganicSugar",
      "recpPremiumIce",
      "recpSecretRecipe",
      "recpMasterRecipe",
      "recpLegendaryFormula",
      // Weather
      "weatPoncho",
      "weatUmbrella",
      "weatPopUpCanopy",
      "weatWeatherproofTent",
      "weatClimateControl",
      "weatIndoorSeating",
      "weatWeatherDome",
      // Marketing
      "mktgFlyers",
      "mktgBusinessCards",
      "mktgLocalPaperAd",
      "mktgSocialMedia",
      "mktgInfluencerDeal",
      "mktgTvCommercial",
      "mktgNationalBrand",
      // Experience
      "expPaperNapkins",
      "expCupSleeves",
      "expBenchSeating",
      "expMusicSpeaker",
      "expVipArea",
      "expPremiumService",
      "expFiveStarService",
      // Supply
      "supPriceComparison",
      "supBulkBuying",
      "supFarmerDeal",
      "supWholesaleAccount",
      "supBulkSupplier",
      "supImportDeal",
      "supVerticalFarm",
      // Speed
      "spdSharpKnife",
      "spdPrepStation",
      "spdSpeedPitcher",
      "spdDoublePitcher",
      "spdAutomatedJuicer",
      "spdDriveThrough",
      "spdExpressLane",
      // Staff
      "stfTipJar",
      "stfHelpWantedSign",
      "stfPartTimeHelper",
      "stfFullTimeEmployee",
      "stfShiftManager",
      "stfFullCrew",
      "stfCorporateTeam",
      // Tech
      "techWeatherRadio",
      "techCalculator",
      "techPriceBoard",
      "techWeatherApp",
      "techPosSystem",
      "techAnalyticsDashboard",
      "techAiForecasting",
      "techMarketIntelligence",
      // Decor
      "decoTablecloth",
      "decoFlowerPot",
      "decoStringLights",
      "decoThemedDecor",
      "decoBrandedCups",
      "decoFlagshipDesign",
      "decoIconicBrand",
      // Specials
      "specFreeSamples",
      "specCuteCups",
      "specLemonGarden",
      "specSugarDispenser",
      "specLoyaltyPunchCard",
      "specInsurancePolicy",
      "specHappyHour",
      "specSecretMenu",
      "specCateringService",
      "specLoyaltyApp",
      "specFranchiseLicense",
      "specFoodFestivalPass",
      "specDeliveryService",
      "specCelebrityEndorsement",
      "specLemonadeMuseum",
      "specWorldRecord",
      "specLemonadeEmpire",
    ) as any,
    achievements: withAchievements(
      "firstSale",
      "centurion",
      "rainyDayFund",
      "perfectDay",
      "entrepreneur",
      "weatherproof",
      "upgradeCollector",
      "survivor",
      "tycoon",
      "pennyPincher",
      "eventSurvivor",
      "bigSpender",
      "lemonKing",
      "comebackKid",
      "fullHouse",
    ) as any,
    stats: {
      totalRevenue: 850.0,
      totalCupsSold: 520,
      dayResults: [],
    },
    phase: "planning",
    freePlay: false,
  },
};

const freePlayMode: DevSave = {
  label: "🏖️ Free Play (Post-Victory)",
  description: "Already won, continuing in free play mode",
  state: {
    ...INITIAL_GAME_STATE,
    day: 30,
    money: 250.0,
    inventory: { lemons: 80, sugar: 60, ice: 70, cups: 90 },
    inventoryBatches: {
      lemons: [{ amount: 80, purchasedOnDay: 29 }],
      sugar: [{ amount: 60, purchasedOnDay: 29 }],
      ice: [{ amount: 70, purchasedOnDay: 29 }],
      cups: [{ amount: 90, purchasedOnDay: 29 }],
    },
    recipe: { lemonsPerCup: 4, sugarPerCup: 3, icePerCup: 4 },
    pricePerCup: 2.0,
    weather: "sunny",
    forecast: "warm",
    reputation: 78,
    upgrades: withUpgrades(
      "standWoodenStand",
      "standMarketCart",
      "standGardenBooth",
      "standCornerShop",
      "signCardboardSign",
      "signChalkboardSign",
      "signWoodenSign",
      "signNeonSign",
      "coolStyrofoamBox",
      "coolBasicCooler",
      "coolInsulatedCooler",
      "storExtraCrate",
      "storStorageShelf",
      "storStorageRack",
      "recpRecipeNotebook",
      "recpQualityLemons",
      "mktgFlyers",
      "mktgBusinessCards",
      "mktgLocalPaperAd",
      "mktgSocialMedia",
      "techWeatherRadio",
      "techCalculator",
      "techPriceBoard",
      "techWeatherApp",
      "weatPoncho",
      "weatUmbrella",
      "spdSharpKnife",
      "spdPrepStation",
      "stfTipJar",
      "stfHelpWantedSign",
      "stfPartTimeHelper",
    ) as any,
    achievements: withAchievements(
      "firstSale",
      "centurion",
      "entrepreneur",
      "rainyDayFund",
      "tycoon",
    ) as any,
    stats: {
      totalRevenue: 520.0,
      totalCupsSold: 380,
      dayResults: [],
    },
    phase: "planning",
    freePlay: true,
  },
};

export const DEV_SAVES: DevSave[] = [
  freshStart,
  earlyGame,
  midGame,
  lateGame,
  nearBankrupt,
  stacked,
  freePlayMode,
];
