import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

/**
 * GET /api/prices/:productId
 * Get price comparisons from all suppliers for a specific product
 */
router.get('/:productId', (req, res) => {
  try {
    const { productId } = req.params;

    // Get the product
    const products = query(
      `SELECT id, name, category, quantity, unit FROM products
       WHERE id = ${esc(productId)} AND tenant_id = ${esc(req.tenantId)}`
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'המוצר לא נמצא' });
    }

    // Get latest prices per supplier for this product
    const prices = query(
      `SELECT sp.id, sp.price, sp.date, s.id as supplier_id, s.name as supplier_name, s.contact
       FROM supplier_prices sp
       JOIN suppliers s ON sp.supplier_id = s.id
       WHERE sp.product_id = ${esc(productId)}
         AND sp.tenant_id = ${esc(req.tenantId)}
         AND s.tenant_id = ${esc(req.tenantId)}
       ORDER BY sp.price ASC`
    );

    // Find the best (lowest) price
    let bestPrice = null;
    if (prices.length > 0) {
      bestPrice = prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0]);
    }

    res.json({
      product: products[0],
      prices,
      bestPrice: bestPrice ? {
        supplier_name: bestPrice.supplier_name,
        price: bestPrice.price,
      } : null,
    });
  } catch (err) {
    console.error('Prices list error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * POST /api/prices
 * Add or update a supplier price for a product
 */
router.post('/', (req, res) => {
  try {
    const { product_id, supplier_id, price } = req.body;

    if (!product_id || !supplier_id || price === undefined) {
      return res.status(400).json({ message: 'נא להזין מוצר, ספק ומחיר' });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    query(
      `INSERT INTO supplier_prices (id, product_id, supplier_id, price, date, tenant_id)
       VALUES (${esc(id)}, ${esc(product_id)}, ${esc(supplier_id)}, ${parseFloat(price)}, ${esc(now)}, ${esc(req.tenantId)})`
    );

    const priceRecord = query(
      `SELECT sp.id, sp.price, sp.date, sp.product_id, sp.supplier_id,
              s.name as supplier_name
       FROM supplier_prices sp
       JOIN suppliers s ON sp.supplier_id = s.id
       WHERE sp.id = ${esc(id)}`
    );

    res.status(201).json({ price: priceRecord[0], message: 'המחיר נוסף בהצלחה' });
  } catch (err) {
    console.error('Price create error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

export default router;