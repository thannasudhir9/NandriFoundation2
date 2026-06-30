import { Update, Student } from '../types';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FeedProps {
  updates: Update[];
  students: Student[];
}

export function Feed({ updates, students }: FeedProps) {
  const { t, language } = useLanguage();
  // Sort updates by date descending
  const sortedUpdates = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleShare = (update: Update) => {
    // In a real app, this would use the Web Share API or open a share dialog
    alert('Share dialog opened for: ' + update.content.substring(0, 30) + '...');
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('feedTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('feedSubtitle')}</p>
      </div>

      <div className="space-y-6">
        {sortedUpdates.map((update) => {
          const student = update.studentId ? students.find(s => s.id === update.studentId) : null;
          const date = new Date(update.date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={update.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-400 font-bold">
                    {update.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{update.authorName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{date} {student ? `• ${t('about')} ${student.name}` : ''}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleShare(update)}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-full hover:bg-green-50 dark:hover:bg-gray-700"
                  aria-label="Share update"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">{update.content}</p>
              </div>

              {/* Photo */}
              {update.photoUrl && (
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-900">
                  <img src={update.photoUrl} alt="Update" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
        {updates.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>{t('noUpdates')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
