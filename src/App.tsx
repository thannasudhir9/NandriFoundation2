/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_UPDATES } from './data';
import { Update, Student } from './types';
import { BottomNav } from './components/BottomNav';
import { Feed } from './components/Feed';
import { StudentsList } from './components/StudentsList';
import { AddUpdate } from './components/AddUpdate';
import { Profile } from './components/Profile';
import { CrmDashboard } from './components/CrmDashboard';
import { AuthUI } from './components/AuthUI';
import { Monitor, Smartphone, Globe, ArrowUp, ArrowDown, MessageCircle, Home, Laptop, Moon, Sun } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { SyncService, localDb } from './db/SyncService';
import { useTheme } from './ThemeContext';

import { Features } from './components/Features';

export default function App() {
  const [viewMode, setViewMode] = useState<'desktop' | 'laptop' | 'mobile'>('desktop');
  const [currentTab, setCurrentTab] = useState('feed');
  const [updates, setUpdates] = useState<Update[]>(INITIAL_UPDATES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const role = user?.role || 'sponsor';

  useEffect(() => {
    // Initial sync on mount
    const initSync = async () => {
      // Seed local DB if empty
      const existingStudents = await localDb.students.count();
      if (existingStudents === 0) {
        await localDb.students.bulkPut(INITIAL_STUDENTS);
        await localDb.updates.bulkPut(INITIAL_UPDATES);
      }
      
      const { localStudents, localUpdates } = await SyncService.syncBothWays();
      if (localStudents.length > 0) setStudents(localStudents);
      if (localUpdates.length > 0) setUpdates(localUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    initSync();
  }, []);

  const handleAddUpdate = async (newUpdate: Omit<Update, 'id' | 'date'>) => {
    const update: Update = {
      ...newUpdate,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setUpdates([update, ...updates]);
    await SyncService.saveUpdateLocally(update);
  };

  const handleAddStudent = async (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStudents([student, ...students]);
    await SyncService.saveStudentLocally(student);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    await SyncService.saveStudentLocally(updatedStudent);
  };

  const handleDeleteStudent = async (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    await localDb.students.delete(id);
    SyncService.syncBothWays();
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (!user) {
      return <AuthUI />;
    }

    switch(currentTab) {
      case 'feed': return <Feed updates={updates} students={students} />;
      case 'students': return <StudentsList students={students} role={role} />;
      case 'add': return (role === 'employee' || role === 'superadmin') ? <AddUpdate students={students} onAddUpdate={handleAddUpdate} onSuccess={() => setCurrentTab('feed')} /> : null;
      case 'crm': return (role === 'employee' || role === 'superadmin') ? <CrmDashboard students={students} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} /> : null;
      case 'profile': return <Profile />;
      case 'features': return <Features />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-950 flex flex-col font-sans selection:bg-green-100 selection:text-green-900 transition-colors duration-300">
      {/* Top Device Preview Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-4 py-3 flex justify-between items-center z-[100] relative shadow-sm transition-colors duration-300">
        <h1 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded-md"></div>
          <span className="hidden sm:inline">Nandri Connect Preview</span>
        </h1>
        <div className="flex items-center gap-4">
          <a 
            href="https://nandrikinderhilfe.de/jetzt-spenden/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#0070ba] text-white rounded-lg text-sm font-medium hover:bg-[#003087] transition-colors shadow-sm"
          >
            <span>Donate Now</span>
          </a>
          <div id="google_translate_element" className="scale-90 origin-right"></div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg transition-colors duration-300">
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}
              className="bg-transparent border-none text-sm font-medium focus:outline-none text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 hidden md:flex transition-colors duration-300">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'desktop' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              <Monitor className="w-4 h-4" /> Web App
            </button>
            <button 
              onClick={() => setViewMode('laptop')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'laptop' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              <Laptop className="w-4 h-4" /> Laptop
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'mobile' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              <Smartphone className="w-4 h-4" /> Mobile App
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex justify-center items-center relative">
        {/* Render area */}
        <div className={`${
          viewMode === 'desktop' ? 'w-full h-full' : 
          viewMode === 'laptop' ? 'w-[1024px] h-[768px] my-8 rounded-[1rem] border-[8px] border-gray-800 shrink-0 shadow-2xl relative overflow-hidden' : 
          'w-[375px] h-[812px] my-8 rounded-[3rem] border-[12px] border-gray-900 shrink-0 shadow-2xl relative overflow-hidden'
        } bg-gray-50 dark:bg-gray-900 flex flex-col transition-all duration-500 ease-in-out`}>
          
          {/* App Header with Login/Sign Up */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center shrink-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => user && setCurrentTab('feed')}
                className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold hidden sm:block">Nandri</span>
              </button>
              
              {user && (
                <button 
                  onClick={() => setCurrentTab('feed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <button 
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                >
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-700 dark:text-green-400 text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
              ) : (
                <>
                  <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
                    {t('login')}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="hidden sm:inline">{t('signup')}</span>
                    <span className="sm:hidden">{t('signupShort')}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto pb-safe scroll-smooth">
            {renderContent()}
          </div>
          
          {/* Floating Actions */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-40">
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollToBottom}
              className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <a 
              href={`https://wa.me/${localStorage.getItem('nandri_wa_number') || '919000668360'}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors mt-2"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
          
          {user && <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} />}
        </div>
      </div>
    </div>
  );
}

