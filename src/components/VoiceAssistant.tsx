import { useMemo, useState } from 'react';
import { Mic, MicOff, Languages, Volume2 } from 'lucide-react';
import { Language } from '../i18n';
import { Role, Student } from '../types';

interface VoiceAssistantProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  onAddUser: (input: { name: string; email: string; role: Role }) => Promise<void>;
  onSetLanguage: (lang: Language) => void;
}

export function VoiceAssistant({ students, onAddStudent, onAddUser, onSetLanguage }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const donationsSummary = useMemo(() => {
    const total = students.reduce((sum, s) => sum + (s.donationAmount ?? 0), 0);
    const sponsored = students.filter((s) => Boolean(s.sponsorName?.trim())).length;
    return `Total donations EUR ${Math.round(total)}. Sponsored students ${sponsored}.`;
  }, [students]);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const parseBetween = (input: string, start: string, endOptions: string[]): string => {
    const lower = input.toLowerCase();
    const startIdx = lower.indexOf(start);
    if (startIdx < 0) return '';
    const from = startIdx + start.length;
    const endIdx = endOptions
      .map((token) => lower.indexOf(token, from))
      .filter((idx) => idx >= 0)
      .sort((a, b) => a - b)[0];
    const to = endIdx ?? input.length;
    return input.slice(from, to).trim();
  };

  const executeTranscript = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const lower = text.toLowerCase();

    if (lower.includes('translate to german') || lower.includes('translate to deutsch')) {
      onSetLanguage('de');
      setResult('Language set to German.');
      speak('Language set to German.');
      return;
    }
    if (lower.includes('translate to english')) {
      onSetLanguage('en');
      setResult('Language set to English.');
      speak('Language set to English.');
      return;
    }
    if (lower.includes('show donation information')) {
      setResult(donationsSummary);
      speak(donationsSummary);
      return;
    }

    if (lower.startsWith('add child') || lower.startsWith('add student')) {
      const name = parseBetween(text, 'name', ['age', 'village', 'school', 'grade', 'sponsor']);
      const ageValue = parseBetween(text, 'age', ['village', 'school', 'grade', 'sponsor']);
      const village = parseBetween(text, 'village', ['school', 'grade', 'sponsor']) || 'Irular Village A';
      const school = parseBetween(text, 'school', ['grade', 'sponsor']) || 'Primary Village School';
      const grade = parseBetween(text, 'grade', ['sponsor']) || '5th Grade';
      const sponsorName = parseBetween(text, 'sponsor', []);
      const age = Number((ageValue.match(/\d+/) || ['10'])[0]);

      if (!name) throw new Error('Child name missing. Say: add child name Ravi age 10 village ...');

      await onAddStudent({
        name,
        age,
        school,
        village,
        grade,
        sponsorName: sponsorName || '',
        sponsorEmail: '',
        donationAmount: sponsorName ? 50 : 0,
        bio: `${name} added via voice command.`,
        photoUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
      });
      const ok = `Child ${name} added successfully.`;
      setResult(ok);
      speak(ok);
      return;
    }

    if (lower.startsWith('add user')) {
      const name = parseBetween(text, 'name', ['email', 'role']);
      const email = parseBetween(text, 'email', ['role']);
      const roleRaw = parseBetween(text, 'role', []).toLowerCase();
      const role: Role = roleRaw === 'superadmin' || roleRaw === 'employee' ? roleRaw : 'sponsor';
      if (!name || !email) throw new Error('User name/email missing. Say: add user name Anna email anna@example.com role employee');
      await onAddUser({ name, email, role });
      const ok = `User ${name} added successfully.`;
      setResult(ok);
      speak(ok);
      return;
    }

    throw new Error('Command not recognized. Try add child, add user, show donation information, translate to German/English.');
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    setError('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);

    recognition.onresult = async (event: any) => {
      const spoken = event.results?.[0]?.[0]?.transcript || '';
      setTranscript(spoken);
      try {
        await executeTranscript(spoken);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Voice command failed.';
        setError(msg);
        speak(msg);
      }
    };
    recognition.onerror = () => setError('Voice recognition error.');
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors mt-2"
        aria-label="Voice assistant"
      >
        <Languages className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-36 right-0 w-[360px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Voice Assistant</h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 mb-2">
            Commands: add child, add user, show donation information, translate to German/English.
          </p>
          <div className="flex gap-2 mb-3">
            <button
              onClick={startListening}
              disabled={isListening}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Listening...' : 'Start Voice'}
            </button>
            <button
              onClick={() => transcript && executeTranscript(transcript).catch((e) => setError(e instanceof Error ? e.message : 'Failed'))}
              className="px-3 py-1.5 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
              Run Text
            </button>
          </div>

          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Voice transcript appears here..."
            className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {result && <p className="mt-2 text-xs text-green-700 dark:text-green-300">{result}</p>}
          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
      )}
    </>
  );
}
