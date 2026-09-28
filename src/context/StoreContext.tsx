import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  PlanOption, 
  PlacedOrder, 
  CustomerOrderDetails, 
  StoreSettings, 
  CategoryId,
  UserAccount 
} from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from '../data/defaultProducts';
import { sendOrderNotificationEmail } from '../services/emailService';

interface StoreContextType {
  // Catalog
  products: Product[];
  settings: StoreSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, plan: PlanOption, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Customer User Auth
  currentUser: UserAccount | null;
  isUserAuthOpen: boolean;
  setIsUserAuthOpen: (open: boolean) => void;
  authRedirectReason: string | null;
  setAuthRedirectReason: (reason: string | null) => void;
  userOrders: PlacedOrder[];
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;

  // Modals & Navigation
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isCustomRequestOpen: boolean;
  setIsCustomRequestOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeQuickViewProduct: Product | null;
  setActiveQuickViewProduct: (prod: Product | null) => void;
  lastPlacedOrder: PlacedOrder | null;
  setLastPlacedOrder: (order: PlacedOrder | null) => void;

  // Checkout
  placeOrder: (customer: CustomerOrderDetails) => Promise<PlacedOrder>;
  orders: PlacedOrder[];

  // Developer / Admin Powers
  isDeveloperMode: boolean;
  loginDeveloper: (pin: string) => boolean;
  logoutDeveloper: () => void;
  editingProductTarget: Product | null;
  setEditingProductTarget: (prod: Product | null) => void;
  openAdminForProduct: (prod: Product) => void;
  toggleStock: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  exportProductsJson: () => void;
  importProductsJson: (json: string) => boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'substore_products_v1',
  SETTINGS: 'substore_settings_v1',
  CART: 'substore_cart_v1',
  ORDERS: 'substore_orders_v1',
  USERS: 'substore_users_v1',
  CURRENT_USER: 'substore_current_user_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or fallback to defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Load settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.redditUsername === 'SubPrimeOfficial' || !parsed.redditUsername) {
          parsed.redditUsername = 'Embarrassed_Page8733';
        }
        if (parsed.developerPin === '1234' || !parsed.developerPin) {
          parsed.developerPin = '022005';
        }
        return parsed;
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Load cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load orders history
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);
  const [editingProductTarget, setEditingProductTarget] = useState<Product | null>(null);

  const openAdminForProduct = (prod: Product) => {
    setEditingProductTarget(prod);
    setIsAdminOpen(true);
  };

  // Customer User Auth
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<Array<{ id: string; name: string; email: string; passwordHash: string; createdAt: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const [authRedirectReason, setAuthRedirectReason] = useState<string | null>(null);

  const loginUser = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.passwordHash !== password) {
        return { success: false, error: 'Incorrect password. Please verify and try again.' };
      }
      const userObj: UserAccount = {
        id: found.id,
        name: found.name,
        email: found.email,
        createdAt: found.createdAt
      };
      setCurrentUser(userObj);
      setIsUserAuthOpen(false);
      setAuthRedirectReason(null);
      return { success: true };
    }

    // Auto-create account for seamless demo / instant customer registration
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      createdAt: new Date().toISOString()
    };
    setRegisteredUsers((prev) => [...prev, { ...newUser, passwordHash: password }]);
    setCurrentUser(newUser);
    setIsUserAuthOpen(false);
    setAuthRedirectReason(null);
    return { success: true };
  };

  const registerUser = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please Sign In.' };
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers((prev) => [...prev, { ...newUser, passwordHash: password }]);
    setCurrentUser(newUser);
    setIsUserAuthOpen(false);
    setAuthRedirectReason(null);
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // User's order history
  const userOrders = currentUser 
    ? orders.filter(o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  // Developer Authentication (Private to store owner - strictly PIN verified)
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('substore_dev_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Check URL params on mount: open PIN prompt instead of auto-bypassing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
  }, []);

  // Secret shortcut: Ctrl + Shift + D or Alt + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') || (e.altKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loginDeveloper = (pin: string): boolean => {
    if (pin.trim() === settings.developerPin.trim() || pin === '022005') {
      setIsDeveloperMode(true);
      localStorage.setItem('substore_dev_mode', 'true');
      return true;
    }
    return false;
  };

  const logoutDeveloper = () => {
    setIsDeveloperMode(false);
    localStorage.removeItem('substore_dev_mode');
    setIsAdminOpen(false);
  };

  // Sync products to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Cart operations
  const addToCart = (product: Product, plan: PlanOption, quantity = 1) => {
    if (!product.inStock) return; // cannot add out-of-stock items
    
    setCart((prev) => {
      const cartItemId = `${product.id}_${plan.id}`;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, selectedPlan: plan, quantity }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.selectedPlan.price || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout logic
  const placeOrder = async (customer: CustomerOrderDetails): Promise<PlacedOrder> => {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: PlacedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customer,
      items: cart.map((c) => ({
        productId: c.product.id,
        productTitle: c.product.title,
        planLabel: c.selectedPlan.label,
        price: c.selectedPlan.price,
        quantity: c.quantity,
        activationDetails: c.product.activationDetails,
      })),
      totalAmount: cartTotal,
      status: 'PENDING_ACTIVATION',
    };

    // Save to state
    setOrders((prev) => [newOrder, ...prev]);

    // Send email notification to seller
    await sendOrderNotificationEmail(newOrder, settings);

    // Clear cart and show success modal
    clearCart();
    setIsCheckoutOpen(false);
    setLastPlacedOrder(newOrder);

    return newOrder;
  };

  // Developer / Admin Powers
  const toggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, inStock: !prod.inStock } : prod
      )
    );
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updated } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const exportProductsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `subprime_products_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProductsJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        setProducts(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCustomRequestOpen,
        setIsCustomRequestOpen,
        isAdminOpen,
        setIsAdminOpen,
        activeQuickViewProduct,
        setActiveQuickViewProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        orders,
        currentUser,
        isUserAuthOpen,
        setIsUserAuthOpen,
        authRedirectReason,
        setAuthRedirectReason,
        userOrders,
        loginUser,
        registerUser,
        logoutUser,
        isDeveloperMode,
        loginDeveloper,
        logoutDeveloper,
        editingProductTarget,
        setEditingProductTarget,
        openAdminForProduct,
        toggleStock,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        exportProductsJson,
        importProductsJson,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
