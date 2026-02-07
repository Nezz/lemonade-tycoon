import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/store/gameStore";
import GameButton from "@/components/GameButton";
import PixelIcon from "@/components/PixelIcon";
import { formatMoney } from "@/utils/format";
import { BAILOUT_AMOUNT } from "@/engine/constants";
import { C, PIXEL_FONT, F, pixelPanel, pixelBevel } from "@/theme/pixel";
import StripedBackground from "@/components/StripedBackground";
import { successHaptic } from "@/utils/haptics";

export default function BailoutScreen() {
  const router = useRouter();
  const claimBailout = useGameStore((s) => s.claimBailout);

  useEffect(() => {
    successHaptic();
  }, []);

  const handleClaim = () => {
    claimBailout();
    router.replace("/(game)/day");
  };

  return (
    <StripedBackground color1="#1A5C2A" color2="#1E6830">
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconRow}>
            <PixelIcon emoji="💰" size={56} />
          </View>

          <Text style={styles.title}>A SECOND CHANCE</Text>

          <View style={styles.storyCard}>
            <Text style={styles.storyText}>
              As you pack up your stand for what feels like the last time, a
              familiar face appears...
            </Text>

            <Text style={styles.storyText}>
              Mrs. Henderson — your very first customer — walks up with a warm
              smile and a small envelope.
            </Text>

            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>
                {
                  "\u201CI still remember that first glass of lemonade you made me. Best I ever had. Here\u2019s a little something to help you get back on your feet.\u201D"
                }
              </Text>
            </View>

            <Text style={styles.storyText}>
              Inside the envelope, you find{" "}
              <Text style={styles.moneyHighlight}>
                {formatMoney(BAILOUT_AMOUNT)}
              </Text>{" "}
              and a handwritten note:
            </Text>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {
                  "\u201CEveryone deserves a second chance. Make it count!\u201D"
                }
              </Text>
              <Text style={styles.noteSignature}>— Mrs. Henderson</Text>
            </View>
          </View>

          <GameButton
            title={`THANK YOU! (+${formatMoney(BAILOUT_AMOUNT)})`}
            onPress={handleClaim}
            haptic
          />
        </ScrollView>
      </SafeAreaView>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 20,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  iconRow: {
    alignItems: "center",
  },
  title: {
    fontFamily: PIXEL_FONT,
    fontSize: 48,
    color: C.goldBright,
    textAlign: "center",
  },
  storyCard: {
    ...pixelPanel,
    ...pixelBevel,
    gap: 14,
  },
  storyText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.text,
    lineHeight: 34,
  },
  moneyHighlight: {
    color: C.goldBright,
  },
  quoteBox: {
    backgroundColor: C.panelDark,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 0,
    padding: 12,
  },
  quoteText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textLight,
    fontStyle: "italic",
    lineHeight: 34,
  },
  noteBox: {
    backgroundColor: "#2A7040",
    borderWidth: 2,
    borderColor: C.gold,
    borderRadius: 0,
    padding: 12,
    alignItems: "center",
  },
  noteText: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
    color: C.gold,
    textAlign: "center",
    lineHeight: 38,
  },
  noteSignature: {
    fontFamily: PIXEL_FONT,
    fontSize: F.small,
    color: C.textMuted,
    marginTop: 6,
  },
});
