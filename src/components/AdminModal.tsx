import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  SlidersHorizontal, 
  Mail, 
  MessageSquare, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  Package, 
  Lock, 
  LogOut, 
  KeyRound, 
  CheckSquare, 
  Copy, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Phone, 
  FileText, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryId, PlanOption, CheckoutSettings, CheckoutFieldConfig, ProductCheckoutConfig, FieldRequirementLevel } from '../types';
import { CATEGORIES, DEFAULT_CHECKOUT_SETTINGS } from '../data/defaultProducts';
import { buildRedditDmUrl } from '../services/emailService';

export const AdminModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    toggleStock, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefaults, 
    exportProductsJson, 
    settings, 
    updateSettings,
    orders,
    isDeveloperMode,
    loginDeveloper,
    logoutDeveloper,
    editingProductTarget,
    setEditingProductTarget
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'edit' | 'checkout' | 'settings' | 'orders'>('inventory');
  const [filterQuery, setFilterQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Edit product form state (Allows full price and plan modification)
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState<CategoryId>('ai_dev');
  const [editFeatures, setEditFeatures] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editActivationType, setEditActivationType] = useState<'email' | 'link' | 'account' | 'credentials'>('email');
  const [editInStock, setEditInStock] = useState(true);
  const [editPlans, setEditPlans] = useState<PlanOption[]>([]);
  const [editSuccess, setEditSuccess] = useState('');
  const [quickSaved, setQuickSaved] = useState<string | null>(null);

  // Developer PIN state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('ai_dev');
  const [newPrice, setNewPrice] = useState(25);
  const [newOriginalPrice, setNewOriginalPrice] = useState(60);
  const [newDurationLabel, setNewDurationLabel] = useState('12 Months');
  const [newFeatures, setNewFeatures] = useState('Official Activation Link\nActivation on your email\nFull term warranty\nFast delivery');
  const [newDescription, setNewDescription] = useState('Genuine premium activation with full feature access and priority delivery.');
  const [newActivationType, setNewActivationType] = useState<'email' | 'link' | 'account'>('email');
  const [newInStock, setNewInStock] = useState(true);
  const [formSuccess, setFormSuccess] = useState('');

  // Settings form state
  const [sellerEmail, setSellerEmail] = useState(settings.sellerEmail);
  const [redditUsername, setRedditUsername] = useState(settings.redditUsername);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [storeName, setStoreName] = useState(settings.storeName);
  const [devPin, setDevPin] = useState(settings.developerPin || '1234');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Checkout Fields Configuration State
  const [checkoutForm, setCheckoutForm] = useState<CheckoutSettings>(() =>
    settings.checkoutSettings ? JSON.parse(JSON.stringify(settings.checkoutSettings)) : DEFAULT_CHECKOUT_SETTINGS
  );
  const [checkoutSaved, setCheckoutSaved] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<{ [orderId: string]: boolean }>({});

  // Product-specific checkout settings state (Edit Product)
  const [editCheckoutUseCustom, setEditCheckoutUseCustom] = useState(false);
  const [editRequirePassword, setEditRequirePassword] = useState<FieldRequirementLevel>('hidden');
  const [editPasswordLabel, setEditPasswordLabel] = useState('');
  const [editPasswordHelperText, setEditPasswordHelperText] = useState('');

  const [editRequireActivationEmail, setEditRequireActivationEmail] = useState<FieldRequirementLevel>('optional');
  const [editActivationEmailLabel, setEditActivationEmailLabel] = useState('');
  const [editActivationEmailPlaceholder, setEditActivationEmailPlaceholder] = useState('');

  const [editRequireCustomField, setEditRequireCustomField] = useState<FieldRequirementLevel>('hidden');
  const [editCustomFieldLabel, setEditCustomFieldLabel] = useState('');
  const [editCustomFieldPlaceholder, setEditCustomFieldPlaceholder] = useState('');

  const [editProductCheckoutNotice, setEditProductCheckoutNotice] = useState('');

  // Product-specific checkout settings state (New Product)
  const [newCheckoutUseCustom, setNewCheckoutUseCustom] = useState(false);
  const [newRequirePassword, setNewRequirePassword] = useState<FieldRequirementLevel>('hidden');
  const [newPasswordLabel, setNewPasswordLabel] = useState('');
  const [newPasswordHelperText, setNewPasswordHelperText] = useState('');
  const [newRequireActivationEmail, setNewRequireActivationEmail] = useState<FieldRequirementLevel>('optional');
  const [newActivationEmailLabel, setNewActivationEmailLabel] = useState('');
  const [newRequireCustomField, setNewRequireCustomField] = useState<FieldRequirementLevel>('hidden');
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState('');
  const [newProductCheckoutNotice, setNewProductCheckoutNotice] = useState('');

  // Sync settings when external changes occur
  useEffect(() => {
    if (settings.checkoutSettings) {
      setCheckoutForm(JSON.parse(JSON.stringify(settings.checkoutSettings)));
    }
    setSellerEmail(settings.sellerEmail);
    setRedditUsername(settings.redditUsername);
    setCurrencySymbol(settings.currencySymbol);
    setStoreName(settings.storeName);
    if (settings.developerPin) setDevPin(settings.developerPin);
  }, [settings]);

  const startEditingProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditTitle(prod.title || '');
    setEditSubtitle(prod.subtitle || '');
    setEditCategory(prod.category || 'ai_dev');
    setEditFeatures(Array.isArray(prod.features) ? prod.features.join('\n') : '');
    setEditDescription(prod.description || '');
    setEditActivationType(prod.activationType || 'email');
    setEditInStock(prod.inStock !== false);
    setEditPlans(Array.isArray(prod.plans) ? prod.plans.map(p => ({ ...p })) : []);
    setEditSuccess('');

    // Load product-specific checkout configuration
    const cfg = prod.checkoutConfig;
    if (cfg && cfg.useCustomRules) {
      setEditCheckoutUseCustom(true);
      setEditRequirePassword(cfg.passwordRequirement || 'hidden');
      setEditPasswordLabel(cfg.passwordLabel || '');
      setEditPasswordHelperText(cfg.passwordHelperText || '');

      setEditRequireActivationEmail(cfg.activationEmailRequirement || 'optional');
      setEditActivationEmailLabel(cfg.activationEmailLabel || '');
      setEditActivationEmailPlaceholder(cfg.activationEmailPlaceholder || '');

      setEditRequireCustomField(cfg.customFieldRequirement || 'hidden');
      setEditCustomFieldLabel(cfg.customFieldLabel || '');
      setEditCustomFieldPlaceholder(cfg.customFieldPlaceholder || '');

      setEditProductCheckoutNotice(cfg.checkoutNotice || '');
    } else {
      setEditCheckoutUseCustom(false);
      setEditRequirePassword('hidden');
      setEditPasswordLabel('');
      setEditPasswordHelperText('');

      setEditRequireActivationEmail('optional');
      setEditActivationEmailLabel('');
      setEditActivationEmailPlaceholder('');

      setEditRequireCustomField('hidden');
      setEditCustomFieldLabel('');
      setEditCustomFieldPlaceholder('');

      setEditProductCheckoutNotice('');
    }

    setActiveTab('edit');
  };

  useEffect(() => {
    if (editingProductTarget) {
      startEditingProduct(editingProductTarget);
      setEditingProductTarget(null);
    }
  }, [editingProductTarget]);

  if (!isAdminOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginDeveloper(pinInput)) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect Developer PIN. Please try again.');
    }
  };

  // If not authenticated as developer, display secure PIN login prompt
  if (!isDeveloperMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
        <div className="bg-[#0c0f18] text-white rounded-3xl shadow-2xl max-w-sm w-full p-7 border border-white/[0.09] text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">&gt;_ OWNER ACCESS GATE</span>
            <h3 className="font-display font-extrabold text-xl text-white mt-1">Developer Portal</h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Enter private developer PIN to unlock stock management, pricing & settings.
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
            <input
              type="password"
              autoFocus
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center tracking-widest text-lg font-mono px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
            />
            {pinError && (
              <p className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/60 border border-rose-900/60 py-1 px-2 rounded-lg">{pinError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
            >
              Unlock Developer Mode
            </button>
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="w-full text-xs font-mono text-slate-500 hover:text-slate-300 py-1"
            >
              Cancel
            </button>
          </form>
          <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-500">
            Tip: Press <kbd className="bg-white/[0.06] border border-white/10 px-1 py-0.5 rounded font-mono text-slate-300">Ctrl + Shift + D</kbd> anywhere to open.
          </div>
        </div>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const featureList = newFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const plans: PlanOption[] = [
      {
        id: 'plan-1',
        label: newDurationLabel || 'Standard Access',
        price: Number(newPrice),
        originalPrice: Number(newOriginalPrice) || undefined,
      }
    ];

    addProduct({
      title: newTitle,
      subtitle: newSubtitle,
      category: newCategory,
      description: newDescription,
      features: featureList,
      plans,
      inStock: newInStock,
      badge: 'New Arrival',
      rating: 5.0,
      reviewCount: 1,
      activationType: newActivationType,
      activationDetails: `Direct ${newActivationType} activation delivered to your provided email or Reddit handle.`,
      iconName: 'Zap',
      tags: [newCategory, newTitle.toLowerCase()],
      checkoutConfig: newCheckoutUseCustom ? {
        useCustomRules: true,
        passwordRequirement: newRequirePassword,
        passwordLabel: newPasswordLabel.trim() || undefined,
        passwordHelperText: newPasswordHelperText.trim() || undefined,
        activationEmailRequirement: newRequireActivationEmail,
        activationEmailLabel: newActivationEmailLabel.trim() || undefined,
        customFieldRequirement: newRequireCustomField,
        customFieldLabel: newCustomFieldLabel.trim() || undefined,
        checkoutNotice: newProductCheckoutNotice.trim() || undefined,
      } : undefined
    });

    setFormSuccess(`Added "${newTitle}" to the store!`);
    // Reset form
    setNewTitle('');
    setTimeout(() => {
      setFormSuccess('');
      setActiveTab('inventory');
    }, 1500);
  };

  const handleUpdatePlan = (index: number, field: keyof PlanOption, value: any) => {
    setEditPlans((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddPlan = () => {
    setEditPlans((prev) => [
      ...prev,
      {
        id: 'plan-' + Date.now(),
        label: '12 Months',
        price: 30,
        originalPrice: 60,
      }
    ]);
  };

  const handleRemovePlan = (index: number) => {
    if (editPlans.length <= 1) return;
    setEditPlans((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editTitle.trim()) return;

    const featureList = editFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    updateProduct(editingProduct.id, {
      title: editTitle,
      subtitle: editSubtitle,
      category: editCategory,
      description: editDescription,
      features: featureList,
      plans: editPlans,
      inStock: editInStock,
      activationType: editActivationType,
      checkoutConfig: editCheckoutUseCustom ? {
        useCustomRules: true,
        passwordRequirement: editRequirePassword,
        passwordLabel: editPasswordLabel.trim() || undefined,
        passwordHelperText: editPasswordHelperText.trim() || undefined,
        activationEmailRequirement: editRequireActivationEmail,
        activationEmailLabel: editActivationEmailLabel.trim() || undefined,
        activationEmailPlaceholder: editActivationEmailPlaceholder.trim() || undefined,
        customFieldRequirement: editRequireCustomField,
        customFieldLabel: editCustomFieldLabel.trim() || undefined,
        customFieldPlaceholder: editCustomFieldPlaceholder.trim() || undefined,
        checkoutNotice: editProductCheckoutNotice.trim() || undefined,
      } : {
        useCustomRules: false,
        passwordRequirement: 'hidden',
        activationEmailRequirement: 'optional',
        customFieldRequirement: 'hidden',
      }
    });

    setEditSuccess(`Updated "${editTitle}" pricing, details & checkout rules!`);
    setTimeout(() => {
      setEditSuccess('');
      setActiveTab('inventory');
      setEditingProduct(null);
    }, 1200);
  };

  const handleQuickPriceChange = (productId: string, planId: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr);
    if (isNaN(val) || val < 0) return;
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const updatedPlans = prod.plans.map(p => p.id === planId ? { ...p, price: val } : p);
    updateProduct(productId, { plans: updatedPlans });
    setQuickSaved(`${productId}-${planId}`);
    setTimeout(() => setQuickSaved(null), 1500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      sellerEmail,
      redditUsername: redditUsername.replace(/^u\//, ''),
      currencySymbol,
      storeName,
      developerPin: devPin,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleUpdateCheckoutField = (
    fieldName: keyof Omit<CheckoutSettings, 'checkoutNoticeText'>,
    subField: keyof CheckoutFieldConfig,
    value: any
  ) => {
    setCheckoutForm((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [subField]: value
      }
    }));
  };

  const handleSaveCheckoutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      checkoutSettings: checkoutForm
    });
    setCheckoutSaved(true);
    setTimeout(() => setCheckoutSaved(false), 2500);
  };

  const handleResetCheckoutDefaults = () => {
    if (window.confirm('Reset all checkout fields and requirements to default configuration?')) {
      const cloned = JSON.parse(JSON.stringify(DEFAULT_CHECKOUT_SETTINGS));
      setCheckoutForm(cloned);
      updateSettings({
        checkoutSettings: cloned
      });
      setCheckoutSaved(true);
      setTimeout(() => setCheckoutSaved(false), 2500);
    }
  };

  const handleCopyCredential = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCredential(id);
    setTimeout(() => setCopiedCredential(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c0f18] text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col border border-white/[0.09] overflow-hidden">
        
        {/* Developer Portal Header */}
        <div className="bg-[#080a12] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base tracking-tight text-white">
                  Developer Power & Store Manager
                </h2>
                <span className="text-[10px] font-mono bg-cyan-500 text-black font-black px-2 py-0.2 rounded-full uppercase">
                  Owner Active
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Private Control Center • Visible Only to Store Owner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutDeveloper}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 flex items-center gap-1.5 transition font-mono font-bold"
              title="Lock and hide developer mode from all visitors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              title="Close window (stay logged in)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Stats Overview */}
        <div className="bg-[#080a12]/80 border-b border-white/[0.06] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Total: <strong className="text-white font-bold">{products.length}</strong>
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              In Stock: <strong>{inStockCount}</strong>
            </span>
            <span className="text-rose-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Out of Stock: <strong>{outOfStockCount}</strong>
            </span>
            <span className="text-cyan-400 font-medium">
              Orders: <strong>{orders.length}</strong>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportProductsJson}
              className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-200 font-mono font-bold flex items-center gap-1 transition"
              title="Download products.json backup"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all catalog and settings to defaults?')) {
                  resetToDefaults();
                }
              }}
              className="px-2 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-rose-950 text-rose-400 font-mono font-bold flex items-center gap-1 transition"
              title="Reset products to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] bg-[#080a12] px-4 font-mono overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stock & Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subscription</span>
          </button>

          {editingProduct && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'edit'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-transparent text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Editing: {editingProduct.title}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('checkout')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checkout'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span>Checkout Fields & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Order Email & Reddit Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: INVENTORY & 1-CLICK STOCK TOGGLES */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Special instruction highlight for ChatGPT & out of stock */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">1-Click Stock Management:</strong>
                  <p className="text-[11px] mt-0.5 text-amber-800">
                    Click the stock switch on any item to instantly toggle between <strong>[IN STOCK]</strong> and <strong>[OUT OF STOCK]</strong>. For example, toggle <strong>ChatGPT Plus</strong> to test how it disables the cart and displays the Reddit restock notice!
                  </p>
                </div>
              </div>

              {/* Search filter within admin */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Quick filter products by title or category..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Product Table / Cards */}
              <div className="space-y-3">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 ${
                      prod.inStock ? 'bg-white/[0.03] border-white/[0.08] hover:border-cyan-500/30' : 'bg-rose-950/20 border-rose-900/40'
                    }`}
                  >
                    {/* Info & Quick Price Editors */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-extrabold text-sm sm:text-base text-white">
                          {prod.title}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/40 rounded-md">
                          {prod.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md">
                          {prod.activationType}
                        </span>
                        {prod.id === 'chatgpt-plus' && !prod.inStock && (
                          <span className="text-[10px] font-mono font-bold bg-rose-900/60 text-rose-300 border border-rose-700/60 px-2 py-0.5 rounded-md">
                            Restock Request Active
                          </span>
                        )}
                        {prod.checkoutConfig?.useCustomRules && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            prod.checkoutConfig.passwordRequirement === 'required'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                          }`}>
                            {prod.checkoutConfig.passwordRequirement === 'required' ? '🔑 Pass Required' : '⚡ Custom Checkout'}
                          </span>
                        )}
                      </div>

                      {/* Instant Plan Price Editor Chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Instant Price Editor (type to change & click away):
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {prod.plans.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.1] px-2.5 py-1 rounded-xl text-xs font-mono"
                            >
                              <span className="text-slate-300 font-medium">{p.label}:</span>
                              {p.contactForPrice ? (
                                <span className="text-amber-400 font-bold text-[11px]">DM for Price</span>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-cyan-400 font-bold">{settings.currencySymbol}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    defaultValue={p.price}
                                    onBlur={(e) => handleQuickPriceChange(prod.id, p.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleQuickPriceChange(prod.id, p.id, (e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).blur();
                                      }
                                    }}
                                    className="w-16 px-1 py-0.5 bg-black/40 border border-white/[0.1] focus:border-cyan-500 rounded text-cyan-300 font-mono font-bold text-xs outline-none text-right"
                                    title="Edit price and press Enter or click away"
                                  />
                                  {quickSaved === `${prod.id}-${p.id}` && (
                                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls: Edit, Stock Toggle & Delete */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                      
                      {/* Full Edit Button */}
                      <button
                        onClick={() => startEditingProduct(prod)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="Edit all plans, prices, features and description"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Details & Plans</span>
                      </button>

                      {/* 1-Click Stock Toggle Button */}
                      <button
                        onClick={() => toggleStock(prod.id)}
                        className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95 ${
                          prod.inStock
                            ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700'
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        {prod.inStock ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>IN STOCK</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5 text-rose-400" />
                            <span>OUT OF STOCK</span>
                          </>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${prod.title}" from store?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: EDIT EXISTING PRODUCT & PRICES */}
          {activeTab === 'edit' && editingProduct && (
            <form onSubmit={handleSaveEditProduct} className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    SUBSCRIPTION & PRICE EDITOR
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Edit {editTitle || 'Subscription'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('inventory'); setEditingProduct(null); }}
                  className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {editSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 text-xs rounded-xl font-bold flex items-center gap-2 font-mono">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{editSuccess}</span>
                </div>
              )}

              {/* Core Pricing & Plans Section */}
              <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-cyan-400" />
                      Subscription Plans & Pricing
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Modify existing plan prices, add monthly or yearly variations, or set custom contact pricing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPlan}
                    className="px-2.5 py-1 text-xs bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Plan Option</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-1">
                  {editPlans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Plan Label / Duration</label>
                        <input
                          type="text"
                          required
                          value={plan.label}
                          onChange={(e) => handleUpdatePlan(idx, 'label', e.target.value)}
                          placeholder="e.g. 1 Month, 12 Months"
                          className="w-full px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-xs text-white outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Price ({settings.currencySymbol})</label>
                        <input
                          type="number"
                          required={!plan.contactForPrice}
                          min="0"
                          step="any"
                          value={plan.price}
                          onChange={(e) => handleUpdatePlan(idx, 'price', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-xs text-cyan-300 outline-none focus:border-cyan-500 font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Original Price ({settings.currencySymbol})</label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={plan.originalPrice || ''}
                          onChange={(e) => handleUpdatePlan(idx, 'originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Optional"
                          className="w-full px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-xs text-slate-300 outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-4">
                        <label className="text-[10px] text-slate-400 flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.contactForPrice || false}
                            onChange={(e) => handleUpdatePlan(idx, 'contactForPrice', e.target.checked)}
                            className="rounded accent-cyan-500"
                          />
                          <span>DM</span>
                        </label>

                        {editPlans.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePlan(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                            title="Remove plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Product Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Subtitle / Badge</label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 bg-[#090c14] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Activation Type</label>
                  <select
                    value={editActivationType}
                    onChange={(e) => setEditActivationType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#090c14] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="email">Activation on Your Email</option>
                    <option value="link">Official Activation Link</option>
                    <option value="account">Private Account Credentials</option>
                    <option value="credentials">Custom Credentials</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Stock Status</label>
                  <select
                    value={editInStock ? 'true' : 'false'}
                    onChange={(e) => setEditInStock(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-[#090c14] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="true">In Stock (Available)</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Feature Bullets (1 per line)</label>
                <textarea
                  rows={3}
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Product Description (Shown on storefront card & details modal)
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Supports full details & instructions
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter detailed description of the subscription service, activation details, benefits, etc."
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-sans leading-relaxed"
                />
              </div>

              {/* Product Checkout Page Requirements Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">
                        Checkout Requirements for this Product
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Configure what fields appear on checkout when a customer buys this product.
                      </p>
                    </div>
                  </div>

                  {/* Toggle: Use Custom or Default */}
                  <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl hover:bg-white/[0.08] transition">
                    <input
                      type="checkbox"
                      checked={editCheckoutUseCustom}
                      onChange={(e) => setEditCheckoutUseCustom(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20 focus:ring-cyan-500 cursor-pointer"
                    />
                    <span className={editCheckoutUseCustom ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                      {editCheckoutUseCustom ? 'Custom Checkout Rules Active' : 'Use Store Defaults'}
                    </span>
                  </label>
                </div>

                {!editCheckoutUseCustom ? (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400 font-mono flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>This product currently inherits your global store-wide checkout rules. Tick &ldquo;Custom Checkout Rules Active&rdquo; above to customize password or fields for this product.</span>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-1">
                    {/* 1. Account Password / PIN Requirement */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/25 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-amber-300">
                            Account Password / Access PIN
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (for login/upgrade activations)
                          </span>
                        </div>

                        {/* Tri-state selector: Required / Optional / Hidden */}
                        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setEditRequirePassword('required')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequirePassword === 'required'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            * Required
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequirePassword('optional')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequirePassword === 'optional'
                                ? 'bg-amber-500 text-black shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Optional
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequirePassword('hidden')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequirePassword === 'hidden'
                                ? 'bg-slate-700 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Hidden
                          </button>
                        </div>
                      </div>

                      {editRequirePassword !== 'hidden' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Custom Password Field Label
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Existing Netflix Account Password"
                              value={editPasswordLabel}
                              onChange={(e) => setEditPasswordLabel(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Helper Instructions for Password
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. We will log in securely to apply the upgrade"
                              value={editPasswordHelperText}
                              onChange={(e) => setEditPasswordHelperText(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Activation Email / Account ID Requirement */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-500/25 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-cyan-300">
                            Account Email / ID for Activation
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setEditRequireActivationEmail('required')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireActivationEmail === 'required'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            * Required
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequireActivationEmail('optional')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireActivationEmail === 'optional'
                                ? 'bg-cyan-500 text-black shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Optional
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequireActivationEmail('hidden')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireActivationEmail === 'hidden'
                                ? 'bg-slate-700 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Hidden
                          </button>
                        </div>
                      </div>

                      {editRequireActivationEmail !== 'hidden' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Custom Activation Email Label
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Canva Account Email"
                              value={editActivationEmailLabel}
                              onChange={(e) => setEditActivationEmailLabel(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Input Placeholder
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. user@canva.com"
                              value={editActivationEmailPlaceholder}
                              onChange={(e) => setEditActivationEmailPlaceholder(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Custom Field Requirement */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-pink-500/25 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-pink-400" />
                          <span className="text-xs font-bold text-pink-300">
                            Custom Order Requirement
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setEditRequireCustomField('required')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireCustomField === 'required'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            * Required
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequireCustomField('optional')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireCustomField === 'optional'
                                ? 'bg-pink-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Optional
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRequireCustomField('hidden')}
                            className={`px-2.5 py-1 rounded transition text-[11px] font-bold cursor-pointer ${
                              editRequireCustomField === 'hidden'
                                ? 'bg-slate-700 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Hidden
                          </button>
                        </div>
                      </div>

                      {editRequireCustomField !== 'hidden' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Field Label
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Profile Name to Upgrade / Discord ID"
                              value={editCustomFieldLabel}
                              onChange={(e) => setEditCustomFieldLabel(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-pink-400 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-mono text-slate-400 block mb-1">
                              Placeholder
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Profile 1"
                              value={editCustomFieldPlaceholder}
                              onChange={(e) => setEditCustomFieldPlaceholder(e.target.value)}
                              className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-pink-400 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Product Checkout Notice Banner */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Special Checkout Notice for this Product
                      </label>
                      <textarea
                        rows={2}
                        value={editProductCheckoutNotice}
                        onChange={(e) => setEditProductCheckoutNotice(e.target.value)}
                        placeholder="Instructions displayed on checkout when this product is in the cart (e.g. 'Please turn off 2FA or stay available on Reddit for verification code')."
                        className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 text-xs font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Pricing & Product Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('inventory'); setEditingProduct(null); }}
                  className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ADD NEW SUBSCRIPTION */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} className="max-w-xl mx-auto space-y-4">
              
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Subscription Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+ Premium, Midjourney Pro, Claude Pro"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Subtitle / Quick Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 Months Official Link • 4K Streaming"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Duration Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Month, 12 Months, 3 Months"
                    value={newDurationLabel}
                    onChange={(e) => setNewDurationLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Selling Price ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Original Price ({settings.currencySymbol}) (for discount %)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Activation Type
                  </label>
                  <select
                    value={newActivationType}
                    onChange={(e) => setNewActivationType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="email">Activation on Your Email</option>
                    <option value="link">Official Activation Link</option>
                    <option value="account">Private Account Credentials</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Initial Stock Status
                  </label>
                  <select
                    value={newInStock ? 'true' : 'false'}
                    onChange={(e) => setNewInStock(e.target.value === 'true')}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="true">In Stock (Ready to Buy)</option>
                    <option value="false">Out of Stock (Currently Unavailable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Feature Bullets (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Product Checkout Page Requirements Section for New Product */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Checkout Page Requirements</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Configure password, activation email or custom field for this product.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newCheckoutUseCustom}
                      onChange={(e) => setNewCheckoutUseCustom(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className={newCheckoutUseCustom ? 'text-indigo-600 font-bold' : 'text-gray-500'}>
                      {newCheckoutUseCustom ? 'Custom Rules' : 'Use Store Defaults'}
                    </span>
                  </label>
                </div>

                {newCheckoutUseCustom && (
                  <div className="space-y-3 pt-1 text-xs">
                    {/* Password */}
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                          Account Password / PIN
                        </span>
                        <select
                          value={newRequirePassword}
                          onChange={(e) => setNewRequirePassword(e.target.value as FieldRequirementLevel)}
                          className="px-2 py-0.5 text-[11px] border border-amber-300 rounded bg-white text-gray-800"
                        >
                          <option value="hidden">Hidden / Not Needed</option>
                          <option value="optional">Optional</option>
                          <option value="required">* Required</option>
                        </select>
                      </div>
                      {newRequirePassword !== 'hidden' && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Custom password label..."
                            value={newPasswordLabel}
                            onChange={(e) => setNewPasswordLabel(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Password instructions..."
                            value={newPasswordHelperText}
                            onChange={(e) => setNewPasswordHelperText(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Activation Email */}
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          Account Email / Target ID
                        </span>
                        <select
                          value={newRequireActivationEmail}
                          onChange={(e) => setNewRequireActivationEmail(e.target.value as FieldRequirementLevel)}
                          className="px-2 py-0.5 text-[11px] border border-blue-300 rounded bg-white text-gray-800"
                        >
                          <option value="hidden">Hidden / Not Needed</option>
                          <option value="optional">Optional</option>
                          <option value="required">* Required</option>
                        </select>
                      </div>
                      {newRequireActivationEmail !== 'hidden' && (
                        <input
                          type="text"
                          placeholder="Custom email label (e.g. Canva Account Email)..."
                          value={newActivationEmailLabel}
                          onChange={(e) => setNewActivationEmailLabel(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                        />
                      )}
                    </div>

                    {/* Custom Field */}
                    <div className="p-2.5 rounded-lg bg-pink-50 border border-pink-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pink-900 flex items-center gap-1 text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-pink-600" />
                          Custom Requirement Field
                        </span>
                        <select
                          value={newRequireCustomField}
                          onChange={(e) => setNewRequireCustomField(e.target.value as FieldRequirementLevel)}
                          className="px-2 py-0.5 text-[11px] border border-pink-300 rounded bg-white text-gray-800"
                        >
                          <option value="hidden">Hidden / Not Needed</option>
                          <option value="optional">Optional</option>
                          <option value="required">* Required</option>
                        </select>
                      </div>
                      {newRequireCustomField !== 'hidden' && (
                        <input
                          type="text"
                          placeholder="Field label (e.g. Profile Name to Upgrade)..."
                          value={newCustomFieldLabel}
                          onChange={(e) => setNewCustomFieldLabel(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                        />
                      )}
                    </div>

                    {/* Notice */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-0.5">
                        Special Checkout Notice for this Product
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Instructions displayed at checkout when this item is in cart..."
                        value={newProductCheckoutNotice}
                        onChange={(e) => setNewProductCheckoutNotice(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 px-4 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Subscription</span>
              </button>

            </form>
          )}

          {/* TAB 3: ORDER EMAIL & REDDIT SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-xl mx-auto space-y-4">
              
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Settings saved successfully!</span>
                </div>
              )}

              <div className="p-3.5 bg-blue-500/10 border border-blue-500/25 rounded-2xl text-xs text-blue-200">
                <span className="font-bold text-cyan-300 block mb-0.5">Live Store Configuration:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Update your notification email and Reddit handle here. Changes immediately apply to all checkout orders and pre-filled Reddit DM links!
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Your Receiving Email (Where orders are delivered) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono">Every placed order dispatches order notifications to this email address.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Your Reddit Username (For customer DMs & Custom Requests) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Embarrassed_Page8733 or your username"
                  value={redditUsername}
                  onChange={(e) => setRedditUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono">Pre-populates the 1-click Reddit DM compose URL.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Currency Symbol
                  </label>
                  <select
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Developer Mode Security PIN (Only you know this)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={devPin}
                    onChange={(e) => setDevPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Used with <kbd className="bg-white/10 px-1 py-0.2 rounded font-mono text-slate-200">Ctrl + Shift + D</kbd> to unlock your private management controls.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] transition flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <Check className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </button>

            </form>
          )}

          {/* TAB 4: CHECKOUT FIELDS & REQUIREMENTS CONFIGURATOR */}
          {activeTab === 'checkout' && (
            <form onSubmit={handleSaveCheckoutSettings} className="space-y-5 max-w-3xl mx-auto">
              
              {checkoutSaved && (
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl font-bold flex items-center gap-2 font-mono">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Checkout fields configuration updated and live on storefront!</span>
                </div>
              )}

              {/* Instructions Banner */}
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-bold font-mono">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Customizable Checkout Form & Field Rules</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                  Control exactly what appears when customers click <strong>Proceed to Checkout</strong>.
                  Toggle <strong>Show Field</strong> to enable/disable fields, and tick <strong>Required (*)</strong> to enforce mandatory completion before order submission.
                </p>
              </div>

              {/* Account Password Feature Callout */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold font-mono">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Account Password / Access PIN Feature</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Selling subscriptions where you need to log into the customer&apos;s account to upgrade them (e.g. Netflix, YouTube Premium, Coursera, or Canva)?
                  Ensure <strong>Account Password / Access PIN</strong> is toggled to <strong>Show Field</strong> and tick <strong>Required (*)</strong>.
                  Customers will see a secure password input with show/hide toggle. All submitted passwords appear in your <strong>Customer Orders</strong> tab with 1-click copy.
                </p>
              </div>

              {/* Field Config List */}
              <div className="space-y-3.5">
                {[
                  {
                    key: 'accountPassword' as const,
                    title: 'Account Password / Access PIN',
                    badge: 'Sensitive Credential',
                    badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
                    icon: KeyRound,
                    description: 'Allows customer to provide their account password/PIN if activation requires logging into their account.',
                    isSensitive: true,
                  },
                  {
                    key: 'activationEmail' as const,
                    title: 'Account Email / ID for Activation',
                    badge: 'Activation Target',
                    badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
                    icon: Mail,
                    description: 'The email/ID where the subscription should be assigned (if different from delivery email).',
                  },
                  {
                    key: 'fullName' as const,
                    title: 'Customer Full Name',
                    badge: 'Customer Identity',
                    badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
                    icon: CheckCircle2,
                    description: 'Full name for invoice, warranty record, and greeting.',
                  },
                  {
                    key: 'deliveryEmail' as const,
                    title: 'Delivery Email Address',
                    badge: 'Receipt & Delivery',
                    badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
                    icon: Mail,
                    description: 'Primary email address where order receipt and delivery links will be sent.',
                  },
                  {
                    key: 'redditUsername' as const,
                    title: 'Reddit Username',
                    badge: 'Reddit DM Flow',
                    badgeColor: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
                    icon: MessageSquare,
                    description: 'Reddit handle to pre-fill 1-click Reddit DM compose button and verify buyer identity.',
                  },
                  {
                    key: 'telegramOrWhatsapp' as const,
                    title: 'Telegram or WhatsApp',
                    badge: 'Instant Messaging',
                    badgeColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
                    icon: Phone,
                    description: 'Alternative direct contact channel for fast fulfillment coordination.',
                  },
                  {
                    key: 'paymentNotes' as const,
                    title: 'Payment Method & Order Notes',
                    badge: 'Payment Preference',
                    badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
                    icon: DollarSign,
                    description: 'Customer preferred payment method (Crypto, PayPal, CashApp, UPI) and special notes.',
                  },
                  {
                    key: 'customField' as const,
                    title: 'Custom Order Requirement',
                    badge: 'Customizable Field',
                    badgeColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
                    icon: FileText,
                    description: 'Any extra custom requirement (e.g., Discord Tag, Country/Region, Profile Name).',
                  },
                ].map((f) => (
                  <div
                    key={f.key}
                    className={`p-4 rounded-2xl border transition ${
                      checkoutForm[f.key].enabled
                        ? f.isSensitive
                          ? 'bg-amber-500/[0.04] border-amber-500/30'
                          : 'bg-white/[0.03] border-white/[0.08]'
                        : 'bg-white/[0.01] border-white/[0.04] opacity-60'
                    }`}
                  >
                    {/* Header with Title, Badge, and Checkboxes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl border mt-0.5 ${f.badgeColor}`}>
                          <f.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-sm text-white">
                              {f.title}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                              {f.badge}
                            </span>
                            {checkoutForm[f.key].required && checkoutForm[f.key].enabled && (
                              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-full">
                                * Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-sans">
                            {f.description}
                          </p>
                        </div>
                      </div>

                      {/* Controls: Enable & Required */}
                      <div className="flex items-center gap-4 shrink-0 bg-white/[0.03] border border-white/[0.08] p-2 rounded-xl">
                        <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={checkoutForm[f.key].enabled}
                            onChange={(e) => handleUpdateCheckoutField(f.key, 'enabled', e.target.checked)}
                            className="w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20 focus:ring-cyan-500 cursor-pointer"
                          />
                          <span className={checkoutForm[f.key].enabled ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                            Show Field
                          </span>
                        </label>

                        <div className="w-px h-5 bg-white/10" />

                        <label className={`flex items-center gap-2 text-xs font-mono select-none ${
                          checkoutForm[f.key].enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                        }`}>
                          <input
                            type="checkbox"
                            disabled={!checkoutForm[f.key].enabled}
                            checked={checkoutForm[f.key].required}
                            onChange={(e) => handleUpdateCheckoutField(f.key, 'required', e.target.checked)}
                            className="w-4 h-4 rounded text-rose-500 bg-black/40 border-white/20 focus:ring-rose-500 cursor-pointer"
                          />
                          <span className={checkoutForm[f.key].required ? 'text-rose-300 font-bold' : 'text-slate-400'}>
                            Required (*)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Inputs when enabled */}
                    {checkoutForm[f.key].enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
                        <div>
                          <label className="text-[11px] font-mono text-slate-400 block mb-1">
                            Field Label
                          </label>
                          <input
                            type="text"
                            value={checkoutForm[f.key].label}
                            onChange={(e) => handleUpdateCheckoutField(f.key, 'label', e.target.value)}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-400 block mb-1">
                            Placeholder Text
                          </label>
                          <input
                            type="text"
                            value={checkoutForm[f.key].placeholder}
                            onChange={(e) => handleUpdateCheckoutField(f.key, 'placeholder', e.target.value)}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-slate-400 block mb-1">
                            Helper / Subtext
                          </label>
                          <input
                            type="text"
                            value={checkoutForm[f.key].helperText || ''}
                            onChange={(e) => handleUpdateCheckoutField(f.key, 'helperText', e.target.value)}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white outline-none font-sans"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Checkout Notice Banner Editor */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Checkout Information Banner Text</span>
                  <span className="text-[10px] font-mono text-slate-500">Displayed at top of checkout modal</span>
                </label>
                <textarea
                  rows={3}
                  value={checkoutForm.checkoutNoticeText || ''}
                  onChange={(e) => setCheckoutForm((prev) => ({ ...prev, checkoutNoticeText: e.target.value }))}
                  placeholder="Instructions displayed to customers when opening checkout..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-cyan-500 text-white text-xs outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition flex items-center justify-center gap-2 cursor-pointer font-mono"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Checkout Configuration</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCheckoutDefaults}
                  className="w-full sm:w-auto px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Default Fields</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 5: RECENT ORDERS WITH CREDENTIALS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Package className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-bold text-slate-300">No customer orders placed yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-mono">
                    Place a test order from the storefront cart to see incoming customer credentials, passwords, and details here!
                  </p>
                </div>
              ) : (
                orders.map((ord) => {
                  const summaryText = [
                    `📦 SUBPRIME ORDER #${ord.orderId}`,
                    `Date: ${new Date(ord.createdAt).toLocaleString()}`,
                    `Customer: ${ord.customer.fullName}`,
                    `Delivery Email: ${ord.customer.email}`,
                    `Activation Target: ${ord.customer.activationEmailOrAccount || ord.customer.email}`,
                    ord.customer.accountPassword ? `Account Password: ${ord.customer.accountPassword}` : null,
                    ord.customer.redditUsername ? `Reddit: u/${ord.customer.redditUsername.replace(/^u\//, '')}` : null,
                    ord.customer.telegramOrWhatsapp ? `Telegram/WhatsApp: ${ord.customer.telegramOrWhatsapp}` : null,
                    ord.customer.customFieldValue ? `Custom Detail: ${ord.customer.customFieldValue}` : null,
                    ord.customer.notes ? `Payment / Notes: ${ord.customer.notes}` : null,
                    ``,
                    `Items Ordered:`,
                    ...ord.items.map((it) => `• ${it.productTitle} (${it.planLabel}) x${it.quantity} - ${settings.currencySymbol}${it.price}`),
                    `Total: ${settings.currencySymbol}${ord.totalAmount.toFixed(2)}`
                  ].filter(Boolean).join('\n');

                  return (
                    <div 
                      key={ord.orderId} 
                      className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0c101c] space-y-3.5 text-xs shadow-xl"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-white text-base">
                            Order #{ord.orderId}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                            {ord.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleCopyCredential(summaryText, `order-${ord.orderId}`)}
                            className="px-2.5 py-1 text-[11px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-slate-300 flex items-center gap-1 font-mono transition"
                            title="Copy complete order summary to clipboard"
                          >
                            {copiedCredential === `order-${ord.orderId}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Summary Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-cyan-400" />
                                <span>Copy Summary</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Customer Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-slate-300 font-mono text-xs">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <span className="text-[10px] text-slate-500 uppercase block font-bold">Customer Name</span>
                          <span className="text-white font-bold">{ord.customer.fullName}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block font-bold">Delivery Email</span>
                            <span className="text-white break-all">{ord.customer.email}</span>
                          </div>
                          <button
                            onClick={() => handleCopyCredential(ord.customer.email, `email-${ord.orderId}`)}
                            className="p-1 hover:text-cyan-400 transition ml-1"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-cyan-400 uppercase block font-bold">Activation Target</span>
                            <span className="text-cyan-200 font-bold break-all">
                              {ord.customer.activationEmailOrAccount || ord.customer.email}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopyCredential(ord.customer.activationEmailOrAccount || ord.customer.email, `act-${ord.orderId}`)}
                            className="p-1 hover:text-cyan-400 transition ml-1"
                            title="Copy activation target"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {ord.customer.redditUsername && (
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-[10px] text-orange-400 uppercase block font-bold">Reddit Username</span>
                            <a 
                              href={`https://www.reddit.com/user/${ord.customer.redditUsername.replace(/^u\//, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-300 hover:underline flex items-center gap-1 font-bold"
                            >
                              <span>u/{ord.customer.redditUsername.replace(/^u\//, '')}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {ord.customer.telegramOrWhatsapp && (
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-sky-400 uppercase block font-bold">Telegram / WhatsApp</span>
                              <span className="text-sky-200 font-bold">{ord.customer.telegramOrWhatsapp}</span>
                            </div>
                            <button
                              onClick={() => handleCopyCredential(ord.customer.telegramOrWhatsapp || '', `chat-${ord.orderId}`)}
                              className="p-1 hover:text-sky-400 transition ml-1"
                              title="Copy handle"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {ord.customer.customFieldValue && (
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <span className="text-[10px] text-pink-400 uppercase block font-bold">Custom Requirement</span>
                            <span className="text-pink-200">{ord.customer.customFieldValue}</span>
                          </div>
                        )}
                      </div>

                      {/* Account Password Highlight Box (If provided by customer) */}
                      {ord.customer.accountPassword && (
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                              <KeyRound className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block">
                                Customer Account Password / Access PIN
                              </span>
                              <span className="font-mono text-sm text-white font-black tracking-widest">
                                {revealedPasswords[ord.orderId] ? ord.customer.accountPassword : '••••••••••••'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setRevealedPasswords((prev) => ({ ...prev, [ord.orderId]: !prev[ord.orderId] }))}
                              className="px-2.5 py-1.5 text-xs bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl text-slate-300 flex items-center gap-1.5 font-mono transition cursor-pointer"
                            >
                              {revealedPasswords[ord.orderId] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{revealedPasswords[ord.orderId] ? 'Hide' : 'Reveal'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyCredential(ord.customer.accountPassword || '', `pass-${ord.orderId}`)}
                              className="px-3 py-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-amber-300 flex items-center gap-1.5 font-mono font-bold transition cursor-pointer"
                            >
                              {copiedCredential === `pass-${ord.orderId}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Password</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Payment Notes if any */}
                      {ord.customer.notes && (
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
                          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-0.5">
                            Customer Payment Notes / Preference:
                          </span>
                          <p className="text-slate-300 font-sans italic">{ord.customer.notes}</p>
                        </div>
                      )}

                      {/* Ordered Items Breakdown */}
                      <div className="border-t border-white/[0.06] pt-3">
                        <div className="font-mono font-bold text-slate-400 text-[11px] mb-2 uppercase">
                          Purchased Items:
                        </div>
                        <div className="space-y-1.5">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/[0.02]">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold">{item.productTitle}</span>
                                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.2 rounded border border-cyan-800/40">
                                  {item.planLabel}
                                </span>
                                <span className="text-slate-400 font-mono">x{item.quantity}</span>
                              </div>
                              <span className="font-mono font-bold text-slate-200">
                                {settings.currencySymbol}{item.price}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            {settings.redditUsername && (
                              <a
                                href={buildRedditDmUrl(settings.redditUsername, ord, settings)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-[#FF4500]/15 hover:bg-[#FF4500]/25 border border-[#FF4500]/30 rounded-xl text-orange-300 font-mono text-[11px] font-bold flex items-center gap-1.5 transition"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Open Pre-filled Reddit DM</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${ord.customer.email}?subject=${encodeURIComponent(`SubPrime Store - Order #${ord.orderId} Delivery`)}`}
                              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-slate-300 font-mono text-[11px] flex items-center gap-1.5 transition"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Customer</span>
                            </a>
                          </div>

                          <div className="font-display font-extrabold text-white text-sm">
                            Total: <span className="text-cyan-400">{settings.currencySymbol}{ord.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
