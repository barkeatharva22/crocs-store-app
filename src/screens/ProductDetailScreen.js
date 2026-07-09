import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, type } from '../theme/colors';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ConfettiBurst from '../components/ConfettiBurst';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === productId);

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [added, setAdded] = useState(false);
  const [burst, setBurst] = useState(0);

  const btnScale = useRef(new Animated.Value(1)).current;
  const colorScales = useRef({}).current;

  const getColorScale = (c) => {
    if (!colorScales[c]) colorScales[c] = new Animated.Value(1);
    return colorScales[c];
  };

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const bounceColor = (c) => {
    const v = getColorScale(c);
    Animated.sequence([
      Animated.spring(v, { toValue: 1.25, useNativeDriver: true, speed: 50 }),
      Animated.spring(v, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    setSelectedColor(c);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setBurst((b) => b + 1);
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 1.06, useNativeDriver: true, speed: 40 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.offWhite }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 190 }}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(17,17,17,0.35)', 'rgba(17,17,17,0)']}
            style={styles.topScrim}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartBtn}>
            <Ionicons name="heart-outline" size={20} color={colors.black} />
          </TouchableOpacity>

          <View style={styles.imageDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.imageDot, i === 0 && styles.imageDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.primaryDark} />
              <Text style={styles.ratingText}>{product.rating?.toFixed(1) ?? 'New'}</Text>
            </View>
            <Text style={styles.reviewsText}>{product.reviews ?? 0} reviews</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {(product.colors || []).map((c) => (
              <TouchableOpacity key={c} onPress={() => bounceColor(c)} activeOpacity={0.8}>
                <Animated.View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c, transform: [{ scale: getColorScale(c) }] },
                    selectedColor === c && styles.colorSwatchSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Size (US)</Text>
          <View style={styles.sizeRow}>
            {(product.sizes || []).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSelectedSize(s)}
                style={[styles.sizeChip, selectedSize === s && styles.sizeChipActive]}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.sizeChipText, selectedSize === s && styles.sizeChipTextActive]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={18} color={colors.black} />
              <Text style={styles.featureText}>Water Friendly</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cloud-outline" size={18} color={colors.black} />
              <Text style={styles.featureText}>Ultra Light</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="leaf-outline" size={18} color={colors.black} />
              <Text style={styles.featureText}>Croslite Foam</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Price</Text>
          <Text style={styles.footerPrice}>${product.price.toFixed(2)}</Text>
        </View>
        <View>
          <ConfettiBurst trigger={burst} originX={0.75} originY={0.1} />
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.addBtn, added && { backgroundColor: colors.success }]}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <Ionicons
                name={added ? 'checkmark' : 'bag-add-outline'}
                size={18}
                color={added ? colors.white : colors.black}
              />
              <Text style={[styles.addBtnText, added && { color: colors.white }]}>
                {added ? 'Added' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrap: { width, height: width * 1.05, backgroundColor: colors.lightGray },
  image: { width: '100%', height: '100%' },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
  },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  heartBtn: {
    position: 'absolute',
    top: 55,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  imageDots: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  imageDotActive: {
    width: 18,
    backgroundColor: colors.white,
  },
  sheet: {
    backgroundColor: colors.offWhite,
    marginTop: -24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  category: { fontSize: 12, color: colors.gray, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { ...type.display, color: colors.black, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '800', color: colors.black },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
    ...shadow.card,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.black },
  reviewsText: { fontSize: 12, color: colors.gray },
  divider: { height: 1, backgroundColor: colors.lightGray, marginTop: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.black, marginTop: 22, marginBottom: 10 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  colorSwatchSelected: { borderWidth: 2, borderColor: colors.black },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeChip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  sizeChipActive: { backgroundColor: colors.primary },
  sizeChipText: { fontSize: 13, fontWeight: '700', color: colors.black },
  sizeChipTextActive: { color: colors.black },
  description: { fontSize: 13, color: colors.gray, lineHeight: 20 },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  featureItem: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: radius.md,
    ...shadow.card,
  },
  featureText: { fontSize: 10, fontWeight: '600', color: colors.black, marginTop: 6, textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: radius.xl,
    ...shadow.deep,
  },
  footerLabel: { fontSize: 11, color: colors.gray },
  footerPrice: { fontSize: 18, fontWeight: '800', color: colors.black },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  addBtnText: { fontSize: 13, fontWeight: '800', color: colors.black, marginLeft: 8 },
});
