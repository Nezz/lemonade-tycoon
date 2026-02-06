import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
  const bgColor =
    variant === 'primary'
      ? '#84CC16'
      : variant === 'danger'
        ? '#EF4444'
        : '#F5F5F4';

  const txtColor =
    variant === 'secondary' ? '#44403C' : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: bgColor },
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 14,
  },
});
