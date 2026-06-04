import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Calendar, Plus, BarChart2 } from 'lucide-react';
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

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.status === 'low' || p.status === 'מלאי נמוך').length,
    expiring: products.filter(p => {
      if (!p.expiry_date) return false;
      const expiry = new Date(p.expiry_date);
      const now = new Date();
      const diff = expiry - now;
      const days = diff / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30; // Next 30 days
    }).length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">ניהול מלאי</h1>
          <p className="text-gray-500 mt-1">סקירה כללית ועדכוני סטטוס בזמן אמת</p>
        </div>
        
        <div className="flex space-x-3 space-x-reverse w-full md:w-auto">
          <button 
            onClick={() => navigate('/add-product')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
            <Plus size={20} />
            <span>הוספת מוצר חדש</span>
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95"
          >
            <BarChart2 size={20} />
            <span>השוואת מחירי רכש</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">סה"כ פריטים במלאי</p>
            <p className="text-3xl font-black text-foreground">{isLoading ? '...' : stats.total}</p>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-warning">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">התראות מלאי נמוך</p>
            <p className="text-3xl font-black text-warning">{isLoading ? '...' : stats.lowStock}</p>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-success">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">פריטים עם תפוגה קרובה</p>
            <p className="text-3xl font-black text-success">{isLoading ? '...' : stats.expiring}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-bold text-foreground">רשימת מלאי מפורטת</h2>
           <span className="text-sm text-gray-400 font-medium">{stats.total} פריטים נמצאו</span>
        </div>
        <InventoryTable 
          products={products} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
