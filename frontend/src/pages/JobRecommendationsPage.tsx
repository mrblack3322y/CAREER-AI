import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Job, JobMatch } from '../types';

export const JobRecommendationsPage: React.FC = () => {
  const [mode, setMode] = useState<'recommended' | 'all'>('recommended');
  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal for view details
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    loadJobs();
  }, [mode, roleFilter, locationFilter, minSalary]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      if (mode === 'recommended') {
        const res = await api.getJobRecommendations(15);
        setRecommendations(res.recommendations);
      } else {
        const res = await api.getJobs({
          search: search || undefined,
          role: roleFilter || undefined,
          location: locationFilter || undefined,
          min_salary: minSalary ? parseFloat(minSalary) : undefined,
          limit: 30
        });
        setAllJobs(res.jobs);
        setTotalJobsCount(res.total);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'all') {
      loadJobs();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 mb-2">
          <Briefcase className="w-3 h-3" /> Job Compatibility Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Tech Job Recommendations & Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore seeded tech job opportunities ranked with multi-attribute candidate compatibility scoring.
        </p>
      </div>

      {/* Mode Switcher & Filters */}
      <div className="glass-panel p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('recommended')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                mode === 'recommended'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ranked for You (AI Matching)</span>
            </button>
            <button
              onClick={() => setMode('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                mode === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse All Tech Jobs ({totalJobsCount || 550}+)</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search job title, skills, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Any Salary</option>
            <option value="6">Min 6 LPA</option>
            <option value="10">Min 10 LPA</option>
            <option value="15">Min 15 LPA</option>
            <option value="20">Min 20 LPA</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading job postings...</p>
        </div>
      ) : mode === 'recommended' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => {
            const job = item.job;
            return (
              <div
                key={job.id}
                className="glass-card p-5 border-slate-800 flex flex-col justify-between hover:border-blue-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{job.title}</h4>
                      <p className="text-xs font-semibold text-blue-400 mt-0.5">{job.company}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300">
                      {item.compatibility_score}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> {job.salary_range}
                    </span>
                    <span>•</span>
                    <span>{job.job_type}</span>
                  </div>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.required_skills.slice(0, 4).map((sk) => {
                      const isMatched = item.matched_skills.includes(sk);
                      return (
                        <span
                          key={sk}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            isMatched
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Posted {job.posted_days_ago} days ago
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>View Role</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-5 border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{job.title}</h4>
                    <p className="text-xs font-semibold text-blue-400 mt-0.5">{job.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                    {job.job_type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.salary_range}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.required_skills.slice(0, 4).map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Min {job.min_experience} yrs exp</span>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">{selectedJob.title}</h3>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">{selectedJob.company} • {selectedJob.location}</p>

            <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Salary Range</span>
                <span className="font-semibold text-emerald-400">{selectedJob.salary_range}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Experience Required</span>
                <span className="font-semibold text-slate-200">{selectedJob.min_experience} – {selectedJob.max_experience} Years</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Education</span>
                <span className="font-semibold text-slate-200">{selectedJob.required_education}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Employment Type</span>
                <span className="font-semibold text-slate-200">{selectedJob.job_type}</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-300 mb-1">Description</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{selectedJob.description}</p>

            <h4 className="text-xs font-bold text-slate-300 mb-1.5">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {selectedJob.required_skills.map((sk) => (
                <span key={sk} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  {sk}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                alert(`Applied successfully to ${selectedJob.company} for ${selectedJob.title}!`);
                setSelectedJob(null);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md"
            >
              Submit Candidate Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
