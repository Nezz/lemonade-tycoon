import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { C, PIXEL_FONT, F } from '../theme/pixel';

interface GameButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  small?: boolean;
}

export default function GameButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  small = false,
}: GameButtonProps) {
  const bg =
    variant === 'primary'
      ? C.btnPrimary
      : variant === 'danger'
        ? C.btnDanger
        : C.btnSecondary;

  const hi =
    variant === 'primary'
      ? C.btnPrimaryHi
      : variant === 'danger'
        ? C.btnDangerHi
        : C.btnSecHi;

  const lo =
    variant === 'primary'
      ? C.btnPrimaryLo
      : variant === 'danger'
        ? C.btnDangerLo
        : C.btnSecLo;

  const txtColor =
    variant === 'secondary' ? C.text : C.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        small && styles.buttonSmall,
        {
          backgroundColor: bg,
          borderTopColor: hi,
          borderLeftColor: hi,
          borderBottomColor: lo,
          borderRightColor: lo,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          small && styles.textSmall,
          { color: txtColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 0,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontFamily: PIXEL_FONT,
    fontSize: F.body,
  },
  textSmall: {
    fontSize: F.small,
  },
});
