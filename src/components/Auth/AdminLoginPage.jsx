import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api.js';
import { setSession } from '../../utils/auth.js';

export default function AdminLoginPage({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login({ email, password });

      if (data.role !== 'admin') {
        setError('Access restricted. This portal is for placement cell administrators only.');
        setLoading(false);
        return;
      }

      setSession(data.token, data.role, data.email, data.isApproved);
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your administrator credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[420px] bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[26px] flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      >
        {/* Card Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#34c759]/10 border border-[#34c759]/20 flex items-center justify-center text-[#34c759] mx-auto">
            <ShieldCheck size={20} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Placement Cell Admin</h2>
          <p className="text-xs text-[#86868b]">Control desk for university verification & placements</p>
        </div>

        {/* Demo credentials callout */}
        <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3.5 text-xs text-[#6e6e73] leading-relaxed">
          <div className="font-semibold text-[#1d1d1f] mb-1">Demo Administrator:</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#0066cc] font-mono">admin@placement.edu</span>
            <span>(admin123)</span>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl text-xs text-[#ff3b30]">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                placeholder="admin@placement.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
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
            className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] active:scale-[0.98] py-2.5 rounded-full transition-all duration-200 disabled:opacity-60 cursor-pointer mt-2 shadow-sm"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <hr className="border-[#e5e5ea]" />

        <div className="text-center text-xs text-[#86868b]">
          Not an administrator?{' '}
          <a href="/login" className="text-[#0066cc] hover:underline font-medium">
            User login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
