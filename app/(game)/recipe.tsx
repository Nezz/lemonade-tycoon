import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import RecipeSlider from '../../components/RecipeSlider';
import Slider from '../../components/Slider';
import InventoryBar from '../../components/InventoryBar';
import { cupsFromInventory } from '../../engine/customers';
import { costPerCup } from '../../engine/simulation';
import { formatMoney } from '../../utils/format';
import {
  MIN_INGREDIENT,
  MAX_INGREDIENT,
  MIN_PRICE,
  MAX_PRICE,
  PRICE_STEP,
  WEATHER_DATA,
} from '../../engine/constants';
import { aggregateEffects } from '../../engine/upgrades';
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from '../../theme/pixel';
import StripedBackground from '../../components/StripedBackground';

export default function RecipeScreen() {
  const recipe = useGameStore((s) => s.recipe);
  const pricePerCup = useGameStore((s) => s.pricePerCup);
  const inventory = useGameStore((s) => s.inventory);
  const weather = useGameStore((s) => s.weather);
  const upgrades = useGameStore((s) => s.upgrades);
  const setRecipe = useGameStore((s) => s.setRecipe);
  const setPrice = useGameStore((s) => s.setPrice);

  const effects = aggregateEffects(upgrades);
  const cupsMakeable = cupsFromInventory(inventory, recipe);
  const ingredientCost = costPerCup(recipe, effects.costReduction);
  const profit = pricePerCup - ingredientCost;

  const weatherInfo = WEATHER_DATA[weather];
  const hasRecipeHints = effects.showRecipeHints;
  const showProfitPerCup = effects.showProfitPerCup;

  return (
    <StripedBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <InventoryBar inventory={inventory} />

        {/* Recipe Sliders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INGREDIENTS/CUP</Text>

          <RecipeSlider
            label="Lemons"
            emoji="🍋"
            value={recipe.lemonsPerCup}
            min={MIN_INGREDIENT}
            max={MAX_INGREDIENT}
            unit="/cup"
            hint={
              hasRecipeHints
                ? `Ideal: ${weatherInfo.idealLemons[0]}-${weatherInfo.idealLemons[1]}`
                : undefined
            }
            onChange={(v) => setRecipe({ lemonsPerCup: v })}
          />

          <RecipeSlider
            label="Sugar"
            emoji="🍬"
            value={recipe.sugarPerCup}
            min={MIN_INGREDIENT}
            max={MAX_INGREDIENT}
            unit="/cup"
            hint={
              hasRecipeHints
                ? `Ideal: ${weatherInfo.idealSugar[0]}-${weatherInfo.idealSugar[1]}`
                : undefined
            }
            onChange={(v) => setRecipe({ sugarPerCup: v })}
          />

          <RecipeSlider
            label="Ice"
            emoji="🧊"
            value={recipe.icePerCup}
            min={MIN_INGREDIENT}
            max={MAX_INGREDIENT}
            unit="/cup"
            hint={
              hasRecipeHints
                ? `Ideal: ${weatherInfo.idealIce[0]}-${weatherInfo.idealIce[1]}`
                : undefined
            }
            onChange={(v) => setRecipe({ icePerCup: v })}
          />
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRICE PER CUP</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>{formatMoney(pricePerCup)}</Text>
          </View>
          <Slider
            value={pricePerCup}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={PRICE_STEP}
            onChange={setPrice}
          />
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cost</Text>
            <Text style={styles.summaryValue}>{formatMoney(ingredientCost)}</Text>
          </View>
          {showProfitPerCup && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Profit/cup</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: profit > 0 ? C.green : C.red },
                ]}
              >
                {formatMoney(profit)}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBig}>CUPS MAKEABLE</Text>
            <Text style={styles.summaryValueBig}>{cupsMakeable}</Text>
          </View>
        </View>
      </ScrollView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
    gap: 10,
  },
  section: {
    ...pixelPanel,
    ...pixelBevel,
  },
  sectionTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
    marginBottom: 12,
  },
  priceRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  priceValue: {
    fontFamily: PIXEL_FONT,
    fontSize: F.title,
    color: C.green,
  },
  summaryCard: {
    ...pixelPanel,
    ...pixelBevel,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textLight,
  },
  summaryValue: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  divider: {
    height: 2,
    backgroundColor: C.border,
    marginVertical: 6,
  },
  summaryLabelBig: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.text,
  },
  summaryValueBig: {
    fontFamily: PIXEL_FONT,
    fontSize: F.heading,
    color: C.green,
  },
});
