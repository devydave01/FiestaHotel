import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Shield } from 'lucide-react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import api from '../services/api';
import useStore from '../store/useStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Hardcoded credentials for school project handover
    const ADMIN_EMAIL = 'fiesta@gmail.com';
    const ADMIN_PASS = '12345678';

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        // Simulate a successful response from a backend
        const mockUser = { id: 1, name: 'Admin', email: ADMIN_EMAIL };
        const mockToken = 'mock-jwt-token-12345';
        
        setAuth(mockUser, mockToken);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Interior" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-black/40">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-accent/40 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-accent/30">
              <Shield className="text-accent" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-accent tracking-tight">Admin Login</h1>
            <p className="text-accent/70 mt-2">Access the Fiesta Control Panel</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-white text-sm rounded-xl backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-text-secondary ml-1 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60" size={18} />
                <input 
                  type="email"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all placeholder:text-gray-400"
                  placeholder="admin@fiestahotel.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-text-secondary ml-1 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60" size={18} />
                <input 
                  type="password"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 shadow-xl shadow-accent/20" 
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>
        
        <p className="text-center text-white/50 mt-8 text-sm">
          Protected by enterprise-grade security.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
