import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme/colors';
import { useCart } from '../context/CartContext';
import ConfettiBurst from '../components/ConfettiBurst';

export default function CartScreen() {
  const { items, updateQty, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [burst, setBurst] = useState(0);

  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (items.length === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bob, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bob, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [items.length]);

  const bobTranslate = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const bobRotate = bob.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] });

  const handleCheckout = () => {
    if (items.length === 0) return;
    setBurst((b) => b + 1);
    setTimeout(() => {
      Alert.alert(
        'Order placed! 🎉',
        `Your order of ${totalItems} item(s) totaling $${totalPrice.toFixed(2)} is on its way.`,
        [{ text: 'Great!', onPress: clearCart }]
      );
    }, 250);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View
          style={{ transform: [{ translateY: bobTranslate }, { rotate: bobRotate }] }}
        >
          <Ionicons name="bag-outline" size={72} color={colors.lightGray} />
        </Animated.View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add some comfy Crocs to get started! 👟</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
        renderItem={({ item, index }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.product.image }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemMeta}>
                Size {item.size} · <Text style={{ color: item.color }}>●</Text>
              </Text>
              <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
            </View>

            <View style={styles.qtyControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(index, -1)}>
                <Ionicons name="remove" size={16} color={colors.black} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(index, 1)}>
                <Ionicons name="add" size={16} color={colors.black} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => removeFromCart(index)}
              style={styles.removeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 6 }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        <View>
          <ConfettiBurst trigger={burst} originX={0.5} originY={0.3} />
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.black },
  clearText: { fontSize: 12, fontWeight: '600', color: colors.danger },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.offWhite,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.black, marginTop: 16 },
  emptySubtitle: { fontSize: 13, color: colors.gray, marginTop: 6 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 12,
    ...shadow.card,
  },
  itemImage: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.lightGray },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.black },
  itemMeta: { fontSize: 11, color: colors.gray, marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: '800', color: colors.black, marginTop: 4 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { marginHorizontal: 8, fontWeight: '700', color: colors.black },
  removeBtn: { padding: 4 },
  summary: {
    backgroundColor: colors.white,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 110,
    borderRadius: radius.xl,
    ...shadow.deep,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: colors.gray },
  summaryValue: { fontSize: 13, fontWeight: '600', color: colors.black },
  totalLabel: { fontSize: 15, fontWeight: '800', color: colors.black },
  totalValue: { fontSize: 15, fontWeight: '800', color: colors.black },
  checkoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  checkoutText: { fontSize: 15, fontWeight: '800', color: colors.black },
});
