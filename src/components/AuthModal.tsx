import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Shield, X, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types/tourism';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'tourist' | 'admin'>('tourist');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      // Demo authentication simulation
      const isAdmin = email.toLowerCase().includes('admin');
      const user: UserProfile = {
        id: isAdmin ? 1 : 2,
        name: isAdmin ? 'Administrator' : email.split('@')[0],
        email,
        role: isAdmin ? 'admin' : 'tourist'
      };
      onLoginSuccess(user);
      onClose();
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      const user: UserProfile = {
        id: Date.now(),
        name,
        email,
        role
      };
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleQuickDemo = (demoRole: 'tourist' | 'admin') => {
    if (demoRole === 'tourist') {
      onLoginSuccess({
        id: 2,
        name: 'Pawan Deol',
        email: 'tourist@tourismplanner.local',
        role: 'tourist'
      });
    } else {
      onLoginSuccess({
        id: 1,
        name: 'Administrator',
        email: 'admin@tourismplanner.local',
        role: 'admin'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-6">
          <button
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              authMode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold font-display text-slate-900">
            {authMode === 'login' ? 'Welcome Back Traveler' : 'Create Tourism Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {authMode === 'login'
              ? 'Access your personalized itineraries and budget tracking.'
              : 'Save multi-day travel plans, expenses, and destination bookmarks.'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Pawan Deol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="tourist">Tourist (Traveler)</option>
                <option value="admin">Admin (Destination Manager)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Instant 1-Click Demo Sign-In
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('tourist')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 text-left transition-colors"
            >
              <div className="font-bold text-xs text-slate-900">Tourist Demo</div>
              <div className="text-[10px] text-slate-500">Pawan Deol</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 text-left transition-colors"
            >
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-600" />
                Admin Demo
              </div>
              <div className="text-[10px] text-slate-500">Full Manager Access</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
