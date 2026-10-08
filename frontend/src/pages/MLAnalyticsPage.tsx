import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BarChart3, 
  Database, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';
import { MLMetricsReport } from '../types';

export const MLAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<MLMetricsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classification' | 'regression' | 'confusion' | 'data'>('classification');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMLMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load ML metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading ML Pipeline & Model Diagnostics...</p>
        </div>
      </div>
    );
  }

  const clf = metrics.classification;
  const reg = metrics.regression;
  const dq = metrics.data_quality;

  // Format Top 15 features for bar chart
  const featureData = (clf.top_features || []).slice(0, 15).map(f => ({
    name: f.feature.replace('skill_', '').replace('assessment_', 'quiz_'),
    importance: Math.round(f.importance * 1000) / 10
  }));

  // Best classification confusion matrix
  const bestClfModel = clf.models_evaluated.find(m => m.model_name === clf.best_model_name) || clf.models_evaluated[0];
  const cm = bestClfModel?.confusion_matrix;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-400 mb-2">
            <Cpu className="w-3 h-3" /> Machine Learning Architecture & Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ML Models Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical benchmark metrics, cross-model evaluations, feature importances, and dataset audit statistics.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* System Status Banner */}
      <div className="glass-panel p-6 border-slate-800 bg-gradient-to-r from-purple-950/20 via-slate-900 to-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inference Status</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> Models Loaded & Active
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Best Role Classifier</span>
            <span className="text-sm font-bold text-white mt-0.5 block truncate">
              {clf.best_model_name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Best Salary Regressor</span>
            <span className="text-sm font-bold text-white mt-0.5 block truncate">
              {reg.best_model_name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tracked Taxonomy Skills</span>
            <span className="text-sm font-bold text-purple-400 mt-0.5 block">
              {metrics.system_status.total_tracked_skills || 54} Dimensional Vectors
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('classification')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'classification'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Role Classification Models
        </button>
        <button
          onClick={() => setActiveTab('regression')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'regression'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Salary Regression Models
        </button>
        <button
          onClick={() => setActiveTab('confusion')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'confusion'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          12x12 Confusion Matrix
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'data'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Dataset Statistics & Audits
        </button>
      </div>

      {/* Tab 1: Classification Comparison */}
      {activeTab === 'classification' && (
        <div className="space-y-6">
          <div className="glass-panel overflow-hidden border-slate-800">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Classification Models Benchmark Comparison (12 Tech Roles)
              </h3>
              <span className="text-xs text-slate-400">Evaluated on 20% holdout test set (Stratified)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Model Name</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Precision (Weighted)</th>
                    <th className="py-3 px-4">Recall (Weighted)</th>
                    <th className="py-3 px-4">F1-Score</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {clf.models_evaluated.map((m) => {
                    const isBest = m.model_name === clf.best_model_name;
                    return (
                      <tr key={m.model_name} className={isBest ? 'bg-purple-950/20 font-semibold' : ''}>
                        <td className="py-3.5 px-4 text-white flex items-center gap-2">
                          <span>{m.model_name}</span>
                          {isBest && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              Selected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{(m.accuracy * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-4 text-slate-300">{(m.precision * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-4 text-slate-300">{(m.recall * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-4 text-purple-300 font-bold">{(m.f1_score * 100).toFixed(2)}%</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            isBest
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isBest ? 'Production Champion' : 'Evaluated Candidate'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Importances Horizontal Bar Chart */}
          <div className="glass-panel p-6 border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Top Predictive Feature Importances
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Features with highest influence during multi-class role classification
            </p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={110} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} arb. units`, 'Importance']}
                  />
                  <Bar dataKey="importance" fill="#818cf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Regression Comparison */}
      {activeTab === 'regression' && (
        <div className="space-y-6">
          <div className="glass-panel overflow-hidden border-slate-800">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Salary Regression Models Benchmark Comparison (LPA)
              </h3>
              <span className="text-xs text-slate-400">Target: Annual Salary (Lakhs Per Annum)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Model Name</th>
                    <th className="py-3 px-4">Mean Absolute Error (MAE)</th>
                    <th className="py-3 px-4">Root Mean Squared Error (RMSE)</th>
                    <th className="py-3 px-4">R² Score (Variance Explained)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reg.models_evaluated.map((m) => {
                    const isBest = m.model_name === reg.best_model_name;
                    return (
                      <tr key={m.model_name} className={isBest ? 'bg-emerald-950/20 font-semibold' : ''}>
                        <td className="py-3.5 px-4 text-white flex items-center gap-2">
                          <span>{m.model_name}</span>
                          {isBest && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Selected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{m.mae.toFixed(4)} LPA</td>
                        <td className="py-3.5 px-4 text-slate-300">{m.rmse.toFixed(4)} LPA</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">{m.r2_score.toFixed(4)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            isBest
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isBest ? 'Production Champion' : 'Evaluated Candidate'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Confusion Matrix */}
      {activeTab === 'confusion' && cm && (
        <div className="glass-panel p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                12x12 Role Classification Confusion Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated on {cm.matrix.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0)} holdout test predictions. Diagonal elements represent correct predictions.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Model: {bestClfModel.model_name}
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="text-[10px] border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-slate-500 font-normal">Predicted →<br />Actual ↓</th>
                  {cm.labels.map((lbl) => (
                    <th key={lbl} className="p-1.5 text-slate-400 font-semibold max-w-[65px] truncate text-center" title={lbl}>
                      {lbl.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cm.matrix.map((row, rIdx) => (
                  <tr key={cm.labels[rIdx]}>
                    <td className="p-1.5 text-slate-300 font-semibold whitespace-nowrap text-right pr-3">
                      {cm.labels[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      let bg = 'bg-slate-950/40 text-slate-600';
                      if (val > 0) {
                        bg = isDiagonal
                          ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold';
                      }
                      return (
                        <td
                          key={cIdx}
                          className={`p-2 text-center rounded min-w-[36px] ${bg}`}
                          title={`Actual: ${cm.labels[rIdx]} | Predicted: ${cm.labels[cIdx]} = ${val}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Dataset Audits */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <span className="text-xs text-slate-400">Total Observations</span>
              <p className="text-2xl font-bold text-white mt-1">{dq.total_records}</p>
              <span className="text-[11px] text-slate-500">Student & Candidate Profiles</span>
            </div>
            <div className="glass-card p-5">
              <span className="text-xs text-slate-400">Feature Dimensions</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{dq.total_features}</p>
              <span className="text-[11px] text-slate-500">Numerical, Categorical & Skills</span>
            </div>
            <div className="glass-card p-5">
              <span className="text-xs text-slate-400">Missing Values Audit</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{dq.total_missing_values}</p>
              <span className="text-[11px] text-emerald-400/80">100% Cleaned & Imputed</span>
            </div>
            <div className="glass-card p-5">
              <span className="text-xs text-slate-400">Duplicate Check</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{dq.duplicate_records}</p>
              <span className="text-[11px] text-cyan-400/80">Zero duplicate records</span>
            </div>
          </div>

          <div className="glass-panel p-6 border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Role Distribution in Dataset</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(dq.role_distribution || {}).map(([role, count]) => (
                <div key={role} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 truncate pr-2">{role}</span>
                  <span className="text-xs font-bold text-purple-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
