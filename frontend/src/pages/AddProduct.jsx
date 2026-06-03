import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/client';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'מזווה',
    unit: '',
    quantity: 0,
    expiry_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await addProduct(formData);
      navigate('/');
    } catch (err) {
      console.error('Error adding product:', err);
      setError('שגיאה בהוספת המוצר. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground text-center">הוספת מוצר חדש</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-8 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block font-medium">שם מוצר</label>
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right" 
            placeholder="לדוגמה: חלב 3%" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">קטגוריה</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
            >
              <option value="מזווה">מזווה</option>
              <option value="מקרר">מקרר</option>
              <option value="ירקות ופירות">ירקות ופירות</option>
              <option value="בשר ודגים">בשר ודגים</option>
              <option value="אחר">אחר</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-medium">יחידה</label>
            <input 
              type="text" 
              name="unit"
              required
              value={formData.unit}
              onChange={handleChange}
              className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right" 
              placeholder="יחידות, ק''ג, ליטר..." 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">כמות התחלתית</label>
            <input 
              type="number" 
              name="quantity"
              required
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right" 
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">תאריך תפוגה (אופציונלי)</label>
            <input 
              type="date" 
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors mt-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'שומר...' : 'שמירת מוצר'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
