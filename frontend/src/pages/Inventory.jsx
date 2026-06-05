import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileDown, SlidersHorizontal } from 'lucide-react';
import InventoryTable from '../components/InventoryTable';
import { getProducts } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
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
        setError('שגיאה בטעינת המלאי');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">ניהול מלאי</h1>
          <p className="text-muted-foreground mt-1 font-medium">ניהול רשימת מוצרים, כמויות וסטטוס</p>
        </div>
        
        <div className="flex space-x-3 space-x-reverse w-full md:w-auto">
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-border dark:border-white/10 text-foreground px-5 py-3 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          >
            <FileDown size={20} />
            <span>ייצוא דוח</span>
          </button>
          <button 
            onClick={() => navigate('/add-product')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 gradient-primary text-white px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus size={20} />
            <span>הוספת מוצר</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 border-none shadow-glass flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="חיפוש לפי שם, קטגוריה או מזהה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" size={18} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl py-3 pr-11 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none min-w-[180px] text-foreground font-semibold"
            >
              <option value="all">כל הקטגוריות</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-none shadow-glass">
        <InventoryTable 
          products={filteredProducts} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Inventory;
