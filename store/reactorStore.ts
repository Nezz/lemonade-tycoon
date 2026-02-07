import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REACTOR_KEY = "@lemonade_reactor_key";

interface ReactorStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  /** Load persisted key from storage. Call once on app init. */
  hydrate: () => Promise<void>;
}

export const useReactorStore = create<ReactorStore>((set) => ({
  apiKey: "",

  setApiKey: (key: string) => {
    set({ apiKey: key });
    AsyncStorage.setItem(REACTOR_KEY, key).catch(() => {});
  },

  clearApiKey: () => {
    set({ apiKey: "" });
    AsyncStorage.removeItem(REACTOR_KEY).catch(() => {});
  },

  hydrate: async () => {
    const stored = await AsyncStorage.getItem(REACTOR_KEY).catch(() => null);
    if (stored) {
      set({ apiKey: stored });
    }
  },
}));
