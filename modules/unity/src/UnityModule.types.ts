import type { StyleProp, ViewStyle } from "react-native";

export type UnityModuleEvents = {
  onUnityMessage: (payload: { message: string }) => void;
  onUnityUnloaded: () => void;
};

export type UnityViewProps = {
  style?: StyleProp<ViewStyle>;
  androidKeepPlayerMounted?: boolean;
  fullScreen?: boolean;
};
