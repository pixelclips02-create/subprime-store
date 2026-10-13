import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, StoreSettings, PlacedOrder } from '../types';

// Storage key to allow storing credentials locally if not in .env
const SUPABASE_CONFIG_KEY = 'substore_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  // 1. Try Vite environment variables (Vercel)
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  // 2. Try localStorage (configured via Developer Mode)
  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch (err) {
    console.warn('Error reading saved Supabase config:', err);
  }

  return { url: '', anonKey: '' };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    // Reset client cache
    cachedClient = null;
  } catch (err) {
    console.error('Failed to save Supabase config to localStorage:', err);
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  try {
    cachedClient = createClient(url, anonKey);
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

/**
 * Fetch all products from Supabase store_products table
 */
export async function fetchCloudProducts(): Promise<Product[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('store_products')
      .select('id, data, updated_at');

    if (error) {
      console.warn('Error fetching products from Supabase:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => row.data as Product);
  } catch (err) {
    console.warn('Network error fetching cloud products:', err);
    return null;
  }
}

/**
 * Save / Upsert a single product to Supabase store_products table
 */
export async function saveCloudProduct(product: Product): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('store_products')
      .upsert({
        id: product.id,
        data: product,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving product to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error saving cloud product:', err);
    return false;
  }
}

/**
 * Delete a product from Supabase store_products table
 */
export async function deleteCloudProduct(productId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('store_products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error deleting cloud product:', err);
    return false;
  }
}

/**
 * Seed all current products to Supabase in bulk
 */
export async function seedCloudProducts(products: Product[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = products.map((p) => ({
      id: p.id,
      data: p,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client
      .from('store_products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Error seeding products to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error seeding cloud products:', err);
    return false;
  }
}

/**
 * Fetch store settings from Supabase store_settings table
 */
export async function fetchCloudSettings(): Promise<StoreSettings | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('store_settings')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error) {
      return null;
    }

    return (data?.data as StoreSettings) || null;
  } catch (err) {
    return null;
  }
}

/**
 * Save store settings to Supabase store_settings table
 */
export async function saveCloudSettings(settings: StoreSettings): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('store_settings')
      .upsert({
        id: 'main',
        data: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving settings to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error saving cloud settings:', err);
    return false;
  }
}

/**
 * Fetch orders from Supabase store_orders table
 */
export async function fetchCloudOrders(): Promise<PlacedOrder[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('store_orders')
      .select('data')
      .order('created_at', { ascending: false });

    if (error) return null;
    if (!data) return [];

    return data.map((r: any) => r.data as PlacedOrder);
  } catch (err) {
    return null;
  }
}

/**
 * Save order to Supabase store_orders table
 */
export async function saveCloudOrder(order: PlacedOrder): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('store_orders')
      .upsert({
        id: order.orderId,
        data: order,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving order to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Network error saving cloud order:', err);
    return false;
  }
}
