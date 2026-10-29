import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api.js';
import { setSession, isAuthenticated, getRole } from '../../utils/auth.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      const role = getRole();
      window.location.href = `/${role}`;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login({ email, password });
      
      // Save credentials in session
      setSession(data.token, data.role, data.email, data.isApproved);
      
      // Redirect based on role (admins use the separate admin portal)
      window.location.href = data.role === 'admin' ? '/admin' : `/${data.role}`;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[26px] flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      >
        {/* Card Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center font-bold text-sm text-[#0066cc] mx-auto">
            C
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Sign In</h2>
          <p className="text-xs text-[#86868b]">Use your CampusConnect placement credentials</p>
        </div>

        {/* Demo credentials callout */}
        <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3.5 text-xs text-[#6e6e73] leading-relaxed">
          <div className="font-semibold text-[#1d1d1f] mb-1">Demo Credentials:</div>
          <div className="grid grid-cols-2 gap-x-2 text-[11px]">
            <span>Student: <code className="text-[#0066cc]">student1@placement.edu</code></span>
            <span>(password123)</span>
            <span>Company: <code className="text-[#0066cc]">hr@ibm.com</code></span>
            <span>(password123)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#e5e5ea] text-[11px]">
            Administrators sign in at the{' '}
            <a href="/admin" className="text-[#0066cc] hover:underline font-medium">Admin Portal</a>.
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-xl text-xs text-[#ff3b30]">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[#86868b]" size={16} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                placeholder="aarav@placement.edu"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#1d1d1f]">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[#86868b]" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] py-2.5 rounded-full transition-all disabled:opacity-60 cursor-pointer mt-2 shadow-sm"
          >
            {loading ? <span>Signing in...</span> : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#86868b]">
          Don't have an account?{' '}
          <a href="/register" className="text-[#0066cc] hover:underline font-medium">
            Register here
          </a>
        </div>

        <div className="text-center text-[11px] text-[#86868b] border-t border-[#e5e5ea] pt-3">
          <a href="/admin" className="hover:text-[#0066cc] transition-colors">
            Administrator? Go to Admin Portal
          </a>
        </div>
      </motion.div>
    </div>
  );
}
