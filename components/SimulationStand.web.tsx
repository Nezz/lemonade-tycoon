import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useReactorStore } from "@/store/reactorStore";

export default function SimulationStand() {
  const apiKey = useReactorStore((s) => s.apiKey);

  // When Reactor is active, the AI video already shows the stand
  if (apiKey) {
    return null;
  }

  return (
    <Image
      source={require("@/assets/stand.png")}
      style={styles.image}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    position: "absolute",
    bottom: "30%",
  },
});
