import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActiveEvent } from "../engine/types";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "../theme/pixel";

interface EventBannerProps {
  event: ActiveEvent;
}

export default function EventBanner({ event }: EventBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>{event.emoji}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{event.name}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.warning,
    borderRadius: 0,
    padding: 10,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: C.warningBorder,
    ...pixelBevel,
    borderTopColor: C.borderLight,
    borderLeftColor: C.borderLight,
    borderBottomColor: C.borderDark,
    borderRightColor: C.borderDark,
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
  },
  description: {
    fontFamily: PIXEL_FONT,
    fontSize: F.tiny,
    color: C.textLight,
    marginTop: 3,
    lineHeight: 30,
  },
});
