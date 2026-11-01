import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, MessageCircle, Briefcase, Award, Settings, Bell } from 'lucide-react';
import { getUser, clearSession, isAuthenticated } from '../../utils/auth.js';
import { api } from '../../utils/api.js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial check
    setUser(getUser());

    // Setup listener for auth state changes if page transitions don't fully reload
    const handleAuthChange = () => {
      setUser(getUser());
    };
    window.addEventListener('storage', handleAuthChange);

    // If logged in, fetch notifications count
    if (isAuthenticated()) {
      fetchNotificationsCount();
      const interval = setInterval(fetchNotificationsCount, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }

    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  const fetchNotificationsCount = async () => {
    try {
      const data = await api.students.getNotifications();
      setUnreadCount(data.filter(n => !n.read).length);
    } catch {
      // Fail silently
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const renderNavLinks = () => {
    const defaultLinks = [
      { name: 'Home', href: '/' }
    ];

    if (!user) {
      return defaultLinks.map(link => (
        <a 
          key={link.name} 
          href={link.href} 
          className="text-[13px] font-normal text-[#1d1d1f]/80 hover:text-[#0066cc] transition-colors duration-150"
        >
          {link.name}
        </a>
      ));
    }

    // Role specific links
    const roleLinks = [];
    if (user.role === 'student') {
      roleLinks.push(
        { name: 'Dashboard', href: '/student/dashboard', icon: Award },
        { name: 'Jobs Feed', href: '/student/dashboard?tab=jobs', icon: Briefcase },
        { name: 'AI Assistant', href: '/student/dashboard?tab=chatbot', icon: MessageCircle }
      );
    } else if (user.role === 'company') {
      if (user.isApproved) {
        roleLinks.push(
          { name: 'Dashboard', href: '/company/dashboard', icon: Briefcase },
          { name: 'Post Job', href: '/company/dashboard?tab=post-job', icon: Settings }
        );
      } else {
        roleLinks.push(
          { name: 'Under Review', href: '/company/dashboard', icon: Briefcase }
        );
      }
    } else if (user.role === 'admin') {
      roleLinks.push(
        { name: 'Dashboard', href: '/admin', icon: Settings }
      );
    }

    return [...defaultLinks, ...roleLinks].map(link => (
      <a 
        key={link.name} 
        href={link.href} 
        className="flex items-center gap-1.5 text-[13px] font-normal text-[#1d1d1f]/80 hover:text-[#0066cc] transition-colors duration-150"
      >
        {link.icon && <link.icon size={14} className="text-[#0066cc]" />}
        <span>{link.name}</span>
      </a>
    ));
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-12 bg-white/80 backdrop-blur-xl border-b border-[#e5e5ea] flex items-center justify-between px-6 md:px-12 select-none transition-all duration-200">
      {/* Apple-style Logo Wordmark */}
      <a href="/" className="flex items-center gap-2 group">
        <div className="w-5 h-5 rounded-full bg-[#0066cc] flex items-center justify-center font-bold text-[10px] text-white shadow-sm group-hover:bg-[#0077ed] transition-colors">
          C
        </div>
        <span className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
          CampusConnect
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {renderNavLinks()}
      </div>

      {/* Desktop Auth Section */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {user.role === 'student' && (
              <a 
                href="/student/dashboard?tab=notifications" 
                className="relative p-1.5 rounded-full hover:bg-[#f5f5f7] border border-transparent hover:border-[#e5e5ea] transition-all"
                title="Notifications"
              >
                <Bell size={16} className="text-[#6e6e73] hover:text-[#1d1d1f]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#34c759] ring-2 ring-white" />
                )}
              </a>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-xs text-[#1d1d1f]">
              <User size={12} className="text-[#0066cc]" />
              <span className="font-medium">{user.email.split('@')[0]}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-[10px] text-[#6e6e73] border border-[#e5e5ea] uppercase font-semibold tracking-wide">
                {user.role}
              </span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 text-xs font-normal text-[#6e6e73] hover:text-[#ff3b30] bg-[#f5f5f7] border border-[#e5e5ea] hover:border-[#ff3b30]/30 hover:bg-[#ff3b30]/5 px-3 py-1.2 rounded-full transition-all cursor-pointer"
            >
              <LogOut size={12} />
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a 
              href="/login" 
              className="text-xs font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] px-4 py-1.5 rounded-full transition-all shadow-sm"
            >
              Sign in
            </a>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden p-1.5 rounded-lg bg-[#f5f5f7] border border-[#e5e5ea] hover:bg-[#e8e8ed] text-[#1d1d1f] transition-all cursor-pointer"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-12 left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-[#e5e5ea] flex flex-col px-6 py-6 gap-5 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-3">
              {renderNavLinks()}
            </div>
            <hr className="border-[#e5e5ea]" />
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-xs text-[#1d1d1f]">
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-[#0066cc]" />
                      {user.email}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-[10px] text-[#6e6e73] border border-[#e5e5ea] uppercase font-semibold">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'student' && (
                    <a 
                      href="/student/dashboard?tab=notifications" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-sm text-[#1d1d1f] hover:text-[#0066cc]"
                    >
                      <Bell size={15} />
                      Notifications ({unreadCount} unread)
                    </a>
                  )}
                  <button 
                    onClick={() => { setIsOpen(false); handleLogout(); }} 
                    className="flex items-center justify-center gap-2 text-sm font-normal text-[#ff3b30] bg-[#ff3b30]/10 border border-[#ff3b30]/20 hover:bg-[#ff3b30]/15 py-2 rounded-full transition-all cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <a 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] py-2 rounded-full transition-all shadow-sm"
                  >
                    Sign in
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
