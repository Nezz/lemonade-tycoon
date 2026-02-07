import { StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function SimulationStand() {
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
