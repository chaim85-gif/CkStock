import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Tag, PlusCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

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
    <div className="flex min-h-screen bg-[#F9FAFB]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 border-l border-border bg-white flex flex-col fixed h-screen">
        <div className="p-6 border-b border-border h-20 flex items-center justify-center">
          <Logo />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 space-x-reverse p-3 w-full text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 text-right"
          >
            <LogOut size={20} />
            <span className="font-semibold">התנתקות</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 min-h-screen">
        <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <h2 className="text-xl font-bold text-foreground">
            {navItems.find(i => i.path === location.pathname)?.name || 'CkStock'}
          </h2>
          <div className="flex items-center gap-4">
             {/* Simple user profile placeholder */}
             <div className="w-10 h-10 rounded-full bg-gray-100 border border-border flex items-center justify-center text-primary font-bold">
               U
             </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
