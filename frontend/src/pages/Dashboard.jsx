import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryTable from '../components/InventoryTable';
import { getProducts } from '../api/client';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('המידע מתעדכן כעת, אנא המתן רגע');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">דשבורד מלאי</h1>
        <div className="flex space-x-4 space-x-reverse">
          <button 
            onClick={() => navigate('/add-product')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            הוספת מוצר חדש
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            השוואת מחירי רכש
          </button>
        </div>
      </div>
      
      <InventoryTable 
        products={products} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default Dashboard;
