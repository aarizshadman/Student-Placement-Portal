import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Briefcase, MessageCircle, User, Bell, Bookmark, FileText, 
  Search, MapPin, Building, Calendar, DollarSign, Upload, Plus, Trash2, 
  Send, ShieldAlert, CheckCircle2, Clock, X, ChevronRight, RefreshCw,
  Sparkles, Check, ArrowUpRight, Download, AlertCircle
} from 'lucide-react';
import { api, fileUrl } from '../../utils/api.js';
import { getUser, isAuthenticated, getRole, getEmail, applyAuthFromUrl } from '../../utils/auth.js';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, profile, jobs, applications, saved, chatbot, notifications
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLoc, setFilterLoc] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Status flags
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your CampusConnect AI Placement Assistant. Ask me anything regarding campus placement eligibility, interview advice, or current openings.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Profile Edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCgpa, setEditCgpa] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editEducation, setEditEducation] = useState([]);
  const [editProjects, setEditProjects] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [modalResumeFile, setModalResumeFile] = useState(null);
  const [modalUploading, setModalUploading] = useState(false);
  const [modalChangingResume, setModalChangingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    applyAuthFromUrl();

    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    if (getRole() !== 'student') {
      window.location.href = getRole() === 'admin' ? '/admin' : '/company/dashboard';
      return;
    }

    // Deep-link tab sync
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }

    fetchInitialData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchInitialData = async () => {
    setLoading(true);
    setApiError('');
    try {
      const authData = await api.auth.getProfile();
      const pData = authData.profile || {};
      setProfile(pData);
      
      setEditName(pData.fullName || '');
      setEditPhone(pData.phone || '');
      setEditCgpa(pData.cgpa || '');
      setEditSkills(pData.skills ? pData.skills.join(', ') : '');
      setEditEducation(pData.education || []);
      setEditProjects(pData.projects || []);

      setContactEmail(getEmail() || '');
      setContactPhone(pData.phone || '');

      const allJobs = await api.jobs.getAll();
      setJobs(allJobs);

      const recJobs = await api.students.getRecommendedJobs();
      setRecommended(recJobs);

      const sJobs = await api.students.getSavedJobs();
      setSavedJobs(sJobs);

      const apps = await api.applications.getStudentApplications();
      setApplications(apps);

      const notifs = await api.students.getNotifications();
      setNotifications(notifs);

    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Failed to fetch portal data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      const updated = await api.students.updateProfile({
        fullName: editName,
        phone: editPhone,
        cgpa: parseFloat(editCgpa),
        skills: editSkills,
        education: editEducation,
        projects: editProjects
      });
      setProfile(updated);
      showToast('Profile updated successfully');
    } catch (err) {
      setApiError(err.message || 'Failed to update profile');
      window.scrollTo(0, 0);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!photoFile && !resumeFile) return;
    setUploadProgress(true);
    try {
      const formData = new FormData();
      if (photoFile) formData.append('photo', photoFile);
      if (resumeFile) formData.append('resume', resumeFile);

      const response = await api.students.uploadFiles(formData);
      
      setProfile(prev => ({
        ...prev,
        photoUrl: response.photoUrl || prev.photoUrl,
        resumeUrl: response.resumeUrl || prev.resumeUrl
      }));
      
      setPhotoFile(null);
      setResumeFile(null);
      showToast('Files uploaded successfully');
    } catch (err) {
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleModalResumeUpload = async () => {
    if (!modalResumeFile) return;
    setModalUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', modalResumeFile);

      const response = await api.students.uploadFiles(formData);

      setProfile(prev => ({
        ...prev,
        resumeUrl: response.resumeUrl || prev.resumeUrl
      }));
      setModalResumeFile(null);
      showToast('Resume uploaded successfully');
    } catch (err) {
      showToast(err.message || 'Resume upload failed', 'error');
    } finally {
      setModalUploading(false);
    }
  };

  const handleApplyJob = async () => {
    if (!selectedJob) return;
    if (submitting) return;
    setApiError('');
    setSubmitting(true);
    try {
      await api.applications.apply({
        jobId: selectedJob._id,
        coverLetter,
        contactEmail,
        contactPhone
      });
      
      showToast(`Successfully applied for ${selectedJob.title}`);
      setSelectedJob(null);
      setCoverLetter('');
      setModalResumeFile(null);
      setModalChangingResume(false);
      
      const apps = await api.applications.getStudentApplications();
      setApplications(apps);
    } catch (err) {
      showToast(err.message || 'Failed to apply.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSave = async (jobId) => {
    try {
      const res = await api.students.toggleSaveJob(jobId);
      showToast(res.message);
      
      const sJobs = await api.students.getSavedJobs();
      setSavedJobs(sJobs);
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.students.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      // Fail silently
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const data = await api.chatbot.sendMessage(userMessage);
      setChatMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'I encountered an issue connecting to the placement AI assistant. Please try again in a moment.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-8 animate-pulse">
        <div className="h-8 bg-[#e5e5ea] rounded-full w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white rounded-[22px] border border-[#e5e5ea]" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-[24px] border border-[#e5e5ea]" />
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = filterType === 'all' || job.type === filterType;
    const matchesLoc = filterLoc === 'all' || job.location.toLowerCase().includes(filterLoc.toLowerCase());
    
    return matchesSearch && matchesType && matchesLoc;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Apple Floating Toast */}
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

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[11px] font-medium text-[#0066cc] mb-2 shadow-xs">
              <Award size={12} />
              <span>Student Placement Candidate</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Welcome, {profile?.fullName || 'Student'}
            </h1>
            <p className="text-xs text-[#86868b] mt-1">
              Explore enterprise openings, track ongoing applications, and manage your placement profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchInitialData} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d2d2d7] hover:border-[#86868b] rounded-full text-xs font-medium text-[#1d1d1f] transition-all shadow-xs cursor-pointer active:scale-95"
              title="Refresh Records"
            >
              <RefreshCw size={13} className="text-[#6e6e73]" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="p-4 bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl text-xs text-[#ff3b30] flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Layout: Apple Sidebar + Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Apple Sidebar */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider px-3 mb-1">
              Portal Menu
            </div>
            {[
              { id: 'overview', name: 'Overview', icon: Award },
              { id: 'profile', name: 'Student Profile', icon: User },
              { id: 'jobs', name: 'Jobs Feed', icon: Briefcase, count: jobs.length },
              { id: 'applications', name: 'My Applications', icon: FileText, count: applications.length },
              { id: 'saved', name: 'Saved Openings', icon: Bookmark, count: savedJobs.length },
              { id: 'chatbot', name: 'AI Placement Bot', icon: MessageCircle },
              { id: 'notifications', name: 'Notifications', icon: Bell, count: notifications.filter(n => !n.read).length }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-150 ${
                    isActive 
                      ? 'bg-white text-[#0066cc] border border-[#e5e5ea] shadow-xs' 
                      : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <tab.icon size={15} className={isActive ? 'text-[#0066cc]' : 'text-[#86868b]'} />
                    <span>{tab.name}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-[#f5f5f7] text-[#6e6e73] border border-[#e5e5ea]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Workspace Panels */}
          <div className="lg:col-span-3 min-h-[50vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-6">
                    {/* 3 Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 shadow-xs">
                        <div className="text-xs font-medium text-[#86868b]">Applied Positions</div>
                        <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-2">{applications.length}</div>
                        <div className="text-xs text-[#34c759] font-medium mt-1.5 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>{applications.filter(a => a.status === 'shortlisted').length} shortlisted</span>
                        </div>
                      </div>
                      <div className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 shadow-xs">
                        <div className="text-xs font-medium text-[#86868b]">Academic CGPA</div>
                        <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-2">{profile?.cgpa || '0.00'}</div>
                        <div className="text-xs text-[#86868b] mt-1.5">Out of 10.0 scale</div>
                      </div>
                      <div className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 shadow-xs">
                        <div className="text-xs font-medium text-[#86868b]">Saved Openings</div>
                        <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-2">{savedJobs.length}</div>
                        <div className="text-xs text-[#0066cc] font-medium mt-1.5">Bookmarked for later</div>
                      </div>
                    </div>

                    {/* Profile Health check callout */}
                    {(!profile?.resumeUrl || !profile?.skills?.length) && (
                      <div className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 shadow-xs flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#ff9500]/10 text-[#ff9500] flex items-center justify-center shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-semibold text-[#1d1d1f]">Complete Your Placement Dossier</h4>
                          <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed">
                            Upload your official resume PDF and list your primary technical stack. Recruiters filter candidates based on resume completeness.
                          </p>
                          <button
                            onClick={() => setActiveTab('profile')}
                            className="mt-3 px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#0066cc] rounded-full text-xs font-medium transition-all cursor-pointer"
                          >
                            Update Profile Details
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Recommended Jobs */}
                    <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                          <Sparkles size={16} className="text-[#0066cc]" />
                          <span>Recommended Openings</span>
                        </h3>
                        <button
                          onClick={() => setActiveTab('jobs')}
                          className="text-xs text-[#0066cc] font-medium hover:underline"
                        >
                          View all ({jobs.length})
                        </button>
                      </div>

                      {recommended.length === 0 ? (
                        <p className="text-xs text-[#86868b] text-center py-8">No specific skill matches yet. Explore all openings in the Jobs Feed.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {recommended.slice(0, 4).map(job => (
                            <div key={job._id} className="p-5 bg-[#f5f5f7]/50 border border-[#e5e5ea] rounded-[20px] flex flex-col justify-between gap-4 hover:border-[#d2d2d7] transition-all">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-semibold text-[#0066cc] px-2.5 py-0.5 bg-white border border-[#e5e5ea] rounded-full capitalize">
                                    {job.type}
                                  </span>
                                  <span className="text-xs text-[#86868b]">{job.location}</span>
                                </div>
                                <h4 
                                  className="text-sm font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer" 
                                  onClick={() => { setSelectedJob(job); setActiveTab('jobs'); }}
                                >
                                  {job.title}
                                </h4>
                                <p className="text-xs text-[#6e6e73] mt-1">{job.company?.companyName}</p>
                              </div>
                              <div className="flex items-center justify-between border-t border-[#e5e5ea] pt-3.5">
                                <span className="text-xs font-medium text-[#1d1d1f]">{job.salary}</span>
                                <button 
                                  onClick={() => { setSelectedJob(job); setActiveTab('jobs'); }} 
                                  className="text-xs font-medium text-[#0066cc] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <span>View Opening</span>
                                  <ChevronRight size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: PROFILE EDIT & UPLOAD */}
                {activeTab === 'profile' && (
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                      <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <User size={18} className="text-[#0066cc]" />
                        <span>Professional Student Profile</span>
                      </h2>
                      <p className="text-xs text-[#86868b] mt-0.5">Maintain your credentials, projects, and resume document</p>
                    </div>

                    {/* Photo & Resume Upload */}
                    <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-[#e5e5ea] pb-8">
                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4">
                          {profile?.photoUrl ? (
                            <img src={fileUrl(profile.photoUrl)} alt="Avatar" className="w-14 h-14 rounded-full border border-[#d2d2d7] object-cover shrink-0" />
                          ) : (
                            <div className="w-14 h-14 rounded-full border border-[#d2d2d7] bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] font-semibold text-lg shrink-0">
                              {profile?.fullName?.charAt(0) || 'P'}
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setPhotoFile(e.target.files[0])}
                            className="text-xs text-[#6e6e73] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#f5f5f7] file:text-[#1d1d1f] hover:file:bg-[#e8e8ed] cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-2">Resume PDF</label>
                        <div className="flex flex-col gap-2">
                          {profile?.resumeUrl && (
                            <a 
                              href={fileUrl(profile.resumeUrl)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 text-xs text-[#0066cc] font-medium hover:underline"
                            >
                              <FileText size={14} />
                              <span>View Current Resume (PDF)</span>
                            </a>
                          )}
                          <input 
                            type="file" 
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                            className="text-xs text-[#6e6e73] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#f5f5f7] file:text-[#1d1d1f] hover:file:bg-[#e8e8ed] cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 flex justify-end">
                        <button 
                          type="submit"
                          disabled={uploadProgress || (!photoFile && !resumeFile)}
                          className="flex items-center gap-2 px-5 py-2 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Upload size={13} />
                          <span>{uploadProgress ? 'Uploading...' : 'Save Uploaded Documents'}</span>
                        </button>
                      </div>
                    </form>

                    {/* Profile Fields Form */}
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Contact Phone</label>
                          <input 
                            type="text" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Academic CGPA</label>
                          <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            max="10"
                            required
                            value={editCgpa}
                            onChange={(e) => setEditCgpa(e.target.value)}
                            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">Skills (comma-separated)</label>
                        <input 
                          type="text" 
                          value={editSkills}
                          onChange={(e) => setEditSkills(e.target.value)}
                          placeholder="React.js, Node.js, Python, MongoDB"
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>

                      {/* Education Entries */}
                      <div>
                        <div className="flex items-center justify-between border-t border-[#e5e5ea] pt-5 mt-3 mb-3">
                          <label className="text-xs font-semibold text-[#1d1d1f]">Education Milestones</label>
                          <button 
                            type="button"
                            onClick={() => setEditEducation([...editEducation, { school: '', degree: '', year: '' }])}
                            className="flex items-center gap-1 text-xs text-[#0066cc] font-medium hover:underline cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Add Education</span>
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          {editEducation.map((edu, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-[#f5f5f7] border border-[#e5e5ea] p-3 rounded-xl">
                              <input 
                                type="text" 
                                required
                                value={edu.school}
                                onChange={(e) => {
                                  const newEdu = [...editEducation];
                                  newEdu[idx].school = e.target.value;
                                  setEditEducation(newEdu);
                                }}
                                placeholder="University / College"
                                className="flex-grow bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                              />
                              <input 
                                type="text" 
                                required
                                value={edu.degree}
                                onChange={(e) => {
                                  const newEdu = [...editEducation];
                                  newEdu[idx].degree = e.target.value;
                                  setEditEducation(newEdu);
                                }}
                                placeholder="Degree (e.g. B.Tech CSE)"
                                className="flex-grow bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                              />
                              <input 
                                type="text" 
                                required
                                value={edu.year}
                                onChange={(e) => {
                                  const newEdu = [...editEducation];
                                  newEdu[idx].year = e.target.value;
                                  setEditEducation(newEdu);
                                }}
                                placeholder="Year"
                                className="w-24 bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                              />
                              <button 
                                type="button" 
                                onClick={() => setEditEducation(editEducation.filter((_, i) => i !== idx))}
                                className="text-[#ff3b30] p-1.5 hover:bg-[#ff3b30]/10 rounded-full cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects Entries */}
                      <div>
                        <div className="flex items-center justify-between border-t border-[#e5e5ea] pt-5 mt-3 mb-3">
                          <label className="text-xs font-semibold text-[#1d1d1f]">Portfolio Projects</label>
                          <button 
                            type="button"
                            onClick={() => setEditProjects([...editProjects, { title: '', description: '', link: '' }])}
                            className="flex items-center gap-1 text-xs text-[#0066cc] font-medium hover:underline cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Add Project</span>
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          {editProjects.map((proj, idx) => (
                            <div key={idx} className="flex flex-col gap-2.5 bg-[#f5f5f7] border border-[#e5e5ea] p-4 rounded-xl">
                              <div className="flex items-center gap-3">
                                <input 
                                  type="text" 
                                  required
                                  value={proj.title}
                                  onChange={(e) => {
                                    const newProj = [...editProjects];
                                    newProj[idx].title = e.target.value;
                                    setEditProjects(newProj);
                                  }}
                                  placeholder="Project Title"
                                  className="flex-grow bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                                />
                                <input 
                                  type="url" 
                                  value={proj.link}
                                  onChange={(e) => {
                                    const newProj = [...editProjects];
                                    newProj[idx].link = e.target.value;
                                    setEditProjects(newProj);
                                  }}
                                  placeholder="GitHub / Live Link"
                                  className="flex-grow bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => setEditProjects(editProjects.filter((_, i) => i !== idx))}
                                  className="text-[#ff3b30] p-1.5 hover:bg-[#ff3b30]/10 rounded-full cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <input 
                                type="text" 
                                required
                                value={proj.description}
                                onChange={(e) => {
                                  const newProj = [...editProjects];
                                  newProj[idx].description = e.target.value;
                                  setEditProjects(newProj);
                                }}
                                placeholder="Summary of architecture, impact, and tech stack..."
                                className="w-full bg-white border border-[#d2d2d7] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-[#e5e5ea] pt-5 mt-3">
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 3: JOBS FEED */}
                {activeTab === 'jobs' && (
                  <div className="flex flex-col gap-6">
                    {/* Apple Search & Filters Bar */}
                    <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-xs">
                      <div className="relative md:col-span-2">
                        <Search className="absolute left-3.5 top-2.5 text-[#86868b]" size={15} />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search positions by title, keyword, or skills..."
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full pl-10 pr-4 py-2 text-xs text-[#1d1d1f] transition-all"
                        />
                      </div>
                      <div>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full px-4 py-2 text-xs text-[#1d1d1f] transition-all cursor-pointer"
                        >
                          <option value="all">All Employment Types</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <select
                          value={filterLoc}
                          onChange={(e) => setFilterLoc(e.target.value)}
                          className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full px-4 py-2 text-xs text-[#1d1d1f] transition-all cursor-pointer"
                        >
                          <option value="all">All Locations</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Noida">Noida</option>
                          <option value="Mumbai">Mumbai</option>
                        </select>
                      </div>
                    </div>

                    {/* Jobs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredJobs.length === 0 ? (
                        <div className="md:col-span-2 bg-white border border-[#e5e5ea] rounded-[24px] p-12 text-center shadow-xs">
                          <Briefcase size={32} className="text-[#86868b] mx-auto mb-2" />
                          <p className="text-xs text-[#86868b]">No job postings found matching your search criteria.</p>
                        </div>
                      ) : (
                        filteredJobs.map(job => {
                          const isJobSaved = savedJobs.some(s => s._id === job._id);
                          const isJobApplied = applications.some(a => a.job?._id === job._id);
                          
                          return (
                            <div 
                              key={job._id} 
                              className="bg-white border border-[#e5e5ea] rounded-[22px] p-6 flex flex-col justify-between gap-5 shadow-xs hover:shadow-sm transition-all"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="text-[10px] font-semibold text-[#0066cc] px-2.5 py-0.5 bg-[#0066cc]/10 border border-[#0066cc]/20 rounded-full capitalize">
                                    {job.type}
                                  </span>
                                  <button 
                                    onClick={() => handleToggleSave(job._id)}
                                    className="p-1.5 text-[#86868b] hover:text-[#0066cc] rounded-full transition-colors cursor-pointer"
                                    title={isJobSaved ? 'Remove from saved' : 'Save position'}
                                  >
                                    <Bookmark size={15} fill={isJobSaved ? '#0066cc' : 'none'} className={isJobSaved ? 'text-[#0066cc]' : ''} />
                                  </button>
                                </div>
                                <h3 className="text-base font-semibold text-[#1d1d1f]">{job.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-[#6e6e73] mt-1">
                                  <span>{job.company?.companyName}</span>
                                  <span>•</span>
                                  <span>{job.location}</span>
                                </div>
                                <p className="text-xs text-[#6e6e73] leading-relaxed mt-3 line-clamp-3">
                                  {job.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                  {job.skills.map((skill, idx) => (
                                    <span key={idx} className="text-[10px] text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full border border-[#e5e5ea]">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-[#e5e5ea] pt-4 mt-1">
                                <span className="text-xs font-semibold text-[#1d1d1f]">{job.salary}</span>
                                {isJobApplied ? (
                                  <span className="text-xs font-medium text-[#34c759] flex items-center gap-1.5 bg-[#34c759]/10 border border-[#34c759]/20 px-3 py-1 rounded-full">
                                    <CheckCircle2 size={13} />
                                    <span>Applied</span>
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => setSelectedJob(job)}
                                    className="px-4 py-1.5 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all shadow-xs active:scale-95 cursor-pointer"
                                  >
                                    Apply Now
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: MY APPLICATIONS */}
                {activeTab === 'applications' && (
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                      <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <FileText size={18} className="text-[#0066cc]" />
                        <span>Job Applications Tracker</span>
                      </h2>
                      <p className="text-xs text-[#86868b] mt-0.5">Real-time status updates from recruiters</p>
                    </div>

                    {applications.length === 0 ? (
                      <div className="text-center py-16">
                        <FileText size={32} className="text-[#86868b] mx-auto mb-2" />
                        <p className="text-xs text-[#86868b]">You have not applied for any placement positions yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {applications.map(app => {
                          const statusClasses = {
                            pending: 'bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/20',
                            reviewed: 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/20',
                            shortlisted: 'bg-[#5856d6]/10 text-[#5856d6] border-[#5856d6]/20',
                            accepted: 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20',
                            rejected: 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20'
                          };
                          
                          return (
                            <div key={app._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#f5f5f7]/50 border border-[#e5e5ea] rounded-[20px] gap-4">
                              <div>
                                <h3 className="text-sm font-semibold text-[#1d1d1f]">{app.job?.title}</h3>
                                <p className="text-xs text-[#6e6e73] mt-1">{app.job?.company?.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                {app.coverLetter && (
                                  <p className="text-xs text-[#6e6e73] mt-2 bg-white border border-[#e5e5ea] p-3 rounded-xl max-w-xl italic">
                                    "{app.coverLetter}"
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 flex items-center justify-between md:justify-end gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusClasses[app.status] || statusClasses.pending}`}>
                                  {app.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SAVED JOBS */}
                {activeTab === 'saved' && (
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                      <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <Bookmark size={18} className="text-[#0066cc]" />
                        <span>Saved Bookmarks</span>
                      </h2>
                      <p className="text-xs text-[#86868b] mt-0.5">{savedJobs.length} opportunities pinned for later</p>
                    </div>

                    {savedJobs.length === 0 ? (
                      <div className="text-center py-16">
                        <Bookmark size={32} className="text-[#86868b] mx-auto mb-2" />
                        <p className="text-xs text-[#86868b]">You do not have any bookmarked job openings.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedJobs.map(job => (
                          <div key={job._id} className="p-5 bg-[#f5f5f7]/50 border border-[#e5e5ea] rounded-[20px] flex flex-col justify-between gap-4">
                            <div>
                              <h3 
                                className="text-sm font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer" 
                                onClick={() => { setSelectedJob(job); setActiveTab('jobs'); }}
                              >
                                {job.title}
                              </h3>
                              <p className="text-xs text-[#6e6e73] mt-1">{job.company?.companyName}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#e5e5ea] pt-3">
                              <button 
                                onClick={() => handleToggleSave(job._id)}
                                className="text-xs text-[#ff3b30] hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                              <button 
                                onClick={() => { setSelectedJob(job); setActiveTab('jobs'); }}
                                className="px-3 py-1 bg-white border border-[#d2d2d7] rounded-full text-xs font-medium text-[#1d1d1f] hover:border-[#0066cc] cursor-pointer"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: CHATBOT PANEL (APPLE MESSAGES STYLE) */}
                {activeTab === 'chatbot' && (
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-6 flex flex-col h-[65vh] shadow-xs">
                    <div className="border-b border-[#e5e5ea] pb-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#34c759]" />
                        <span className="text-xs font-semibold text-[#1d1d1f]">CampusConnect AI Placement Assistant</span>
                      </div>
                      <span className="text-[10px] text-[#6e6e73] px-2.5 py-0.5 bg-[#f5f5f7] border border-[#e5e5ea] rounded-full">
                        Powered by AI
                      </span>
                    </div>

                    {/* Messages Thread */}
                    <div className="flex-grow overflow-y-auto pr-2 flex flex-col gap-3 text-xs mb-4">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`max-w-[78%] rounded-[18px] px-4 py-2.5 leading-relaxed ${
                            msg.sender === 'bot' 
                              ? 'self-start bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]' 
                              : 'self-end bg-[#0066cc] text-white shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="self-start bg-[#f5f5f7] border border-[#e5e5ea] rounded-[18px] px-4 py-2 text-xs text-[#86868b] animate-pulse">
                          Assistant is composing reply...
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleChatSubmit} className="flex gap-2.5 mt-auto border-t border-[#e5e5ea] pt-3">
                      <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about placement timelines, salary standards, or resume guidance..."
                        className="flex-grow bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-full px-4 py-2.5 text-xs text-[#1d1d1f]"
                      />
                      <button 
                        type="submit"
                        disabled={chatLoading || !chatInput.trim()}
                        className="bg-[#0066cc] hover:bg-[#0077ed] w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-all active:scale-95 shadow-xs"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 7: NOTIFICATIONS */}
                {activeTab === 'notifications' && (
                  <div className="bg-white border border-[#e5e5ea] rounded-[24px] p-7 shadow-xs">
                    <div className="border-b border-[#e5e5ea] pb-4 mb-6">
                      <h2 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <Bell size={18} className="text-[#0066cc]" />
                        <span>System Notifications</span>
                      </h2>
                      <p className="text-xs text-[#86868b] mt-0.5">Official communication from the placement cell and recruiters</p>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#86868b] text-center py-10">You have no new notifications.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {notifications.map(n => (
                          <div 
                            key={n._id}
                            onClick={() => !n.read && handleMarkRead(n._id)}
                            className={`p-4 rounded-[18px] transition-all text-xs flex justify-between items-start gap-4 ${
                              n.read 
                                ? 'bg-white border border-[#e5e5ea] text-[#6e6e73]' 
                                : 'bg-[#0066cc]/5 border border-[#0066cc]/20 text-[#1d1d1f] cursor-pointer hover:bg-[#0066cc]/10'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-sm">{n.title}</div>
                              <p className="mt-1 text-xs text-[#6e6e73] leading-relaxed">{n.message}</p>
                            </div>
                            {!n.read && (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-[#0066cc] mt-1.5" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Apple Apply to Job Sheet Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => { setSelectedJob(null); setModalResumeFile(null); setModalChangingResume(false); }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[520px] bg-white rounded-[26px] p-7 flex flex-col gap-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e5e5ea]"
              >
                <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#1d1d1f]">Apply to Position</h3>
                    <p className="text-xs text-[#86868b] mt-0.5">{selectedJob.title} • {selectedJob.company?.companyName}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setSelectedJob(null); setModalResumeFile(null); setModalChangingResume(false); }} 
                    className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] flex items-center justify-center text-[#6e6e73] transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Resume Status in Modal */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">Resume Attachment</label>
                  {profile?.resumeUrl ? (
                    <div className="bg-[#f5f5f7] border border-[#e5e5ea] p-3.5 rounded-2xl text-xs text-[#1d1d1f] flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <FileText size={14} className="text-[#0066cc]" />
                          Profile Resume Linked
                        </span>
                        <a 
                          href={fileUrl(profile.resumeUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#0066cc] hover:underline font-medium text-xs"
                        >
                          Preview
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {modalChangingResume ? (
                          <>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => setModalResumeFile(e.target.files[0])}
                              className="flex-1 text-xs text-[#6e6e73] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-medium file:bg-white file:text-[#1d1d1f]"
                            />
                            <button
                              type="button"
                              onClick={handleModalResumeUpload}
                              disabled={!modalResumeFile || modalUploading}
                              className="px-3 py-1 bg-[#0066cc] text-white rounded-full text-xs font-normal disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              {modalUploading ? 'Uploading...' : 'Replace'}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setModalChangingResume(true)}
                            className="text-xs text-[#0066cc] font-medium hover:underline cursor-pointer"
                          >
                            Replace with new file
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#ff9500]/10 border border-[#ff9500]/20 p-3.5 rounded-2xl text-xs text-[#ff9500] flex flex-col gap-2">
                      <span>No resume detected on profile. Please attach a PDF resume to apply.</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setModalResumeFile(e.target.files[0])}
                          className="flex-1 text-xs text-[#6e6e73] file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-medium file:bg-white file:text-[#1d1d1f]"
                        />
                        <button
                          type="button"
                          onClick={handleModalResumeUpload}
                          disabled={!modalResumeFile || modalUploading}
                          className="px-3 py-1 bg-[#0066cc] text-white rounded-full text-xs font-normal disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {modalUploading ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pitch / Cover letter */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Note to Recruiter (Optional)</label>
                  <textarea 
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state your relevant skills and motivation for this role..."
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] resize-none"
                  />
                </div>

                {/* Contact info */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Contact Verification</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-[#86868b] mb-1">Email</span>
                      <input 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#86868b] mb-1">Phone</span>
                      <input 
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-[#f5f5f7] border border-[#d2d2d7] focus:border-[#0066cc] focus:bg-white focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-[#e5e5ea] pt-4 mt-2">
                  <button 
                    type="button"
                    onClick={() => { setSelectedJob(null); setModalResumeFile(null); setModalChangingResume(false); }}
                    className="px-5 py-2 bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-full text-xs font-medium hover:bg-[#f5f5f7] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleApplyJob}
                    disabled={!profile?.resumeUrl || modalUploading || submitting}
                    className="px-6 py-2 bg-[#0066cc] hover:bg-[#0077ed] text-white rounded-full text-xs font-normal transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
