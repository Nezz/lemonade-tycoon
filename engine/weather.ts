import { WeatherType } from "@/engine/types";
import {
  WEATHER_TYPES,
  WEATHER_WEIGHTS,
  FORECAST_ACCURACY,
} from "@/engine/constants";

/**
 * Pick a random weather type using weighted probabilities.
 */
function weightedRandom(): WeatherType {
  const totalWeight = WEATHER_WEIGHTS.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * totalWeight;

  for (let i = 0; i < WEATHER_TYPES.length; i++) {
    roll -= WEATHER_WEIGHTS[i];
    if (roll <= 0) {
      return WEATHER_TYPES[i];
    }
  }

  return WEATHER_TYPES[WEATHER_TYPES.length - 1];
}

/**
 * Generate actual weather for today.
 * If a forecast was given yesterday, there's an `accuracy` chance it's correct.
 * Defaults to FORECAST_ACCURACY (80%). The weatherStation upgrade passes 95%.
 */
export function generateWeather(
  forecast: WeatherType | null,
  accuracy: number = FORECAST_ACCURACY,
): WeatherType {
  if (forecast && Math.random() < accuracy) {
    return forecast;
  }
  return weightedRandom();
}

/**
 * Generate a forecast for tomorrow (random weighted pick).
 */
export function generateForecast(): WeatherType {
  return weightedRandom();
}
