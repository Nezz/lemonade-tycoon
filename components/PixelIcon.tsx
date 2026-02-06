import { Image, type ImageStyle } from "expo-image";
import { Text } from "react-native";

import { ICON_MAP } from "@/utils/icons";

interface PixelIconProps {
  emoji: string;
  size: number;
  style?: ImageStyle;
}

/**
 * Renders a pixel-art icon for a given emoji string.
 * Falls back to the raw emoji character if no icon mapping exists.
 */
export default function PixelIcon({ emoji, size, style }: PixelIconProps) {
  const source = ICON_MAP[emoji];

  if (!source) {
    return <Text style={{ fontSize: size }}>{emoji}</Text>;
  }

  return (
    <Image
      source={source}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
    />
  );
}
