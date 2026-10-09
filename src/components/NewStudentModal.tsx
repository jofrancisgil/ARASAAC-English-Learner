import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { X, Sparkles } from 'lucide-react';

interface NewStudentModalProps {
  onAddStudent: (student: StudentProfile) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🦊', '🐼', '🦋', '🦁', '🦉', '🐬', '🐶', '🐱', '🚀', '⭐', '🌈'];

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  onAddStudent,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [gradeOrGroup, setGradeOrGroup] = useState('Primary SEN');
  const [avatarEmoji, setAvatarEmoji] = useState('🦊');
  const [targetLevel, setTargetLevel] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [speechRate, setSpeechRate] = useState(0.85);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: StudentProfile = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      avatarEmoji,
      gradeOrGroup: gradeOrGroup.trim(),
      targetLevel,
      notes: notes.trim(),
      targetWords: [],
      speechRate,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-800 font-fredoka">
              Add New Student Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">
              Choose Avatar
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition ${
                    avatarEmoji === emoji
                      ? 'bg-teal-100 ring-2 ring-teal-500 scale-110 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Leo Sanders"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Grade / Group */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Classroom / Group
            </label>
            <input
              type="text"
              value={gradeOrGroup}
              onChange={(e) => setGradeOrGroup(e.target.value)}
              placeholder="e.g. Primary SEN 2, Year 3 Inclusion"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Target Level & Speech Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                English Level
              </label>
              <select
                value={targetLevel}
                onChange={(e) =>
                  setTargetLevel(e.target.value as 'Beginner' | 'Elementary' | 'Intermediate')
                }
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Elementary">Elementary</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Speech Rate ({speechRate}x)
              </label>
              <input
                type="range"
                min="0.5"
                max="1.1"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-teal-600 mt-2"
              />
            </div>
          </div>

          {/* IEP Notes */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              IEP Focus & Accommodations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Non-verbal, uses AAC for choice-making, prefers slow speech modeling..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
            >
              Create Student Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
