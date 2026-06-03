import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './db/index.js';

/**
 * CkStock Demo Seed Script
 * Creates sample data for demo/development purposes
 * - 1 tenant with admin user
 * - 10 sample products across categories
 * - 4 suppliers
 * - Price entries for products
 */

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function uuid() {
  return crypto.randomUUID();
}

console.log('🌱 Seeding CkStock demo data...\n');

// ─── Tenant & User ───────────────────────────────────────────
const tenantId = 'demo-tenant-001';
const userId = uuid();
const passwordHash = bcrypt.hashSync('demo1234', 10);

// Insert tenant user (in a real system, tenants would have their own setup)
query(
  `INSERT OR IGNORE INTO users (id, email, password_hash, tenant_id, role)
   VALUES (${esc(userId)}, ${esc('admin@ckstock.co.il')}, ${esc(passwordHash)}, ${esc(tenantId)}, ${esc('admin')})`
);
console.log('✅ User: admin@ckstock.co.il / demo1234');

// ─── Products ────────────────────────────────────────────────
const products = [
  { name: 'קמח לבן 5 ק"ג', category: 'מזון יבש', quantity: 45, unit: 'יחידה', expiry_date: '2026-06-15', status: 'in_stock' },
  { name: 'שמן זית כתית 750 מ"ל', category: 'מזון יבש', quantity: 3, unit: 'בקבוק', expiry_date: '2025-12-01', status: 'low' },
  { name: 'קופסאות קרטון 40x30', category: 'אריזה', quantity: 200, unit: 'יחידה', expiry_date: '', status: 'in_stock' },
  { name: 'סוכר לבן 1 ק"ג', category: 'מזון יבש', quantity: 0, unit: 'ק"ג', expiry_date: '2026-03-10', status: 'out_of_stock' },
  { name: 'שקיות ניילון 30x40', category: 'אריזה', quantity: 500, unit: 'יחידה', expiry_date: '', status: 'in_stock' },
  { name: 'נייר טואלט (חבילה 12 יחידות)', category: 'ניקיון', quantity: 8, unit: 'חבילה', expiry_date: '', status: 'low' },
  { name: 'חלב עמיד 1 ליטר', category: 'מזון קר', quantity: 24, unit: 'קרטון', expiry_date: '2025-09-20', status: 'in_stock' },
  { name: 'ביצים (מארז 12)', category: 'מזון קר', quantity: 15, unit: 'מארז', expiry_date: '2025-08-05', status: 'in_stock' },
  { name: 'אבקת כביסה 3 ק"ג', category: 'ניקיון', quantity: 2, unit: 'ק"ג', expiry_date: '', status: 'low' },
  { name: 'מפיות נייר (חבילה 100)', category: 'ניקיון', quantity: 60, unit: 'חבילה', expiry_date: '', status: 'in_stock' },
];

const productIds = [];
const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

for (const p of products) {
  const pid = uuid();
  productIds.push(pid);
  query(
    `INSERT INTO products (id, name, category, quantity, unit, status, expiry_date, tenant_id, created_at)
     VALUES (${esc(pid)}, ${esc(p.name)}, ${esc(p.category)}, ${p.quantity}, ${esc(p.unit)}, ${esc(p.status)}, ${esc(p.expiry_date)}, ${esc(tenantId)}, ${esc(now)})`
  );
}
console.log(`✅ ${products.length} products created`);

// ─── Suppliers ───────────────────────────────────────────────
const suppliers = [
  { name: 'ספקית מזון בע"מ', contact: 'טלפון: 03-1234567, דוא"ל: info@food-supplier.co.il' },
  { name: 'חברה לאריזות ישראל', contact: 'טלפון: 08-9876543, דוא"ל: sales@packaging.co.il' },
  { name: 'ניקיון ובשמים בע"מ', contact: 'טלפון: 09-5551234, דוא"ל: order@clean.co.il' },
  { name: 'משק ארגמן - תוצרת חקלאית', contact: 'טלפון: 052-1112233, דוא"ל: argaman@farm.co.il' },
];

const supplierIds = [];
for (const s of suppliers) {
  const sid = uuid();
  supplierIds.push(sid);
  query(
    `INSERT INTO suppliers (id, name, contact, tenant_id)
     VALUES (${esc(sid)}, ${esc(s.name)}, ${esc(s.contact)}, ${esc(tenantId)})`
  );
}
console.log(`✅ ${suppliers.length} suppliers created`);

// ─── Supplier Prices ─────────────────────────────────────────
const priceEntries = [
  // קמח (product 0) - prices from supplier 0 and supplier 3
  { product_idx: 0, supplier_idx: 0, price: 12.90 },
  { product_idx: 0, supplier_idx: 3, price: 11.50 },
  { product_idx: 0, supplier_idx: 1, price: 14.00 },
  // שמן זית (product 1)
  { product_idx: 1, supplier_idx: 0, price: 42.00 },
  { product_idx: 1, supplier_idx: 3, price: 38.90 },
  // קופסאות קרטון (product 2)
  { product_idx: 2, supplier_idx: 1, price: 4.50 },
  { product_idx: 2, supplier_idx: 0, price: 5.20 },
  // סוכר (product 3)
  { product_idx: 3, supplier_idx: 0, price: 8.90 },
  { product_idx: 3, supplier_idx: 3, price: 7.80 },
  // שקיות ניילון (product 4)
  { product_idx: 4, supplier_idx: 1, price: 0.35 },
  { product_idx: 4, supplier_idx: 2, price: 0.40 },
  // נייר טואלט (product 5)
  { product_idx: 5, supplier_idx: 2, price: 29.90 },
  { product_idx: 5, supplier_idx: 1, price: 32.00 },
  // חלב (product 6)
  { product_idx: 6, supplier_idx: 0, price: 7.20 },
  { product_idx: 6, supplier_idx: 3, price: 6.80 },
  // ביצים (product 7)
  { product_idx: 7, supplier_idx: 3, price: 15.90 },
  { product_idx: 7, supplier_idx: 0, price: 16.50 },
  // אבקת כביסה (product 8)
  { product_idx: 8, supplier_idx: 2, price: 34.50 },
  { product_idx: 8, supplier_idx: 0, price: 36.00 },
  // מפיות (product 9)
  { product_idx: 9, supplier_idx: 1, price: 18.90 },
  { product_idx: 9, supplier_idx: 2, price: 22.00 },
];

const priceDate = now;
for (const pe of priceEntries) {
  const prid = uuid();
  query(
    `INSERT INTO supplier_prices (id, product_id, supplier_id, price, date, tenant_id)
     VALUES (${esc(prid)}, ${esc(productIds[pe.product_idx])}, ${esc(supplierIds[pe.supplier_idx])}, ${pe.price}, ${esc(priceDate)}, ${esc(tenantId)})`
  );
}
console.log(`✅ ${priceEntries.length} price entries created`);

console.log('\n🎉 Seeding complete!');
console.log('──────────────────────────');
console.log('Login: admin@ckstock.co.il');
console.log('Password: demo1234');
console.log('Tenant: demo-tenant-001');