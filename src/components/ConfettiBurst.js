import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const CONFETTI_COLORS = [
  colors.primary,
  colors.accentPink,
  colors.accentTeal,
  colors.accentPurple,
  colors.accentBlue,
  colors.white,
];

const PIECES = 14;

export default function ConfettiBurst({ trigger, originX = 0.5, originY = 0.5 }) {
  const animsRef = useRef(
    Array.from({ length: PIECES }, () => new Animated.Value(0))
  );

  useEffect(() => {
    if (!trigger) return;
    animsRef.current.forEach((v) => v.setValue(0));
    Animated.stagger(
      12,
      animsRef.current.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 700 + Math.random() * 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [trigger]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {animsRef.current.map((v, i) => {
        const angle = (i / PIECES) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 60 + Math.random() * 70;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 30;
        const rotate = `${(Math.random() - 0.5) * 720}deg`;
        const size = 6 + Math.random() * 6;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

        const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
        const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
        const opacity = v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
        const scale = v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0.6] });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: `${originX * 100}%`,
              top: `${originY * 100}%`,
              width: size,
              height: size * (i % 2 === 0 ? 1 : 1.6),
              backgroundColor: color,
              borderRadius: i % 3 === 0 ? size / 2 : 2,
              opacity,
              transform: [{ translateX }, { translateY }, { scale }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}
