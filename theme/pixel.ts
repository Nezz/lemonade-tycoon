import { StyleSheet, ViewStyle, TextStyle } from "react-native";

// ── Pixel Font ──────────────────────────────────────────────
export const PIXEL_FONT = "VT323_400Regular";

// ── Color Palette (Saturated Green Scheme) ──────────────────
export const C = {
  bg: "#00832E",
  bgLight: "#009730",
  panel: "#1EA838",
  panelDark: "#109030",
  border: "#109F2D",
  borderLight: "#A4D53B",
  borderDark: "#007F2E",

  text: "#E0FFE0",
  textLight: "#C0F0C0",
  textMuted: "#90D890",
  gold: "#C8F050",
  goldBright: "#E0FF60",

  green: "#A4D53B",
  greenDark: "#109F2D",
  greenLight: "#C8F050",

  red: "#E84040",
  redDark: "#B02020",
  redLight: "#FF8888",

  btnPrimary: "#71C91D",
  btnPrimaryHi: "#A4D53B",
  btnPrimaryLo: "#109F2D",
  btnSecondary: "#8AD838",
  btnSecHi: "#B8F068",
  btnSecLo: "#109F2D",
  btnDanger: "#E84040",
  btnDangerHi: "#FF6868",
  btnDangerLo: "#B02020",

  headerBg: "#109F2D",
  white: "#FFFFFF",
  black: "#000000",

  tierGray: "#60B860",
  tierBlue: "#60A0E8",
  tierPurple: "#A878E0",
  tierOrange: "#E89830",
  tierRed: "#E85050",
  tierViolet: "#8858D0",
  tierPink: "#E068A0",

  achieveGreen: "#109F2D",
  achievePanel: "#1B8A30",
  lockedPanel: "#58A858",
  lockedBorder: "#309830",

  warning: "#2E7D18",
  warningBorder: "#4A9928",
};

// ── Font Sizes (VT323 is more readable, can use larger sizes) ─
export const F = {
  title: 42,
  heading: 33,
  body: 27,
  small: 23,
  tiny: 20,
};

// ── Reusable Style Fragments ────────────────────────────────

/** Standard pixel-art panel (card) */
export const pixelPanel: ViewStyle = {
  backgroundColor: C.panel,
  borderWidth: 3,
  borderColor: C.border,
  borderRadius: 0,
  padding: 12,
};

/** Bevel effect: light top-left, dark bottom-right */
export const pixelBevel: ViewStyle = {
  borderTopColor: C.borderLight,
  borderLeftColor: C.borderLight,
  borderBottomColor: C.borderDark,
  borderRightColor: C.borderDark,
};

/** Inset bevel (pressed state) */
export const pixelBevelInset: ViewStyle = {
  borderTopColor: C.borderDark,
  borderLeftColor: C.borderDark,
  borderBottomColor: C.borderLight,
  borderRightColor: C.borderLight,
};

/** Standard pixel text */
export const pixelText: TextStyle = {
  fontFamily: PIXEL_FONT,
  color: C.text,
  fontSize: F.body,
};

/** Heading text */
export const pixelHeading: TextStyle = {
  fontFamily: PIXEL_FONT,
  color: C.text,
  fontSize: F.heading,
};

/** Title text */
export const pixelTitle: TextStyle = {
  fontFamily: PIXEL_FONT,
  color: C.gold,
  fontSize: F.title,
};

/** Progress bar track */
export const pixelTrack: ViewStyle = {
  height: 12,
  backgroundColor: C.bgLight,
  borderWidth: 2,
  borderColor: C.border,
  borderRadius: 0,
  overflow: "hidden" as const,
};

/** Progress bar fill */
export const pixelFill: ViewStyle = {
  height: "100%" as any,
  backgroundColor: C.green,
  borderRadius: 0,
};

// ── Common StyleSheet ───────────────────────────────────────
export const pixelStyles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 32,
    gap: 10,
  },
  panel: {
    ...pixelPanel,
    ...pixelBevel,
  },
  panelTitle: {
    ...pixelHeading,
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: C.border,
    marginVertical: 6,
  },
});
