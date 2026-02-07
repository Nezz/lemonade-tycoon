import { View, StyleSheet } from "react-native";
import { UnityView } from "@/modules/unity";

interface SimulationBackgroundProps {
  children: React.ReactNode;
}

export default function SimulationBackground({
  children,
}: SimulationBackgroundProps) {
  return (
    <View style={styles.container}>
      <UnityView style={StyleSheet.absoluteFillObject} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
