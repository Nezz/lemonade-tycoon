import {
  WeatherType,
  WeatherInfo,
  SupplyId,
  SupplyDefinition,
  UpgradeId,
  UpgradeDefinition,
  Recipe,
  Inventory,
  InventoryBatches,
  AchievementId,
  GameState,
} from "@/engine/types";

// ── Weather Definitions ──────────────────────────────────────────────────────

export const WEATHER_DATA: Record<WeatherType, WeatherInfo> = {
  hot: {
    type: "hot",
    label: "Hot",
    emoji: "🔥",
    demandMultiplier: 1.4,
    idealIce: [4, 6],
    idealLemons: [3, 5],
    idealSugar: [2, 4],
  },
  sunny: {
    type: "sunny",
    label: "Sunny",
    emoji: "☀️",
    demandMultiplier: 1.2,
    idealIce: [3, 5],
    idealLemons: [3, 5],
    idealSugar: [2, 4],
  },
  warm: {
    type: "warm",
    label: "Warm",
    emoji: "🌤️",
    demandMultiplier: 1.0,
    idealIce: [2, 4],
    idealLemons: [3, 5],
    idealSugar: [3, 5],
  },
  cloudy: {
    type: "cloudy",
    label: "Cloudy",
    emoji: "☁️",
    demandMultiplier: 0.85,
    idealIce: [1, 3],
    idealLemons: [3, 5],
    idealSugar: [3, 5],
  },
  rainy: {
    type: "rainy",
    label: "Rainy",
    emoji: "🌧️",
    demandMultiplier: 0.6,
    idealIce: [1, 2],
    idealLemons: [2, 4],
    idealSugar: [3, 6],
  },
  stormy: {
    type: "stormy",
    label: "Stormy",
    emoji: "⛈️",
    demandMultiplier: 0.3,
    idealIce: [1, 2],
    idealLemons: [2, 4],
    idealSugar: [4, 6],
  },
};

export const WEATHER_TYPES: WeatherType[] = [
  "hot",
  "sunny",
  "warm",
  "cloudy",
  "rainy",
  "stormy",
];
export const WEATHER_WEIGHTS = [10, 25, 30, 20, 10, 5];

// ── Supply Definitions ───────────────────────────────────────────────────────

export const SUPPLY_DEFINITIONS: Record<SupplyId, SupplyDefinition> = {
  lemons: {
    id: "lemons",
    label: "Lemons",
    emoji: "🍋",
    packSize: 30,
    packCost: 2.0,
    unit: "lemons",
    meltsOvernight: false,
    shelfLife: 3,
  },
  sugar: {
    id: "sugar",
    label: "Sugar",
    emoji: "🍬",
    packSize: 15,
    packCost: 1.5,
    unit: "scoops",
    meltsOvernight: false,
    shelfLife: 5,
  },
  ice: {
    id: "ice",
    label: "Ice",
    emoji: "🧊",
    packSize: 20,
    packCost: 0.5,
    unit: "cubes",
    meltsOvernight: true,
    shelfLife: 1,
  },
  cups: {
    id: "cups",
    label: "Cups",
    emoji: "🥤",
    packSize: 25,
    packCost: 1.0,
    unit: "cups",
    meltsOvernight: false,
    shelfLife: null,
  },
};

export const SUPPLY_IDS: SupplyId[] = ["lemons", "sugar", "ice", "cups"];

// ══════════════════════════════════════════════════════════════════════════════
// ── UPGRADE DEFINITIONS (110 upgrades across 7 tiers) ───────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// Helper: shorthand for defining an upgrade
function def(
  id: UpgradeId,
  name: string,
  description: string,
  cost: number,
  emoji: string,
  tier: number,
  category: UpgradeDefinition["category"],
  requires: UpgradeId[],
  effects: UpgradeDefinition["effects"],
): UpgradeDefinition {
  return {
    id,
    name,
    description,
    cost,
    emoji,
    tier,
    category,
    requires,
    effects,
  };
}

export const UPGRADE_DEFINITIONS: Record<UpgradeId, UpgradeDefinition> = {
  // ════════════════════════════════════════════════════════════════════════════
  // TIER 1 — Sidewalk (no rent, $3-$18)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standWoodenStand: def(
    "standWoodenStand",
    "Wooden Stand",
    "A proper stand! Unlocks Tier 2. Rent: $1/day",
    18,
    "🔨",
    1,
    "stand",
    [],
    { rentPerDay: 1 },
  ),

  // Signage
  signCardboardSign: def(
    "signCardboardSign",
    "Cardboard Sign",
    "+3% customer awareness",
    4,
    "🪧",
    1,
    "signage",
    [],
    { awareness: 0.03 },
  ),
  // Cooling
  coolStyrofoamBox: def(
    "coolStyrofoamBox",
    "Styrofoam Box",
    "Ice lasts 1 extra day",
    5,
    "📦",
    1,
    "cooling",
    [],
    { iceShelfBonus: 1 },
  ),
  // Storage
  storExtraCrate: def(
    "storExtraCrate",
    "Extra Crate",
    "+50 max inventory",
    5,
    "🗃️",
    1,
    "storage",
    [],
    { inventoryBonus: 50 },
  ),
  // Recipe
  recpRecipeNotebook: def(
    "recpRecipeNotebook",
    "Recipe Notebook",
    "Shows basic recipe hints",
    4,
    "📓",
    1,
    "recipe",
    [],
    { showRecipeHints: true, recipeQuality: 0.02 },
  ),
  // Weather
  weatPoncho: def(
    "weatPoncho",
    "Poncho",
    "Rain penalty -10%",
    4,
    "🧥",
    1,
    "weather",
    [],
    { rainReduction: 0.1 },
  ),
  // Marketing
  mktgFlyers: def(
    "mktgFlyers",
    "Flyers",
    "+3% awareness",
    3,
    "📄",
    1,
    "marketing",
    [],
    { awareness: 0.03 },
  ),
  // Experience
  expPaperNapkins: def(
    "expPaperNapkins",
    "Paper Napkins",
    "+3% satisfaction",
    3,
    "🧻",
    1,
    "experience",
    [],
    { satisfaction: 0.03 },
  ),
  // Supply
  supPriceComparison: def(
    "supPriceComparison",
    "Price Comparison",
    "3% off supplies",
    3,
    "📋",
    1,
    "supply",
    [],
    { costReduction: 0.03 },
  ),
  // Speed
  spdSharpKnife: def(
    "spdSharpKnife",
    "Sharp Knife",
    "+5% max served",
    4,
    "🔪",
    1,
    "speed",
    [],
    { maxServedBonus: 0.05 },
  ),
  // Staff
  stfTipJar: def(
    "stfTipJar",
    "Tip Jar",
    "+5% reputation gain",
    3,
    "🫙",
    1,
    "staff",
    [],
    { reputationGain: 0.05 },
  ),
  // Technology
  techWeatherRadio: def(
    "techWeatherRadio",
    "Weather Radio",
    "See tomorrow's weather forecast",
    6,
    "📻",
    1,
    "technology",
    [],
    { showForecast: true },
  ),
  techCalculator: def(
    "techCalculator",
    "Calculator",
    "Shows profit per cup",
    5,
    "🧮",
    1,
    "technology",
    [],
    { showProfitPerCup: true },
  ),
  // Decor
  decoTablecloth: def(
    "decoTablecloth",
    "Tablecloth",
    "+2% satisfaction",
    3,
    "🎨",
    1,
    "decor",
    [],
    { satisfaction: 0.02 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 2 — Wooden Stand (rent $1/day, $10-$50)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standMarketCart: def(
    "standMarketCart",
    "Market Cart",
    "Mobile selling! Unlocks Tier 3. Rent: $3/day",
    50,
    "🛒",
    2,
    "stand",
    ["standWoodenStand"],
    { rentPerDay: 3 },
  ),

  // Signage
  signChalkboardSign: def(
    "signChalkboardSign",
    "Chalkboard Sign",
    "+5% awareness",
    12,
    "🖊️",
    2,
    "signage",
    ["standWoodenStand", "signCardboardSign"],
    { awareness: 0.05 },
  ),
  // Cooling
  coolBasicCooler: def(
    "coolBasicCooler",
    "Basic Cooler",
    "Ice +1 day, lemons +1 day",
    15,
    "❄️",
    2,
    "cooling",
    ["standWoodenStand", "coolStyrofoamBox"],
    { iceShelfBonus: 1, lemonShelfBonus: 1 },
  ),
  // Storage
  storStorageShelf: def(
    "storStorageShelf",
    "Storage Shelf",
    "+75 max inventory",
    18,
    "🗄️",
    2,
    "storage",
    ["standWoodenStand", "storExtraCrate"],
    { inventoryBonus: 75 },
  ),
  // Recipe
  recpQualityLemons: def(
    "recpQualityLemons",
    "Quality Lemons",
    "+5% recipe quality",
    16,
    "🍋",
    2,
    "recipe",
    ["standWoodenStand", "recpRecipeNotebook"],
    { recipeQuality: 0.05 },
  ),
  // Weather
  weatUmbrella: def(
    "weatUmbrella",
    "Umbrella",
    "Rain -10%, cold -5%",
    14,
    "☂️",
    2,
    "weather",
    ["standWoodenStand", "weatPoncho"],
    { rainReduction: 0.1, coldReduction: 0.05 },
  ),
  // Marketing
  mktgBusinessCards: def(
    "mktgBusinessCards",
    "Business Cards",
    "+5% awareness",
    10,
    "💼",
    2,
    "marketing",
    ["standWoodenStand", "mktgFlyers"],
    { awareness: 0.05 },
  ),
  // Experience
  expCupSleeves: def(
    "expCupSleeves",
    "Cup Sleeves",
    "+5% satisfaction",
    10,
    "🫗",
    2,
    "experience",
    ["standWoodenStand", "expPaperNapkins"],
    { satisfaction: 0.05 },
  ),
  // Supply
  supBulkBuying: def(
    "supBulkBuying",
    "Bulk Buying",
    "5% off supplies",
    15,
    "📦",
    2,
    "supply",
    ["standWoodenStand", "supPriceComparison"],
    { costReduction: 0.05 },
  ),
  // Speed
  spdPrepStation: def(
    "spdPrepStation",
    "Prep Station",
    "+8% max served",
    14,
    "🍽️",
    2,
    "speed",
    ["standWoodenStand", "spdSharpKnife"],
    { maxServedBonus: 0.08 },
  ),
  // Staff
  stfHelpWantedSign: def(
    "stfHelpWantedSign",
    "Help Wanted Sign",
    "+3% demand",
    12,
    "📝",
    2,
    "staff",
    ["standWoodenStand", "stfTipJar"],
    { awareness: 0.03 },
  ),
  // Technology
  techPriceBoard: def(
    "techPriceBoard",
    "Price Board",
    "+2% awareness",
    10,
    "📊",
    2,
    "technology",
    ["standWoodenStand", "techCalculator"],
    { awareness: 0.02 },
  ),
  // Decor
  decoFlowerPot: def(
    "decoFlowerPot",
    "Flower Pot",
    "+3% satisfaction",
    10,
    "🌸",
    2,
    "decor",
    ["standWoodenStand", "decoTablecloth"],
    { satisfaction: 0.03 },
  ),

  // Specials
  specFreeSamples: def(
    "specFreeSamples",
    "Free Samples",
    "+5% reputation gain",
    12,
    "🥤",
    2,
    "special",
    ["standWoodenStand"],
    { reputationGain: 0.05 },
  ),
  specCuteCups: def(
    "specCuteCups",
    "Cute Cups",
    "+3% satisfaction",
    10,
    "🎀",
    2,
    "special",
    ["standWoodenStand"],
    { satisfaction: 0.03 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 3 — Market Cart (rent $3/day, $20-$100)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standGardenBooth: def(
    "standGardenBooth",
    "Garden Booth",
    "Permanent spot! Unlocks Tier 4. Rent: $6/day",
    100,
    "⛺",
    3,
    "stand",
    ["standMarketCart"],
    { rentPerDay: 6 },
  ),

  // Signage
  signWoodenSign: def(
    "signWoodenSign",
    "Wooden Sign",
    "+8% awareness",
    28,
    "🪵",
    3,
    "signage",
    ["standMarketCart", "signChalkboardSign"],
    { awareness: 0.08 },
  ),
  // Cooling
  coolInsulatedCooler: def(
    "coolInsulatedCooler",
    "Insulated Cooler",
    "Ice +1, lemons +1 day",
    30,
    "🧊",
    3,
    "cooling",
    ["standMarketCart", "coolBasicCooler"],
    { iceShelfBonus: 1, lemonShelfBonus: 1 },
  ),
  // Storage
  storStorageRack: def(
    "storStorageRack",
    "Storage Rack",
    "+100 max inventory",
    35,
    "🗂️",
    3,
    "storage",
    ["standMarketCart", "storStorageShelf"],
    { inventoryBonus: 100 },
  ),
  // Recipe
  recpOrganicSugar: def(
    "recpOrganicSugar",
    "Organic Sugar",
    "+8% recipe quality",
    30,
    "🍯",
    3,
    "recipe",
    ["standMarketCart", "recpQualityLemons"],
    { recipeQuality: 0.08 },
  ),
  // Weather
  weatPopUpCanopy: def(
    "weatPopUpCanopy",
    "Pop-up Canopy",
    "Rain -10%, cold -10%",
    28,
    "🏕️",
    3,
    "weather",
    ["standMarketCart", "weatUmbrella"],
    { rainReduction: 0.1, coldReduction: 0.1 },
  ),
  // Marketing
  mktgLocalPaperAd: def(
    "mktgLocalPaperAd",
    "Local Paper Ad",
    "+8% awareness",
    25,
    "📰",
    3,
    "marketing",
    ["standMarketCart", "mktgBusinessCards"],
    { awareness: 0.08 },
  ),
  // Experience
  expBenchSeating: def(
    "expBenchSeating",
    "Bench Seating",
    "+8% satisfaction",
    30,
    "🪑",
    3,
    "experience",
    ["standMarketCart", "expCupSleeves"],
    { satisfaction: 0.08 },
  ),
  // Supply
  supFarmerDeal: def(
    "supFarmerDeal",
    "Farmer Deal",
    "6% off supplies",
    30,
    "🌾",
    3,
    "supply",
    ["standMarketCart", "supBulkBuying"],
    { costReduction: 0.06 },
  ),
  // Speed
  spdSpeedPitcher: def(
    "spdSpeedPitcher",
    "Speed Pitcher",
    "+10% max served",
    28,
    "🏺",
    3,
    "speed",
    ["standMarketCart", "spdPrepStation"],
    { maxServedBonus: 0.1 },
  ),
  // Staff
  stfPartTimeHelper: def(
    "stfPartTimeHelper",
    "Part-time Helper",
    "+5% demand, +5% served",
    32,
    "👤",
    3,
    "staff",
    ["standMarketCart", "stfHelpWantedSign"],
    { awareness: 0.05, maxServedBonus: 0.05 },
  ),
  // Technology
  techWeatherApp: def(
    "techWeatherApp",
    "Weather App",
    "Forecast 85% accurate",
    22,
    "📱",
    3,
    "technology",
    ["standMarketCart", "techPriceBoard"],
    { forecastAccuracy: 0.85 },
  ),
  // Decor
  decoStringLights: def(
    "decoStringLights",
    "String Lights",
    "+5% satisfaction, +3% rep",
    22,
    "💡",
    3,
    "decor",
    ["standMarketCart", "decoFlowerPot"],
    { satisfaction: 0.05, reputationGain: 0.03 },
  ),

  // Specials
  specLemonGarden: def(
    "specLemonGarden",
    "Lemon Garden",
    "10 free lemons/day",
    40,
    "🌳",
    3,
    "special",
    ["standMarketCart"],
    { freeLemons: 10 },
  ),
  specSugarDispenser: def(
    "specSugarDispenser",
    "Sugar Dispenser",
    "+1 day sugar shelf life",
    25,
    "🍬",
    3,
    "special",
    ["standMarketCart"],
    { sugarShelfBonus: 1 },
  ),
  specLoyaltyPunchCard: def(
    "specLoyaltyPunchCard",
    "Loyalty Punch Card",
    "+8% reputation gain",
    28,
    "💳",
    3,
    "special",
    ["standMarketCart"],
    { reputationGain: 0.08 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 4 — Garden Booth (rent $6/day, $40-$175)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standCornerShop: def(
    "standCornerShop",
    "Corner Shop",
    "A real shop! Unlocks Tier 5. Rent: $10/day",
    175,
    "🏪",
    4,
    "stand",
    ["standGardenBooth"],
    { rentPerDay: 10 },
  ),

  // Signage
  signNeonSign: def(
    "signNeonSign",
    "Neon Sign",
    "+12% awareness",
    55,
    "💡",
    4,
    "signage",
    ["standGardenBooth", "signWoodenSign"],
    { awareness: 0.12 },
  ),
  // Cooling
  coolIceMachine: def(
    "coolIceMachine",
    "Ice Machine",
    "Ice +1, lemons +1, sugar +1 day",
    65,
    "🏭",
    4,
    "cooling",
    ["standGardenBooth", "coolInsulatedCooler"],
    { iceShelfBonus: 1, lemonShelfBonus: 1, sugarShelfBonus: 1 },
  ),
  // Storage
  storMiniWarehouse: def(
    "storMiniWarehouse",
    "Mini Warehouse",
    "+150 max inventory",
    60,
    "🏠",
    4,
    "storage",
    ["standGardenBooth", "storStorageRack"],
    { inventoryBonus: 150 },
  ),
  // Recipe
  recpPremiumIce: def(
    "recpPremiumIce",
    "Premium Ice",
    "+10% recipe quality",
    55,
    "💎",
    4,
    "recipe",
    ["standGardenBooth", "recpOrganicSugar"],
    { recipeQuality: 0.1 },
  ),
  // Weather
  weatWeatherproofTent: def(
    "weatWeatherproofTent",
    "Weatherproof Tent",
    "Rain -10%, cold -10%",
    55,
    "🎪",
    4,
    "weather",
    ["standGardenBooth", "weatPopUpCanopy"],
    { rainReduction: 0.1, coldReduction: 0.1 },
  ),
  // Marketing
  mktgSocialMedia: def(
    "mktgSocialMedia",
    "Social Media",
    "+12% awareness",
    50,
    "📱",
    4,
    "marketing",
    ["standGardenBooth", "mktgLocalPaperAd"],
    { awareness: 0.12 },
  ),
  // Experience
  expMusicSpeaker: def(
    "expMusicSpeaker",
    "Music Speaker",
    "+10% satisfaction",
    50,
    "🔊",
    4,
    "experience",
    ["standGardenBooth", "expBenchSeating"],
    { satisfaction: 0.1 },
  ),
  // Supply
  supWholesaleAccount: def(
    "supWholesaleAccount",
    "Wholesale Account",
    "7% off supplies",
    60,
    "🏷️",
    4,
    "supply",
    ["standGardenBooth", "supFarmerDeal"],
    { costReduction: 0.07 },
  ),
  // Speed
  spdDoublePitcher: def(
    "spdDoublePitcher",
    "Double Pitcher",
    "+12% max served",
    55,
    "⚡",
    4,
    "speed",
    ["standGardenBooth", "spdSpeedPitcher"],
    { maxServedBonus: 0.12 },
  ),
  // Staff
  stfFullTimeEmployee: def(
    "stfFullTimeEmployee",
    "Full-time Employee",
    "+8% demand, +8% served",
    65,
    "👷",
    4,
    "staff",
    ["standGardenBooth", "stfPartTimeHelper"],
    { awareness: 0.08, maxServedBonus: 0.08 },
  ),
  // Technology
  techPosSystem: def(
    "techPosSystem",
    "POS System",
    "+3% revenue",
    50,
    "💻",
    4,
    "technology",
    ["standGardenBooth", "techWeatherApp"],
    { revenueBonus: 0.03 },
  ),
  // Decor
  decoThemedDecor: def(
    "decoThemedDecor",
    "Themed Decor",
    "+8% satisfaction, +5% rep",
    45,
    "🎭",
    4,
    "decor",
    ["standGardenBooth", "decoStringLights"],
    { satisfaction: 0.08, reputationGain: 0.05 },
  ),

  // Specials
  specInsurancePolicy: def(
    "specInsurancePolicy",
    "Insurance Policy",
    "Reduce negative events 25%",
    55,
    "🛡️",
    4,
    "special",
    ["standGardenBooth"],
    { eventPenaltyReduction: 0.25 },
  ),
  specHappyHour: def(
    "specHappyHour",
    "Happy Hour",
    "+10% demand",
    48,
    "🎉",
    4,
    "special",
    ["standGardenBooth"],
    { awareness: 0.1 },
  ),
  specSecretMenu: def(
    "specSecretMenu",
    "Secret Menu",
    "+10% satisfaction",
    52,
    "🤫",
    4,
    "special",
    ["standGardenBooth"],
    { satisfaction: 0.1 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 5 — Corner Shop (rent $10/day, $65-$300)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standDowntownStore: def(
    "standDowntownStore",
    "Downtown Store",
    "Prime real estate! Unlocks Tier 6. Rent: $16/day",
    300,
    "🏬",
    5,
    "stand",
    ["standCornerShop"],
    { rentPerDay: 16 },
  ),

  // Signage
  signLedDisplay: def(
    "signLedDisplay",
    "LED Display",
    "+15% awareness",
    90,
    "📺",
    5,
    "signage",
    ["standCornerShop", "signNeonSign"],
    { awareness: 0.15 },
  ),
  // Cooling
  coolIndustrialFreezer: def(
    "coolIndustrialFreezer",
    "Industrial Freezer",
    "Ice +1, lemons +1, sugar +1 day",
    100,
    "🧊",
    5,
    "cooling",
    ["standCornerShop", "coolIceMachine"],
    { iceShelfBonus: 1, lemonShelfBonus: 1, sugarShelfBonus: 1 },
  ),
  // Storage
  storFullWarehouse: def(
    "storFullWarehouse",
    "Full Warehouse",
    "+200 max inventory",
    95,
    "🏭",
    5,
    "storage",
    ["standCornerShop", "storMiniWarehouse"],
    { inventoryBonus: 200 },
  ),
  // Recipe
  recpSecretRecipe: def(
    "recpSecretRecipe",
    "Secret Recipe",
    "+12% recipe quality",
    85,
    "🤫",
    5,
    "recipe",
    ["standCornerShop", "recpPremiumIce"],
    { recipeQuality: 0.12 },
  ),
  // Weather
  weatClimateControl: def(
    "weatClimateControl",
    "Climate Control",
    "Rain -10%, cold -10%",
    85,
    "🌡️",
    5,
    "weather",
    ["standCornerShop", "weatWeatherproofTent"],
    { rainReduction: 0.1, coldReduction: 0.1 },
  ),
  // Marketing
  mktgInfluencerDeal: def(
    "mktgInfluencerDeal",
    "Influencer Deal",
    "+15% awareness",
    100,
    "🤳",
    5,
    "marketing",
    ["standCornerShop", "mktgSocialMedia"],
    { awareness: 0.15 },
  ),
  // Experience
  expVipArea: def(
    "expVipArea",
    "VIP Area",
    "+12% satisfaction",
    80,
    "🎖️",
    5,
    "experience",
    ["standCornerShop", "expMusicSpeaker"],
    { satisfaction: 0.12 },
  ),
  // Supply
  supBulkSupplier: def(
    "supBulkSupplier",
    "Bulk Supplier",
    "8% off supplies",
    95,
    "🚚",
    5,
    "supply",
    ["standCornerShop", "supWholesaleAccount"],
    { costReduction: 0.08 },
  ),
  // Speed
  spdAutomatedJuicer: def(
    "spdAutomatedJuicer",
    "Automated Juicer",
    "+15% max served",
    85,
    "🤖",
    5,
    "speed",
    ["standCornerShop", "spdDoublePitcher"],
    { maxServedBonus: 0.15 },
  ),
  // Staff
  stfShiftManager: def(
    "stfShiftManager",
    "Shift Manager",
    "+10% demand, +10% served",
    95,
    "👔",
    5,
    "staff",
    ["standCornerShop", "stfFullTimeEmployee"],
    { awareness: 0.1, maxServedBonus: 0.1 },
  ),
  // Technology
  techAnalyticsDashboard: def(
    "techAnalyticsDashboard",
    "Analytics Dashboard",
    "+5% revenue",
    80,
    "📈",
    5,
    "technology",
    ["standCornerShop", "techPosSystem"],
    { revenueBonus: 0.05 },
  ),
  // Decor
  decoBrandedCups: def(
    "decoBrandedCups",
    "Branded Cups",
    "+10% satisfaction, +8% rep",
    70,
    "🏆",
    5,
    "decor",
    ["standCornerShop", "decoThemedDecor"],
    { satisfaction: 0.1, reputationGain: 0.08 },
  ),

  // Specials
  specCateringService: def(
    "specCateringService",
    "Catering Service",
    "+12% demand",
    105,
    "🍽️",
    5,
    "special",
    ["standCornerShop"],
    { awareness: 0.12 },
  ),
  specLoyaltyApp: def(
    "specLoyaltyApp",
    "Loyalty App",
    "+15% reputation gain",
    85,
    "📲",
    5,
    "special",
    ["standCornerShop"],
    { reputationGain: 0.15 },
  ),
  specFranchiseLicense: def(
    "specFranchiseLicense",
    "Franchise License",
    "Passive income $2/day",
    130,
    "📜",
    5,
    "special",
    ["standCornerShop"],
    { passiveIncome: 2 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 6 — Downtown Store (rent $16/day, $100-$500)
  // ════════════════════════════════════════════════════════════════════════════

  // Stand
  standFoodTruckFleet: def(
    "standFoodTruckFleet",
    "Food Truck Fleet",
    "Go big! Unlocks the Supercell Superstore. Rent: $24/day",
    500,
    "🚐",
    6,
    "stand",
    ["standDowntownStore"],
    { rentPerDay: 24 },
  ),

  // Signage
  signDigitalBillboard: def(
    "signDigitalBillboard",
    "Digital Billboard",
    "+18% awareness",
    160,
    "🖥️",
    6,
    "signage",
    ["standDowntownStore", "signLedDisplay"],
    { awareness: 0.18 },
  ),
  // Cooling
  coolColdStorage: def(
    "coolColdStorage",
    "Cold Storage",
    "Ice +1, lemons +1, sugar +1 day",
    175,
    "🏔️",
    6,
    "cooling",
    ["standDowntownStore", "coolIndustrialFreezer"],
    { iceShelfBonus: 1, lemonShelfBonus: 1, sugarShelfBonus: 1 },
  ),
  // Storage
  storDistributionHub: def(
    "storDistributionHub",
    "Distribution Hub",
    "+250 max inventory",
    150,
    "🏢",
    6,
    "storage",
    ["standDowntownStore", "storFullWarehouse"],
    { inventoryBonus: 250 },
  ),
  // Recipe
  recpMasterRecipe: def(
    "recpMasterRecipe",
    "Master Recipe",
    "+15% recipe quality",
    140,
    "👨‍🍳",
    6,
    "recipe",
    ["standDowntownStore", "recpSecretRecipe"],
    { recipeQuality: 0.15 },
  ),
  // Weather
  weatIndoorSeating: def(
    "weatIndoorSeating",
    "Indoor Seating",
    "Rain -10%, cold -10%",
    155,
    "🏠",
    6,
    "weather",
    ["standDowntownStore", "weatClimateControl"],
    { rainReduction: 0.1, coldReduction: 0.1 },
  ),
  // Marketing
  mktgTvCommercial: def(
    "mktgTvCommercial",
    "TV Commercial",
    "+18% awareness",
    180,
    "📺",
    6,
    "marketing",
    ["standDowntownStore", "mktgInfluencerDeal"],
    { awareness: 0.18 },
  ),
  // Experience
  expPremiumService: def(
    "expPremiumService",
    "Premium Service",
    "+15% satisfaction",
    130,
    "⭐",
    6,
    "experience",
    ["standDowntownStore", "expVipArea"],
    { satisfaction: 0.15 },
  ),
  // Supply
  supImportDeal: def(
    "supImportDeal",
    "Import Deal",
    "8% off supplies",
    155,
    "🌍",
    6,
    "supply",
    ["standDowntownStore", "supBulkSupplier"],
    { costReduction: 0.08 },
  ),
  // Speed
  spdDriveThrough: def(
    "spdDriveThrough",
    "Drive-Through",
    "+18% max served",
    150,
    "🚗",
    6,
    "speed",
    ["standDowntownStore", "spdAutomatedJuicer"],
    { maxServedBonus: 0.18 },
  ),
  // Staff
  stfFullCrew: def(
    "stfFullCrew",
    "Full Crew",
    "+12% demand, +12% served",
    165,
    "👥",
    6,
    "staff",
    ["standDowntownStore", "stfShiftManager"],
    { awareness: 0.12, maxServedBonus: 0.12 },
  ),
  // Technology
  techAiForecasting: def(
    "techAiForecasting",
    "AI Forecasting",
    "Forecast 95% accurate, +5% revenue",
    140,
    "🤖",
    6,
    "technology",
    ["standDowntownStore", "techAnalyticsDashboard"],
    { forecastAccuracy: 0.95, revenueBonus: 0.05 },
  ),
  // Decor
  decoFlagshipDesign: def(
    "decoFlagshipDesign",
    "Flagship Design",
    "+12% satisfaction, +10% rep",
    120,
    "🎨",
    6,
    "decor",
    ["standDowntownStore", "decoBrandedCups"],
    { satisfaction: 0.12, reputationGain: 0.1 },
  ),

  // Specials
  specFoodFestivalPass: def(
    "specFoodFestivalPass",
    "Food Festival Pass",
    "Positive events +30%",
    130,
    "🎪",
    6,
    "special",
    ["standDowntownStore"],
    { eventBonusMult: 0.3 },
  ),
  specDeliveryService: def(
    "specDeliveryService",
    "Delivery Service",
    "+15% rainy day demand",
    150,
    "🛵",
    6,
    "special",
    ["standDowntownStore"],
    { rainReduction: 0.15 },
  ),
  specCelebrityEndorsement: def(
    "specCelebrityEndorsement",
    "Celebrity Endorsement",
    "+15% awareness",
    200,
    "🌟",
    6,
    "special",
    ["standDowntownStore"],
    { awareness: 0.15 },
  ),

  // ════════════════════════════════════════════════════════════════════════════
  // TIER 7 — Supercell Superstore (rent $24/day, $150-$500)
  // ════════════════════════════════════════════════════════════════════════════

  // Signage
  signHolographicDisplay: def(
    "signHolographicDisplay",
    "Arena Jumbotron",
    "Clash Royale arena screens draw massive crowds. +20% awareness",
    220,
    "🏟️",
    7,
    "signage",
    ["standFoodTruckFleet", "signDigitalBillboard"],
    { awareness: 0.2 },
  ),
  // Cooling
  coolCryogenicChiller: def(
    "coolCryogenicChiller",
    "Freeze Spell Cooler",
    "Magical freeze keeps everything perfectly chilled. Ice +1, lemons +1, sugar +1 day",
    260,
    "🥶",
    7,
    "cooling",
    ["standFoodTruckFleet", "coolColdStorage"],
    { iceShelfBonus: 1, lemonShelfBonus: 1, sugarShelfBonus: 1 },
  ),
  // Storage
  storSupplyNetwork: def(
    "storSupplyNetwork",
    "Clan Castle Vault",
    "Store supplies in an impenetrable clan vault. +300 max inventory",
    220,
    "🏰",
    7,
    "storage",
    ["standFoodTruckFleet", "storDistributionHub"],
    { inventoryBonus: 300 },
  ),
  // Recipe
  recpLegendaryFormula: def(
    "recpLegendaryFormula",
    "Elixir Infusion",
    "Ancient elixir recipe passed down by Wizards. +18% recipe quality",
    250,
    "⚗️",
    7,
    "recipe",
    ["standFoodTruckFleet", "recpMasterRecipe"],
    { recipeQuality: 0.18 },
  ),
  // Weather
  weatWeatherDome: def(
    "weatWeatherDome",
    "Supercell Sauna",
    "True Finnish weather resilience. Rain -15%, cold -15%",
    260,
    "🧖",
    7,
    "weather",
    ["standFoodTruckFleet", "weatIndoorSeating"],
    { rainReduction: 0.15, coldReduction: 0.15 },
  ),
  // Marketing
  mktgNationalBrand: def(
    "mktgNationalBrand",
    "Clash TV Broadcast",
    "Broadcast your store to millions of viewers. +22% awareness",
    300,
    "📡",
    7,
    "marketing",
    ["standFoodTruckFleet", "mktgTvCommercial"],
    { awareness: 0.22 },
  ),
  // Experience
  expFiveStarService: def(
    "expFiveStarService",
    "Legends League Lounge",
    "Only the best get into the Legends League. +18% satisfaction",
    220,
    "🏆",
    7,
    "experience",
    ["standFoodTruckFleet", "expPremiumService"],
    { satisfaction: 0.18 },
  ),
  // Supply
  supVerticalFarm: def(
    "supVerticalFarm",
    "Hay Day Supply Farm",
    "Grow your own lemons, Hay Day style. 8% off, 15 free lemons/day",
    260,
    "🌾",
    7,
    "supply",
    ["standFoodTruckFleet", "supImportDeal"],
    { costReduction: 0.08, freeLemons: 15 },
  ),
  // Speed
  spdExpressLane: def(
    "spdExpressLane",
    "Haste Spell Express",
    "Everything moves faster with a little magic. +22% max served",
    220,
    "💨",
    7,
    "speed",
    ["standFoodTruckFleet", "spdDriveThrough"],
    { maxServedBonus: 0.22 },
  ),
  // Staff
  stfCorporateTeam: def(
    "stfCorporateTeam",
    "Barbarian Workforce",
    "An army of Barbarians runs the store. +15% demand, +15% served",
    300,
    "⚔️",
    7,
    "staff",
    ["standFoodTruckFleet", "stfFullCrew"],
    { awareness: 0.15, maxServedBonus: 0.15 },
  ),
  // Technology
  techMarketIntelligence: def(
    "techMarketIntelligence",
    "O.T.T.O Bot Analytics",
    "The master builder's bot crunches all the numbers. +8% revenue, 97% forecast",
    260,
    "🤖",
    7,
    "technology",
    ["standFoodTruckFleet", "techAiForecasting"],
    { revenueBonus: 0.08, forecastAccuracy: 0.97 },
  ),
  // Decor
  decoIconicBrand: def(
    "decoIconicBrand",
    "Starr Park Makeover",
    "Themed after the legendary Starr Park. +15% satisfaction, +12% rep",
    220,
    "⭐",
    7,
    "decor",
    ["standFoodTruckFleet", "decoFlagshipDesign"],
    { satisfaction: 0.15, reputationGain: 0.12 },
  ),

  // Specials
  specLemonadeMuseum: def(
    "specLemonadeMuseum",
    "Clan Hall of Fame",
    "Your clan's greatest achievements on display. +20% reputation gain",
    300,
    "🏅",
    7,
    "special",
    ["standFoodTruckFleet"],
    { reputationGain: 0.2 },
  ),
  specWorldRecord: def(
    "specWorldRecord",
    "Global Tournament",
    "Host a massive tournament at your store. +18% demand",
    270,
    "🌍",
    7,
    "special",
    ["standFoodTruckFleet"],
    { awareness: 0.18 },
  ),
  specLemonadeEmpire: def(
    "specLemonadeEmpire",
    "Supercell Partnership",
    "The ultimate deal: Supercell backs your empire",
    500,
    "💎",
    7,
    "special",
    ["standFoodTruckFleet"],
    {
      awareness: 0.15,
      satisfaction: 0.1,
      reputationGain: 0.15,
      recipeQuality: 0.1,
      costReduction: 0.05,
      revenueBonus: 0.1,
      passiveIncome: 5,
    },
  ),
};

/** All upgrade IDs ordered by tier */
export const UPGRADE_IDS: UpgradeId[] = Object.keys(
  UPGRADE_DEFINITIONS,
) as UpgradeId[];

/** Tier metadata */
export const TIER_NAMES: Record<number, string> = {
  1: "Sidewalk",
  2: "Wooden Stand",
  3: "Market Cart",
  4: "Garden Booth",
  5: "Corner Shop",
  6: "Downtown Store",
  7: "Supercell Superstore",
};

export const TIER_COUNT = 7;

// ── Game Balance Constants ───────────────────────────────────────────────────

export const BASE_DEMAND = 20;
export const DEMAND_GROWTH_PER_DAY = 0.5;

export const FORECAST_ACCURACY = 0.8;

export const STARTING_MONEY = 20.0;
export const STARTING_REPUTATION = 50;

export const MAX_INGREDIENT = 6;
export const MIN_INGREDIENT = 1;

export const MIN_PRICE = 0.25;
export const MAX_PRICE = 5.0;
export const PRICE_STEP = 0.25;

export const MAX_INVENTORY_BASE = 200;

export const REPUTATION_MAX = 100;
export const REPUTATION_MIN = 0;
export const REPUTATION_DECAY_RATE = 2;

// ── Rent ─────────────────────────────────────────────────────────────────────

/** Rent is determined by the highest-tier stand upgrade owned */
export function getRentForDay(
  _day: number,
  upgrades: Record<UpgradeId, boolean>,
): number {
  let maxRent = 0;
  for (const id of UPGRADE_IDS) {
    if (upgrades[id]) {
      const rentVal = UPGRADE_DEFINITIONS[id].effects.rentPerDay;
      if (rentVal !== undefined && rentVal > maxRent) {
        maxRent = rentVal;
      }
    }
  }
  return maxRent;
}

// ── Event Constants ──────────────────────────────────────────────────────────

export const EVENT_CHANCE = 0.35;

// ── Victory / Game Over ──────────────────────────────────────────────────────

export const VICTORY_REVENUE_GOAL = 500;
export const BANKRUPTCY_THRESHOLD = 0;

// ── Default Starting State ───────────────────────────────────────────────────

export const DEFAULT_RECIPE: Recipe = {
  lemonsPerCup: 4,
  sugarPerCup: 3,
  icePerCup: 3,
};

export const DEFAULT_INVENTORY: Inventory = {
  lemons: 0,
  sugar: 0,
  ice: 0,
  cups: 0,
};

export const DEFAULT_INVENTORY_BATCHES: InventoryBatches = {
  lemons: [],
  sugar: [],
  ice: [],
  cups: [],
};

/** All upgrades start as not owned */
export const DEFAULT_UPGRADES: Record<UpgradeId, boolean> = Object.fromEntries(
  UPGRADE_IDS.map((id) => [id, false]),
) as Record<UpgradeId, boolean>;

export const DEFAULT_ACHIEVEMENTS: Record<AchievementId, boolean> = {
  firstSale: false,
  centurion: false,
  rainyDayFund: false,
  perfectDay: false,
  entrepreneur: false,
  weatherproof: false,
  upgradeCollector: false,
  survivor: false,
  tycoon: false,
  pennyPincher: false,
  eventSurvivor: false,
  bigSpender: false,
  lemonKing: false,
  comebackKid: false,
  fullHouse: false,
};

export const INITIAL_GAME_STATE: GameState = {
  day: 1,
  money: STARTING_MONEY,
  inventory: { ...DEFAULT_INVENTORY },
  inventoryBatches: { lemons: [], sugar: [], ice: [], cups: [] },
  recipe: { ...DEFAULT_RECIPE },
  pricePerCup: 1.0,
  weather: "sunny",
  forecast: "warm",
  reputation: STARTING_REPUTATION,
  upgrades: { ...DEFAULT_UPGRADES },
  activeEvent: null,
  achievements: { ...DEFAULT_ACHIEVEMENTS },
  stats: { totalRevenue: 0, totalCupsSold: 0, dayResults: [] },
  phase: "planning",
  freePlay: false,
};
