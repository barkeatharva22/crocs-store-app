import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, shadow, radius } from '../theme/colors';
import { useCart } from '../context/CartContext';

import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ShopStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </HomeStack.Navigator>
  );
}

function ShopStackScreen() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="ShopMain" component={ShopScreen} />
      <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <ShopStack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ presentation: 'modal' }}
      />
    </ShopStack.Navigator>
  );
}

function CartStackScreen() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartMain" component={CartScreen} />
    </CartStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ presentation: 'modal' }}
      />
    </ProfileStack.Navigator>
  );
}

const TAB_META = {
  HomeTab: { icon: 'home', iconOutline: 'home-outline', label: 'Home' },
  ShopTab: { icon: 'grid', iconOutline: 'grid-outline', label: 'Shop' },
  CartTab: { icon: 'bag', iconOutline: 'bag-outline', label: 'Cart' },
  ProfileTab: { icon: 'person', iconOutline: 'person-outline', label: 'Profile' },
};

function TabButton({ routeName, focused, onPress, totalItems }) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const widthAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1 : 0.9, useNativeDriver: true, friction: 6 }).start();
    Animated.timing(widthAnim, {
      toValue: focused ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const meta = TAB_META[routeName];
  const showBadge = routeName === 'CartTab' && totalItems > 0;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View
        onTouchEnd={onPress}
        style={[styles.tabBtn, focused && styles.tabBtnActive]}
      >
        <View>
          <Ionicons
            name={focused ? meta.icon : meta.iconOutline}
            size={20}
            color={focused ? colors.black : colors.gray}
          />
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
            </View>
          )}
        </View>
        {focused && <Text style={styles.tabLabel}>{meta.label}</Text>}
      </View>
    </Animated.View>
  );
}

function CustomTabBar({ state, navigation }) {
  const { totalItems } = useCart();

  return (
    <View style={styles.tabBarWrap}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TabButton
              key={route.key}
              routeName={route.name}
              focused={focused}
              onPress={onPress}
              totalItems={totalItems}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="HomeTab" component={HomeStackScreen} />
        <Tab.Screen name="ShopTab" component={ShopStackScreen} />
        <Tab.Screen name="CartTab" component={CartStackScreen} />
        <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    ...shadow.deep,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.black,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.white, fontSize: 8.5, fontWeight: '800' },
});
