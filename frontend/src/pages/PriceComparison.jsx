import React, { useState, useEffect } from 'react';
import { getProducts, getPriceComparisons } from '../api/client';
import { cn } from '../lib/utils';

const PriceComparison = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      setComparisons([]);
      return;
    }

    const fetchComparisons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPriceComparisons(selectedProduct);
        // data: { product, prices: [ { supplier_name, price, date, ... } ], bestPrice }
        setComparisons(data.prices || data);
      } catch (err) {
        console.error('Error fetching comparisons:', err);
        setError('המידע מתעדכן כעת, אנא המתן רגע');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisons();
  }, [selectedProduct]);

  const minPrice = comparisons.length > 0 
    ? Math.min(...comparisons.map(c => c.price))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">השוואת מחירי רכש</h1>
        
        <div className="w-64">
          <select 
            className="w-full border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">בחר מוצר להשוואה...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
          <p className="text-gray-500">טוען השוואות מחירים...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      ) : selectedProduct && comparisons.length > 0 ? (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="p-4 font-semibold text-gray-600">ספק</th>
                <th className="p-4 font-semibold text-gray-600">מחיר</th>
                <th className="p-4 font-semibold text-gray-600">תאריך עדכון</th>
                <th className="p-4 font-semibold text-gray-600">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp, idx) => (
                <tr 
                  key={idx} 
                  className={cn(
                    "border-b border-border transition-colors",
                    comp.price === minPrice ? "bg-green-50" : "hover:bg-gray-50"
                  )}
                >
                  <td className="p-4 font-medium">{comp.supplier_name}</td>
                  <td className="p-4">₪{comp.price.toFixed(2)}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(comp.date).toLocaleDateString('he-IL')}
                  </td>
                  <td className="p-4">
                    {comp.price === minPrice && (
                      <span className="px-2 py-1 bg-success text-white rounded text-xs font-bold">
                        הזול ביותר
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedProduct ? (
        <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
          <p className="text-gray-500">לא נמצאו מחירי ספקים עבור מוצר זה</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg border-dashed">
          <p className="text-gray-400 font-medium text-lg">בחר מוצר מהרשימה כדי לראות השוואת מחירים</p>
        </div>
      )}
    </div>
  );
};

export default PriceComparison;
