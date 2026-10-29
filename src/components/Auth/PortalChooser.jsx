import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

const portals = [
  {
    key: 'student',
    name: 'Student Portal',
    desc: 'Explore active placements, apply for jobs, and build your professional profile.',
    href: '/student',
    icon: GraduationCap,
    accent: 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/20'
  },
  {
    key: 'company',
    name: 'Recruiter Portal',
    desc: 'Publish openings, filter candidate pools, and shortlist top campus talent.',
    href: '/company',
    icon: Building2,
    accent: 'bg-[#5856d6]/10 text-[#5856d6] border-[#5856d6]/20'
  },
  {
    key: 'admin',
    name: 'Admin Portal',
    desc: 'Placement cell management desk, verification queue, and batch analytics.',
    href: '/admin',
    icon: ShieldCheck,
    accent: 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20'
  }
];

export default function PortalChooser() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex flex-col gap-6"
      >
        <div className="text-center flex flex-col gap-2">
          <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 border border-[#0066cc]/20 flex items-center justify-center font-bold text-sm text-[#0066cc] mx-auto">
            C
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Sign in to CampusConnect</h2>
          <p className="text-xs text-[#86868b]">Choose the portal that matches your role</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portals.map((portal, i) => (
            <motion.a
              key={portal.key}
              href={portal.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group bg-white rounded-[22px] border border-[#e5e5ea] hover:border-[#d2d2d7] p-7 flex flex-col justify-between gap-6 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${portal.accent}`}>
                  <portal.icon size={22} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-[#1d1d1f]">{portal.name}</h3>
                  <p className="text-xs text-[#6e6e73] leading-relaxed">{portal.desc}</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#0066cc] group-hover:gap-2.5 transition-all">
                Access Portal <ArrowRight size={13} />
              </span>
            </motion.a>
          ))}
        </div>

        <p className="text-center text-xs text-[#86868b]">
          Student and Recruiter portals support single sign-on. Admin portal authenticates via placement cell database.
        </p>
      </motion.div>
    </div>
  );
}
