import { StyleSheet, Text, View } from "react-native";

import { UnityViewProps } from "@/modules/unity/src/UnityModule.types";

export default function UnityView(props: UnityViewProps) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.text}>Unity is not supported on web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
