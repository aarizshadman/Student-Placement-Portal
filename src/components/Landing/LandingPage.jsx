import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, ShieldCheck, Zap, Sparkles, LineChart, 
  HelpCircle, ChevronDown, Send, ArrowRight, Star, Check 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full bg-[#f5f5f7] overflow-hidden text-[#1d1d1f]">
      <HeroSection />
      <RecruitersMarquee />
      <FeaturesSection />
      <StatisticsSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}

// 1. Apple-style Hero Section with macOS Window Preview
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center bg-white border-b border-[#e5e5ea]">
      {/* Eyebrow badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full text-xs font-normal text-[#1d1d1f] mb-6 shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
        <span className="text-[#6e6e73]">University Placement Cycle 2026 is Live</span>
      </motion.div>

      {/* Main Title - Apple SF Pro Display aesthetic with negative tracking */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-[1.08] mb-6"
      >
        Where Student Talent <br />
        <span className="text-[#0066cc]">
          Connects with Enterprise.
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl text-base sm:text-lg text-[#6e6e73] mb-10 leading-relaxed font-normal"
      >
        CampusConnect streamlines college recruitment. Build your profile, track applications in real-time, and get guidance from our AI Placement Assistant.
      </motion.p>

      {/* Apple Dual Pill CTA Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-3.5 mb-16"
      >
        <a 
          href="/student" 
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] px-7 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.01] cursor-pointer"
        >
          <span>Student Portal</span>
          <ArrowRight size={15} />
        </a>
        <a 
          href="/company" 
          className="w-full sm:w-auto text-sm font-normal text-[#0066cc] bg-[#f5f5f7] border border-[#d2d2d7] hover:bg-[#e8e8ed] px-7 py-3 rounded-full transition-all duration-200 cursor-pointer"
        >
          Recruiter Portal
        </a>
      </motion.div>

      {/* Product Dashboard Preview (Apple macOS Window Chrome) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full max-w-5xl bg-[#f5f5f7] border border-[#d2d2d7] rounded-[22px] p-2.5 sm:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] text-left"
      >
        <div className="w-full rounded-[18px] bg-white border border-[#e5e5ea] overflow-hidden select-none shadow-sm">
          {/* macOS Top Chrome Header */}
          <div className="w-full h-10 bg-[#fbfbfd] border-b border-[#e5e5ea] flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
            <div className="text-[11px] font-normal text-[#86868b] bg-[#f5f5f7] px-4 py-1 rounded-full border border-[#e5e5ea]">
              campusconnect.edu/student/dashboard
            </div>
            <div className="w-8" />
          </div>
          
          {/* Mock Dashboard Layout */}
          <div className="w-full p-6 text-left grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#fbfbfd]">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-4 border-r border-[#e5e5ea] pr-6">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e5ea] rounded-xl text-xs text-[#1d1d1f] shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-[#34c759]" />
                <span className="font-medium">Aarav Sharma</span>
                <span className="text-[10px] text-[#86868b]">7.92 CGPA</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-[#86868b] font-semibold px-2">Navigation</div>
                <div className="text-xs font-medium text-[#0066cc] bg-[#0066cc]/10 px-3 py-1.5 rounded-lg">Overview</div>
                <div className="text-xs font-normal text-[#6e6e73] px-3 py-1.5 hover:bg-white rounded-lg">Jobs Listings</div>
                <div className="text-xs font-normal text-[#6e6e73] px-3 py-1.5 hover:bg-white rounded-lg">My Applications</div>
                <div className="text-xs font-normal text-[#6e6e73] px-3 py-1.5 hover:bg-white rounded-lg">Saved Roles</div>
              </div>
            </div>

            {/* Main Stats Frame */}
            <div className="md:col-span-3 flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-3.5">
                <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 shadow-2xs">
                  <div className="text-[11px] text-[#86868b] font-normal">Applied Roles</div>
                  <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">12</div>
                  <div className="text-[10px] text-[#34c759] font-medium mt-1">4 Active Shortlists</div>
                </div>
                <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 shadow-2xs">
                  <div className="text-[11px] text-[#86868b] font-normal">Average Package</div>
                  <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">₹8.5 LPA</div>
                  <div className="text-[10px] text-[#86868b] mt-1">CSE Graduates</div>
                </div>
                <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 shadow-2xs">
                  <div className="text-[11px] text-[#86868b] font-normal">Shortlist Rate</div>
                  <div className="text-2xl font-semibold text-[#1d1d1f] mt-1">82%</div>
                  <div className="text-[10px] text-[#34c759] font-medium mt-1">Profile Strength: High</div>
                </div>
              </div>

              {/* Mock Job Applications List */}
              <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4 shadow-2xs">
                <div className="text-xs font-semibold text-[#1d1d1f] mb-3">Recent Application Status</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-[#0066cc]/10 border border-[#0066cc]/20 rounded-lg flex items-center justify-center font-bold text-xs text-[#0066cc]">IBM</span>
                      <div>
                        <div className="font-medium text-[#1d1d1f]">Software Developer Intern</div>
                        <div className="text-[10px] text-[#86868b]">Applied 3 days ago</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#0066cc]/10 text-[#0066cc] font-medium text-[10px]">Shortlisted</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#f5f5f7] rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-[#ff9500]/10 border border-[#ff9500]/20 rounded-lg flex items-center justify-center font-bold text-xs text-[#ff9500]">TCS</span>
                      <div>
                        <div className="font-medium text-[#1d1d1f]">Associate Systems Engineer</div>
                        <div className="text-[10px] text-[#86868b]">Applied 1 week ago</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#34c759]/10 text-[#34c759] font-medium text-[10px]">Offer Received</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// 2. Recruiting Partners Marquee (Apple Partner Showcase)
function RecruitersMarquee() {
  const companies = ['IBM', 'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Meta', 'Capgemini'];
  
  return (
    <section className="w-full bg-[#f5f5f7] border-b border-[#e5e5ea] py-10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-5 text-center">
        <h3 className="text-xs uppercase tracking-widest font-medium text-[#86868b]">
          Trusted by Premier Global Recruitment Partners
        </h3>
      </div>
      
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f5f5f7] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f5f5f7] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee gap-6">
          {[...companies, ...companies].map((name, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-[#e5e5ea] rounded-full text-[#1d1d1f] font-medium text-xs tracking-tight shadow-2xs hover:border-[#d2d2d7] transition-colors"
            >
              <div className="w-4 h-4 bg-[#0066cc]/10 rounded-full flex items-center justify-center text-[9px] text-[#0066cc]">✓</div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3. Apple Product-Feature Tiles (Bento Grid)
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Tracking",
      description: "No more black-box waiting. Instantly see when recruiter teams view, shortlist, or update your application."
    },
    {
      icon: ShieldCheck,
      title: "Vetted Enterprise Partners",
      description: "Our Placement Cell approves registrations. Every job listing is legitimate, verified, and officially sanctioned."
    },
    {
      icon: Briefcase,
      title: "One-Click Application",
      description: "Upload your resume once. Apply to multiple job posts instantly with customized cover letters and portfolios."
    },
    {
      icon: Sparkles,
      title: "AI Placement Assistant",
      description: "Get immediate answers to recruitment timelines, resume criteria, placement records, and interview preparation."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold text-[#0066cc] uppercase tracking-widest">Platform Core</span>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-[#1d1d1f] mt-2">
          Engineered for Modern University Placements.
        </h2>
        <p className="text-base text-[#6e6e73] max-w-xl mx-auto mt-3">
          Designed with simplicity, speed, and precision so students and employers connect effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-[#e5e5ea] rounded-[22px] p-7 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center text-[#0066cc]">
              <feat.icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">{feat.title}</h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 4. Statistics Section (Apple Keynote Style)
function StatisticsSection() {
  const stats = [
    { value: "₹32 LPA", label: "Highest CTC Offered" },
    { value: "₹8.5 LPA", label: "Average CTC Package" },
    { value: "98.2%", label: "2025 Placement Rate" },
    { value: "120+", label: "Fortune 500 Recruiters" }
  ];

  return (
    <section id="statistics" className="py-20 bg-white border-y border-[#e5e5ea] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors">
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
              {stat.value}
            </span>
            <span className="text-xs text-[#86868b] font-normal">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// 5. Accordion FAQs Section (iOS Settings Style)
function FaqSection() {
  const faqs = [
    {
      q: "How do students get access to CampusConnect?",
      a: "All final-year students of the university are eligible. Register using your university email address. The Placement Cell automatically syncs and approves student registration records."
    },
    {
      q: "Can external companies recruit via CampusConnect?",
      a: "Yes. External companies register via the portal. Registrations enter a pending state and are reviewed by the Placement Cell Admin. Approved companies can post jobs immediately."
    },
    {
      q: "Where is my resume hosted?",
      a: "Your resume is stored securely. In production, we integrate with Cloudinary to handle PDF streams. If credentials are empty during development, files store locally on the server."
    },
    {
      q: "How does the AI Assistant Chatbot work?",
      a: "The chatbot provides instant responses to campus placements, eligibility criteria, average packages, and resume tips. It is built prepared for full IBM Watson Assistant integration."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-[#86868b] mt-2">Clear answers to common placement queries.</p>
      </div>

      <div className="bg-white border border-[#e5e5ea] rounded-[22px] overflow-hidden shadow-sm divide-y divide-[#e5e5ea]">
        {faqs.map((faq, idx) => (
          <div key={idx} className="transition-colors">
            <button 
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown 
                size={16} 
                className={`text-[#86868b] transform transition-transform duration-200 ${activeIndex === idx ? 'rotate-180 text-[#0066cc]' : ''}`} 
              />
            </button>
            
            {activeIndex === idx && (
              <div className="px-5 pb-5 text-xs text-[#6e6e73] leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// 6. Contact Section with Apple Support Clean Form
function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '34875612-c21b-4da5-8b01-5b6b04449c2a',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Message — Student Placement Portal',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 max-w-xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
          Contact Placement Cell
        </h2>
        <p className="text-xs text-[#86868b] mt-2">
          Recruiters, faculty members, and student coordinators can reach us directly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea] p-8 rounded-[24px] shadow-sm flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Full Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
            placeholder="Aarav Sharma"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Email Address</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
            placeholder="aarav@placement.edu"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Your Message</label>
          <textarea 
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none transition-all"
            placeholder="Hello, I would like to query about recruitment timelines..."
          />
        </div>

        <button 
          type="submit" 
          disabled={sent || loading}
          className="w-full flex items-center justify-center gap-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] py-3 rounded-full transition-all disabled:opacity-60 cursor-pointer mt-2 shadow-sm"
        >
          {sent ? (
            <span className="flex items-center gap-1.5">
              <Check size={16} />
              Message Sent Successfully
            </span>
          ) : loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={14} />
            </>
          )}
        </button>

        {error && (
          <p className="text-xs text-[#ff3b30] text-center mt-1">{error}</p>
        )}
      </form>
    </section>
  );
}
