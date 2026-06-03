const API_URL = 'http://localhost:3001/api';

/** Get stored auth token */
function getToken() {
  const t = localStorage.getItem('ckstock_token');
  return t || '';
}

/** Set auth token */
function setToken(token) {
  if (token) localStorage.setItem('ckstock_token', token);
  else localStorage.removeItem('ckstock_token');
}

/** Build fetch options with auth headers */
function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export const api = { getToken, setToken };

export const getProducts = async () => {
  const response = await authFetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('שגיאה בטעינת המוצרים');
  }
  const data = await response.json();
  return data.products || data;
};

export const addProduct = async (product) => {
  const response = await authFetch(`${API_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('שגיאה בהוספת המוצר');
  }
  return response.json();
};

export const updateProduct = async (id, product) => {
  const response = await authFetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('שגיאה בעדכון המוצר');
  }
  return response.json();
};

export const getSuppliers = async () => {
  const response = await authFetch(`${API_URL}/suppliers`);
  if (!response.ok) {
    throw new Error('שגיאה בטעינת הספקים');
  }
  const data = await response.json();
  return data.suppliers || data;
};

export const getPriceComparisons = async (productId) => {
  const response = await authFetch(`${API_URL}/prices/${productId}`);
  if (!response.ok) {
    throw new Error('שגיאה בטעינת השוואת המחירים');
  }
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'שגיאה בכניסה למערכת. בדוק את פרטי ההתחברות.');
  }
  const data = await response.json();
  // Store token automatically
  if (data.token) setToken(data.token);
  return data;
};
