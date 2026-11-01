import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/api.js';
import { isAuthenticated, getRole, applyAuthFromUrl } from '../../utils/auth.js';

const portals = [
  {
    key: 'student',
    role: 'student',
    name: 'Student Portal',
    badge: 'Students & Alumni',
    desc: 'Explore active placements, apply for jobs, and build your verified resume profile.',
    icon: GraduationCap,
    accent: 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/20',
    buttonClass: 'bg-[#0066cc] hover:bg-[#0077ed] text-white',
    features: [
      'Browse verified campus placements',
      'One-click resume applications',
      'AI placement prep assistant'
    ]
  },
  {
    key: 'company',
    role: 'company',
    name: 'Recruiter Portal',
    badge: 'Corporate Partners',
    desc: 'Publish campus vacancies, screen candidates by CGPA, and hire top student talent.',
    icon: Building2,
    accent: 'bg-[#5856d6]/10 text-[#5856d6] border-[#5856d6]/20',
    buttonClass: 'bg-[#5856d6] hover:bg-[#6865e8] text-white',
    features: [
      'Post full-time & internship roles',
      'Screen verified candidate dossiers',
      'Manage applicant shortlists'
    ]
  },
  {
    key: 'admin',
    role: 'admin',
    name: 'Admin Portal',
    badge: 'Placement Cell',
    desc: 'Placement cell management desk, recruiter approvals queue, and batch analytics.',
    icon: ShieldCheck,
    accent: 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20',
    buttonClass: 'bg-[#1d1d1f] hover:bg-[#333336] text-white',
    features: [
      'Recruiter verification approvals queue',
      'Batch placement statistics & funnels',
      'Campus-wide job & candidate controls'
    ]
  }
];

export default function LoginPage() {
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    applyAuthFromUrl();

    if (isAuthenticated()) {
      const role = getRole();
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = `/${role}/dashboard`;
      }
      return;
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err) {
        if (err === 'appid_failed') {
          setUrlError('IBM App ID sign-in was cancelled or could not be completed. Please try again.');
        } else if (err === 'appid_server') {
          setUrlError('IBM App ID authentication server error. Please try again later.');
        } else if (err === 'appid_noemail') {
          setUrlError('No verified email address was returned from IBM App ID.');
        } else {
          setUrlError('Authentication could not be completed. Please try again.');
        }
      }
    }
  }, []);

  const getLoginUrl = (role) => {
    return `${API_BASE_URL}/auth/appid/login?role=${role}`;
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-5xl flex flex-col gap-8"
      >
        {/* Header */}
        <div className="text-center flex flex-col gap-2.5 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center font-bold text-sm text-[#0066cc] mx-auto shadow-2xs">
            C
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Sign in to CampusConnect
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
            Select your designated portal to continue with IBM App ID enterprise single sign-on
          </p>
        </div>

        {/* URL Error Alert */}
        {urlError && (
          <div className="max-w-xl mx-auto w-full flex items-start gap-2.5 p-3.5 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl text-xs text-[#ff3b30]">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{urlError}</span>
          </div>
        )}

        {/* 3 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            const loginUrl = getLoginUrl(portal.role);

            return (
              <motion.div
                key={portal.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-white border border-[#e5e5ea] hover:border-[#d2d2d7] rounded-[24px] p-7 flex flex-col justify-between gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                {/* Top Section */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${portal.accent}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] border border-[#e5e5ea] px-2.5 py-1 rounded-full">
                      {portal.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
                      {portal.name}
                    </h3>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      {portal.desc}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-[#f0f0f2]">
                    {portal.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#1d1d1f]">
                        <CheckCircle2 size={13} className="text-[#34c759] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="flex flex-col gap-2.5 pt-4 border-t border-[#f0f0f2]">
                  <a
                    href={loginUrl}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-medium transition-all shadow-sm active:scale-[0.98] cursor-pointer ${portal.buttonClass}`}
                  >
                    <span>Sign In</span>
                    <ArrowRight size={14} />
                  </a>

                  {portal.role === 'admin' ? (
                    <a
                      href="/admin"
                      className="text-center text-[11px] text-[#86868b] hover:text-[#1d1d1f] hover:underline transition-colors py-0.5"
                    >
                      Or sign in with master admin password
                    </a>
                  ) : (
                    <div className="text-center text-[11px] text-[#86868b]">
                      Authenticates via IBM Cloud App ID
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer SSO Note */}
        <div className="text-center text-xs text-[#86868b] max-w-xl mx-auto flex items-center justify-center gap-1.5">
          <Lock size={12} className="text-[#86868b]" />
          <span>Protected by Enterprise IBM App ID OAuth2 / OIDC Single Sign-On</span>
        </div>
      </motion.div>
    </div>
  );
}
