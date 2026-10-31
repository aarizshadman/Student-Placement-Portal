import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, ExternalLink, ShieldCheck, GraduationCap, Building2, Sparkles } from 'lucide-react';
import { api, API_BASE_URL } from '../../utils/api.js';
import { setSession, isAuthenticated, getRole } from '../../utils/auth.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoRole, setSsoRole] = useState('student'); // 'student' or 'company'

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getRole();
      window.location.href = role === 'admin' ? '/admin' : `/${role}/dashboard`;
    }
  }, []);

  const handleLoginWithCredentials = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login({ email: loginEmail, password: loginPassword });
      setSession(data.token, data.role, data.email, data.isApproved);
      
      if (data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = `/${data.role}/dashboard`;
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginWithCredentials(email, password);
  };

  const quickDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLoginWithCredentials(demoEmail, demoPassword);
  };

  const ibmAppIdUrl = `${API_BASE_URL}/auth/appid/login?role=${ssoRole}`;

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[440px] bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[28px] flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      >
        {/* Card Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center font-bold text-sm text-[#0066cc] mx-auto">
            C
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Sign In</h2>
          <p className="text-xs text-[#86868b]">Universal access for Students, Recruiters, and Placement Admins</p>
        </div>

        {/* 1-Click Quick Demo Login Pills */}
        <div className="flex flex-col gap-2 p-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#1d1d1f] px-1">
            <span className="flex items-center gap-1 text-[#0066cc]">
              <Sparkles size={12} />
              1-Click Demo Login:
            </span>
            <span className="text-[#86868b] text-[10px]">Instant Sign-in</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => quickDemoLogin('student1@placement.edu', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-[#0066cc]/5 hover:border-[#0066cc]/30 border border-[#e5e5ea] rounded-xl text-[11px] font-medium text-[#1d1d1f] transition-all cursor-pointer shadow-2xs"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('hr@ibm.com', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-[#0066cc]/5 hover:border-[#0066cc]/30 border border-[#e5e5ea] rounded-xl text-[11px] font-medium text-[#1d1d1f] transition-all cursor-pointer shadow-2xs"
            >
              🏢 Recruiter
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('admin@placement.edu', 'admin123')}
              className="py-1.5 px-2 bg-white hover:bg-[#0066cc]/5 hover:border-[#0066cc]/30 border border-[#e5e5ea] rounded-xl text-[11px] font-medium text-[#1d1d1f] transition-all cursor-pointer shadow-2xs"
            >
              🛡️ Admin
            </button>
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
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                placeholder="name@placement.edu or hr@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Password</label>
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
            className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] active:scale-[0.98] py-2.5 rounded-full transition-all duration-200 disabled:opacity-60 cursor-pointer mt-1 shadow-sm"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <hr className="w-full border-[#e5e5ea]" />
          <span className="absolute bg-white px-3 text-[10px] uppercase font-semibold text-[#86868b] tracking-wider">
            Or Enterprise SSO
          </span>
        </div>

        {/* IBM App ID Section */}
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 p-1 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full">
            <button
              type="button"
              onClick={() => setSsoRole('student')}
              className={`py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
                ssoRole === 'student' ? 'bg-white text-[#1d1d1f] shadow-2xs' : 'text-[#6e6e73]'
              }`}
            >
              Student SSO
            </button>
            <button
              type="button"
              onClick={() => setSsoRole('company')}
              className={`py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
                ssoRole === 'company' ? 'bg-white text-[#1d1d1f] shadow-2xs' : 'text-[#6e6e73]'
              }`}
            >
              Recruiter SSO
            </button>
          </div>

          <a
            href={ibmAppIdUrl}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-[#d2d2d7] py-2.5 rounded-full transition-all active:scale-[0.98] cursor-pointer"
          >
            <ExternalLink size={13} className="text-[#0066cc]" />
            <span>Continue with IBM App ID ({ssoRole === 'student' ? 'Student' : 'Recruiter'})</span>
          </a>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center text-xs text-[#86868b] pt-1 border-t border-[#e5e5ea]">
          Don't have an account yet?{' '}
          <a href="/register" className="text-[#0066cc] hover:underline font-medium">
            Create an Account
          </a>
        </div>
      </motion.div>
    </div>
  );
}
