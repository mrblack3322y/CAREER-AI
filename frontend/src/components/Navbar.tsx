import React from 'react';
import { 
  Sparkles, 
  Compass, 
  BarChart2, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  BookOpen, 
  User as UserIcon, 
  Cpu, 
  LogOut, 
  LogIn 
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onOpenAuth,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'career', label: 'Career AI', icon: Compass },
    { id: 'skillgap', label: 'Skill Gap', icon: Sparkles },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'assessment', label: 'Assessment', icon: CheckSquare },
    { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'ml', label: 'ML Analytics', icon: Cpu, isBadge: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI</span>
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium block -mt-1">
              Intelligence Platform
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.isBadge ? 'text-purple-400' : ''}`} />
                <span>{item.label}</span>
                {item.isBadge && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/40">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => onNavigate('profile')} 
                className="hidden sm:flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl hover:border-slate-700"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.full_name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Student / Candidate</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="glow-btn px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
