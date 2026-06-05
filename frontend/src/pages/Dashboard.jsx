import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Calendar, Plus, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getProducts } from '../api/client';
import { cn } from '../lib/utils';

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
          <h1 className="text-3xl font-black text-foreground tracking-tight">דשבורד ראשי</h1>
          <p className="text-muted-foreground mt-1 font-medium">סקירה כללית וביצועי מלאי</p>
        </div>
        
        <div className="flex space-x-3 space-x-reverse w-full md:w-auto">
          <button 
            onClick={() => navigate('/add-product')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 gradient-primary text-white px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus size={20} />
            <span>הוספת מוצר חדש</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-5 transition-all hover:scale-[1.02] cursor-default border-none shadow-glass">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Package size={28} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">סה"כ פריטים</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-foreground">{isLoading ? '...' : stats.total}</p>
              <span className="flex items-center text-xs font-bold text-success mb-1">
                <ArrowUpRight size={14} />
                12%+
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5 transition-all hover:scale-[1.02] cursor-default border-none shadow-glass">
          <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-warning">
            <AlertTriangle size={28} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">מלאי נמוך</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-warning">{isLoading ? '...' : stats.lowStock}</p>
              <span className="flex items-center text-xs font-bold text-danger mb-1">
                <ArrowUpRight size={14} />
                4+
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5 transition-all hover:scale-[1.02] cursor-default border-none shadow-glass">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-success">
            <Calendar size={28} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">תפוגה קרובה</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-success">{isLoading ? '...' : stats.expiring}</p>
              <span className="flex items-center text-xs font-bold text-success mb-1">
                <ArrowDownRight size={14} />
                2-
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple Chart */}
        <div className="glass-card p-6 shadow-glass border-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-foreground">תנועת מלאי שבועית</h3>
            <div className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black text-muted-foreground uppercase tracking-wider">
              7 ימים אחרונים
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 px-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div 
                  className="w-full gradient-primary opacity-20 group-hover:opacity-100 transition-all rounded-xl relative"
                  style={{ height: `${height}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold">
                     {height}
                   </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">יום {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 shadow-glass border-none">
          <h3 className="font-bold text-lg text-foreground mb-6">פעולות אחרונות</h3>
          <div className="space-y-5">
            {[
              { text: 'עודכן מלאי: חלב 3%', time: 'לפני 5 דקות', type: 'update' },
              { text: 'הוזמן מוצר חדש: קמח לבן', time: 'לפני 20 דקות', type: 'order' },
              { text: 'התראת פקיעת תוקף: גבינה צהובה', time: 'לפני שעה', type: 'alert' },
              { text: 'ספק חדש נוסף: תנובה', time: 'לפני שעתיים', type: 'system' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                  item.type === 'update' && "bg-blue-500/10 text-blue-500",
                  item.type === 'order' && "bg-emerald-500/10 text-emerald-500",
                  item.type === 'alert' && "bg-red-500/10 text-red-500",
                  item.type === 'system' && "bg-purple-500/10 text-purple-500"
                )}>
                  {item.type === 'update' && <Package size={18} />}
                  {item.type === 'order' && <Plus size={18} />}
                  {item.type === 'alert' && <AlertTriangle size={18} />}
                  {item.type === 'system' && <User size={18} />}
                </div>
                <div className="flex-1 border-b border-border dark:border-white/5 pb-3">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.text}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/inventory')}
            className="w-full mt-6 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl transition-all"
          >
            צפייה בכל המלאי
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
