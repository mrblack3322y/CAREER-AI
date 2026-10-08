import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  Briefcase,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { FullProfileResponse, EducationItem, ProjectItem, CertificationItem, ExperienceItem } from '../types';

export const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<FullProfileResponse | null>(null);
  const [headline, setHeadline] = useState('');
  const [degree, setDegree] = useState('MCA');
  const [gpa, setGpa] = useState(8.2);
  const [yearsExp, setYearsExp] = useState(1.0);
  const [location, setLocation] = useState('Bangalore');
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Sub-lists
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfileData(data);
      const p = data.profile;
      setHeadline(p.headline);
      setDegree(p.degree);
      setGpa(p.gpa);
      setYearsExp(p.years_experience);
      setLocation(p.location);
      setTargetRole(p.target_role);
      setSkills(p.skills || []);

      setEducation(data.education || []);
      setProjects(data.projects || []);
      setCertifications(data.certifications || []);
      setExperience(data.experience || []);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim().toLowerCase();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateProfile({
        headline,
        degree,
        gpa,
        years_experience: yearsExp,
        location,
        target_role: targetRole,
        skills,
        education,
        projects,
        certifications,
        experience
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 mb-2">
            <UserIcon className="w-3 h-3" /> Candidate Profile & Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Profile & Experience Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update your academic history, technical skills, projects, and certifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="glow-btn px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Form Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: General & Academic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">General Information</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Degree</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="MCA">MCA</option>
                  <option value="B.Tech CS">B.Tech CS</option>
                  <option value="B.Tech IT">B.Tech IT</option>
                  <option value="BCA">BCA</option>
                  <option value="M.Tech CS">M.Tech CS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Academic CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={gpa}
                  onChange={(e) => setGpa(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Projects List */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Technical Projects ({projects.length})
              </h3>
              <button
                onClick={() => setProjects([
                  ...projects,
                  { title: 'New Project', description: 'Project overview', tech_stack: 'Python, React' }
                ])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...projects];
                        copy[idx].title = e.target.value;
                        setProjects(copy);
                      }}
                      className="bg-transparent font-bold text-sm text-white focus:outline-none focus:border-b border-blue-500"
                    />
                    <button
                      onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[idx].description = e.target.value;
                      setProjects(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Tech stack (e.g. Python, FastAPI, Docker)"
                    value={proj.tech_stack}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[idx].tech_stack = e.target.value;
                      setProjects(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-indigo-300 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Certifications */}
        <div className="space-y-6">
          {/* Skills Management */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Technical Skills ({skills.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pr-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-blue-300 capitalize"
                >
                  <span>{s}</span>
                  <button
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications Management */}
          <div className="glass-panel p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Certifications ({certifications.length})
              </h3>
              <button
                onClick={() => setCertifications([
                  ...certifications,
                  { name: 'AWS Certified Cloud Practitioner', issuing_org: 'Amazon', issue_date: '2025' }
                ])}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            <div className="space-y-2.5">
              {certifications.map((c, cIdx) => (
                <div key={cIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-200">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.issuing_org} • {c.issue_date}</p>
                  </div>
                  <button
                    onClick={() => setCertifications(certifications.filter((_, i) => i !== cIdx))}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
