import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, type } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

export default function ProductCard({ product, onPress, style, tall = false }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };

  const toggleLike = () => {
    setLiked((l) => !l);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View
        style={[
          styles.card,
          { width: CARD_WIDTH, height: tall ? CARD_WIDTH * 1.55 : CARD_WIDTH * 1.32 },
          { transform: [{ scale }] },
          style,
        ]}
      >
        <Image source={{ uri: product.image }} style={StyleSheet.absoluteFill} />

        {/* Top row: tag + heart */}
        <View style={styles.topRow}>
          {!!product.tag ? (
            <View style={[styles.tag, product.tag === 'Limited' && styles.tagLimited]}>
              <Text style={styles.tagText}>
                {product.tag === 'Limited' ? '✨ ' : ''}
                {product.tag}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <TouchableWithoutFeedback onPress={toggleLike}>
            <Animated.View style={[styles.heart, { transform: [{ scale: heartScale }] }]}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={15}
                color={liked ? colors.danger : colors.black}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

        {/* Bottom gradient scrim with text */}
        <LinearGradient
          colors={[colors.scrimTop, colors.scrimBottom]}
          locations={[0, 0.85]}
          style={styles.scrim}
        >
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={10} color={colors.primary} />
            <Text style={styles.ratingPillText}>{product.rating?.toFixed(1) ?? '—'}</Text>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.colorDots}>
              {(product.colors || []).slice(0, 3).map((c, idx) => (
                <View key={idx} style={[styles.dot, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
    ...shadow.card,
  },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagLimited: {
    backgroundColor: colors.accentPurple,
  },
  tagText: {
    ...type.micro,
    color: colors.black,
  },
  heart: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: 6,
    gap: 3,
  },
  ratingPillText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  name: {
    ...type.h3,
    color: colors.white,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  colorDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: -4,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
