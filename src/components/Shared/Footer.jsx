import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f5f5f7] border-t border-[#d2d2d7] px-8 py-12 md:py-16 md:px-12 select-none text-[#6e6e73]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#0066cc] flex items-center justify-center font-bold text-[10px] text-white">
              C
            </div>
            <span className="text-sm font-semibold text-[#1d1d1f] tracking-tight">
              CampusConnect
            </span>
          </div>
          <p className="text-xs text-[#86868b] leading-relaxed max-w-[240px]">
            A university placement engine bridging student talent with enterprise recruiters worldwide.
          </p>
        </div>

        {/* Resources Link Grid */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider">Resources</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="/login" className="text-xs text-[#6e6e73] hover:text-[#0066cc] transition-colors">Jobs Feed</a></li>
            <li><a href="/#statistics" className="text-xs text-[#6e6e73] hover:text-[#0066cc] transition-colors">Placement Analytics</a></li>
            <li><a href="/#faq" className="text-xs text-[#6e6e73] hover:text-[#0066cc] transition-colors">Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider">Placement Cell</h4>
          <ul className="flex flex-col gap-2">
            <li><span className="text-xs text-[#6e6e73]">Block 3, University Campus</span></li>
            <li><a href="mailto:admin@campusconnect.edu" className="text-xs text-[#6e6e73] hover:text-[#0066cc] transition-colors">admin@campusconnect.edu</a></li>
            <li><span className="text-xs text-[#6e6e73]">+91 80 4911-3000</span></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider">Guidelines</h4>
          <ul className="flex flex-col gap-2">
            <li><span className="text-xs text-[#6e6e73] hover:text-[#0066cc] cursor-pointer transition-colors">Placement Policy</span></li>
            <li><span className="text-xs text-[#6e6e73] hover:text-[#0066cc] cursor-pointer transition-colors">Student Code of Conduct</span></li>
            <li><span className="text-xs text-[#6e6e73] hover:text-[#0066cc] cursor-pointer transition-colors">Privacy & Data Security</span></li>
          </ul>
        </div>

      </div>

      <hr className="border-[#e5e5ea] max-w-7xl mx-auto my-8" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#86868b]">
        <span>Copyright &copy; {currentYear} CampusConnect Inc. All rights reserved.</span>
        <span>Designed with Apple-inspired Human Interface precision.</span>
      </div>
    </footer>
  );
}
