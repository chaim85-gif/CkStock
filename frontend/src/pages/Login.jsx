import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'שגיאה בכניסה למערכת. בדוק את פרטי ההתחברות.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-border shadow-xl shadow-gray-200/50">
        <div className="flex flex-col items-center">
          <Logo className="mb-2" />
          <p className="mt-2 text-gray-500 font-medium">ניהול מלאי ורכש — פשוט, נקי, בהיר</p>
        </div>
        
        <div className="mt-8">
           <h2 className="text-2xl font-bold text-foreground text-center mb-6">כניסה לחשבון</h2>
           
           <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium border border-red-100 text-center animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 mr-1">אימייל</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right bg-gray-50 focus:bg-white" 
                dir="ltr" 
                placeholder="you@example.com" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-bold text-gray-700 mr-1">סיסמה</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right bg-gray-50 focus:bg-white" 
                dir="ltr" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-primary/25 text-base font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:bg-blue-300 mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  מתחבר...
                </span>
              ) : 'כניסה למערכת'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
           <p className="text-xs text-gray-400">
             CkStock &copy; 2024. המערכת המקצועית לניהול רכש ומלאי.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
