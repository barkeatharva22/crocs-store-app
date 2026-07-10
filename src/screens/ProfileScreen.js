import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme/colors';
import { useProducts } from '../context/ProductContext';

const MENU_ITEMS = [
  { icon: 'receipt-outline', label: 'My Orders' },
  { icon: 'location-outline', label: 'Shipping Addresses' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'heart-outline', label: 'Wishlist' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'settings-outline', label: 'Settings' },
];

export default function ProfileScreen({ navigation }) {
  const { products } = useProducts();
  const myListings = products.filter((p) => p.id.startsWith('custom-'));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/crocuser/200/200' }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.userName}>Username</Text>
          <Text style={styles.userEmail}>seller@crocsstore.app</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="pencil" size={14} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{myListings.length}</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addProductBanner}
        onPress={() => navigation.navigate('ShopTab', { screen: 'AddProduct' })}
        activeOpacity={0.85}
      >
        <View style={styles.bannerIcon}>
          <Ionicons name="add" size={22} color={colors.onPrimary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bannerTitle}>List a new product</Text>
          <Text style={styles.bannerSubtitle}>Add photos, pricing & details</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.onPrimary} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, idx !== MENU_ITEMS.length - 1 && styles.menuItemBorder]}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={18} color={colors.textPrimary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: radius.lg,
    marginTop: 10,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surfaceAlt },
  userName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  userEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  editBtn: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  addProductBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: radius.lg,
    ...shadow.glow,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13,13,13,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: colors.onPrimary },
  bannerSubtitle: { fontSize: 11, color: 'rgba(13,13,13,0.65)', marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 26,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    borderRadius: radius.lg,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    gap: 8,
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: colors.danger },
});