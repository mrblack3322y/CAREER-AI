import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Compass, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Award, 
  BarChart3, 
  BookOpen, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { FullProfileResponse, CareerRecommendation, SalaryEstimate } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [profileData, setProfileData] = useState<FullProfileResponse | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [salaryEstimate, setSalaryEstimate] = useState<SalaryEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const p = await api.getProfile();
      setProfileData(p);

      // Fetch career recommendations based on profile
      const recRes = await api.getCareerRecommendations();
      if (recRes && recRes.recommendations) {
        setRecommendations(recRes.recommendations);
        const topRole = recRes.recommendations[0]?.role || p.profile.target_role;
        const sal = await api.predictSalary({ target_role: topRole });
        setSalaryEstimate(sal);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Career Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const user = profileData?.user;

  // Radar chart data for student assessment skills
  const radarData = [
    { subject: 'Python', score: profile?.assessment_scores?.python || 75 },
    { subject: 'SQL', score: profile?.assessment_scores?.sql || 70 },
    { subject: 'ML / AI', score: profile?.assessment_scores?.ml || 65 },
    { subject: 'DSA', score: profile?.assessment_scores?.dsa || 65 },
    { subject: 'Web Dev', score: profile?.assessment_scores?.web || 60 },
    { subject: 'Statistics', score: profile?.assessment_scores?.stats || 70 },
    { subject: 'Aptitude', score: profile?.assessment_scores?.aptitude || 80 },
  ];

  // Bar chart data for top 5 predicted career matches
  const careerBarData = recommendations.slice(0, 5).map(r => ({
    name: r.role.replace(" Developer", " Dev").replace(" Engineer", " Eng"),
    match: r.match_percentage
  }));

  const topMatch = recommendations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-8 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 mb-2">
              <Sparkles className="w-3 h-3" /> Career Intelligence Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.full_name || 'Alex'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Target Role: <span className="text-slate-200 font-semibold">{profile?.target_role || 'Data Scientist'}</span> • {profile?.degree} ({profile?.gpa} CGPA) • {profile?.location}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('career')}
              className="glow-btn px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Predict Career</span>
            </button>
            <button
              onClick={() => onNavigate('resume')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Job Readiness Score */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Job Readiness Score</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {profile?.overall_readiness_score || 82}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {profile?.readiness_tier || 'Hire Ready'}
            </span>
            <span className="text-[11px] text-slate-400">Multi-factor ML index</span>
          </div>
        </div>

        {/* Card 2: Top Career Match */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Best Career Match</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Compass className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white truncate max-w-[170px]">
              {topMatch?.role || 'Data Scientist'}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {topMatch?.match_percentage || 88.5}% Match
            </span>
            <span className="text-[11px] text-slate-400">Cosine + Classifier</span>
          </div>
        </div>

        {/* Card 3: Salary Prediction */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Estimated Salary Range</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white truncate">
              {salaryEstimate?.formatted_range || 'INR 7.5 - 11.8 LPA'}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Regression Range
            </span>
            <span className="text-[11px] text-slate-400">Empirical 85% Interval</span>
          </div>
        </div>

        {/* Card 4: Resume ATS Score */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Resume ATS Score</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {profile?.resume_score ? Math.round(profile.resume_score) : 75}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Estimated ATS
            </span>
            <span className="text-[11px] text-slate-400">NLP Keyword Evaluated</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart 1: Assessment Skill Radar */}
        <div className="glass-panel p-6 border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Technical Competency Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-dimensional assessment score across core tech domains
              </p>
            </div>
            <button
              onClick={() => onNavigate('assessment')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Take Quiz <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.45}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Career Matches Bar Chart */}
        <div className="glass-panel p-6 border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                Top Career Path Affinity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Model predicted role compatibility matching percentage
              </p>
            </div>
            <button
              onClick={() => onNavigate('career')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Full Analysis <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerBarData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={110} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}% Match`, 'Affinity']}
                />
                <Bar dataKey="match" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transparent Job Readiness Score Breakdown & Quick Links */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Transparent Formula Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">
            Transparent Job Readiness Formula Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Calculated as: 30% Tech Skills + 20% Projects + 15% Resume + 15% Assessments + 10% Experience + 10% Certs/Edu
          </p>

          <div className="space-y-4">
            {profile?.readiness_breakdown && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Technical Skills Coverage (Weight 30%)</span>
                    <span className="text-blue-400 font-bold">{profile.readiness_breakdown.technical_skills}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${profile.readiness_breakdown.technical_skills}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Hands-on Projects & Codebases (Weight 20%)</span>
                    <span className="text-indigo-400 font-bold">{profile.readiness_breakdown.projects}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${profile.readiness_breakdown.projects}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Resume ATS Compatibility (Weight 15%)</span>
                    <span className="text-cyan-400 font-bold">{profile.readiness_breakdown.resume_quality}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                      style={{ width: `${profile.readiness_breakdown.resume_quality}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Assessment Scores (Weight 15%)</span>
                    <span className="text-purple-400 font-bold">{profile.readiness_breakdown.assessments}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                      style={{ width: `${profile.readiness_breakdown.assessments}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-300">Industry Experience (Weight 10%)</span>
                    <span className="text-emerald-400 font-bold">{profile.readiness_breakdown.experience}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${profile.readiness_breakdown.experience}%` }} 
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Col: Quick Actions & Recommended Next Steps */}
        <div className="glass-panel p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Recommended Next Steps</h3>
            <p className="text-xs text-slate-400 mb-4">
              AI-driven suggestions to boost your readiness score and career match rate.
            </p>

            <div className="space-y-3">
              <div 
                onClick={() => onNavigate('skillgap')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Inspect Skill Gap</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Review missing high-importance skills for {profile?.target_role}.</p>
              </div>

              <div 
                onClick={() => onNavigate('roadmap')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Personalized Roadmap</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Check out your 8-week weekly learning curriculum.</p>
              </div>

              <div 
                onClick={() => onNavigate('jobs')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Matched Tech Jobs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Explore 500+ postings ranked with 5-factor compatibility.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => onNavigate('ml')}
              className="text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Inspect ML Pipeline & Diagnostics</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
