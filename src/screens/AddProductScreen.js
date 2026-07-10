import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, radius, shadow } from '../theme/colors';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/products';
import ConfettiBurst from '../components/ConfettiBurst';

const COLOR_OPTIONS = [
  { name: 'Lime', hex: '#C8FF3D' },
  { name: 'Black', hex: '#0D0D0D' },
  { name: 'Pink', hex: '#FF6FA5' },
  { name: 'Teal', hex: '#00E0C7' },
  { name: 'Blue', hex: '#4FA8FF' },
  { name: 'White', hex: '#FAFAFA' },
];

const SIZE_OPTIONS = [4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function AddProductScreen({ navigation }) {
  const { addProduct } = useProducts();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedColors, setSelectedColors] = useState(['#C8FF3D']);
  const [selectedSizes, setSelectedSizes] = useState([7, 8, 9]);
  const [burst, setBurst] = useState(0);
  const btnScale = useRef(new Animated.Value(1)).current;

  const toggleColor = (hex) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload a product image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a product name.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price greater than 0.');
      return;
    }
    if (selectedColors.length === 0) {
      Alert.alert('Pick a color', 'Select at least one color.');
      return;
    }
    if (selectedSizes.length === 0) {
      Alert.alert('Pick a size', 'Select at least one available size.');
      return;
    }

    addProduct({
      name: name.trim(),
      category,
      price: parsedPrice,
      description: description.trim() || 'No description provided.',
      image: image || `https://picsum.photos/seed/${Date.now()}/600/600`,
      colors: selectedColors,
      sizes: selectedSizes,
    });

    setBurst((b) => b + 1);
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 1.1, useNativeDriver: true, speed: 40 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();

    setTimeout(() => {
      Alert.alert('Product added! 🎉', `"${name}" is now live in your shop.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {/* Image picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={30} color={colors.textSecondary} />
              <Text style={styles.imagePlaceholderText}>Add Product Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Neon Splash Clog"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, category === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price */}
        <Text style={styles.label}>Price (USD)</Text>
        <View style={styles.priceInputWrap}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Colors */}
        <Text style={styles.label}>Available Colors</Text>
        <View style={styles.colorRow}>
          {COLOR_OPTIONS.map((c) => {
            const selected = selectedColors.includes(c.hex);
            return (
              <TouchableOpacity
                key={c.hex}
                onPress={() => toggleColor(c.hex)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c.hex },
                  selected && styles.colorSwatchSelected,
                ]}
              >
                {selected && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={c.hex === '#0D0D0D' ? colors.white : colors.onPrimary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sizes */}
        <Text style={styles.label}>Available Sizes</Text>
        <View style={styles.sizeRow}>
          {SIZE_OPTIONS.map((s) => {
            const selected = selectedSizes.includes(s);
            return (
              <TouchableOpacity
                key={s}
                onPress={() => toggleSize(s)}
                style={[styles.sizeChip, selected && styles.sizeChipActive]}
              >
                <Text style={[styles.sizeChipText, selected && styles.sizeChipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell customers what makes this pair special..."
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View>
          <ConfettiBurst trigger={burst} originX={0.5} originY={0.5} />
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
              <Text style={styles.submitText}>Publish Product</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
  },
  imagePlaceholderText: { color: colors.textSecondary, marginTop: 8, fontWeight: '600', fontSize: 12 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 18,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    marginBottom: 18,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  chipTextActive: { color: colors.onPrimary },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  dollarSign: { fontSize: 16, fontWeight: '700', color: colors.textSecondary, marginRight: 4 },
  priceInput: { flex: 1, paddingVertical: 14, fontSize: 14, color: colors.textPrimary },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorSwatchSelected: { borderWidth: 2, borderColor: colors.primary },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  sizeChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sizeChipText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  sizeChipTextActive: { color: colors.onPrimary },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...shadow.glow,
  },
  submitText: { fontSize: 15, fontWeight: '800', color: colors.onPrimary, marginLeft: 8 },
});