import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Phone, Globe, Building2, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api.js';
import { setSession, isAuthenticated, getRole } from '../../utils/auth.js';

export default function RegisterPage() {
  const [role, setRole] = useState('student'); // 'student' or 'company'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      const payload = {
        email,
        password,
        role,
        fullName,
        phone,
        companyName,
        website,
        industry,
        description
      };

      const data = await api.auth.register(payload);
      
      // Save credentials in session
      setSession(data.token, data.role, data.email, data.isApproved);
      
      // Redirect based on role
      window.location.href = `/${data.role}`;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[460px] bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[26px] flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      >
        {/* Card Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center font-bold text-sm text-[#0066cc] mx-auto">
            C
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Create Account</h2>
          <p className="text-xs text-[#86868b]">Join the CampusConnect placement network</p>
        </div>

        {/* Apple Segmented Control Toggle between Student and Company */}
        <div className="grid grid-cols-2 p-1 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full">
          <button 
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`py-2 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
              role === 'student' 
                ? 'bg-white text-[#1d1d1f] shadow-sm' 
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            Student Account
          </button>
          <button 
            type="button"
            onClick={() => { setRole('company'); setError(''); }}
            className={`py-2 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
              role === 'company' 
                ? 'bg-white text-[#1d1d1f] shadow-sm' 
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            Recruiter Account
          </button>
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
                placeholder={role === 'student' ? 'aarav@placement.edu' : 'hr@ibm.com'}
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

          {/* Student Fields */}
          {role === 'student' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                    placeholder="Aarav Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </>
          )}

          {/* Company Fields */}
          {role === 'company' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                    placeholder="IBM Corporation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 text-[#86868b]" size={15} />
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1d1d1f] transition-all"
                      placeholder="https://ibm.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Industry</label>
                  <input 
                    type="text" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                    placeholder="Cloud & AI"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Company Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none transition-all"
                  placeholder="Provide a brief summary of your company's core focus and hiring goals..."
                />
              </div>

              <div className="bg-[#f5f5f7] border border-[#e5e5ea] p-3.5 rounded-xl text-xs text-[#6e6e73] leading-relaxed">
                <span className="font-semibold text-[#1d1d1f]">Recruiter Note:</span> New recruiter registrations enter the placement cell verification queue. Once approved by administration, vacancy postings will be published.
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] active:scale-[0.98] py-2.5 rounded-full transition-all duration-200 disabled:opacity-60 cursor-pointer mt-2 shadow-sm"
          >
            {loading ? <span>Creating account...</span> : (
              <>
                <span>Create Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <hr className="border-[#e5e5ea]" />

        <div className="text-center text-xs text-[#86868b]">
          Already have an account?{' '}
          <a href="/login" className="text-[#0066cc] hover:underline font-medium">
            Sign in
          </a>
        </div>
      </motion.div>
    </div>
  );
}
