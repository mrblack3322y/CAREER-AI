import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Cpu, 
  HelpCircle,
  Plus,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { CareerRecommendation, SalaryEstimate } from '../types';

export const CareerPredictionPage: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([
    'python', 'sql', 'pandas', 'machine learning', 'scikit-learn', 'git'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [degree, setDegree] = useState('MCA');
  const [yearsExp, setYearsExp] = useState(1.0);
  const [location, setLocation] = useState('Bangalore');
  const [gpa, setGpa] = useState(8.2);

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [salaryEstimate, setSalaryEstimate] = useState<SalaryEstimate | null>(null);
  const [topRole, setTopRole] = useState<string>('Data Scientist');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleRunPrediction();
  }, []);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await api.predictCareer({
        skills,
        degree,
        years_experience: yearsExp,
        location,
        gpa
      });
      setRecommendations(res.recommendations);
      setSalaryEstimate(res.salary_estimate);
      setTopRole(res.top_role);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim().toLowerCase();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-400 mb-2">
          <Cpu className="w-3 h-3" /> Machine Learning Inference
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Career Role Classification & Prediction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Trained classifier and vector embedding engines predict your highest affinity tech roles and estimated salary.
        </p>
      </div>

      {/* Input Controls Card */}
      <div className="glass-panel p-6 border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Customize Candidate Profile Features
        </h3>

        <div className="grid md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Education Degree</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="B.Tech CS">B.Tech Computer Science</option>
              <option value="B.Tech IT">B.Tech IT</option>
              <option value="BCA">BCA</option>
              <option value="B.Sc CS">B.Sc Computer Science</option>
              <option value="M.Tech CS">M.Tech Computer Science</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Experience: {yearsExp} {yearsExp === 1 ? 'Year' : 'Years'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={yearsExp}
              onChange={(e) => setYearsExp(parseFloat(e.target.value))}
              className="w-full mt-2 accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Location Preference</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Academic CGPA (Out of 10)</label>
            <input
              type="number"
              min="5.0"
              max="10.0"
              step="0.1"
              value={gpa}
              onChange={(e) => setGpa(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Skills Tag Input */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Technical Skills & Competencies</label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-blue-300"
              >
                <span>{s}</span>
                <button
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skill (e.g., docker, react, pytorch)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Run Prediction Action */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Click to re-evaluate ML classification vectors & regression ranges
          </span>
          <button
            onClick={handleRunPrediction}
            disabled={isLoading}
            className="glow-btn px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2"
          >
            {isLoading ? (
              <span>Running Inference...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run ML Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Salary Regression Prediction Highlight */}
      {salaryEstimate && (
        <div className="glass-panel p-6 border-slate-800 bg-gradient-to-r from-emerald-950/20 to-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Regression Estimated Salary Range for {topRole}
              </span>
              <p className="text-3xl font-extrabold text-white">
                {salaryEstimate.formatted_range}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Predicted Median: <span className="text-emerald-300 font-semibold">INR {salaryEstimate.predicted_median_lpa} LPA</span> • {salaryEstimate.confidence_interval}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {salaryEstimate.contributing_factors.map((f, i) => (
                <div key={i} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-left">
                  <p className="text-[10px] text-slate-400">{f.factor}</p>
                  <p className="text-xs font-bold text-slate-200">{f.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Roles List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-400" />
          Top Recommended Career Roles (Ranked)
        </h3>

        <div className="grid gap-4">
          {recommendations.map((rec, index) => {
            const isTop = index === 0;
            return (
              <div
                key={rec.role}
                className={`glass-panel p-6 border transition-all ${
                  isTop ? 'border-purple-500/40 bg-purple-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isTop ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{rec.role}</h4>
                      <p className="text-xs text-slate-400">
                        Cosine Similarity: {(rec.cosine_similarity * 100).toFixed(1)}% • Classifier Confidence: {(rec.ml_confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                      {rec.match_percentage}%
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Explainable AI (XAI) Reasons */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                  <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Explainable AI Rationale: Why {rec.role} is recommended
                  </p>
                  <ul className="space-y-1">
                    {rec.reasons.map((r, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Overlap & Missing Skills */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block mb-1.5">
                      Matched Competencies ({rec.matched_skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.matched_skills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-1.5">
                      Missing High-Priority Skills ({rec.missing_high_priority.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.missing_high_priority.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
