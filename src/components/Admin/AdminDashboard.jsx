import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Building, Briefcase, FileText, CheckCircle2, 
  XCircle, Search, RefreshCw, BarChart2, Globe, ArrowUpRight,
  Download, Clock, Check, AlertCircle, ChevronRight
} from 'lucide-react';
import { api, fileUrl } from '../../utils/api.js';
import { isAuthenticated, getRole, clearSession, applyAuthFromUrl } from '../../utils/auth.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, students, companies, jobs
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Search filters
  const [searchStudent, setSearchStudent] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchJob, setSearchJob] = useState('');

  // Status indicators
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    applyAuthFromUrl();

    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    if (getRole() !== 'admin') {
      clearSession();
      window.location.href = '/login';
      return;
    }
    fetchAdminData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setApiError('');
    try {
      const metrics = await api.admin.getStats();
      setStats(metrics);

      const studs = await api.admin.getStudents();
      setStudents(studs);

      const comps = await api.admin.getCompanies();
      setCompanies(comps);

      const jobList = await api.admin.getJobs();
      setJobs(jobList);
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Failed to load administrator records.');
    } finally {
      setLoading(false);
    }
  };

  // Approve Company Registration
  const handleApproveCompany = async (companyId, decision) => {
    try {
      const res = await api.admin.approveCompany(companyId, decision);
      showToast(res.message);
      
      setCompanies(prev => 
        prev.map(c => c._id === companyId ? { ...c, status: decision, user: { ...c.user, isApproved: decision === 'approved' } } : c)
      );

      const metrics = await api.admin.getStats();
      setStats(metrics);
    } catch (err) {
      showToast('Failed to complete approval decision', 'error');
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-8 animate-pulse">
        <div className="h-8 bg-[#e5e5ea] rounded-full w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-[22px] border border-[#e5e5ea]" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-[24px] border border-[#e5e5ea]" />
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.skills.some(skill => skill.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchCompany.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchJob.toLowerCase()) ||
    j.company?.companyName.toLowerCase().includes(searchJob.toLowerCase())
  );

  const pendingCompanies = companies.filter(c => c.status === 'pending');

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Apple Floating Toast Alert */}
        <AnimatePresence>
          {toast.show && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#1d1d1f] text-white text-xs font-normal flex items-center gap-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.2)] border border-white/10 backdrop-blur-xl"
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={16} className="text-[#34c759]" />
              ) : (
                <XCircle size={16} className="text-[#ff3b30]" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[11px] font-medium text-[#0066cc] mb-2 shadow-xs">
              <Shield size={12} />
              <span>Placement Cell Administration</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Control Center
            </h1>
            <p className="text-xs text-[#86868b] mt-1">
              Supervise student verification, recruiter approvals, and recruitment cycles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAdminData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d2d2d7] hover:border-[#86868b] rounded-full text-xs font-medium text-[#1d1d1f] transition-all shadow-xs cursor-pointer active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw size={13} className="text-[#6e6e73]" />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-4 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl text-xs text-[#ff3b30] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Apple Segmented Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#e5e5ea] rounded-full overflow-x-auto shadow-xs w-full max-w-4xl">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart2 },
            { id: 'approvals', name: 'Approvals Queue', count: pendingCompanies.length, icon: CheckCircle2 },
            { id: 'students', name: 'Student Registry', icon: Users },
            { id: 'companies', name: 'Recruiters Directory', icon: Building },
            { id: 'jobs', name: 'Placements Registry', icon: Briefcase }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0066cc] text-white shadow-xs' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.name}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#ff9500]/15 text-[#ff9500]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panels Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === 'overview' && stats && (
              <div className="flex flex-col gap-8">
                {/* 4 Apple Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Total Enrolled Students', value: stats.summary?.totalStudents || 0, icon: Users, color: '#0066cc' },
                    { label: 'Corporate Recruiters', value: stats.summary?.totalCompanies || 0, icon: Building, color: '#5856d6' },
                    { label: 'Active Placement Posts', value: stats.summary?.totalJobs || 0, icon: Briefcase, color: '#34c759' },
                    { label: 'Candidate Applications', value: stats.summary?.totalApplications || 0, icon: FileText, color: '#ff9500' }
                  ].map((metric, i) => (
                    <div 
                      key={i} 
                      className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-[#86868b]">{metric.label}</span>
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
                        >
                          <metric.icon size={17} />
                        </div>
                      </div>
                      <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bars & statistics breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Funnel */}
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <h3 className="text-sm font-semibold text-[#1d1d1f] mb-6 flex items-center justify-between">
                      <span>Applications Funnel</span>
                      <span className="text-xs text-[#86868b] font-normal">Active Candidates</span>
                    </h3>
                    <div className="flex flex-col gap-4 text-xs">
                      {Object.entries(stats.applicationStatus || {}).map(([status, count]) => {
                        const total = stats.summary?.totalApplications || 1;
                        const percentage = ((count / total) * 100).toFixed(0);
                        
                        const colorMap = {
                          pending: '#ff9500',
                          reviewed: '#0066cc',
                          shortlisted: '#5856d6',
                          accepted: '#34c759',
                          rejected: '#ff3b30'
                        };

                        return (
                          <div key={status} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[#6e6e73]">
                              <span className="capitalize font-medium text-[#1d1d1f]">{status}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: colorMap[status] || '#0066cc'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Job Segment Breakdown */}
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <h3 className="text-sm font-semibold text-[#1d1d1f] mb-6 flex items-center justify-between">
                      <span>Placement Segments</span>
                      <span className="text-xs text-[#86868b] font-normal">By Opportunity Type</span>
                    </h3>
                    <div className="flex flex-col gap-4 text-xs">
                      {Object.entries(stats.jobTypes || {}).map(([type, count]) => {
                        const total = stats.summary?.totalJobs || 1;
                        const percentage = ((count / total) * 100).toFixed(0);
                        
                        const typeColors = {
                          'full-time': '#0066cc',
                          'part-time': '#5856d6',
                          'internship': '#34c759'
                        };

                        return (
                          <div key={type} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[#6e6e73]">
                              <span className="capitalize font-medium text-[#1d1d1f]">{type}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: typeColors[type] || '#0066cc'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs overflow-hidden">
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-5">
                    Recent Recruitment Activity
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#e5e5ea] text-[#86868b]">
                          <th className="pb-3 font-medium">Candidate</th>
                          <th className="pb-3 font-medium">Opening / Company</th>
                          <th className="pb-3 font-medium">Applied Date</th>
                          <th className="pb-3 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f5f5f7]">
                        {stats.recentActivity?.map(act => (
                          <tr key={act._id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                            <td className="py-3.5 font-medium text-[#1d1d1f]">{act.student?.fullName || 'Candidate'}</td>
                            <td className="py-3.5 text-[#6e6e73]">
                              {act.job?.title}
                            </td>
                            <td className="py-3.5 text-[#86868b]">{new Date(act.appliedAt).toLocaleDateString()}</td>
                            <td className="py-3.5 text-right">
                              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] capitalize">
                                {act.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RECRUITER APPROVALS QUEUE */}
            {activeTab === 'approvals' && (
              <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                  <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#0066cc]" />
                    <span>Recruiter Verification Queue</span>
                  </h2>
                  <p className="text-xs text-[#86868b] mt-1">Review newly registered recruiters before granting job posting authorization</p>
                </div>

                {pendingCompanies.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 rounded-full bg-[#34c759]/10 text-[#34c759] flex items-center justify-center mx-auto mb-3">
                      <Check size={22} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1d1d1f]">Queue is empty</h3>
                    <p className="text-xs text-[#86868b] mt-1">All recruiter profiles have been verified.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {pendingCompanies.map(comp => (
                      <div key={comp._id} className="border border-[#e5e5ea] p-5 rounded-[20px] bg-[#f5f5f7]/50 flex flex-col md:flex-row justify-between gap-5 text-xs text-left">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-sm font-semibold text-[#1d1d1f]">{comp.companyName}</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#ff9500]/15 text-[#ff9500] text-[10px] font-medium border border-[#ff9500]/20">
                              Pending Review
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#6e6e73] mt-1.5">
                            <span>Sector: <strong className="text-[#1d1d1f] font-medium">{comp.industry}</strong></span>
                            {comp.website && (
                              <a href={comp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#0066cc] hover:underline">
                                <Globe size={12} />
                                <span>{comp.website.replace(/^https?:\/\//, '')}</span>
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-[#6e6e73] mt-3 max-w-2xl leading-relaxed">
                            {comp.description}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                          <button 
                            onClick={() => handleApproveCompany(comp._id, 'approved')}
                            className="px-4 py-2 bg-[#34c759] hover:bg-[#30b753] text-white rounded-full font-medium text-xs transition-all active:scale-95 shadow-xs cursor-pointer"
                          >
                            Approve Access
                          </button>
                          <button 
                            onClick={() => handleApproveCompany(comp._id, 'rejected')}
                            className="px-4 py-2 bg-white border border-[#d2d2d7] hover:bg-[#ff3b30]/10 hover:border-[#ff3b30]/30 hover:text-[#ff3b30] text-[#1d1d1f] rounded-full font-medium text-xs transition-all active:scale-95 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STUDENTS DIRECTORY */}
            {activeTab === 'students' && (
              <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e5e5ea] pb-5 mb-6 gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Users size={18} className="text-[#0066cc]" />
                      <span>Student Roster</span>
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">{filteredStudents.length} candidate profiles registered</p>
                  </div>
                  <div className="relative w-full max-w-[280px]">
                    <Search className="absolute left-3.5 top-2.5 text-[#86868b]" size={14} />
                    <input 
                      type="text"
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      placeholder="Filter by name or skills..."
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5ea] text-[#86868b]">
                        <th className="pb-3 font-medium">Student Name</th>
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Phone</th>
                        <th className="pb-3 font-medium">Academic CGPA</th>
                        <th className="pb-3 font-medium text-right">Resume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f7]">
                      {filteredStudents.map(stud => (
                        <tr key={stud._id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                          <td className="py-3.5 font-medium text-[#1d1d1f]">{stud.fullName}</td>
                          <td className="py-3.5 text-[#6e6e73]">{stud.user?.email || 'N/A'}</td>
                          <td className="py-3.5 text-[#6e6e73]">{stud.phone || 'N/A'}</td>
                          <td className="py-3.5 text-[#1d1d1f] font-medium">{stud.cgpa ? `${stud.cgpa} CGPA` : '—'}</td>
                          <td className="py-3.5 text-right">
                            {stud.resumeUrl ? (
                              <a 
                                href={fileUrl(stud.resumeUrl)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0066cc]/10 hover:bg-[#0066cc]/15 text-[#0066cc] rounded-full text-[11px] font-medium transition-colors"
                              >
                                <Download size={12} />
                                <span>PDF</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-[#86868b]">No file</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: COMPANIES DIRECTORY */}
            {activeTab === 'companies' && (
              <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e5e5ea] pb-5 mb-6 gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Building size={18} className="text-[#0066cc]" />
                      <span>Corporate Partners</span>
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">{filteredCompanies.length} enterprise recruiters in database</p>
                  </div>
                  <div className="relative w-full max-w-[280px]">
                    <Search className="absolute left-3.5 top-2.5 text-[#86868b]" size={14} />
                    <input 
                      type="text"
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                      placeholder="Filter by name or industry..."
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5ea] text-[#86868b]">
                        <th className="pb-3 font-medium">Company Name</th>
                        <th className="pb-3 font-medium">Industry</th>
                        <th className="pb-3 font-medium">Contact Email</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f7]">
                      {filteredCompanies.map(comp => (
                        <tr key={comp._id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                          <td className="py-3.5 font-medium text-[#1d1d1f]">{comp.companyName}</td>
                          <td className="py-3.5 text-[#6e6e73]">{comp.industry}</td>
                          <td className="py-3.5 text-[#6e6e73]">{comp.user?.email || 'N/A'}</td>
                          <td className="py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              comp.status === 'approved' 
                                ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' 
                                : comp.status === 'rejected' 
                                ? 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20' 
                                : 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20'
                            }`}>
                              {comp.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {comp.status === 'pending' ? (
                              <button 
                                onClick={() => handleApproveCompany(comp._id, 'approved')}
                                className="text-xs text-[#0066cc] font-medium hover:underline cursor-pointer"
                              >
                                Approve
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApproveCompany(comp._id, comp.status === 'approved' ? 'rejected' : 'approved')}
                                className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] font-medium cursor-pointer"
                              >
                                {comp.status === 'approved' ? 'Revoke Access' : 'Restore Access'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: JOBS REGISTRY */}
            {activeTab === 'jobs' && (
              <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e5e5ea] pb-5 mb-6 gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Briefcase size={18} className="text-[#0066cc]" />
                      <span>Placements Registry</span>
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">{filteredJobs.length} active opportunities listed</p>
                  </div>
                  <div className="relative w-full max-w-[280px]">
                    <Search className="absolute left-3.5 top-2.5 text-[#86868b]" size={14} />
                    <input 
                      type="text"
                      value={searchJob}
                      onChange={(e) => setSearchJob(e.target.value)}
                      placeholder="Filter by title or company..."
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5ea] text-[#86868b]">
                        <th className="pb-3 font-medium">Opening Title</th>
                        <th className="pb-3 font-medium">Hiring Recruiter</th>
                        <th className="pb-3 font-medium">Location</th>
                        <th className="pb-3 font-medium">Opportunity Type</th>
                        <th className="pb-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f7]">
                      {filteredJobs.map(job => (
                        <tr key={job._id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                          <td className="py-3.5 font-medium text-[#1d1d1f]">{job.title}</td>
                          <td className="py-3.5 text-[#6e6e73]">{job.company?.companyName || 'N/A'}</td>
                          <td className="py-3.5 text-[#6e6e73]">{job.location}</td>
                          <td className="py-3.5 capitalize font-medium text-[#0066cc]">{job.type}</td>
                          <td className="py-3.5 text-right">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              job.status === 'active' 
                                ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' 
                                : 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
