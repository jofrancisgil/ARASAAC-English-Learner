import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { Users, Plus, Trash2, Edit2, Check, X, Sparkles, UserPlus } from 'lucide-react';

interface ManageStudentsModalProps {
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (student: StudentProfile) => void;
  onAddStudent: (student: StudentProfile) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🦊', '🐼', '🦋', '🦁', '🦉', '🐬', '🐶', '🐱', '🚀', '⭐', '🌈', '🌸'];

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(students.length === 0);
  const [name, setName] = useState('');
  const [gradeOrGroup, setGradeOrGroup] = useState('Primary SEN');
  const [avatarEmoji, setAvatarEmoji] = useState('🦊');
  const [targetLevel, setTargetLevel] = useState<'Beginner' | 'Elementary' | 'Intermediate'>('Beginner');
  const [speechRate, setSpeechRate] = useState(0.85);
  const [notes, setNotes] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
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
    setName('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleStartEdit = (student: StudentProfile) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditGrade(student.gradeOrGroup);
  };

  const handleSaveEdit = (student: StudentProfile) => {
    if (!editName.trim()) return;
    onUpdateStudent({
      ...student,
      name: editName.trim(),
      gradeOrGroup: editGrade.trim(),
    });
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 font-fredoka">
                Manage Students
              </h2>
              <p className="text-xs text-slate-500">
                Add and manage individual student profiles for your classroom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Student List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Students ({students.length})
              </span>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Student</span>
                </button>
              )}
            </div>

            {students.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No students added yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
                  Add your students to personalize their speech speeds, track their vocabulary progress, and generate individualized IEP reports.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Student</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => {
                  const isActive = student.id === activeStudentId;
                  const isEditing = editingId === student.id;

                  return (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 transition ${
                        isActive
                          ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{student.avatarEmoji}</span>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="text-xs p-1 rounded-lg border border-slate-300 font-bold"
                            />
                            <input
                              type="text"
                              value={editGrade}
                              onChange={(e) => setEditGrade(e.target.value)}
                              className="text-xs p-1 rounded-lg border border-slate-300 w-28"
                            />
                            <button
                              onClick={() => handleSaveEdit(student)}
                              className="p-1 text-teal-700 hover:bg-teal-100 rounded-lg"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">
                                {student.name}
                              </span>
                              {isActive && (
                                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-teal-200 text-teal-900">
                                  Active
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 block">
                              {student.gradeOrGroup} • Speech: {student.speechRate}x
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isActive && (
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-100 hover:text-teal-800 font-semibold text-slate-700 transition"
                          >
                            Select
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEdit(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          title="Edit student name"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${student.name}'s profile?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Student Form */}
          {showAddForm && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Add New Student Profile
                </h3>
                {students.length > 0 && (
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-3">
                {/* Avatar Picker */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Choose Avatar Emoji
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setAvatarEmoji(e)}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition ${
                          avatarEmoji === e
                            ? 'bg-teal-100 ring-2 ring-teal-500 scale-105 shadow-xs'
                            : 'bg-white hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maria Sanchez"
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Classroom / Group
                    </label>
                    <input
                      type="text"
                      value={gradeOrGroup}
                      onChange={(e) => setGradeOrGroup(e.target.value)}
                      placeholder="e.g. SEN Group 1, Grade 2"
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      English Level
                    </label>
                    <select
                      value={targetLevel}
                      onChange={(e) =>
                        setTargetLevel(e.target.value as 'Beginner' | 'Elementary' | 'Intermediate')
                      }
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white font-semibold"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Speech Rate ({speechRate}x)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.1"
                      step="0.05"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full accent-teal-600 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    IEP Accommodations & Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Working on visual AAC for requests, prefers slow speech modeling..."
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                  >
                    Save Student Profile
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
