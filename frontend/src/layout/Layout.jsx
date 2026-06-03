import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, PlusCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'דשבורד', path: '/', icon: LayoutDashboard },
    { name: 'השוואת מחירים', path: '/pricing', icon: Tag },
    { name: 'הוספת מוצר', path: '/add-product', icon: PlusCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 border-l border-border flex flex-col">
        <div className="p-6 border-b border-border text-center">
          <h1 className="text-2xl font-bold text-primary">CkStock</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 space-x-reverse p-3 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-border"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 space-x-reverse p-3 w-full text-foreground hover:bg-border rounded-md transition-colors text-right"
          >
            <LogOut size={20} />
            <span className="font-medium">התנתקות</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border flex items-center px-8 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold">
            {navItems.find(i => i.path === location.pathname)?.name || 'CkStock'}
          </h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
