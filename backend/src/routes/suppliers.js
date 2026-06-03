import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

/**
 * GET /api/suppliers
 * List all suppliers for the current tenant
 */
router.get('/', (req, res) => {
  try {
    const suppliers = query(
      `SELECT id, name, contact FROM suppliers
       WHERE tenant_id = ${esc(req.tenantId)}
       ORDER BY name ASC`
    );

    res.json({ suppliers });
  } catch (err) {
    console.error('Suppliers list error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * POST /api/suppliers
 * Add a new supplier
 */
router.post('/', (req, res) => {
  try {
    const { name, contact } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'נא להזין שם ספק' });
    }

    const id = crypto.randomUUID();

    query(
      `INSERT INTO suppliers (id, name, contact, tenant_id)
       VALUES (${esc(id)}, ${esc(name.trim())}, ${esc(contact || '')}, ${esc(req.tenantId)})`
    );

    const supplier = query(
      `SELECT id, name, contact FROM suppliers WHERE id = ${esc(id)}`
    );

    res.status(201).json({ supplier: supplier[0], message: 'הספק נוסף בהצלחה' });
  } catch (err) {
    console.error('Supplier create error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

/**
 * PUT /api/suppliers/:id
 * Update supplier details
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact } = req.body;

    const existing = query(
      `SELECT id FROM suppliers WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'הספק לא נמצא' });
    }

    const updates = [];
    if (name !== undefined) updates.push(`name = ${esc(name.trim())}`);
    if (contact !== undefined) updates.push(`contact = ${esc(contact)}`);

    if (updates.length > 0) {
      query(
        `UPDATE suppliers SET ${updates.join(', ')} WHERE id = ${esc(id)} AND tenant_id = ${esc(req.tenantId)}`
      );
    }

    const supplier = query(
      `SELECT id, name, contact FROM suppliers WHERE id = ${esc(id)}`
    );

    res.json({ supplier: supplier[0], message: 'הספק עודכן בהצלחה' });
  } catch (err) {
    console.error('Supplier update error:', err.message);
    res.status(500).json({ message: 'המידע מתעדכן כעת, אנא המתן רגע' });
  }
});

export default router;