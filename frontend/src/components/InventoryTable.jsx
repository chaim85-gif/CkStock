import React from 'react';
import { cn } from '../lib/utils';

const StatusBadge = ({ status }) => {
  const isLow = status === 'low' || status === 'מלאי נמוך';
  
  return (
    <span className={cn(
      "px-2 py-1 rounded text-sm font-medium",
      isLow 
        ? "bg-warning/10 text-warning" 
        : "bg-success/10 text-success"
    )}>
      {isLow ? 'מלאי נמוך' : 'במלאי'}
    </span>
  );
};

const InventoryTable = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
        <p className="text-gray-500">טוען נתונים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white border border-border rounded-lg">
        <p className="text-gray-500">אין מוצרים להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-border">
            <th className="p-4 font-semibold text-gray-600">שם פריט</th>
            <th className="p-4 font-semibold text-gray-600">קטגוריה</th>
            <th className="p-4 font-semibold text-gray-600">כמות</th>
            <th className="p-4 font-semibold text-gray-600">יחידה</th>
            <th className="p-4 font-semibold text-gray-600">סטטוס</th>
            <th className="p-4 font-semibold text-gray-600">תוקף</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium">{product.name}</td>
              <td className="p-4 text-gray-600">{product.category}</td>
              <td className="p-4">{product.quantity}</td>
              <td className="p-4 text-gray-600">{product.unit}</td>
              <td className="p-4">
                <StatusBadge status={product.status} />
              </td>
              <td className="p-4 text-gray-600">
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
