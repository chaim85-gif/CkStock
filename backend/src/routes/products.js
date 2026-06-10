import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

/**
 * Helper to escape single quotes for SQLite
 */
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

/**
 * GET /api/products
 * List all products for the current tenant
 */
router.get('/', (req, res) => {
  try {
    const products = query(
      `SELECT id, name, category, quantity, unit, status, expiry_date, price, created_at
       FROM products
       WHERE tenant_id = ${esc(req.tenantId)}
       ORDER BY created_at DESC`
    );

    res.json({ products });
  } catch (err) {
    console.error('Products list error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * POST /api/products
 * Add a new product
 */
router.post('/', (req, res) => {
  try {
    const { name, category, quantity, unit, expiry_date, price } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'נא להזין שם מוצר' });
    }

    const id = crypto.randomUUID();
    const qty = parseInt(quantity, 10) || 0;
    const itemPrice = parseFloat(price) || 0;
    const units = unit || 'יחידה';

    // Auto-determine status based on quantity
    const status = qty <= 0 ? 'out_of_stock' : qty < 10 ? 'low' : 'in_stock';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    query(
      `INSERT INTO products (id, name, category, quantity, unit, status, expiry_date, price, tenant_id, created_at)
       VALUES (${esc(id)}, ${esc(name.trim())}, ${esc(category || '')}, ${qty}, ${esc(units)}, ${esc(status)}, ${esc(expiry_date || '')}, ${itemPrice}, ${esc(req.tenantId)}, ${esc(now)})`
    );

    const product = query(
      `SELECT id, name, category, quantity, unit, status, expiry_date, price, created_at
       FROM products WHERE id = ${esc(id)}`
    );

    res.status(201).json({ product: product[0], message: 'המוצר נוסף בהצלחה' });
  } catch (err) {
    console.error('Product create error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * PUT /api/products/:id
 * Update product quantity/status/fields
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, status, expiry_date, price } = req.body;

    // Verify product exists and belongs to tenant
    const existing = query(
      `SELECT * FROM products WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }

    const updates = [];
    if (name !== undefined) updates.push(`name = ${esc(name.trim())}`);
    if (category !== undefined) updates.push(`category = ${esc(category)}`);
    if (quantity !== undefined) {
      const qty = parseInt(quantity, 10) || 0;
      updates.push(`quantity = ${qty}`);
      // Auto-update status based on new quantity
      const newStatus = qty <= 0 ? 'out_of_stock' : qty < 10 ? 'low' : 'in_stock';
      updates.push(`status = ${esc(newStatus)}`);
    }
    if (unit !== undefined) updates.push(`unit = ${esc(unit)}`);
    if (status !== undefined) updates.push(`status = ${esc(status)}`);
    if (expiry_date !== undefined) updates.push(`expiry_date = ${esc(expiry_date)}`);
    if (price !== undefined) updates.push(`price = ${parseFloat(price) || 0}`);

    if (updates.length > 0) {
      query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`
      );
    }

    const product = query(
      `SELECT id, name, category, quantity, unit, status, expiry_date, price, created_at
       FROM products WHERE id = ${esc(id)}`
    );

    res.json({ product: product[0], message: 'המוצר עודכן בהצלחה' });
  } catch (err) {
    console.error('Product update error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = query(
      `SELECT id FROM products WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }

    query(`DELETE FROM supplier_prices WHERE product_id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`);
    query(`DELETE FROM products WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`);

    res.json({ message: 'המוצר נמחק בהצלחה' });
  } catch (err) {
    console.error('Product delete error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

export default router;