import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from '../src/data/defaultProducts';

const SUPABASE_URL = 'https://qfracmtespfenfafjfok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcmFjbXRlc3BmZW5mYWZqZm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MDM5MTgsImV4cCI6MjEwNzQ3OTkxOH0.1hi0jMzZGr4FWUfVp_eHkNNuJZkYy0pAaBPdYRUSRAc';

async function seed() {
  console.log(`Starting Supabase seed with ${DEFAULT_PRODUCTS.length} products...`);

  // 1. Seed products
  const rows = DEFAULT_PRODUCTS.map((prod) => ({
    id: prod.id,
    data: prod,
    updated_at: new Date().toISOString()
  }));

  const prodRes = await fetch(`${SUPABASE_URL}/rest/v1/store_products`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(rows)
  });

  if (!prodRes.ok) {
    const errText = await prodRes.text();
    console.error('Failed to seed products:', prodRes.status, errText);
    return;
  }
  console.log(`Successfully seeded ${rows.length} products to Supabase!`);

  // 2. Seed settings
  const settingsRow = {
    id: 'main',
    data: {
      ...DEFAULT_SETTINGS,
      developerPin: '022005',
      redditUsername: 'Embarrassed_Page8733'
    },
    updated_at: new Date().toISOString()
  };

  const setRes = await fetch(`${SUPABASE_URL}/rest/v1/store_settings`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(settingsRow)
  });

  if (!setRes.ok) {
    const errText = await setRes.text();
    console.error('Failed to seed settings:', setRes.status, errText);
    return;
  }
  console.log('Successfully seeded store settings to Supabase!');
}

seed();
