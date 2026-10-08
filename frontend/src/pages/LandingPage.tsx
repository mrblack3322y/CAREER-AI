import React from 'react';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Target, 
  FileSearch, 
  Briefcase, 
  Award, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreML: () => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreML,
  onQuickDemo
}) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autonomous Machine Learning & Career Intelligence Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Know Your Skills.{' '}
            <span className="gradient-text">Discover Your Career.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CareerAI analyzes your programming skills, academic trajectory, assessments, and resume 
            using trained Machine Learning models to predict best-fit tech roles, pinpoint skill gaps, 
            and recommend high-compatibility jobs.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onQuickDemo}
              className="glow-btn px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-blue-600/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Demo Profile</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExploreML}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm rounded-xl flex items-center gap-2 transition-all hover:border-slate-600"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>View ML Model Analytics</span>
            </button>
          </div>

          {/* Live Metrics Showcase */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-white">12 Roles</p>
              <p className="text-xs text-slate-400 mt-1">Classified with ML</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">99.7% F1</p>
              <p className="text-xs text-slate-400 mt-1">Cross-Evaluated Models</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">550+ Jobs</p>
              <p className="text-xs text-slate-400 mt-1">Ranked with Compatibility</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-cyan-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">Explainable AI (XAI)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              End-to-End Career Intelligence Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              A comprehensive system uniting predictive classification, NLP resume parsing, and regression modeling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-6 border-slate-800 hover:border-blue-500/40">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Role Prediction & XAI</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Evaluates candidate skill vectors against 12 industry benchmarks using Random Forest, XGBoost, and Cosine embeddings. Explains the exact mathematical reasons behind each match.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 border-slate-800 hover:border-purple-500/40">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Skill Gap Identification</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Highlights missing high-priority skills needed for roles like AI Engineer, Backend Developer, or Cloud Specialist with prioritized learning order.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 border-slate-800 hover:border-emerald-500/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Salary Range Regression</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Gradient Boosting Regressor calculates empirical salary ranges in LPA based on experience, certifications, GPA, and location demand rather than arbitrary guesses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 border-slate-800 hover:border-cyan-500/40">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">NLP Resume ATS Analyzer</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Uploads and parses PDF, DOCX, and TXT resumes. Normalizes technical keywords, identifies quantifiable outcomes, and delivers an estimated ATS compatibility score.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-6 border-slate-800 hover:border-indigo-500/40">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Job Matching Engine</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Weighted multi-attribute scoring (50% skills, 15% experience, 10% education, 10% certs, 10% projects, 5% location) across 500+ top company postings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-6 border-slate-800 hover:border-rose-500/40">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Interactive Assessment</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tests across 7 technical categories (Python, SQL, ML, DSA, Web Dev, Stats, Aptitude) feeding performance metrics directly back into the student profile features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How CareerAI Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From raw student profile to personalized career roadmap in 4 steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h4 className="text-sm font-semibold text-white">Profile Onboarding</h4>
              <p className="text-xs text-slate-400 mt-1">Input skills, degree, projects, or upload your resume for NLP extraction.</p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h4 className="text-sm font-semibold text-white">ML Inference</h4>
              <p className="text-xs text-slate-400 mt-1">Models evaluate skill vector overlap and predict role affinity & salary range.</p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h4 className="text-sm font-semibold text-white">Skill Gap & Assessment</h4>
              <p className="text-xs text-slate-400 mt-1">Assess domain knowledge and review missing required competencies.</p>
            </div>

            <div className="p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                4
              </div>
              <h4 className="text-sm font-semibold text-white">Roadmap & Matching</h4>
              <p className="text-xs text-slate-400 mt-1">Follow customized weekly learning plan and apply to top-matched jobs.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={onGetStarted}
              className="glow-btn px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/25"
            >
              Get Started Now — Explore Platform
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
