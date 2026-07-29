import React from 'react';
import { GraduationCap, MessageSquare, Lightbulb, HelpCircle, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'solver' | 'quiz';
  setActiveTab: (tab: 'chat' | 'solver' | 'quiz') => void;
  gradeLevel: string;
  setGradeLevel: (level: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
}

const GRADE_LEVELS = [
  'Elementary (K-5)',
  'Middle School (6-8)',
  'High School (9-12)',
  'College / Undergraduate',
];

const SUBJECTS = [
  'General Tutoring',
  'Algebra & Calculus',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History & Civics',
  'Literature & Essay Writing',
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  gradeLevel,
  setGradeLevel,
  subject,
  setSubject,
}) => {
  return (
    <header id="main-header" className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div id="logo-icon" className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 id="app-title" className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Professor Maya <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Tutor</span>
            </h1>
            <p className="text-xs text-slate-400">Interactive Learning & Step-by-Step Problem Solver</p>
          </div>
        </div>

        {/* Global Controls: Grade & Subject */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg px-2.5 py-1 border border-slate-700/60 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <select
              id="select-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub} className="bg-slate-900 text-slate-200">
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg px-2.5 py-1 border border-slate-700/60 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <select
              id="select-grade"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
            >
              {GRADE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-slate-900 text-slate-200">
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav id="nav-tabs" className="flex items-center bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Tutor Chat
          </button>

          <button
            id="tab-solver"
            onClick={() => setActiveTab('solver')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'solver'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Problem Solver
          </button>

          <button
            id="tab-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Practice Quiz
          </button>
        </nav>
      </div>
    </header>
  );
};
