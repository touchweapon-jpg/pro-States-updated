import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, ShieldCheck, AlertCircle, Check, Compass, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPages() {
  const { setUser, setCurrentPage } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Status flags
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: 'usr-guest',
        name: email.split('@')[0].toUpperCase(),
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'guest',
        joinedDate: 'July 2026',
        walletBalance: 0,
        currency: 'GBP',
        language: 'en',
      });
      setCurrentPage('home');
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all parameters.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please accept Terms of Service.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      setAuthMode('verify');
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Reset password link dispatched successfully.');
      setErrorMsg('');
    }, 1000);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: 'usr-guest',
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'guest',
        joinedDate: 'July 2026',
        walletBalance: 250, // Welcome gift!
        currency: 'GBP',
        language: 'en',
      });
      setCurrentPage('home');
    }, 1000);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />

        {/* LOGO BRIEF */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Pro<span className="text-blue-600">States</span>
          </span>
          <p className="text-xs text-gray-400">The Global Elite Vacation Rental Platform</p>
        </div>

        {/* FEEDBACK LABELS */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-colors cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Don\'t have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </p>
          </form>
        )}

        {/* REGISTER MODE */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Alexander Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-blue-600 mt-0.5"
              />
              <span>I accept ProStates Terms of Service and Privacy Directives.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-colors cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Reset Password Link</h3>
            <p className="text-xs text-gray-400">Enter your email and we will send a password restoration link.</p>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Send Link
              </button>
            </div>
          </form>
        )}

        {/* EMAIL VERIFICATION MODE */}
        {authMode === 'verify' && (
          <form onSubmit={handleVerifyEmail} className="space-y-4 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Verify Your Identity</h3>
            <p className="text-xs text-gray-400">We have simulated sending a code to <strong>{email}</strong>.</p>

            <div className="flex justify-center gap-2.5">
              {['1', '8', '2', '4'].map((char, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  defaultValue={char}
                  className="w-10 h-10 border border-gray-200 rounded-xl text-center font-bold text-sm bg-gray-50 outline-none focus:border-blue-500"
                  readOnly
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Verify & Complete Registration
            </button>
          </form>
        )}

        {/* THIRD-PARTY SIGN IN SOCIAL LOGINS */}
        {authMode !== 'verify' && (
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or Sign In with</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUser({
                    id: 'usr-google',
                    name: 'Google Traveler',
                    email: 'google@traveler.com',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
                    role: 'guest',
                    joinedDate: 'July 2026',
                    walletBalance: 150,
                    currency: 'GBP',
                    language: 'en',
                  });
                  setCurrentPage('home');
                }}
                className="px-3.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUser({
                    id: 'usr-apple',
                    name: 'Apple User',
                    email: 'apple@icloud.com',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
                    role: 'guest',
                    joinedDate: 'July 2026',
                    walletBalance: 150,
                    currency: 'GBP',
                    language: 'en',
                  });
                  setCurrentPage('home');
                }}
                className="px-3.5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
