import { useState } from 'react';
import { Student, Update } from '../types';
import { Camera, Send } from 'lucide-react';

interface AddUpdateProps {
  students: Student[];
  onAddUpdate: (update: Omit<Update, 'id' | 'date'>) => void;
  onSuccess: () => void;
}

export function AddUpdate({ students, onAddUpdate, onSuccess }: AddUpdateProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'student'>('general');
  const [studentId, setStudentId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddUpdate({
      authorName: 'Employee User', // In real app, from auth
      content,
      type,
      studentId: type === 'student' ? studentId : undefined,
      photoUrl: photoUrl.trim() || undefined,
    });
    
    setContent('');
    setPhotoUrl('');
    onSuccess();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Post Update</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Share news with sponsors</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="text-green-600 focus:ring-green-500 w-4 h-4 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                checked={type === 'general'}
                onChange={() => setType('general')}
              />
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-200">General News</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                className="text-green-600 focus:ring-green-500 w-4 h-4 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                checked={type === 'student'}
                onChange={() => setType('student')}
              />
              <span className="ml-2 text-sm text-gray-900 dark:text-gray-200">About a Student</span>
            </label>
          </div>
        </div>

        {type === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Student</label>
            <select
              required
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border transition-colors"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="" disabled>Choose a student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.village})</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full py-3 px-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Photo (URL for prototype)</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 sm:text-sm transition-colors">
              <Camera className="w-5 h-5" />
            </span>
            <input
              type="url"
              className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-xl focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border transition-colors"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Post Update
          </button>
        </div>
      </form>
    </div>
  );
}
