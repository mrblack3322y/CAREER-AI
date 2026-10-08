import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Award, 
  Layers, 
  ChevronRight,
  Code2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Target
} from 'lucide-react';
import { api } from '../services/api';
import { LearningRoadmap } from '../types';

const ROLES = [
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Software Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Business Analyst"
];

interface LearningRoadmapPageProps {
  initialRole?: string;
}

export const LearningRoadmapPage: React.FC<LearningRoadmapPageProps> = ({ initialRole }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'Data Scientist');
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    loadRoadmap(selectedRole);
  }, [selectedRole]);

  const loadRoadmap = async (role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getLearningRoadmap(role);
      setRoadmap(data);
    } catch (err: any) {
      console.error('Failed to load roadmap:', err);
      setError(err?.message || 'Unable to generate personalized learning roadmap for this role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const weeks = roadmap?.weeks || [];
  const phases = roadmap?.phases || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-medium text-indigo-400 mb-2">
          <BookOpen className="w-3 h-3" /> Personalized Skill Curriculum
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Personalized Career Learning Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Weekly sprint milestones prioritized to bridge your specific skill gaps for {selectedRole}.
        </p>
      </div>

      {/* Role Selector Card */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Target Career Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {roadmap && (
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-400 block">Total Duration</span>
                <span className="text-2xl font-bold text-white">
                  {roadmap.total_weeks || weeks.length || 6} Weeks
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Weekly Commitment</span>
                <span className="text-2xl font-bold text-indigo-400">~12 Hours/wk</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-panel p-6 border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-rose-300">{error}</p>
          </div>
          <button
            onClick={() => loadRoadmap(selectedRole)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-200 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="glass-panel p-12 border-slate-800 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Generating customized learning curriculum for {selectedRole}...</p>
        </div>
      )}

      {/* Capstone Project Showcase */}
      {!isLoading && roadmap?.capstone_project && (
        <div className="glass-panel p-6 border-slate-800 bg-gradient-to-r from-indigo-950/30 to-purple-950/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5">
                Recommended Role Capstone Project
              </span>
              <h3 className="text-base font-bold text-white mb-1">
                {roadmap.capstone_project}
              </h3>
              <p className="text-xs text-slate-400">
                Building this portfolio capstone demonstrates mastery of the required tech stack to hiring managers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Timeline */}
      {!isLoading && weeks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Week-by-Week Learning Sprints ({weeks.length} Sprints)
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Sequential Progression
            </span>
          </div>

          <div className="space-y-4">
            {weeks.map((week) => (
              <div
                key={week.week}
                className="glass-panel p-6 border-slate-800 hover:border-blue-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs">
                      WEEK {week.week}
                    </span>
                    <h4 className="text-base font-bold text-white">{week.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {week.estimated_hours} Hours
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      week.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}>
                      {week.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Current Status</span>
                    <span className="font-medium text-slate-300">{week.current_level}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sprint Target Outcome</span>
                    <span className="font-semibold text-emerald-400">{week.target_level}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{week.recommended_action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback if no weeks but phases exist */}
      {!isLoading && weeks.length === 0 && phases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Curriculum Phase Milestones
          </h3>
          <div className="space-y-4">
            {phases.map((phase, idx) => (
              <div key={idx} className="glass-panel p-6 border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                    {phase.phase}
                  </span>
                  <span className="text-xs text-slate-400">{phase.estimated_time}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{phase.title}</h4>
                <p className="text-xs text-slate-400">{phase.focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
