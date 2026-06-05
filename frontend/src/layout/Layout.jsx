import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  ChevronRight,
  Bell,
  User,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { name: 'דשבורד ראשי', path: '/', icon: BarChart3 },
    { name: 'ניהול מלאי', path: '/inventory', icon: Package },
    { name: 'דוחות ואנליטיקה', path: '/reports', icon: PieChart },
    { name: 'הגדרות מערכת', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn("flex min-h-screen", isDarkMode ? "dark bg-[#0A0E17]" : "bg-[#F8FAFC]")} dir="rtl">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 w-72 transition-transform duration-300 z-40 lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-white dark:bg-[#131A26] border-l border-border dark:border-white/5 shadow-xl lg:shadow-none">
          {/* Logo Section */}
          <div className="p-6 border-b border-border dark:border-white/5 flex items-center justify-between h-20">
            <Logo />
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          {/* Global Search */}
          <div className="p-4 border-b border-border dark:border-white/5">
            <div className="relative group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="חיפוש גלובלי..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>
          
          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group",
                  location.pathname === item.path
                    ? "gradient-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/5 hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <item.icon size={20} />
                  <span className="font-semibold">{item.name}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={16} className="text-white/70" />}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border dark:border-white/5 space-y-2">
            <button 
              onClick={toggleDarkMode}
              className="flex items-center space-x-3 space-x-reverse p-3 w-full text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all duration-200 text-right"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-semibold">{isDarkMode ? 'מצב יום' : 'מצב לילה'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 space-x-reverse p-3 w-full text-muted-foreground hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 rounded-xl transition-all duration-200 text-right"
            >
              <LogOut size={20} />
              <span className="font-semibold">התנתקות</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="h-20 border-b border-border dark:border-white/5 bg-white/80 dark:bg-[#131A26]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              onClick={toggleSidebar}
            >
              <Menu size={24} className="text-foreground" />
            </button>
            <h2 className="text-xl font-bold text-foreground hidden sm:block">
              {navItems.find(i => i.path === location.pathname)?.name || 'CkStock'}
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#131A26]" />
            </button>

            <div className="h-8 w-px bg-border dark:bg-white/5 hidden sm:block" />

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="hidden text-left lg:block">
                <p className="text-sm font-bold text-foreground leading-tight">משתמש מערכת</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">מנהל מלאי</p>
              </div>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
