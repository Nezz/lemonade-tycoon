import { View, Text, StyleSheet, Platform, type ViewStyle } from "react-native";
import { UnityView } from "@/modules/unity";
import { C, PIXEL_FONT, F, pixelBevel } from "@/theme/pixel";
import ReactorSettings from "@/components/ReactorSettings";

interface LemonadeStandProps {
  style?: ViewStyle;
}

export default function LemonadeStand({ style }: LemonadeStandProps) {
  if (Platform.OS === "web") {
    return <ReactorSettings />;
  }
  return (
    <View style={[styles.container, style]}>
      <UnityView style={styles.unity} />
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
});
