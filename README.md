# Crocs Store — React Native (Expo) E-commerce App

A full-featured, beautifully designed Crocs-style e-commerce app with 4 tabs and a working
"Add Product" flow. Built on **Expo SDK 54** (React Native 0.81, React 19.1, New Architecture)
with React Navigation, using only in-memory state (no backend needed) so it runs immediately.

## Features

- **Home tab** — search, hero banner, category filter chips, featured product grid
- **Shop tab** — full catalog, category filter, price sort, floating "+" Add Product button
- **Cart tab** — quantity controls, remove items, live subtotal/total, checkout flow
- **Profile tab** — user card, stats, "List a new product" shortcut, account menu
- **Add Product** — full form: photo picker (device gallery), category, price, multi-select
  colors & sizes, description, validation, and it instantly appears in the Shop/Home feeds
- **Product Detail** — image, color/size selectors, description, animated "Added!" state
- Custom yellow/black Crocs-inspired theme, shadows, rounded cards, gradients

## Setup (copy-paste into VS Code terminal)

1. Make sure you have Node.js (18+) installed.
2. Open this folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

   Then run this once to let Expo double-check every native package matches SDK 54 exactly:

   ```bash
   npx expo install --fix
   ```

4. Start the app:

   ```bash
   npx expo start
   ```

5. Scan the QR code with the **Expo Go** app (iOS/Android) on your phone, or press:
   - `a` to open Android emulator
   - `i` to open iOS simulator
   - `w` to open in a web browser

That's it — no backend, no API keys, no extra config. Everything (products, cart) is
stored in React Context in memory, so it "just works" out of the box.

## Project Structure

```
crocs-app/
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── theme/colors.js          # Colors, shadows, border radius tokens
    ├── data/products.js         # Seed product catalog + categories
    ├── context/
    │   ├── ProductContext.js    # Product list + addProduct()
    │   └── CartContext.js       # Cart items + qty/add/remove
    ├── components/
    │   └── ProductCard.js       # Reusable grid product card
    ├── navigation/
    │   └── RootNavigator.js     # Bottom tabs + nested stacks
    └── screens/
        ├── HomeScreen.js
        ├── ShopScreen.js
        ├── CartScreen.js
        ├── ProfileScreen.js
        ├── ProductDetailScreen.js
        └── AddProductScreen.js
```

## Notes / Next steps if you want to go further

- Product images currently use placeholder photos (picsum.photos) — swap `image` URLs
  in `src/data/products.js` or upload your own via the Add Product photo picker.
- To persist data between app restarts, swap the in-memory Context state for
  `AsyncStorage` or a real backend (Firebase, Supabase, your own API).
- To add real payments, integrate `expo-stripe` or a payment gateway of your choice
  at the `handleCheckout` function in `CartScreen.js`.
