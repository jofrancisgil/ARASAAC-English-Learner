import React, { useState } from 'react';
import {
  AppSettings,
  isPasscodeEnabled,
  getPasscodeHint,
  setAppPasscode,
  removeAppPasscode,
  setSessionUnlocked,
} from '../utils/storage';
import { StudentProfile } from '../types';
import { speakText } from '../utils/speech';
import { X, Volume2, ShieldCheck, Moon, Sun, Type, Lock, KeyRound } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  activeStudent?: StudentProfile | null;
  onUpdateStudent?: (updated: StudentProfile) => void;
  onLockApp: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  activeStudent,
  onUpdateStudent,
  onLockApp,
  onClose,
}) => {
  const [passcodeError, setPasscodeError] = useState('');
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const currentSpeechRate = activeStudent?.speechRate ?? settings.speechRate ?? 0.85;

  const handleTestSpeech = (rate: number) => {
    speakText('Hello! This is English speech audio.', { rate });
  };

  const handleSavePasscode = () => {
    if (newPasscode.trim().length < 4) {
      setPasscodeError('Passcode must have at least 4 characters');
      return;
    }
    setAppPasscode(newPasscode.trim(), passcodeHint.trim());
    setPasscodeActive(true);
    setIsEditingPasscode(false);
    setNewPasscode('');
    setPasscodeError('');
  };

  const handleRemovePasscode = () => {
    removeAppPasscode();
    setPasscodeActive(false);
    setIsEditingPasscode(false);
    setNewPasscode('');
    setPasscodeHint('');
    setShowConfirmRemove(false);
  };

  const handleLockNow = () => {
    setSessionUnlocked(false);
    onClose();
    onLockApp();
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
          {/* Speech Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Speech Audio Rate ({currentSpeechRate}x)
              </label>
              <button
                type="button"
                onClick={() => handleTestSpeech(currentSpeechRate)}
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
              value={currentSpeechRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (activeStudent && onUpdateStudent) {
                  onUpdateStudent({ ...activeStudent, speechRate: val });
                }
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

          {/* Privacy Passcode Management */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 block">
                🔒 Privacy Passcode Protection
              </span>
              {passcodeActive ? (
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Not Set
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Lock the website so unauthorized visitors cannot see your student profiles or AAC boards.
            </p>

            {isEditingPasscode ? (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                {passcodeError && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {passcodeError}
                  </div>
                )}
                <input
                  type="password"
                  placeholder="New passcode (min 4 characters)"
                  value={newPasscode}
                  onChange={(e) => {
                    setNewPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Password hint (optional)"
                  value={passcodeHint}
                  onChange={(e) => setPasscodeHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSavePasscode}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition"
                  >
                    Save Passcode
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPasscode(false);
                      setPasscodeError('');
                    }}
                    className="py-1.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : showConfirmRemove ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <p className="text-xs text-rose-800 font-medium">
                  Are you sure you want to remove passcode protection? The app will open without a lock screen.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRemovePasscode}
                    className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                  >
                    Yes, Remove Passcode
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmRemove(false)}
                    className="px-3 py-1 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingPasscode(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
                >
                  {passcodeActive ? 'Change Passcode' : 'Set Passcode Now'}
                </button>
                {passcodeActive && (
                  <>
                    <button
                      type="button"
                      onClick={handleLockNow}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      Lock App Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmRemove(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                    >
                      Remove Lock
                    </button>
                  </>
                )}
              </div>
            )}
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
