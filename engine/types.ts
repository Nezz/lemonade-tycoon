// ── Weather ──────────────────────────────────────────────────────────────────

export type WeatherType =
  | "hot"
  | "sunny"
  | "warm"
  | "cloudy"
  | "rainy"
  | "stormy";

export interface WeatherInfo {
  type: WeatherType;
  label: string;
  emoji: string;
  demandMultiplier: number;
  /** Ideal recipe ranges shift with weather */
  idealIce: [number, number];
  idealLemons: [number, number];
  idealSugar: [number, number];
}

// ── Supplies ─────────────────────────────────────────────────────────────────

export type SupplyId = "lemons" | "sugar" | "ice" | "cups";

export interface SupplyDefinition {
  id: SupplyId;
  label: string;
  emoji: string;
  packSize: number;
  packCost: number;
  unit: string;
  meltsOvernight: boolean;
  /** Days until spoilage. null = never spoils */
  shelfLife: number | null;
}

/** A batch of supplies purchased on a specific day */
export interface SupplyBatch {
  amount: number;
  purchasedOnDay: number;
}

/** Flat inventory counts */
export interface Inventory {
  lemons: number;
  sugar: number;
  ice: number;
  cups: number;
}

/** Batch-based inventory for spoilage tracking */
export interface InventoryBatches {
  lemons: SupplyBatch[];
  sugar: SupplyBatch[];
  ice: SupplyBatch[];
  cups: SupplyBatch[];
}

// ── Recipe ───────────────────────────────────────────────────────────────────

export interface Recipe {
  lemonsPerCup: number;
  sugarPerCup: number;
  icePerCup: number;
}

// ── Upgrade Effects (data-driven) ───────────────────────────────────────────

export interface UpgradeEffects {
  // Demand
  awareness?: number; // additive demand % bonus
  maxServedBonus?: number; // additive % more customers servable

  // Quality / Satisfaction
  recipeQuality?: number; // additive recipe quality %
  satisfaction?: number; // additive satisfaction %

  // Reputation
  reputationGain?: number; // additive rep gain multiplier

  // Weather (continuous, capped)
  rainReduction?: number; // cumulative rain/storm penalty reduction (cap 0.85)
  coldReduction?: number; // cumulative cloudy penalty reduction (cap 0.85)
  forecastAccuracy?: number; // highest owned value wins

  // Shelf life (continuous, additive days)
  iceShelfBonus?: number; // extra days for ice
  lemonShelfBonus?: number; // extra days for lemons
  sugarShelfBonus?: number; // extra days for sugar

  // Economy
  costReduction?: number; // cumulative supply cost reduction (cap 0.40)
  inventoryBonus?: number; // additive max inventory increase
  rentPerDay?: number; // highest owned value sets rent
  revenueBonus?: number; // additive % revenue increase
  passiveIncome?: number; // additive $/day passive
  freeLemons?: number; // additive free lemons per day

  // Events
  eventBonusMult?: number; // amplify positive event effects
  eventPenaltyReduction?: number; // reduce negative event effects (cap 0.75)

  // UI unlocks
  showRecipeHints?: boolean; // show ideal recipe ranges
  showProfitPerCup?: boolean; // show profit per cup
  showForecast?: boolean; // show tomorrow's weather forecast
}

// ── Upgrade Categories ──────────────────────────────────────────────────────

export type UpgradeCategory =
  | "stand"
  | "signage"
  | "cooling"
  | "storage"
  | "recipe"
  | "weather"
  | "marketing"
  | "experience"
  | "supply"
  | "speed"
  | "staff"
  | "technology"
  | "decor"
  | "special";

// ── Upgrades ─────────────────────────────────────────────────────────────────

export type UpgradeId =
  // ── Stand Upgrades (tier gateways) ──
  | "standWoodenStand"
  | "standMarketCart"
  | "standGardenBooth"
  | "standCornerShop"
  | "standDowntownStore"
  | "standFoodTruckFleet"

  // ── Signage Chain ──
  | "signCardboardSign"
  | "signChalkboardSign"
  | "signWoodenSign"
  | "signNeonSign"
  | "signLedDisplay"
  | "signDigitalBillboard"
  | "signHolographicDisplay"

  // ── Cooling Chain ──
  | "coolStyrofoamBox"
  | "coolBasicCooler"
  | "coolInsulatedCooler"
  | "coolIceMachine"
  | "coolIndustrialFreezer"
  | "coolColdStorage"
  | "coolCryogenicChiller"

  // ── Storage Chain ──
  | "storExtraCrate"
  | "storStorageShelf"
  | "storStorageRack"
  | "storMiniWarehouse"
  | "storFullWarehouse"
  | "storDistributionHub"
  | "storSupplyNetwork"

  // ── Recipe Chain ──
  | "recpRecipeNotebook"
  | "recpQualityLemons"
  | "recpOrganicSugar"
  | "recpPremiumIce"
  | "recpSecretRecipe"
  | "recpMasterRecipe"
  | "recpLegendaryFormula"

  // ── Weather Chain ──
  | "weatPoncho"
  | "weatUmbrella"
  | "weatPopUpCanopy"
  | "weatWeatherproofTent"
  | "weatClimateControl"
  | "weatIndoorSeating"
  | "weatWeatherDome"

  // ── Marketing Chain ──
  | "mktgFlyers"
  | "mktgBusinessCards"
  | "mktgLocalPaperAd"
  | "mktgSocialMedia"
  | "mktgInfluencerDeal"
  | "mktgTvCommercial"
  | "mktgNationalBrand"

  // ── Experience Chain ──
  | "expPaperNapkins"
  | "expCupSleeves"
  | "expBenchSeating"
  | "expMusicSpeaker"
  | "expVipArea"
  | "expPremiumService"
  | "expFiveStarService"

  // ── Supply Chain ──
  | "supPriceComparison"
  | "supBulkBuying"
  | "supFarmerDeal"
  | "supWholesaleAccount"
  | "supBulkSupplier"
  | "supImportDeal"
  | "supVerticalFarm"

  // ── Speed Chain ──
  | "spdSharpKnife"
  | "spdPrepStation"
  | "spdSpeedPitcher"
  | "spdDoublePitcher"
  | "spdAutomatedJuicer"
  | "spdDriveThrough"
  | "spdExpressLane"

  // ── Staff Chain ──
  | "stfTipJar"
  | "stfHelpWantedSign"
  | "stfPartTimeHelper"
  | "stfFullTimeEmployee"
  | "stfShiftManager"
  | "stfFullCrew"
  | "stfCorporateTeam"

  // ── Technology Chain ──
  | "techWeatherRadio"
  | "techCalculator"
  | "techPriceBoard"
  | "techWeatherApp"
  | "techPosSystem"
  | "techAnalyticsDashboard"
  | "techAiForecasting"
  | "techMarketIntelligence"

  // ── Decor Chain ──
  | "decoTablecloth"
  | "decoFlowerPot"
  | "decoStringLights"
  | "decoThemedDecor"
  | "decoBrandedCups"
  | "decoFlagshipDesign"
  | "decoIconicBrand"

  // ── Specials (no chain) ──
  | "specFreeSamples"
  | "specCuteCups"
  | "specLemonGarden"
  | "specSugarDispenser"
  | "specLoyaltyPunchCard"
  | "specInsurancePolicy"
  | "specHappyHour"
  | "specSecretMenu"
  | "specCateringService"
  | "specLoyaltyApp"
  | "specFranchiseLicense"
  | "specFoodFestivalPass"
  | "specDeliveryService"
  | "specCelebrityEndorsement"
  | "specLemonadeMuseum"
  | "specWorldRecord"
  | "specLemonadeEmpire";

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  emoji: string;
  tier: number;
  category: UpgradeCategory;
  requires: UpgradeId[];
  effects: UpgradeEffects;
}

// ── Events ───────────────────────────────────────────────────────────────────

export type EventTiming = "planned" | "surprise";

export type GameEventId =
  // Existing planned
  | "heatWave"
  | "streetFair"
  | "construction"
  | "lemonShortage"
  | "schoolFieldTrip"
  | "competingStand"
  // New planned — per-item price surges
  | "sugarShortage"
  | "iceTruckDelay"
  | "cupShortage"
  | "citrusBlight"
  // New planned — per-item discounts
  | "lemonGlut"
  | "iceSale"
  | "sugarSurplus"
  | "cupPromo"
  // New planned — demand
  | "localSportsGame"
  | "charityMarathon"
  | "neighborhoodGarageSale"
  | "lemonadeDay"
  | "rivalClosed"
  | "parkConcert"
  | "roadClosure"
  // New planned — preference / mixed
  | "churchPicnic"
  | "dietTrend"
  // Existing surprise
  | "healthInspector"
  | "newspaperFeature"
  | "powerOutage"
  | "celebritySighting"
  | "rainSurprise"
  // New surprise — demand
  | "touristBus"
  | "waterMainBreak"
  | "beeSighting"
  | "parkingLotClosed"
  | "heatBurst"
  // New surprise — reputation
  | "foodBlogReview"
  | "badOnlineReview"
  | "viralVideo"
  | "lostDogReunion"
  // New surprise — ice
  | "fridgeMalfunction"
  // New surprise — preference
  | "gymClassField";

/** Resolved effect values for an event (stored so randomized values persist). */
export interface EventEffects {
  demandMultiplier: number;
  supplyCostMultiplier: number;
  supplyCostMultipliers?: Partial<Record<SupplyId, number>>;
  reputationEffect: number;
  destroysIce: boolean;
  sugarPreferenceShift: number;
}

export interface GameEventDefinition {
  id: GameEventId;
  name: string;
  emoji: string;
  timing: EventTiming;
  /** Static effects used as defaults / templates. */
  effects: EventEffects;
}

export interface ActiveEvent {
  id: GameEventId;
  name: string;
  description: string;
  emoji: string;
  timing: EventTiming;
  /** Resolved effects — may contain randomized values. */
  effects: EventEffects;
}

// ── Achievements ─────────────────────────────────────────────────────────────

export type AchievementId =
  | "firstSale"
  | "centurion"
  | "rainyDayFund"
  | "perfectDay"
  | "entrepreneur"
  | "weatherproof"
  | "upgradeCollector"
  | "survivor"
  | "tycoon"
  | "pennyPincher"
  | "eventSurvivor"
  | "bigSpender"
  | "lemonKing"
  | "comebackKid"
  | "fullHouse";

export interface AchievementDefinition {
  id: AchievementId;
  name: string;
  description: string;
  emoji: string;
}

// ── Day Results ──────────────────────────────────────────────────────────────

export interface SpoiledSupplies {
  lemons: number;
  sugar: number;
  ice: number;
  cups: number;
}

export interface DayResult {
  day: number;
  weather: WeatherType;
  cupsSold: number;
  maxDemand: number;
  maxSellable: number;
  revenue: number;
  costOfGoods: number;
  rent: number;
  profit: number;
  satisfaction: number;
  reputationChange: number;
  iceMelted: number;
  spoiledSupplies: SpoiledSupplies;
  plannedEvent: ActiveEvent;
  surpriseEvents: ActiveEvent[];
  achievementsUnlocked: AchievementId[];
}

// ── Game State ───────────────────────────────────────────────────────────────

export type GamePhase = "planning" | "results" | "gameover" | "victory";

export interface GameState {
  day: number;
  money: number;
  inventory: Inventory;
  inventoryBatches: InventoryBatches;
  recipe: Recipe;
  pricePerCup: number;
  weather: WeatherType;
  forecast: WeatherType;
  reputation: number;
  upgrades: Record<UpgradeId, boolean>;
  plannedEvent: ActiveEvent;
  surpriseEvents: ActiveEvent[];
  achievements: Record<AchievementId, boolean>;
  stats: {
    totalRevenue: number;
    totalCupsSold: number;
    dayResults: DayResult[];
  };
  phase: GamePhase;
  freePlay: boolean;
}
