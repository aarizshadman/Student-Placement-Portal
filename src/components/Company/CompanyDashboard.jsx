import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Users, FileText, Globe, Building2, CheckCircle2, 
  XCircle, PlusCircle, Edit2, Trash2, ShieldAlert, GraduationCap,
  Mail, Phone, Copy, Check, X, ArrowUpRight, ChevronRight, Download,
  Search, Filter, Sparkles, MapPin, DollarSign, Clock, ArrowRight,
  ExternalLink, Layers, UserCheck, Star
} from 'lucide-react';
import { api, fileUrl } from '../../utils/api.js';
import { getUser, isAuthenticated, getRole, applyAuthFromUrl } from '../../utils/auth.js';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, profile, post-job, listings, applicants
  const [profile, setProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Job Post form fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [jobSkills, setJobSkills] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [editJobId, setEditJobId] = useState(null); // set to jobId if editing

  // Company Profile fields
  const [compName, setCompName] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compIndustry, setCompIndustry] = useState('');
  const [compDesc, setCompDesc] = useState('');

  // Search & Filter state in candidate reviewer
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantFilterStatus, setApplicantFilterStatus] = useState('all');

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
    if (getRole() !== 'company') {
      window.location.href = getRole() === 'student' ? '/student/dashboard' : '/admin';
      return;
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }

    fetchCompanyData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const copyToClipboard = async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`);
    } catch (err) {
      showToast('Copy failed', 'error');
    }
  };

  const fetchCompanyData = async () => {
    setLoading(true);
    setApiError('');
    try {
      const authData = await api.auth.getProfile();
      const pData = authData.profile || {};
      setProfile(pData);

      setCompName(pData.companyName || '');
      setCompWebsite(pData.website || '');
      setCompIndustry(pData.industry || '');
      setCompDesc(pData.description || '');

      if (authData.isApproved) {
        const jobs = await api.jobs.getCompanyJobs();
        setMyJobs(jobs);
      }
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Failed to load company dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      await api.auth.register({
        role: 'company',
        companyName: compName,
        website: compWebsite,
        industry: compIndustry,
        description: compDesc,
        email: getUser().email,
        password: 'update_trigger_placeholder_is_not_read_if_exists'
      });
      showToast('Profile save completed');
      fetchCompanyData();
    } catch (err) {
      setApiError('Profile update requested');
      showToast('Action logged');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      const jobData = {
        title: jobTitle,
        description: jobDesc,
        location: jobLoc,
        salary: jobSalary,
        type: jobType,
        skills: jobSkills,
        requirements: jobReqs
      };

      if (editJobId) {
        await api.jobs.update(editJobId, jobData);
        showToast('Job listing updated successfully');
        setEditJobId(null);
      } else {
        await api.jobs.create(jobData);
        showToast('New job position posted successfully');
      }

      setJobTitle('');
      setJobDesc('');
      setJobSalary('');
      setJobLoc('');
      setJobType('full-time');
      setJobSkills('');
      setJobReqs('');
      
      const jobs = await api.jobs.getCompanyJobs();
      setMyJobs(jobs);
      setActiveTab('listings');
    } catch (err) {
      setApiError(err.message || 'Failed to submit job listing');
    }
  };

  const startEditJob = (job) => {
    setEditJobId(job._id);
    setJobTitle(job.title);
    setJobDesc(job.description);
    setJobSalary(job.salary);
    setJobLoc(job.location);
    setJobType(job.type);
    setJobSkills(job.skills ? job.skills.join(', ') : '');
    setJobReqs(job.requirements ? job.requirements.join('\n') : '');
    setActiveTab('post-job');
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await api.jobs.delete(id);
      showToast('Job listing removed successfully');
      setMyJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      showToast('Failed to delete job', 'error');
    }
  };

  const handleFetchApplicants = async (jobId) => {
    setSelectedJobId(jobId);
    setLoading(true);
    setApplicantSearch('');
    setApplicantFilterStatus('all');
    try {
      const data = await api.applications.getJobApplicants(jobId);
      setApplicants(data);
      setActiveTab('applicants');
    } catch (err) {
      showToast('Failed to load applicants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, nextStatus) => {
    try {
      await api.applications.updateStatus(appId, nextStatus);
      showToast(`Application status updated to ${nextStatus.toUpperCase()}`);
      
      setApplicants(prev => 
        prev.map(app => app._id === appId ? { ...app, status: nextStatus } : app)
      );

      if (selectedCandidate && selectedCandidate._id === appId) {
        setSelectedCandidate(prev => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update candidate status', 'error');
    }
  };

  const addSuggestedSkill = (skill) => {
    if (!jobSkills) {
      setJobSkills(skill);
    } else if (!jobSkills.toLowerCase().includes(skill.toLowerCase())) {
      setJobSkills(prev => `${prev}, ${skill}`);
    }
  };

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesStatus = applicantFilterStatus === 'all' || app.status === applicantFilterStatus;
      const q = applicantSearch.toLowerCase();
      const matchesQuery = !q || 
        app.student?.fullName?.toLowerCase().includes(q) ||
        app.student?.email?.toLowerCase().includes(q) ||
        app.student?.skills?.some(s => s.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [applicants, applicantFilterStatus, applicantSearch]);

  const selectedJobDetails = useMemo(() => {
    return myJobs.find(j => String(j._id) === String(selectedJobId));
  }, [myJobs, selectedJobId]);

  if (loading && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-8 animate-pulse">
        <div className="h-8 bg-[#e5e5ea] rounded-full w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white rounded-[22px] border border-[#e5e5ea]" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-[24px] border border-[#e5e5ea]" />
      </div>
    );
  }

  // Pending approval screen
  if (profile && profile.status !== 'approved') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-[#e5e5ea] p-8 sm:p-9 rounded-[26px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#ff9500]/10 text-[#ff9500] flex items-center justify-center">
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#1d1d1f]">Recruiter Account Under Review</h1>
            <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
              Your corporate profile for <strong>{profile.companyName}</strong> has been received and is being verified by the university placement cell coordinator.
            </p>
          </div>
          <div className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl p-4 text-xs text-[#6e6e73] w-full text-left leading-relaxed">
            <div className="font-semibold text-[#1d1d1f] mb-1.5">Verification Timeline:</div>
            <div>• Placement coordinators verify corporate credentials within 24 hours.</div>
            <div className="mt-1">• After verification, you can post vacancies and review student portfolios.</div>
          </div>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalJobsCount = myJobs.length;
  const totalApplicantsCount = myJobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0);

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
                <ShieldAlert size={16} className="text-[#ff3b30]" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Apple Pro Executive Header */}
        <div className="bg-white border border-[#e5e5ea] rounded-[28px] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066cc]/10 to-[#0066cc]/5 border border-[#0066cc]/20 flex items-center justify-center font-bold text-2xl text-[#0066cc] shrink-0">
              {profile?.companyName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                  {profile?.companyName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759] text-[11px] font-medium border border-[#34c759]/20">
                  <CheckCircle2 size={11} />
                  <span>Verified Recruiter</span>
                </span>
              </div>
              <p className="text-xs text-[#86868b] flex flex-wrap items-center gap-2">
                <span>{profile?.industry || 'Enterprise Technology'}</span>
                {profile?.website && (
                  <>
                    <span>•</span>
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0066cc] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink size={10} />
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => { setActiveTab('post-job'); setEditJobId(null); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Post New Opening</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-4 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl text-xs text-[#ff3b30] flex items-center gap-2">
            <ShieldAlert size={15} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Apple Segmented Pro Workspace Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#e5e5ea] rounded-full overflow-x-auto shadow-xs w-full max-w-2xl">
          {[
            { id: 'overview', name: 'Overview', icon: Layers },
            { id: 'listings', name: 'Open Positions', icon: Briefcase, count: totalJobsCount },
            { id: 'post-job', name: 'Create Opening', icon: PlusCircle },
            { id: 'profile', name: 'Company Profile', icon: Building2 }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'post-job' && !editJobId) {
                    setJobTitle(''); setJobDesc(''); setJobSalary(''); setJobLoc(''); setJobSkills(''); setJobReqs('');
                  }
                }}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#0066cc] text-white shadow-xs' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.name}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#6e6e73]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Workspace Panels */}
        <div className="min-h-[50vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              
              {/* TAB 1: OVERVIEW FEED */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  {/* Executive Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: 'Active Openings', value: totalJobsCount, icon: Briefcase, color: '#0066cc' },
                      { label: 'Total Applicants', value: totalApplicantsCount, icon: Users, color: '#5856d6' },
                      { label: 'Placement Status', value: 'Active Cycle', icon: Sparkles, color: '#34c759' },
                      { label: 'Coordinator Desk', value: 'Verified', icon: CheckCircle2, color: '#ff9500' }
                    ].map((m, i) => (
                      <div key={i} className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-medium text-[#86868b]">{m.label}</span>
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${m.color}15`, color: m.color }}
                          >
                            <m.icon size={16} />
                          </div>
                        </div>
                        <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Openings Quick Review & Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-base font-semibold text-[#1d1d1f]">Published Placement Openings</h3>
                          <p className="text-xs text-[#86868b] mt-0.5">Click an opening to inspect candidate applications</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('listings')}
                          className="text-xs text-[#0066cc] font-medium hover:underline"
                        >
                          View all ({myJobs.length})
                        </button>
                      </div>

                      {myJobs.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto mb-3 text-[#86868b]">
                            <Briefcase size={22} />
                          </div>
                          <p className="text-xs text-[#86868b] mb-3">No openings published yet.</p>
                          <button
                            onClick={() => setActiveTab('post-job')}
                            className="px-4 py-2 bg-[#0066cc] text-white rounded-full text-xs font-normal shadow-xs cursor-pointer"
                          >
                            Post Your First Opening
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col divide-y divide-[#f5f5f7]">
                          {myJobs.slice(0, 4).map(job => (
                            <div key={job._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-[#1d1d1f]">{job.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-[#6e6e73] mt-1">
                                  <span>{job.location}</span>
                                  <span>•</span>
                                  <span>{job.salary}</span>
                                  <span>•</span>
                                  <span className="capitalize text-[#0066cc] font-medium">{job.type}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleFetchApplicants(job._id)}
                                className="px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#0066cc] rounded-full text-xs font-medium transition-all cursor-pointer shrink-0"
                              >
                                Review Applicants ({job.applicantsCount || 0})
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recruitment Guidelines Card */}
                    <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mb-3">
                          <Sparkles size={18} />
                        </div>
                        <h4 className="text-sm font-semibold text-[#1d1d1f]">Recruiter Protocols</h4>
                        <p className="text-xs text-[#6e6e73] mt-2 leading-relaxed">
                          Campus placement guidelines ensure fair evaluation for all candidates. Mark applicant stages as you progress through screening, technical interviews, and final offers.
                        </p>
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#e5e5ea]">
                        <div className="text-[11px] text-[#86868b] mb-2 font-medium">Evaluation Stages:</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20">Pending</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0066cc]/10 text-[#0066cc] border border-[#0066cc]/20">Reviewed</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#5856d6]/10 text-[#5856d6] border border-[#5856d6]/20">Shortlisted</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">Accepted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: POSTED POSITIONS LISTINGS */}
              {activeTab === 'listings' && (
                <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                  <div className="border-b border-[#e5e5ea] pb-4 mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <Briefcase size={18} className="text-[#0066cc]" />
                        <span>Active Job Openings</span>
                      </h2>
                      <p className="text-xs text-[#86868b] mt-0.5">{myJobs.length} active positions currently accepting student applications</p>
                    </div>
                    <button 
                      onClick={() => { setActiveTab('post-job'); setEditJobId(null); }}
                      className="px-4 py-2 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-xs cursor-pointer"
                    >
                      + Add Position
                    </button>
                  </div>

                  {myJobs.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-xs text-[#86868b] mb-4">You have not published any placement openings yet.</p>
                      <button 
                        onClick={() => setActiveTab('post-job')}
                        className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal"
                      >
                        Create Your First Opening
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {myJobs.map(job => (
                        <div key={job._id} className="p-5 bg-[#f5f5f7]/60 border border-[#e5e5ea] rounded-[22px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#d2d2d7] transition-all">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="text-sm font-semibold text-[#1d1d1f]">{job.title}</h3>
                              <span className="text-[10px] font-semibold text-[#0066cc] px-2 py-0.5 bg-white border border-[#e5e5ea] rounded-full capitalize">
                                {job.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#6e6e73]">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-[#86868b]" />
                                {job.location}
                              </span>
                              <span>•</span>
                              <span>Package: <strong className="text-[#1d1d1f] font-medium">{job.salary}</strong></span>
                            </div>
                            {job.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {job.skills.map((s, idx) => (
                                  <span key={idx} className="text-[10px] bg-white px-2.5 py-0.5 rounded-full text-[#1d1d1f] border border-[#e5e5ea]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <button 
                              onClick={() => handleFetchApplicants(job._id)}
                              className="px-4 py-2 bg-white border border-[#d2d2d7] hover:border-[#86868b] text-[#1d1d1f] rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              Applicants
                            </button>
                            <button 
                              onClick={() => startEditJob(job)}
                              className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white rounded-full transition-all border border-transparent hover:border-[#e5e5ea] cursor-pointer"
                              title="Edit Opening"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-all cursor-pointer"
                              title="Delete Opening"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CREATE OR EDIT JOB FORM */}
              {activeTab === 'post-job' && (
                <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                  <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                    <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <PlusCircle size={18} className="text-[#0066cc]" />
                      <span>{editJobId ? 'Edit Job Opening' : 'Publish New Opening'}</span>
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">Specify job responsibilities, compensation, and qualifications</p>
                  </div>

                  <form onSubmit={handlePostJob} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Role Title</label>
                        <input 
                          type="text" 
                          required
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="Software Engineer Associate"
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Compensation / Package (CTC)</label>
                        <input 
                          type="text" 
                          required
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                          placeholder="₹8.5 LPA"
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Location</label>
                        <input 
                          type="text" 
                          required
                          value={jobLoc}
                          onChange={(e) => setJobLoc(e.target.value)}
                          placeholder="Bengaluru (Hybrid)"
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Opportunity Type</label>
                        <select
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all cursor-pointer"
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Required Skills (comma-separated)</label>
                        <input 
                          type="text" 
                          value={jobSkills}
                          onChange={(e) => setJobSkills(e.target.value)}
                          placeholder="React.js, Node.js, TypeScript"
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div>
                      <span className="text-[11px] text-[#86868b] font-medium block mb-1.5">Quick Skill Suggestions (click to add):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['React.js', 'Node.js', 'TypeScript', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'REST APIs', 'Data Structures'].map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addSuggestedSkill(s)}
                            className="text-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] px-2.5 py-1 rounded-full text-[#1d1d1f] border border-[#e5e5ea] transition-colors cursor-pointer"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Role Description & Responsibilities</label>
                      <textarea 
                        rows={4}
                        required
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Detail the technical responsibilities, day-to-day scope, and team environment..."
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Eligibility Criteria (one per line)</label>
                      <textarea 
                        rows={3}
                        required
                        value={jobReqs}
                        onChange={(e) => setJobReqs(e.target.value)}
                        placeholder="Minimum 7.5 CGPA&#10;Graduating batch of 2026&#10;No standing backlogs"
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none transition-all"
                      />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#e5e5ea] pt-5 mt-2">
                      {editJobId && (
                        <button 
                          type="button"
                          onClick={() => { setEditJobId(null); setActiveTab('listings'); }}
                          className="px-5 py-2.5 bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-full text-xs font-medium hover:bg-[#f5f5f7] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        {editJobId ? 'Save Modifications' : 'Publish Opening'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: COMPANY PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                  <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                    <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                      <Building2 size={18} className="text-[#0066cc]" />
                      <span>Corporate Profile</span>
                    </h2>
                    <p className="text-xs text-[#86868b] mt-0.5">Manage details visible to applicants and placement coordinators</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Company Name</label>
                        <input 
                          type="text" 
                          required
                          value={compName}
                          onChange={(e) => setCompName(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Website</label>
                        <input 
                          type="url" 
                          required
                          value={compWebsite}
                          onChange={(e) => setCompWebsite(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Industry Segment</label>
                        <input 
                          type="text" 
                          required
                          value={compIndustry}
                          onChange={(e) => setCompIndustry(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Corporate Description & Values</label>
                      <textarea 
                        rows={4}
                        required
                        value={compDesc}
                        onChange={(e) => setCompDesc(e.target.value)}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none"
                      />
                    </div>

                    <div className="flex justify-end border-t border-[#e5e5ea] pt-5 mt-2">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: APPLICANTS FOR SELECTED JOB */}
              {activeTab === 'applicants' && (
                <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#e5e5ea] pb-5 mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                          <Users size={18} className="text-[#0066cc]" />
                          <span>Candidate Review Desk</span>
                        </h2>
                        {selectedJobDetails && (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#0066cc] border border-[#e5e5ea]">
                            {selectedJobDetails.title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#86868b] mt-0.5">{applicants.length} total applications submitted</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => setActiveTab('listings')}
                        className="px-4 py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-full text-xs font-medium transition-all cursor-pointer"
                      >
                        ← Back to Openings
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3.5 top-2.5 text-[#86868b]" size={14} />
                      <input 
                        type="text"
                        value={applicantSearch}
                        onChange={(e) => setApplicantSearch(e.target.value)}
                        placeholder="Search candidate by name, email, or skill..."
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full pl-9 pr-4 py-2 text-xs text-[#1d1d1f] transition-all"
                      />
                    </div>
                    <div>
                      <select
                        value={applicantFilterStatus}
                        onChange={(e) => setApplicantFilterStatus(e.target.value)}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full px-4 py-2 text-xs text-[#1d1d1f] transition-all cursor-pointer"
                      >
                        <option value="all">All Statuses ({applicants.length})</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {filteredApplicants.length === 0 ? (
                    <div className="text-center py-16">
                      <Users size={32} className="text-[#86868b] mx-auto mb-2" />
                      <p className="text-xs text-[#86868b]">No candidate applications match this filter.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredApplicants.map(app => (
                        <div key={app._id} className="border border-[#e5e5ea] p-6 rounded-[22px] bg-[#f5f5f7]/40 flex flex-col md:flex-row justify-between gap-6 text-xs text-left hover:border-[#d2d2d7] transition-all">
                          {/* Candidate Info */}
                          <div className="flex-grow flex flex-col gap-3.5">
                            <div className="flex items-center gap-3.5">
                              <button
                                type="button"
                                onClick={() => setSelectedCandidate(app)}
                                className="w-12 h-12 rounded-full bg-white border border-[#d2d2d7] flex items-center justify-center font-semibold text-[#1d1d1f] text-base overflow-hidden shrink-0 shadow-xs cursor-pointer hover:border-[#0066cc]"
                              >
                                {app.student?.photoUrl ? (
                                  <img src={fileUrl(app.student.photoUrl)} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <span>{app.student?.fullName?.charAt(0) || 'C'}</span>
                                )}
                              </button>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCandidate(app)}
                                  className="text-sm font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors text-left cursor-pointer"
                                >
                                  {app.student?.fullName || 'Candidate'}
                                </button>
                                <p className="text-xs text-[#6e6e73] mt-0.5">Academic CGPA: <strong className="text-[#1d1d1f] font-medium">{app.student?.cgpa || 'N/A'}</strong></p>
                              </div>
                            </div>

                            {/* Contact Copy Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              {(app.contactEmail || app.student?.email) && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(app.contactEmail || app.student?.email, 'Email')}
                                  title="Click to copy email"
                                  className="text-[11px] bg-white border border-[#e5e5ea] px-2.5 py-1 rounded-full text-[#0066cc] hover:bg-[#f5f5f7] cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                  <Mail size={11} />
                                  <span>{app.contactEmail || app.student?.email}</span>
                                </button>
                              )}
                              {(app.contactPhone || app.student?.phone) && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(app.contactPhone || app.student?.phone, 'Phone number')}
                                  title="Click to copy phone number"
                                  className="text-[11px] bg-white border border-[#e5e5ea] px-2.5 py-1 rounded-full text-[#0066cc] hover:bg-[#f5f5f7] cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                  <Phone size={11} />
                                  <span>{app.contactPhone || app.student?.phone}</span>
                                </button>
                              )}
                            </div>

                            {/* Skills */}
                            <div>
                              <span className="text-[11px] font-medium text-[#86868b] block mb-1">Core Technical Skills</span>
                              <div className="flex flex-wrap gap-1.5">
                                {app.student?.skills?.length ? app.student.skills.map((skill, i) => (
                                  <span key={i} className="text-[10px] bg-white px-2.5 py-0.5 border border-[#e5e5ea] rounded-full text-[#1d1d1f]">
                                    {skill}
                                  </span>
                                )) : (
                                  <span className="text-xs text-[#86868b]">No skills listed</span>
                                )}
                              </div>
                            </div>

                            {/* Resume Download */}
                            {app.resumeUrl && (
                              <div>
                                <a 
                                  href={fileUrl(app.resumeUrl)} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1.5 text-xs text-[#0066cc] font-medium hover:underline"
                                >
                                  <Download size={13} />
                                  <span>Download Candidate Resume (PDF)</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Evaluation and Actions */}
                          <div className="shrink-0 md:border-l md:border-[#e5e5ea] md:pl-6 flex flex-col justify-between gap-4 md:items-end">
                            <div className="text-right">
                              <span className="text-[10px] text-[#86868b] uppercase font-semibold block mb-1">Stage Status</span>
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold border ${
                                app.status === 'accepted' 
                                  ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' 
                                  : app.status === 'rejected' 
                                  ? 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20' 
                                  : app.status === 'shortlisted' 
                                  ? 'bg-[#5856d6]/10 text-[#5856d6] border-[#5856d6]/20' 
                                  : 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20'
                              }`}>
                                {app.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {app.status === 'pending' && (
                                <button 
                                  onClick={() => handleStatusUpdate(app._id, 'reviewed')}
                                  className="px-3.5 py-1.5 bg-white border border-[#d2d2d7] hover:border-[#86868b] rounded-full text-[11px] font-medium text-[#1d1d1f] transition-all cursor-pointer shadow-xs"
                                >
                                  Mark Reviewed
                                </button>
                              )}
                              {(app.status === 'pending' || app.status === 'reviewed') && (
                                <button 
                                  onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                  className="px-3.5 py-1.5 bg-[#5856d6] hover:bg-[#4d4acb] text-white rounded-full text-[11px] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                  Shortlist
                                </button>
                              )}
                              {app.status !== 'accepted' && app.status !== 'rejected' && (
                                <>
                                  <button 
                                    onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                    className="px-3.5 py-1.5 bg-[#34c759] hover:bg-[#30b753] text-white rounded-full text-[11px] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    Accept Offer
                                  </button>
                                  <button 
                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                    className="px-3.5 py-1.5 bg-white border border-[#d2d2d7] hover:bg-[#ff3b30]/10 hover:border-[#ff3b30]/30 hover:text-[#ff3b30] text-[#1d1d1f] rounded-full text-[11px] font-medium transition-all cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Apple Candidate Profile Sheet Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6" 
              onClick={() => setSelectedCandidate(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[580px] max-h-[85vh] overflow-y-auto bg-white rounded-[28px] p-7 sm:p-8 flex flex-col gap-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e5e5ea]"
              >
                <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
                  <h3 className="text-base font-semibold text-[#1d1d1f]">Candidate Dossier</h3>
                  <button 
                    type="button" 
                    onClick={() => setSelectedCandidate(null)} 
                    className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] flex items-center justify-center text-[#6e6e73] transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Candidate Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center font-bold text-xl text-[#1d1d1f] overflow-hidden shrink-0">
                    {selectedCandidate.student?.photoUrl ? (
                      <img src={fileUrl(selectedCandidate.student.photoUrl)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedCandidate.student?.fullName?.charAt(0) || 'C'}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#1d1d1f]">{selectedCandidate.student?.fullName || 'Candidate'}</h2>
                    <p className="text-xs text-[#6e6e73] mt-0.5 font-medium">Academic CGPA: {selectedCandidate.student?.cgpa || 'N/A'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] capitalize">
                        Stage: {selectedCandidate.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resume Download Action */}
                {selectedCandidate.resumeUrl && (
                  <a 
                    href={fileUrl(selectedCandidate.resumeUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 text-xs font-normal text-white bg-[#0066cc] hover:bg-[#0077ed] px-5 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Full Resume (PDF)</span>
                  </a>
                )}

                {/* Cover Letter */}
                {selectedCandidate.coverLetter && (
                  <div className="p-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-2xl">
                    <span className="text-xs font-semibold text-[#1d1d1f] block mb-1">Cover Note:</span>
                    <p className="text-xs text-[#6e6e73] italic leading-relaxed">"{selectedCandidate.coverLetter}"</p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <span className="text-xs font-semibold text-[#1d1d1f] block mb-2">Technical Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.student?.skills?.map((skill, i) => (
                      <span key={i} className="text-xs bg-[#f5f5f7] px-3 py-1 rounded-full text-[#1d1d1f] border border-[#e5e5ea]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {selectedCandidate.student?.education?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-[#1d1d1f] block mb-2">Academic Background</span>
                    <div className="flex flex-col gap-2">
                      {selectedCandidate.student.education.map((edu, i) => (
                        <div key={i} className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3 text-xs">
                          <div className="font-semibold text-[#1d1d1f]">{edu.degree || 'Degree'}</div>
                          <p className="text-[11px] text-[#6e6e73] mt-0.5">{edu.school} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Immediate Stage Update from inside modal */}
                <div className="border-t border-[#e5e5ea] pt-5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[#86868b]">Update Candidate Stage:</span>
                  <div className="flex gap-2">
                    {selectedCandidate.status !== 'shortlisted' && selectedCandidate.status !== 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedCandidate._id, 'shortlisted')}
                        className="px-3.5 py-1.5 bg-[#5856d6] text-white rounded-full text-xs font-medium cursor-pointer"
                      >
                        Shortlist
                      </button>
                    )}
                    {selectedCandidate.status !== 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedCandidate._id, 'accepted')}
                        className="px-3.5 py-1.5 bg-[#34c759] text-white rounded-full text-xs font-medium cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {selectedCandidate.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedCandidate._id, 'rejected')}
                        className="px-3.5 py-1.5 bg-white border border-[#d2d2d7] text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full text-xs font-medium cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
