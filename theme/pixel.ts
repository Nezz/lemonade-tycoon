import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// ── Pixel Font ──────────────────────────────────────────────
export const PIXEL_FONT = 'VT323_400Regular';

// ── Color Palette ───────────────────────────────────────────
export const C = {
  bg:           '#2D1B00',
  bgLight:      '#3D2B10',
  panel:        '#F5E6C8',
  panelDark:    '#D4C4A0',
  border:       '#5C3A1E',
  borderLight:  '#8B6914',
  borderDark:   '#3A1F0B',

  text:         '#3B2308',
  textLight:    '#7C6040',
  textMuted:    '#9A8565',
  gold:         '#D4A017',
  goldBright:   '#FFD700',

  green:        '#38A832',
  greenDark:    '#1E6B1A',
  greenLight:   '#90E890',

  red:          '#D03030',
  redDark:      '#8B1A1A',
  redLight:     '#FF9090',

  btnPrimary:   '#E8B830',
  btnPrimaryHi: '#FDD860',
  btnPrimaryLo: '#A07818',
  btnSecondary: '#D4C4A0',
  btnSecHi:     '#EDE0C8',
  btnSecLo:     '#8B7950',
  btnDanger:    '#D03030',
  btnDangerHi:  '#FF6060',
  btnDangerLo:  '#801818',

  headerBg:     '#E8B830',
  white:        '#FFFFFF',
  black:        '#000000',

  tierGray:     '#9A8A7A',
  tierBlue:     '#5888D0',
  tierPurple:   '#9068C8',
  tierOrange:   '#D88020',
  tierRed:      '#D04040',
  tierViolet:   '#7848B8',
  tierPink:     '#D05888',

  achieveGreen: '#285828',
  achievePanel: '#C8E8C8',
  lockedPanel:  '#C8C0B0',
  lockedBorder: '#A09080',

  warning:      '#FFF0C0',
  warningBorder:'#D4A017',
};

// ── Font Sizes (VT323 is more readable, can use larger sizes) ─
export const F = {
  title:   42,
  heading: 33,
  body:    27,
  small:   23,
  tiny:    20,
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
  overflow: 'hidden' as const,
};

/** Progress bar fill */
export const pixelFill: ViewStyle = {
  height: '100%' as any,
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
