import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import api from '../services/api';
import { ProfileForm, ListManager } from '../components/Forms';
import CVPreview from '../components/CVPreview';
import { Toaster, toast } from 'react-hot-toast';

const tabs = [
    { id: 'profile', label: 'Basic Info' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
    { id: 'cv', label: 'CV Builder' },
];

const computeCompletion = (data) => {
    if (!data) return 0;
    const checks = [
        Boolean(data.profile?.address && data.profile?.headline),
        (data.education?.length || 0) > 0,
        (data.experience?.length || 0) > 0,
        (data.skills?.length || 0) > 0,
        (data.projects?.length || 0) > 0,
        (data.certifications?.length || 0) > 0,
        (data.languages?.length || 0) > 0,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [cvTemplate, setCvTemplate] = useState(() => localStorage.getItem('cvTemplate') || 'modern');
    const hasAutoRouted = useRef(false);

    useEffect(() => {
        localStorage.setItem('cvTemplate', cvTemplate);
    }, [cvTemplate]);

    const fetchProfileData = async () => {
        try {
            const { data } = await api.get('/profile');
            setProfileData(data);

            if (!hasAutoRouted.current) {
                determineInitialRoute(data);
                hasAutoRouted.current = true;
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                navigate('/auth?mode=login');
            }
        } finally {
            setLoading(false);
        }
    };

    const determineInitialRoute = (data) => {
        setActiveTab('profile'); // Let users navigate freely instead of forcing completion
    };

    useEffect(() => {
        if (!localStorage.getItem('userInfo')) {
            navigate('/auth?mode=login');
        } else {
            fetchProfileData();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    const handleNext = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
        }
    };

    const selectTab = (id) => {
        setActiveTab(id);
        setMobileNavOpen(false);
    };

    const currentIndexState = tabs.findIndex(t => t.id === activeTab);
    const completion = computeCompletion(profileData);

    if (loading) return (
        <div className="text-white flex flex-col gap-4 justify-center items-center h-screen bg-slate-900 cursor-none">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div>Loading Dashboard...</div>
        </div>
    );

    return (
        <div className="flex min-h-screen relative pt-16 lg:pt-0 cursor-none">
            <Toaster position="top-right" />

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 glass-dark flex items-center justify-between px-4 h-16 border-b border-slate-700">
                <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    buildyourcv.io
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-semibold">{tabs[currentIndexState].label}</span>
                    <button
                        onClick={() => setMobileNavOpen(o => !o)}
                        className="p-2 rounded-lg bg-slate-800 text-white cursor-pointer"
                        aria-label="Toggle navigation"
                    >
                        {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed top-16 left-0 right-0 z-30 glass-dark border-b border-slate-700 p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto"
                    >
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => selectTab(tab.id)}
                                className={`text-left px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-gray-300 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <button onClick={handleLogout} className="mt-2 text-left px-4 py-3 rounded-lg font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer">
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <aside className="w-64 glass-dark fixed lg:relative h-screen z-20 flex flex-col p-6 border-r border-slate-700 hidden lg:flex">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">
                    buildyourcv.io
                </div>

                <div className="mb-6 flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl p-3">
                    <div className="relative w-12 h-12 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#334155" strokeWidth="3" />
                            <circle
                                cx="18" cy="18" r="15.5" fill="none" stroke="url(#gradCompletion)" strokeWidth="3"
                                strokeDasharray={`${(completion / 100) * 97.4} 97.4`} strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradCompletion" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{completion}%</span>
                    </div>
                    <div className="text-xs text-gray-400 leading-tight">
                        Profile<br />completeness
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-left px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-8 pt-4 border-t border-slate-700">
                    <div className="text-sm text-gray-400 mb-4 truncate">Hello, {profileData?.user?.name}</div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto h-screen relative z-10 glass">
                <div className="max-w-5xl mx-auto pb-24">
                    <div className="mb-10 w-full bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-slate-700 overflow-x-auto">
                        <div className="flex gap-2 w-full max-w-full">
                            {tabs.map((tab, idx) => (
                                <div key={tab.id} className="flex flex-col items-center flex-1 min-w-[60px]">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${idx < currentIndexState ? 'bg-green-500 text-white' :
                                            idx === currentIndexState ? 'bg-primary text-white scale-110' :
                                                'bg-slate-700 text-gray-400'
                                        }`}>
                                        {idx < currentIndexState ? '✓' : (idx + 1)}
                                    </div>
                                    <div className="text-xs text-center mt-2 text-gray-400 hidden sm:block truncate w-full px-1">{tab.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">{tabs[currentIndexState].label}</h2>
                    <p className="text-gray-400 mb-8 border-b border-slate-700 pb-4">Provide your {tabs[currentIndexState].label.toLowerCase()} details so we can accurately build your professional CV.</p>

                    <div className="bg-slate-900/60 p-6 md:p-8 md:px-10 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl">
                        {activeTab === 'profile' && (
                            <ProfileForm
                                user={profileData?.user}
                                data={profileData?.profile}
                                refresh={fetchProfileData}
                                onNext={handleNext}
                                onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'education' && (
                            <ListManager
                                title="Education" endpoint="education" refresh={fetchProfileData} dataList={profileData?.education}
                                fields={[
                                    { name: 'degree', label: 'Degree' },
                                    { name: 'institute', label: 'Institute' },
                                    { name: 'year', label: 'Year' }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'experience' && (
                            <ListManager
                                title="Experience" endpoint="experience" refresh={fetchProfileData} dataList={profileData?.experience}
                                fields={[
                                    { name: 'title', label: 'Job Title' },
                                    { name: 'company', label: 'Company' },
                                    { name: 'duration', label: 'Duration' }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'skills' && (
                            <ListManager
                                title="Skills" endpoint="skills" refresh={fetchProfileData} dataList={profileData?.skills}
                                fields={[
                                    { name: 'skill_name', label: 'Skill Name' },
                                    { name: 'level', label: 'Proficiency (1-5)', type: 'range', min: 1, max: 5, default: 3 }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'projects' && (
                            <ListManager
                                title="Projects" endpoint="projects" refresh={fetchProfileData} dataList={profileData?.projects}
                                fields={[
                                    { name: 'title', label: 'Project Title' },
                                    { name: 'link', label: 'Project Link (URL)', type: 'text', required: false },
                                    { name: 'tech_stack', label: 'Tech Stack (Comma Separated)', required: false },
                                    { name: 'description', label: 'Description', type: 'textarea' },
                                    { name: 'images', label: 'Project Images', type: 'file', multiple: true, accept: 'image/jpeg,image/png', required: false }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'certifications' && (
                            <ListManager
                                title="Certifications" endpoint="certifications" refresh={fetchProfileData} dataList={profileData?.certifications}
                                fields={[
                                    { name: 'name', label: 'Certification Name' },
                                    { name: 'issuer', label: 'Issuer' }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'languages' && (
                            <ListManager
                                title="Languages" endpoint="languages" refresh={fetchProfileData} dataList={profileData?.languages}
                                fields={[
                                    { name: 'language', label: 'Language Name' },
                                    { name: 'proficiency', label: 'Proficiency Level', type: 'select', options: ['Beginner', 'Intermediate', 'Fluent'] }
                                ]}
                                onNext={handleNext} onSkip={handleNext}
                            />
                        )}

                        {activeTab === 'cv' && (
                            <CVPreview profileData={profileData} template={cvTemplate} setTemplate={setCvTemplate} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
