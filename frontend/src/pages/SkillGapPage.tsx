import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { api } from '../services/api';
import { SkillGapAnalysis } from '../types';

const ROLES = [
  "Data Analyst",
  "Data Scientist",
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

interface SkillGapPageProps {
  onNavigateRoadmap?: (role: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onNavigateRoadmap }) => {
  const [selectedRole, setSelectedRole] = useState('Data Scientist');
  const [gapData, setGapData] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGapData(selectedRole);
  }, [selectedRole]);

  const loadGapData = async (role: string) => {
    setIsLoading(true);
    try {
      const data = await api.getSkillGap(role);
      setGapData(data);
    } catch (err) {
      console.error('Failed to load skill gap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 mb-2">
          <Sparkles className="w-3 h-3" /> Skill Gap Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Role Skill Gap Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compare your current technical competencies against benchmark skill taxonomies for any tech role.
        </p>
      </div>

      {/* Role Selector & Overview Card */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Select Target Career Role
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

          {gapData && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Skill Match Readiness</span>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {gapData.skill_match_percentage}%
                </span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 flex items-center justify-center font-bold text-xs text-white">
                {gapData.existing_skills_count}/{gapData.existing_skills_count + gapData.missing_skills_count}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Existing Skills vs Missing Skills */}
      {gapData && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Acquired Skills */}
          <div className="glass-panel p-6 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Existing Skills ({gapData.existing_skills_count})
              </h3>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                Acquired
              </span>
            </div>

            <div className="space-y-2.5">
              {gapData.existing_skills.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No matching skills identified for this role yet.</p>
              ) : (
                gapData.existing_skills.map((item) => (
                  <div
                    key={item.skill}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white capitalize">{item.skill}</p>
                      <p className="text-[10px] text-slate-400">
                        Taxonomy Weight: {(item.importance_weight * 100).toFixed(0)}%
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Profile Verified
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missing Skills with Priority */}
          <div className="glass-panel p-6 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Missing Competencies ({gapData.missing_skills_count})
              </h3>
              <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
                To Learn
              </span>
            </div>

            <div className="space-y-2.5">
              {gapData.missing_skills.map((item) => {
                const priorityBadge =
                  item.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    : item.priority === 'Medium'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/20';

                return (
                  <div
                    key={item.skill}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-white capitalize">{item.skill}</p>
                      <p className="text-[10px] text-slate-400">
                        Importance: {(item.importance_weight * 100).toFixed(0)}%
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityBadge}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Learning Sequence */}
      {gapData && gapData.recommended_learning_order.length > 0 && (
        <div className="glass-panel p-6 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Recommended Skill Acquisition Order
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimal sequence ordered by core dependencies and market demand weight
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {gapData.recommended_learning_order.map((skill, idx) => (
              <React.Fragment key={skill}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 capitalize">{skill}</span>
                </div>
                {idx < gapData.recommended_learning_order.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
