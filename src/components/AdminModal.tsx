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
  KeyRound
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryId, PlanOption } from '../types';
import { CATEGORIES } from '../data/defaultProducts';

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

  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'edit' | 'settings' | 'orders'>('inventory');
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
      tags: [newCategory, newTitle.toLowerCase()]
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
      activationType: editActivationType
    });

    setEditSuccess(`Updated "${editTitle}" pricing and details!`);
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
        <div className="flex border-b border-white/[0.08] bg-[#080a12] px-4 font-mono">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 ${
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
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 ${
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
              className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 ${
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
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 ${
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
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Recent Orders ({orders.length})</span>
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
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Settings saved successfully!</span>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold">Live Configuration:</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Update your notification email and Reddit handle here. Changes immediately apply to all checkout orders and pre-filled Reddit DM links!
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Your Receiving Email (Where orders are delivered) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your-email@example.com"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span className="text-[10px] text-gray-500">Every placed order will dispatch order notifications to this email address.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Your Reddit Username (For customer DMs & Custom Requests) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="SubPrimeOfficial or your username"
                  value={redditUsername}
                  onChange={(e) => setRedditUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span className="text-[10px] text-gray-500">Pre-populates the 1-click Reddit DM compose URL.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Currency Symbol
                  </label>
                  <select
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Developer Mode Security PIN (Only you know this)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={devPin}
                    onChange={(e) => setDevPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-gray-500">
                  Used with <kbd className="bg-gray-100 px-1 py-0.2 rounded font-mono">Ctrl + Shift + D</kbd> to unlock your private management controls.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Store Configuration</span>
              </button>

            </form>
          )}

          {/* TAB 4: RECENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-700">No orders placed yet</p>
                  <p className="text-xs text-gray-500">
                    Place a test order from the storefront cart to see incoming records here!
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.orderId} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="font-extrabold text-gray-900 text-sm">
                        Order #{ord.orderId}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                      <div>
                        <strong>Customer:</strong> {ord.customer.fullName} ({ord.customer.email})
                      </div>
                      <div>
                        <strong>Reddit:</strong> {ord.customer.redditUsername || 'None'}
                      </div>
                      <div>
                        <strong>Activation Target:</strong> {ord.customer.activationEmailOrAccount || ord.customer.email}
                      </div>
                      <div>
                        <strong>Time:</strong> {new Date(ord.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <div className="font-bold text-gray-900 mb-1">Ordered Items:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                        {ord.items.map((item, idx) => (
                          <li key={idx}>
                            {item.productTitle} ({item.planLabel}) x{item.quantity} - {settings.currencySymbol}{item.price}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 font-black text-gray-900 text-right">
                        Total: {settings.currencySymbol}{ord.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
