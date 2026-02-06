import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { C } from '../theme/pixel';

interface StripedBackgroundProps {
  color1?: string;
  color2?: string;
  stripeWidth?: number;
  children?: React.ReactNode;
}

/**
 * Renders a 45-degree diagonal striped background behind its children.
 * Uses alternating colored rows inside a rotated container.
 */
export default function StripedBackground({
  color1 = C.bg,
  color2 = C.bgLight,
  stripeWidth = 12,
  children,
}: StripedBackgroundProps) {
  const { width, height } = useWindowDimensions();
  // Rotated container needs to be large enough to cover all corners
  const diagonal = Math.ceil(Math.sqrt(width * width + height * height));
  const stripeCount = Math.ceil(diagonal / stripeWidth);

  const stripes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < stripeCount; i++) {
      arr.push(
        <View
          key={i}
          style={{
            height: stripeWidth,
            backgroundColor: i % 2 === 0 ? color1 : color2,
          }}
        />
      );
    }
    return arr;
  }, [stripeCount, stripeWidth, color1, color2]);

  return (
    <View style={styles.container}>
      {/* Stripe layer */}
      <View
        style={[
          styles.stripeContainer,
          {
            width: diagonal,
            height: diagonal,
            top: -(diagonal - height) / 2,
            left: -(diagonal - width) / 2,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      >
        {stripes}
      </View>
      {/* Content layer */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  stripeContainer: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});
