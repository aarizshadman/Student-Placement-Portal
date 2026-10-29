import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api.js';

export default function AppIdLoginPage({ role = 'student' }) {
  const isCompany = role === 'company';
  const loginUrl = `${API_BASE_URL}/auth/appid/login?role=${role}`;
  const otherPath = isCompany ? '/student' : '/company';
  const otherLabel = isCompany ? 'Student Portal' : 'Recruiter Portal';

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[430px] bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[26px] flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      >
        {/* Card Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center text-[#0066cc] mx-auto">
            {isCompany ? <Building2 size={20} /> : <GraduationCap size={20} />}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {isCompany ? 'Recruiter Sign In' : 'Student Sign In'}
          </h2>
          <p className="text-xs text-[#86868b]">
            {isCompany
              ? 'Publish campus vacancies and review student applicants'
              : 'Explore job openings, track applications, and build your resume profile'}
          </p>
        </div>

        {/* Enterprise SSO notice */}
        <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3.5 text-xs text-[#6e6e73] leading-relaxed">
          <div className="font-semibold text-[#1d1d1f] mb-1 flex items-center gap-1.5">
            <AlertCircle size={13} className="text-[#0066cc]" />
            Enterprise Single Sign-On
          </div>
          This portal authenticates securely through IBM App ID Cloud Directory. You will proceed to the verified authentication service.
        </div>

        <a
          href={loginUrl}
          className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] active:scale-[0.98] py-2.5 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
        >
          <ExternalLink size={14} />
          <span>Continue with IBM App ID</span>
        </a>

        <hr className="border-[#e5e5ea]" />

        <div className="flex flex-col gap-3 text-xs text-[#86868b]">
          <a href={otherPath} className="text-center hover:text-[#1d1d1f] transition-colors">
            Switching roles? Go to <span className="text-[#0066cc] font-medium hover:underline">{otherLabel}</span>
          </a>
          <a href="/admin" className="text-center hover:text-[#1d1d1f] transition-colors flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-[#34c759]" />
            <span>
              Placement Cell Admin? Use <span className="text-[#0066cc] font-medium hover:underline">Admin Portal</span>
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
