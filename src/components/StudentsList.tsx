import { useState } from 'react';
import { Student } from '../types';
import { Search, MapPin, GraduationCap, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface StudentsListProps {
  students: Student[];
  role: string;
}

export function StudentsList({ students, role }: StudentsListProps) {
  const [search, setSearch] = useState('');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResults, setAiResults] = useState<Student[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState<number | 'all'>(10);
  const { t } = useLanguage();

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) {
      setAiResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery, data: students })
      });
      const data = await response.json();
      if (data.results) {
        setAiResults(data.results);
      }
    } catch (e) {
      console.error(e);
      setAiResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const displayStudents = isAiMode && aiResults !== null 
    ? aiResults 
    : students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.village.toLowerCase().includes(search.toLowerCase())
      );

  const paginatedStudents = limit === 'all' ? displayStudents : displayStudents.slice(0, limit as number);

  const totalStudents = students.length;
  const sponsoredStudents = students.filter(s => s.sponsorName && s.sponsorName.trim() !== '').length;
  const unsponsoredStudents = totalStudents - sponsoredStudents;
  const uniqueSponsors = new Set(students.filter(s => s.sponsorName && s.sponsorName.trim() !== '').map(s => s.sponsorName)).size;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('studentsTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {role === 'employee' ? t('studentsSubtitleEmployee') : t('studentsSubtitleSponsor')}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsAiMode(!isAiMode);
            setAiResults(null);
            setAiSearchQuery('');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isAiMode ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Search
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Students</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{totalStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sponsored</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{sponsoredStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unsponsored</div>
          <div className="text-xl font-bold text-orange-500 dark:text-orange-400">{unsponsoredStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unique Sponsors</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{uniqueSponsors}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Show
          <select 
            value={limit} 
            onChange={(e) => setLimit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="mx-2 p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={500}>500</option>
            <option value="all">All</option>
          </select>
          records
        </label>
      </div>

      {!isAiMode ? (
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-purple-200 dark:border-purple-800/50 rounded-xl leading-5 bg-purple-50 dark:bg-purple-900/10 placeholder-purple-400 dark:placeholder-purple-500 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
              placeholder="e.g. Find students in Kadambur..."
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
          </div>
          <button 
            onClick={handleAiSearch}
            disabled={isLoading || !aiSearchQuery.trim()}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl shadow-sm text-sm font-medium transition-colors flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {paginatedStudents.map((student) => (
          <div key={student.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex gap-4 items-start transition-colors duration-300">
            <img 
              src={student.photoUrl || undefined} 
              alt={student.name} 
              className="w-16 h-16 rounded-full object-cover border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{student.name}, {student.age}</h3>
              
              <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{student.village}</span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{student.school} • {student.grade}</span>
              </div>

              {role === 'sponsor' && student.sponsorName && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {t('sponsoredBy')} {student.sponsorName}
                </div>
              )}
            </div>
          </div>
        ))}

        {displayStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>{t('noStudents')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
