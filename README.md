# ⚡ SubPrime Digital Storefront

A modern, high-performance digital subscription e-commerce storefront with instant Reddit DM checkout, dynamic stock & pricing management, customizable checkout fields, and secure customer credential handling.

Repository: [https://github.com/pixelclips02-create/subprime-store](https://github.com/pixelclips02-create/subprime-store)

---

## 🚀 Key Features

* **Instant Digital Subscriptions**: Netflix, ChatGPT Plus, Claude, Spotify, Coursera, Canva Edu, Adobe CC, NordVPN, and more.
* **1-Click Reddit Payment Integration**: Automatically pre-fills Reddit DMs with order details, items, and total for frictionless customer transactions.
* **Smart Cart & Modal Flow**: Persistent customer cart with non-intrusive drawer notifications.
* **Customer Authentication & Orders**: User accounts with persistent order history, receipts, and activation target tracking.

---

## 🛠️ Developer Mode & Store Management

Store owners have direct access to a private Developer Portal:

* **Access Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> anywhere on the page (or click **Dev Gate** in the footer).
* **Security PIN**: `022005` (Customizable inside Store Settings).

### Developer Portal Capabilities:
1. **Stock & Inventory**: 1-click toggling between `[IN STOCK]` and `[OUT OF STOCK]` with live restock inquiry links.
2. **Dynamic Pricing & Plans**: Inline price editors and multi-tier plan management.
3. **Checkout Fields & Rules**:
   - Store-wide checkout configuration via the **Checkout Fields & Rules** tab.
   - **Product-by-Product Checkout Customization**: Configure checkout fields directly inside **Product Edit** (`Edit Details & Plans`) or when adding a new subscription.
   - Toggle **Account Password / Access PIN** (Required `*` / Optional / Hidden) per product.
   - Set custom field labels, placeholders, and helper instructions per product.
   - Add product-specific checkout announcement notices.
   - **Smart Cart-Aware Checkout Page**: Checkout dynamically analyzes the items in cart—requesting passwords and displaying notices only when required by items being purchased!
4. **Order Management & Fulfillment**:
   - View recent customer orders.
   - Copy customer passwords and credentials with 1 click.
   - Open pre-filled Reddit DMs directly to coordinate fulfillment.
   - 1-click "Copy Order Summary".

---

## 💻 Tech Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS, Lucide React Icons
* **State Management**: React Context + LocalStorage Persistence
* **Deployment**: Vercel ready (`vercel.json` SPA rewrite configured)

---

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/pixelclips02-create/subprime-store.git

# Enter repository folder
cd subprime-store

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deployment to Vercel

1. Push changes to GitHub (`git push origin main`).
2. Connect repository to [Vercel](https://vercel.com).
3. The build command `npm run build` with output directory `dist` is automatically detected.
