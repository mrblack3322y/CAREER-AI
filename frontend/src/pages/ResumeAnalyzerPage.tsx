import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  AlertTriangle,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ResumeAnalysis } from '../types';

const ROLES = [
  "Software Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Business Analyst"
];

export const ResumeAnalyzerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');

  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    if (activeTab === 'upload' && !selectedFile) {
      setError('Please select a PDF, DOCX, or TXT resume file to upload.');
      return;
    }
    if (activeTab === 'text' && resumeText.trim().length < 50) {
      setError('Please paste at least 50 characters of resume content.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.analyzeResume(
        activeTab === 'upload' ? selectedFile || undefined : undefined,
        activeTab === 'text' ? resumeText : undefined,
        targetRole
      );
      setAnalysisResult(res.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume document.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-medium text-cyan-400 mb-2">
          <FileText className="w-3 h-3" /> NLP Document Parser
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Resume ATS Analyzer & Keyword Extraction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Extract skills, identify ATS formatting patterns, and evaluate compatibility against target role standards.
        </p>
      </div>

      {/* Upload & Configuration Card */}
      <div className="glass-panel p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload Document (PDF / DOCX / TXT)
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400">Target Role Evaluation:</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'upload' ? (
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-8 text-center transition-all bg-slate-950/40">
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              {selectedFile ? selectedFile.name : 'Select or drag your resume here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, or TXT (Max 8 MB)</p>
            <label className="mt-4 inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl cursor-pointer transition-colors">
              Choose File
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume contents here (Education, Experience, Projects, Skills)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="glow-btn px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <span>Extracting & Parsing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Resume ATS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="glass-panel p-6 border-slate-800 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  Estimated Compatibility Score (Heuristic NLP Analysis)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white">
                    {analysisResult.ats_compatibility_score}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {analysisResult.ats_compatibility_score >= 80 ? 'Excellent ATS Alignment' : 'Moderate Alignment'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 max-w-xl">
                  Evaluated across section structuring, quantifiable impact metrics, action verbs, and keyword frequency for {analysisResult.target_role}.
                </p>
              </div>

              {/* Sections Audit */}
              <div className="flex flex-wrap gap-2 sm:max-w-xs">
                {Object.entries(analysisResult.sections_detected).map(([sec, found]) => (
                  <span
                    key={sec}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase flex items-center gap-1 border ${
                      found
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    }`}
                  >
                    {found ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{sec}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid: Extracted Skills & Missing Keywords */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Extracted Skills */}
            <div className="glass-panel p-6 border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Normalized Extracted Skills ({analysisResult.extracted_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.extracted_skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 capitalize">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords for Target Role */}
            <div className="glass-panel p-6 border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Recommended Keywords for {analysisResult.target_role}
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_keywords.map((k) => (
                  <span key={k} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 capitalize">
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Identified Strengths
              </h3>
              <ul className="space-y-2">
                {analysisResult.strengths.map((st, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysisResult.weaknesses.map((wk, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
