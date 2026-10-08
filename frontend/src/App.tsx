import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerPredictionPage } from './pages/CareerPredictionPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { JobRecommendationsPage } from './pages/JobRecommendationsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import { ProfilePage } from './pages/ProfilePage';
import { MLAnalyticsPage } from './pages/MLAnalyticsPage';
import { api } from './services/api';
import { User } from './types';
import { Sparkles, Brain, Code2, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [roadmapRole, setRoadmapRole] = useState<string>('Data Scientist');

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    const token = api.getToken();
    if (token) {
      try {
        const p = await api.getProfile();
        setUser(p.user);
        setCurrentPage('dashboard');
      } catch (err) {
        api.clearToken();
        setUser(null);
      }
    }
    setIsInitialized(true);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    setCurrentPage('landing');
  };

  const handleQuickDemo = async () => {
    try {
      const res = await api.login('demo@careerai.com', 'demo123');
      handleAuthSuccess(res.user);
    } catch {
      setIsAuthOpen(true);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Initializing CareerAI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Router */}
      <main className="flex-1 pb-16">
        {currentPage === 'landing' && (
          <LandingPage
            onGetStarted={() => setIsAuthOpen(true)}
            onExploreML={() => setCurrentPage('ml')}
            onQuickDemo={handleQuickDemo}
          />
        )}
        {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'career' && <CareerPredictionPage />}
        {currentPage === 'skillgap' && (
          <SkillGapPage
            onNavigateRoadmap={(role) => {
              if (role) setRoadmapRole(role);
              setCurrentPage('roadmap');
            }}
          />
        )}
        {currentPage === 'resume' && <ResumeAnalyzerPage />}
        {currentPage === 'jobs' && <JobRecommendationsPage />}
        {currentPage === 'assessment' && <AssessmentPage />}
        {currentPage === 'roadmap' && <LearningRoadmapPage initialRole={roadmapRole} />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'ml' && <MLAnalyticsPage />}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modern SaaS Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">CareerAI</span>
            <span>— Advanced Machine Learning Career Intelligence</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-400" /> Multi-Model Architecture
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Explainable AI
            </span>
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3 text-blue-400" /> Production Fast & Typed
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
