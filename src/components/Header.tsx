import React from 'react';
import { StudentProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutGrid,
  Gamepad2,
  BarChart3,
  Search,
  Printer,
  Settings,
  Users,
  UserPlus,
} from 'lucide-react';

export type AppNavMode = 'board' | 'activities' | 'dashboard';

interface HeaderProps {
  currentMode: AppNavMode;
  onSelectMode: (mode: AppNavMode) => void;
  activeStudent: StudentProfile | null;
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onOpenManageStudentsModal: () => void;
  onOpenExportModal: () => void;
  onOpenSearchModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  activeStudent,
  students,
  onSelectStudent,
  onOpenManageStudentsModal,
  onOpenExportModal,
  onOpenSearchModal,
  onOpenSettingsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* App Title & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-teal-200 via-sky-200 to-purple-200 flex items-center justify-center shadow-xs border border-white">
              <span className="text-xl">🎨</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight font-fredoka">
                  ARASAAC SEN English
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  AAC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Intuitive Vocabulary & Activities for Special Educational Needs
              </p>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <PWAInstallButton />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          {/* Pictogram Board */}
          <button
            onClick={() => onSelectMode('board')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              currentMode === 'board'
                ? 'bg-white text-teal-900 shadow-xs ring-1 ring-teal-200 scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-teal-600" />
            <span>Pictogram Board</span>
          </button>

          {/* Activities (The 6 Interactive Games) */}
          <button
            onClick={() => onSelectMode('activities')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              currentMode === 'activities'
                ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-indigo-200 scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-indigo-600" />
            <span>Activities & Games (6)</span>
          </button>

          {/* Dedicated Educator Section Pill */}
          <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block" />

          <button
            onClick={() => onSelectMode('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              currentMode === 'dashboard'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Educator Tracking</span>
          </button>
        </nav>

        {/* Right Tools & Student Pill */}
        <div className="flex items-center justify-end gap-2">
          {/* Active Student Pill or Add Student Button */}
          {activeStudent && students.length > 0 ? (
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-2.5 py-1 gap-2 shadow-2xs">
              <span className="text-base">{activeStudent.avatarEmoji}</span>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {activeStudent.name}
                </span>
                <span className="text-[10px] text-slate-400 block leading-none">
                  {activeStudent.gradeOrGroup}
                </span>
              </div>
              <select
                value={activeStudent.id}
                onChange={(e) => {
                  const s = students.find((item) => item.id === e.target.value);
                  if (s) onSelectStudent(s);
                }}
                className="text-xs bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={onOpenManageStudentsModal}
                className="p-1 text-slate-400 hover:text-teal-700"
                title="Manage students"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenManageStudentsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Student</span>
            </button>
          )}

          {/* Quick PDF/Sheets Export Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition active:scale-95"
            title="Print PDF reports or export to Google Sheets"
          >
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden xl:inline">Export</span>
          </button>

          {/* Search ARASAAC API */}
          <button
            onClick={onOpenSearchModal}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            title="Search ARASAAC API for more pictograms"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            title="Audio speed & sensory settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="hidden md:block">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </header>
  );
};
