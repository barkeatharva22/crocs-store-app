import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme/colors';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopScreen({ navigation }) {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortAsc, setSortAsc] = useState(true);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  let filtered =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);
  filtered = [...filtered].sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop All</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortAsc((s) => !s)} activeOpacity={0.8}>
          <Ionicons name="swap-vertical" size={16} color={colors.textPrimary} />
          <Text style={styles.sortText}>{sortAsc ? 'Price: Low' : 'Price: High'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 180, paddingTop: 6 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products in this category yet 🤷</Text>}
      />

      {/* Add Product Floating Action Button */}
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: pulse }] }]}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={28} color={colors.onPrimary} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  sortText: { fontSize: 11, fontWeight: '600', color: colors.textPrimary, marginLeft: 4 },
  categoryRow: { paddingHorizontal: 20, paddingBottom: 14, gap: 10 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  categoryTextActive: { color: colors.onPrimary },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 110,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glow,
  },
});