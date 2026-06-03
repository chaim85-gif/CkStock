import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * - Extracts user info from JWT token
 * - Attaches tenant_id to req.tenant (NEVER exposed to user)
 * - Returns friendly error messages only
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'יש להתחבר למערכת' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ckstock-dev-jwt-secret-2024');
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenant_id: decoded.tenant_id,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'התחברות פגה, יש להתחבר מחדש' });
  }
}

/**
 * Tenant isolation middleware
 * Ensures ALL queries are scoped to the authenticated user's tenant
 * Must be used AFTER authenticate
 */
export function tenantScope(req, res, next) {
  if (!req.user || !req.user.tenant_id) {
    return res.status(401).json({ message: 'יש להתחבר למערכת' });
  }
  req.tenantId = req.user.tenant_id;
  next();
}