import React from 'react';
import { cn } from '../lib/utils';

const StatusBadge = ({ status }) => {
  const isLow = status === 'low' || status === 'מלאי נמוך';
  
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
      isLow 
        ? "bg-orange-100 text-warning" 
        : "bg-emerald-100 text-success"
    )}>
      {isLow ? 'מלאי נמוך' : 'במלאי'}
    </span>
  );
};

const InventoryTable = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-2xl shadow-sm">
        <p className="text-gray-400 font-medium">טוען נתונים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-2xl shadow-sm">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-2xl shadow-sm border-dashed">
        <p className="text-gray-400 font-medium">אין מוצרים להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-border text-gray-500 uppercase text-xs tracking-wider">
            <th className="px-6 py-4 font-bold">שם פריט</th>
            <th className="px-6 py-4 font-bold">קטגוריה</th>
            <th className="px-6 py-4 font-bold text-center">כמות</th>
            <th className="px-6 py-4 font-bold">יחידה</th>
            <th className="px-6 py-4 font-bold">סטטוס</th>
            <th className="px-6 py-4 font-bold">תוקף</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-5 font-semibold text-foreground group-hover:text-primary transition-colors">
                {product.name}
              </td>
              <td className="px-6 py-5 text-gray-500">{product.category}</td>
              <td className="px-6 py-5 text-center font-mono font-medium">{product.quantity}</td>
              <td className="px-6 py-5 text-gray-500">{product.unit}</td>
              <td className="px-6 py-5">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-6 py-5 text-gray-500">
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
