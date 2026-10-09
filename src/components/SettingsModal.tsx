import React from 'react';
import { AppSettings } from '../utils/storage';
import { StudentProfile } from '../types';
import { speakText } from '../utils/speech';
import { X, Volume2, ShieldCheck, Moon, Sun, Type } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  activeStudent: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  activeStudent,
  onUpdateStudent,
  onClose,
}) => {
  const handleTestSpeech = (rate: number) => {
    speakText('Hello! This is English speech audio.', { rate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-base font-bold text-slate-800 font-fredoka">
            Audio & Accessibility Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Speech Rate for active student */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Speech Audio Rate ({activeStudent.speechRate || 0.85}x)
              </label>
              <button
                type="button"
                onClick={() => handleTestSpeech(activeStudent.speechRate || 0.85)}
                className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Slower rates (0.7x - 0.85x) provide clear speech modeling for SNE students.
            </p>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={activeStudent.speechRate || 0.85}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateStudent({ ...activeStudent, speechRate: val });
                onUpdateSettings({ ...settings, speechRate: val });
              }}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>0.5x (Very Slow)</span>
              <span>0.85x (Standard SNE)</span>
              <span>1.2x (Fast)</span>
            </div>
          </div>

          {/* Quiz Scaffolding Choices */}
          <div className="pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Quiz Answer Choices Scaffolding
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Adjust cognitive load for the student.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      quizScaffoldingChoices: num as 2 | 3 | 4,
                    })
                  }
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    settings.quizScaffoldingChoices === num
                      ? 'bg-teal-50 border-teal-500 text-teal-800'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {num} Choices
                </button>
              ))}
            </div>
          </div>

          {/* Sensory Calm Mode Toggle */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block">
                Sensory Calm Mode
              </span>
              <span className="text-[11px] text-slate-500">
                Reduces motion animations and keeps visual contrast soft
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.sensoryCalmMode}
              onChange={(e) =>
                onUpdateSettings({ ...settings, sensoryCalmMode: e.target.checked })
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
            />
          </div>

          {/* Offline Notice */}
          <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-100 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-teal-900 leading-relaxed">
              <strong>Offline Ready:</strong> ARASAAC pictograms, student data, and session results are cached locally in your browser storage. Works without internet connection!
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
