import { useState } from 'react';
import { Student } from '../types';
import { Search, MapPin, GraduationCap } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface StudentsListProps {
  students: Student[];
  role: 'employee' | 'sponsor';
}

export function StudentsList({ students, role }: StudentsListProps) {
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.village.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{t('studentsTitle')}</h1>
        <p className="text-sm text-gray-500 font-medium">
          {role === 'employee' ? t('studentsSubtitleEmployee') : t('studentsSubtitleSponsor')}
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-start">
            <img 
              src={student.photoUrl || undefined} 
              alt={student.name} 
              className="w-16 h-16 rounded-full object-cover border border-gray-100 bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{student.name}, {student.age}</h3>
              
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{student.village}</span>
              </div>
              
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{student.school} • {student.grade}</span>
              </div>

              {role === 'sponsor' && student.sponsorName && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                  {t('sponsoredBy')} {student.sponsorName}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>{t('noStudents')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
