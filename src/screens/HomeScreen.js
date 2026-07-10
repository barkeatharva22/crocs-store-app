import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, type } from '../theme/colors';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),

      useNativeDriver: true,
    }).start();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Good to see you</Text>
          <Text style={styles.title}>Find your perfect fit</Text>
        </View>
        <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
          <Ionicons name="person" size={19} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          placeholder="Search clogs, slides, sandals..."
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Editorial full-bleed hero */}
      <Animated.View style={[styles.heroWrap, { opacity: fade }]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => navigation.navigate('ShopTab')}
          style={styles.hero}
        >
          <Image
            source={{ uri: 'https://m.media-amazon.com/images/I/61U4aJ+ls4L._AC_UY1000_.jpg' }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['rgba(13,13,13,0.15)', 'rgba(13,13,13,0.35)', 'rgba(13,13,13,0.96)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>NEW COLLECTION</Text>
            </View>
            <Text style={styles.heroTitle}>Cosmic Glow</Text>
            <View style={styles.heroBottomRow}>
              <Text style={styles.heroSubtitle}>Limited drop · Glow-in-the-dark finish</Text>
              <View style={styles.heroArrow}>
                <Ionicons name="arrow-forward" size={16} color={colors.onPrimary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
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
              activeOpacity={0.85}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Featured grid */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'All' ? 'Featured' : activeCategory}
        </Text>
        <Text style={styles.count}>{filtered.length} items</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            tall={index % 3 === 0}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found. Try a different search.</Text>
        }
      />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 14,
  },
  greeting: { ...type.caption, color: colors.textSecondary },
  title: { ...type.h1, color: colors.textPrimary, marginTop: 3 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: radius.md,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.textPrimary },
  heroWrap: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  hero: {
    width: '100%',
    height: width * 0.72,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.deep,
  },
  heroContent: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginBottom: 10,
  },
  heroBadgeText: { ...type.micro, color: colors.onPrimary },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.8,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  heroArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...type.h2,
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20,
  },
  count: { fontSize: 12, color: colors.textSecondary, marginTop: 28 },
  categoryRow: { paddingHorizontal: 20, gap: 10 },
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
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 30 },
});