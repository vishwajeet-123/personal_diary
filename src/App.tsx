import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Search, 
  LogOut, 
  Home as HomeIcon, 
  Plus, 
  Calendar, 
  Tag, 
  User as UserIcon,
  ChevronRight,
  Heart,
  AlertCircle,
  Frown,
  Menu,
  X
} from 'lucide-react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/Search';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  if (loading) return null;

  const isAuthPage = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isAuthPage && user && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-indigo-600">
              <Book size={24} />
              <span className="text-lg tracking-tight">MyDiary</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <HomeIcon size={20} />
              </Link>
              <Link to="/search" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <Search size={20} />
              </Link>
              <button onClick={handleLogout} className="p-2 text-slate-600 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className={!isAuthPage ? "pt-20 pb-10 px-4 max-w-md mx-auto" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
