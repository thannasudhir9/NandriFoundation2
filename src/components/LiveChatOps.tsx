import { useState } from 'react';
import { Check, MessageSquare, Send, X } from 'lucide-react';

type CommandType = 'add_student' | 'add_user' | 'email_information' | 'post_content' | 'social_post';

interface ParsedCommand {
  type: CommandType;
  raw: string;
  summary: string;
  payload: Record<string, string>;
}

interface LiveChatOpsProps {
  onExecuteCommand: (command: ParsedCommand) => Promise<string>;
}

function parseKeyValues(input: string): Record<string, string> {
  return input
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [key, ...rest] = entry.split('=');
      if (!key || rest.length === 0) return acc;
      acc[key.trim()] = rest.join('=').trim();
      return acc;
    }, {} as Record<string, string>);
}

function parseCommand(input: string): ParsedCommand | null {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (lower.startsWith('add student')) {
    const payload = parseKeyValues(text.replace(/add student/i, '').trim());
    if (!payload.name) return null;
    return {
      type: 'add_student',
      raw: text,
      payload,
      summary: `Add student ${payload.name}`,
    };
  }

  if (lower.startsWith('add user')) {
    const payload = parseKeyValues(text.replace(/add user/i, '').trim());
    if (!payload.email || !payload.name) return null;
    if (payload.role && !['superadmin', 'employee', 'sponsor'].includes(payload.role)) return null;
    return {
      type: 'add_user',
      raw: text,
      payload,
      summary: `Add user ${payload.name} (${payload.email})`,
    };
  }

  if (lower.startsWith('email information')) {
    const payload = parseKeyValues(text.replace(/email information/i, '').trim());
    if (!payload.to || !payload.subject || !payload.body) return null;
    return {
      type: 'email_information',
      raw: text,
      payload,
      summary: `Send email to ${payload.to}`,
    };
  }

  if (lower.startsWith('post content')) {
    const payload = parseKeyValues(text.replace(/post content/i, '').trim());
    if (!payload.message) return null;
    return {
      type: 'post_content',
      raw: text,
      payload,
      summary: 'Post new content to feed',
    };
  }

  if (lower.startsWith('social post')) {
    const payload = parseKeyValues(text.replace(/social post/i, '').trim());
    const platform = (payload.platform || '').toLowerCase();
    if (!payload.message || !['facebook', 'instagram', 'linkedin'].includes(platform)) return null;
    return {
      type: 'social_post',
      raw: text,
      payload,
      summary: `Social post to ${platform}`,
    };
  }

  return null;
}

const EXAMPLES = [
  'add student name=Ravi; age=10; village=Irular Village A; school=Primary Village School; grade=5th Grade',
  'add user name=Anna; email=anna@example.com; role=employee',
  'email information to=sponsor@example.com; subject=Quarter update; body=Student progress shared.',
  'post content message=New books distributed today; studentId=s1',
  'social post platform=linkedin; message=Quarterly milestone reached',
];

export function LiveChatOps({ onExecuteCommand }: LiveChatOpsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState<ParsedCommand | null>(null);
  const [activity, setActivity] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = () => {
    const parsed = parseCommand(input);
    if (!parsed) {
      setError('Invalid command. Use one of the command formats shown.');
      return;
    }
    setError('');
    setPending(parsed);
  };

  const onApprove = async () => {
    if (!pending) return;
    setIsRunning(true);
    try {
      const result = await onExecuteCommand(pending);
      setActivity((prev) => [`Approved: ${pending.summary} -> ${result}`, ...prev].slice(0, 10));
      setInput('');
      setPending(null);
    } catch (e) {
      setActivity((prev) => [`Failed: ${pending.summary}`, ...prev].slice(0, 10));
      setError(e instanceof Error ? e.message : 'Command failed');
    } finally {
      setIsRunning(false);
    }
  };

  const onReject = () => {
    if (!pending) return;
    setActivity((prev) => [`Rejected: ${pending.summary}`, ...prev].slice(0, 10));
    setPending(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors mt-2"
        aria-label="Open live chat commands"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-36 right-0 w-[360px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Live Chat Commands</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Type command..."
            className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <div className="mt-2 flex justify-end">
            <button
              onClick={onSubmit}
              disabled={isRunning}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Review
            </button>
          </div>

          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

          {pending && (
            <div className="mt-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Pending Approval</p>
              <p className="text-sm text-gray-800 dark:text-gray-100 mt-1">{pending.summary}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{pending.raw}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={onApprove} disabled={isRunning} className="px-2.5 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Approve
                </button>
                <button onClick={onReject} disabled={isRunning} className="px-2.5 py-1.5 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Commands</p>
            <div className="space-y-1">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="w-full text-left text-[11px] p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {activity.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">Activity</p>
              <div className="max-h-24 overflow-auto space-y-1">
                {activity.map((item) => (
                  <p key={item} className="text-[11px] text-gray-600 dark:text-gray-300">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export type { ParsedCommand };
