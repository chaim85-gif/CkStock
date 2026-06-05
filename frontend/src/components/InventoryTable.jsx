import React from 'react';
import { cn } from '../lib/utils';

const StatusBadge = ({ status }) => {
  const isLow = status === 'low' || status === 'מלאי נמוך';
  
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
      isLow 
        ? "bg-orange-500/5 text-warning border-orange-500/20" 
        : "bg-emerald-500/5 text-success border-emerald-500/20"
    )}>
      {isLow ? 'מלאי נמוך' : 'במלאי'}
    </span>
  );
};

const InventoryTable = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent">
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-muted-foreground font-bold text-sm">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent text-center">
        <div className="glass-card px-8 py-6 border-danger/20">
           <p className="text-danger font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-transparent border-2 border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">אין מוצרים להצגה</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-right border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-border dark:border-white/5 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
            <th className="px-6 py-4">שם פריט</th>
            <th className="px-6 py-4 text-center">קטגוריה</th>
            <th className="px-6 py-4 text-center">כמות</th>
            <th className="px-6 py-4 text-center">יחידה</th>
            <th className="px-6 py-4 text-center">סטטוס</th>
            <th className="px-6 py-4 text-center">תוקף</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border dark:divide-white/5">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                     {product.name.charAt(0)}
                   </div>
                   <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                     {product.name}
                   </span>
                </div>
              </td>
              <td className="px-6 py-5 text-center text-muted-foreground font-medium text-sm">{product.category}</td>
              <td className="px-6 py-5 text-center">
                 <span className="bg-muted px-2 py-1 rounded-lg font-mono font-bold text-foreground">
                   {product.quantity}
                 </span>
              </td>
              <td className="px-6 py-5 text-center text-muted-foreground font-medium text-sm">{product.unit}</td>
              <td className="px-6 py-5 text-center">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-6 py-5 text-center text-muted-foreground font-bold text-xs uppercase tracking-tight">
                {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString('he-IL') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
