import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
        Ck
      </div>
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Stock
      </span>
    </div>
  );
};

export default Logo;
