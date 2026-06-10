import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Calendar, Plus, BarChart2, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import InventoryTable from '../components/InventoryTable';
import { getProducts } from '../api/client';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    lowStock: products.filter(p => p.status === 'low' || p.status === 'מלאי נמוך' || p.status === 'out_of_stock').length,
    expiringProducts: products.filter(p => {
      if (!p.expiry_date) return false;
      const expiry = new Date(p.expiry_date);
      const now = new Date();
      const diff = expiry - now;
      const days = diff / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30;
    }),
    totalValue: products.reduce((sum, p) => sum + (p.quantity * (p.price || 0)), 0),
    bestSellers: [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  };

  const cardClass = "glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight text-right">דשבורד ניהול</h1>
          <p className="text-muted-foreground mt-1 text-right">סקירה כללית וביצועי מלאי בזמן אמת</p>
        </div>

        <div className="flex space-x-3 space-x-reverse w-full md:w-auto">
          <button
            onClick={() => navigate('/add-product')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200"
          >
            <Plus size={20} />
            <span>הוספת מוצר חדש</span>
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95",
              isDark
                ? "border-2 border-primary/40 text-primary hover:bg-primary/10"
                : "border-2 border-primary text-primary hover:bg-blue-50"
            )}
          >
            <BarChart2 size={20} />
            <span>השוואת מחירי רכש</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products & Value */}
        <div className={cardClass}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              isDark ? "bg-primary/15 text-primary" : "bg-blue-50 text-primary"
            )}>
              <Package size={24} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">סה"כ פריטים</p>
              <p className="text-2xl font-black text-foreground">
                {isLoading ? "..." : stats.total}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
             <span className="text-xs font-bold text-muted-foreground">ערך מלאי כולל:</span>
             <span className="text-sm font-black text-primary">₪{isLoading ? "..." : stats.totalValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={cardClass}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              isDark ? "bg-warning/15 text-warning" : "bg-orange-50 text-warning"
            )}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">מלאי נמוך / חסר</p>
              <p className="text-2xl font-black text-warning">
                {isLoading ? "..." : stats.lowStock}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-border/50 flex justify-between items-center">
             <span className="text-xs font-bold text-muted-foreground">מצריך הזמנה מיידית</span>
             <button onClick={() => navigate('/inventory')} className="text-[10px] font-bold text-warning hover:underline flex items-center gap-1">
               לרשימה <ChevronRight size={10} />
             </button>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className={cardClass}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              isDark ? "bg-success/15 text-success" : "bg-emerald-50 text-success"
            )}>
              <Calendar size={24} />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">תפוגה קרובה (30 יום)</p>
              <p className="text-2xl font-black text-success">
                {isLoading ? "..." : stats.expiringProducts.length}
              </p>
            </div>
          </div>
          <div className="pt-2">
             {stats.expiringProducts.length > 0 ? (
               <div className="space-y-1">
                 {stats.expiringProducts.slice(0, 2).map(p => (
                   <div key={p.id} className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground truncate ml-2">{p.name}</span>
                      <span className="font-bold text-success">{new Date(p.expiry_date).toLocaleDateString('he-IL')}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-[10px] text-muted-foreground">אין פריטים פגי תוקף בקרוב</p>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart (SVG) */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-foreground text-right w-full">תנועת מלאי שבועית</h3>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full gradient-primary opacity-20 group-hover:opacity-100 transition-all duration-500 rounded-xl relative"
                  style={{ height: `${height}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold z-10">
                     {height}
                   </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">יום {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers List */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isDark ? "bg-accent-purple/15 text-accent-purple" : "bg-purple-50 text-accent-purple"
            )}>
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-lg text-foreground">מוצרים מובילים במלאי</h3>
          </div>
          
          <div className="space-y-4">
             {isLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />)}
               </div>
             ) : stats.bestSellers.map((product, idx) => (
               <div key={product.id} className="flex items-center gap-4 group">
                  <span className="text-xs font-black text-muted-foreground w-4">{idx + 1}</span>
                  <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-foreground truncate">{product.name}</span>
                        <span className="text-xs font-black text-primary">{product.quantity} {product.unit}</span>
                     </div>
                     <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-accent transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (product.quantity / stats.bestSellers[0].quantity) * 100)}%` }}
                        />
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-foreground">עדכונים אחרונים</h2>
          <button onClick={() => navigate('/inventory')} className="text-sm font-bold text-primary hover:underline">
            לכל המלאי
          </button>
        </div>
        <InventoryTable
          products={products.slice(0, 10)}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Dashboard;
