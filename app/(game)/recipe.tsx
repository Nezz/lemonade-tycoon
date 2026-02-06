import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <InventoryBar inventory={inventory} />

        {/* Recipe Sliders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients per Cup</Text>

          <RecipeSlider
            label="Lemons"
            emoji="🍋"
            value={recipe.lemonsPerCup}
            min={MIN_INGREDIENT}
            max={MAX_INGREDIENT}
            unit="per cup"
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
            unit="per cup"
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
            unit="per cup"
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
          <Text style={styles.sectionTitle}>Price per Cup</Text>
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
            <Text style={styles.summaryLabel}>Ingredient cost</Text>
            <Text style={styles.summaryValue}>{formatMoney(ingredientCost)}</Text>
          </View>
          {showProfitPerCup && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Profit per cup</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: profit > 0 ? '#166534' : '#DC2626' },
                ]}
              >
                {formatMoney(profit)}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBig}>Cups makeable</Text>
            <Text style={styles.summaryValueBig}>{cupsMakeable}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 16,
  },
  priceRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#166534',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#78716C',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7E5E4',
    marginVertical: 8,
  },
  summaryLabelBig: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1917',
  },
  summaryValueBig: {
    fontSize: 20,
    fontWeight: '800',
    color: '#84CC16',
  },
});
