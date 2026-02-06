import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState } from "@/engine/types";

const SAVE_KEY = "@lemonade_tycoon_save";

/**
 * Save game state to AsyncStorage.
 */
export async function saveGame(state: GameState): Promise<void> {
  try {
    const json = JSON.stringify(state);
    await AsyncStorage.setItem(SAVE_KEY, json);
  } catch (error) {
    console.warn("Failed to save game:", error);
  }
}

/**
 * Load game state from AsyncStorage. Returns null if no save exists.
 */
export async function loadGame(): Promise<GameState | null> {
  try {
    const json = await AsyncStorage.getItem(SAVE_KEY);
    if (json) {
      return JSON.parse(json) as GameState;
    }
    return null;
  } catch (error) {
    console.warn("Failed to load game:", error);
    return null;
  }
}

/**
 * Check if a saved game exists.
 */
export async function hasSavedGame(): Promise<boolean> {
  try {
    const json = await AsyncStorage.getItem(SAVE_KEY);
    return json !== null;
  } catch {
    return false;
  }
}

/**
 * Delete the saved game.
 */
export async function deleteSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn("Failed to delete save:", error);
  }
}
