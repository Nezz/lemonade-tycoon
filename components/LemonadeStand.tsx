import { View, Text, StyleSheet, Platform, type ViewStyle } from "react-native";
import { UnityView } from "@/modules/unity";
import { C, PIXEL_FONT, F, pixelBevel } from "@/theme/pixel";

interface LemonadeStandProps {
  style?: ViewStyle;
}

export default function LemonadeStand({ style }: LemonadeStandProps) {
  return (
    <View style={[styles.container, style]}>
      {Platform.OS === "web" ? (
        <Text style={styles.webMessage}>
          Download the full game for iOS or Android to see your lemonade stand
        </Text>
      ) : (
        <UnityView style={styles.unity} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 180,
    borderWidth: 3,
    borderColor: C.border,
    borderRadius: 0,
    backgroundColor: C.bgLight,
    marginVertical: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    ...pixelBevel,
  },
  unity: {
    width: "100%",
    height: "100%",
  },
  webMessage: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
