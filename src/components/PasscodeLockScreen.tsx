import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import {
  isPasscodeEnabled,
  verifyAppPasscode,
  setSessionUnlocked,
  setAppPasscode,
  getPasscodeHint,
} from '../utils/storage';

interface PasscodeLockScreenProps {
  onUnlocked: () => void;
}

export const PasscodeLockScreen: React.FC<PasscodeLockScreenProps> = ({ onUnlocked }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [rememberOnDevice, setRememberOnDevice] = useState(true);
  const [isSettingInitialPin, setIsSettingInitialPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [hint, setHint] = useState('');
  const [existingHint, setExistingHint] = useState('');
  const [showHint, setShowHint] = useState(false);

  const hasPinSet = isPasscodeEnabled();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasPinSet) {
      setIsSettingInitialPin(true);
    } else {
      setExistingHint(getPasscodeHint());
    }
    inputRef.current?.focus();
  }, [hasPinSet]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your passcode');
      return;
    }

    if (verifyAppPasscode(pin.trim())) {
      setSessionUnlocked(true, rememberOnDevice);
      onUnlocked();
    } else {
      setError('Incorrect passcode. Please try again.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Passcode must be at least 4 characters/digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('Passcodes do not match. Please verify.');
      return;
    }

    setAppPasscode(pin.trim(), hint.trim());
    setSessionUnlocked(true, rememberOnDevice);
    onUnlocked();
  };

  // Quick number keypad support
  const handleKeypadPress = (val: string) => {
    if (val === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setPin('');
    } else {
      if (pin.length < 12) {
        setPin((prev) => prev + val);
      }
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 px-6 py-6 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8 text-teal-200 animate-pulse" />
          </div>
          <h1 className="text-xl font-black font-fredoka tracking-tight text-white">
            {isSettingInitialPin ? 'Setup Private Access Passcode' : 'Private App Access'}
          </h1>
          <p className="text-xs text-teal-100/90 mt-1 max-w-xs mx-auto">
            {isSettingInitialPin
              ? 'Choose a secret PIN or password so only you can access your student profiles and AAC data.'
              : 'This application is protected. Enter your passcode to unlock.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSettingInitialPin ? (
            /* First Time Setup Mode */
            <form onSubmit={handleCreatePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Passcode (Numbers or Letters, min 4 digits)
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. 1234 or MySecretKey"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-bold text-slate-800 tracking-wider"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Passcode
                </label>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter your passcode"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-base font-bold text-slate-800 tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Password Hint
                </label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="e.g. My classroom room number"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-teal-500 focus:outline-none text-xs text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberDeviceInitial"
                  checked={rememberOnDevice}
                  onChange={(e) => setRememberOnDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="rememberDeviceInitial" className="text-xs text-slate-600 select-none">
                  Keep unlocked on this browser / device
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Passcode & Enter App</span>
              </button>
            </form>
          ) : (
            /* Standard Unlock Screen */
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Enter Passcode</label>
                  {existingHint && (
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-[11px] font-semibold text-teal-700 hover:underline"
                    >
                      {showHint ? 'Hide Hint' : 'View Hint'}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter PIN or password..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none text-center text-xl font-bold tracking-widest text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {showHint && existingHint && (
                  <div className="mt-2 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                    💡 <strong>Hint:</strong> {existingHint}
                  </div>
                )}
              </div>

              {/* Numeric On-Screen Keypad for touch/tablet accessibility */}
              <div className="grid grid-cols-3 gap-2 pt-1 pb-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit.toString())}
                    className="py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 font-bold text-lg border border-slate-200 shadow-2xs transition"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleKeypadPress('clear')}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-semibold text-xs border border-slate-200 transition"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 font-bold text-lg border border-slate-200 shadow-2xs transition"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('backspace')}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-semibold text-xs border border-slate-200 transition"
                >
                  ⌫ Del
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberOnDevice}
                    onChange={(e) => setRememberOnDevice(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Stay unlocked on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-base shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <Unlock className="w-5 h-5" />
                <span>Unlock Application</span>
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              🔒 Privacy Protection: Restricts students, visitors, or uninvited viewers from accessing your AAC boards, records, and progress data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
