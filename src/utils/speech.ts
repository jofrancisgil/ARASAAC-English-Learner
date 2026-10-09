/**
 * Web Speech API text-to-speech helper with SNE support (rate control, clear English voices, sentence sequence).
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

let cachedVoice: SpeechSynthesisVoice | null = null;

const pickEnglishVoice = (): SpeechSynthesisVoice | null => {
  if (!synth) return null;
  if (cachedVoice) return cachedVoice;

  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // Prefer high quality English voices (en-GB, en-US)
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Karen') ||
        v.name.includes('Serena'))
  );

  const fallbackEn = voices.find((v) => v.lang.startsWith('en'));
  cachedVoice = preferred || fallbackEn || voices[0] || null;
  return cachedVoice;
};

// Ensure voices are loaded
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickEnglishVoice();
  };
}

export interface SpeakOptions {
  rate?: number; // 0.5 to 1.5, default 0.85
  pitch?: number; // default 1.05 for friendly tone
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export const speakText = (text: string, options: SpeakOptions = {}): boolean => {
  if (!synth || typeof window === 'undefined') {
    return false;
  }

  try {
    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.05;

    const voice = pickEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (options.onStart) {
      utterance.onstart = () => options.onStart?.();
    }
    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or canceled:', e);
      options.onError?.();
    };

    synth.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis exception:', err);
    return false;
  }
};

export const stopSpeech = () => {
  if (synth) {
    synth.cancel();
  }
};

export const isSpeechAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};
