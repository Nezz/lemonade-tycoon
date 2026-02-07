/**
 * Registers dev menu items for loading different game save states.
 * Uses expo-dev-client in custom dev builds, falls back to
 * React Native DevSettings in Expo Go.
 */
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { DEV_SAVES } from "@/dev/saves";
import { useGameStore } from "@/store/gameStore";

const isDevBuild =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient &&
  Platform.OS !== "web";

function loadSave(
  label: string,
  description: string,
  state: (typeof DEV_SAVES)[number]["state"],
) {
  Alert.alert(label, description + "\n\nLoad this save state?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Load",
      onPress: () => {
        useGameStore.getState().loadState({ ...state });
        Alert.alert("Loaded!", `Switched to: ${label}`);
      },
    },
  ]);
}

export function useDevSaves() {
  useEffect(() => {
    if (__DEV__) {
      if (isDevBuild) {
        import("expo-dev-client").then(({ registerDevMenuItems }) => {
          registerDevMenuItems(
            DEV_SAVES.map((save) => ({
              name: save.label,
              callback: () => loadSave(save.label, save.description, save.state),
            })),
          );
        });
      }
    }
  }, []);
}
