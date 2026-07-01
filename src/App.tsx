/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { INITIAL_SPONSORS, INITIAL_STUDENTS, INITIAL_UPDATES } from './data';
import { Sponsor, Update, Student } from './types';
import { BottomNav } from './components/BottomNav';
import { Feed } from './components/Feed';
import { StudentsList } from './components/StudentsList';
import { SponsorsList } from './components/SponsorsList';
import { AddUpdate } from './components/AddUpdate';
import { Profile } from './components/Profile';
import { CrmDashboard } from './components/CrmDashboard';
import { Dashboard } from './components/Dashboard';
import { AuthUI } from './components/AuthUI';
import { Globe, ArrowUp, ArrowDown, MessageCircle, Home, Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { SyncService } from './db/SyncService';
import { useTheme } from './ThemeContext';

import { Features } from './components/Features';
import { LiveChatOps, ParsedCommand } from './components/LiveChatOps';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Role } from './types';
import { ContactUs } from './components/ContactUs';
import { AdminSqlPage } from './components/AdminSqlPage';

interface TabOption {
  id: string;
  label: string;
  visible: boolean;
}

export default function App() {
  return <AppShell />;
}

interface AppShellProps {
  initialTab?: string;
}

export function AppShell({ initialTab = 'feed' }: AppShellProps) {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [updates, setUpdates] = useState<Update[]>(INITIAL_UPDATES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [sponsors, setSponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);
  
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [waNumber, setWaNumber] = useState('919000668360');
  const [donateUrl, setDonateUrl] = useState('https://www.paypal.com/donate');
  const [showTranslatePanel, setShowTranslatePanel] = useState(false);

  const role = user?.role || 'sponsor';
  const isStaff = role === 'employee' || role === 'superadmin';
  const deployedAt = process.env.NEXT_PUBLIC_DEPLOY_DATE || new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const staffOnlyTabs = new Set(['dashboard', 'add', 'crm', 'admin']);
    if (!isStaff && staffOnlyTabs.has(currentTab)) {
      setCurrentTab('feed');
    }
  }, [currentTab, isStaff]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWaNumber(localStorage.getItem('nandri_wa_number') || '919000668360');
      setDonateUrl(localStorage.getItem('nandri_donate_url') || 'https://www.paypal.com/donate');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('google-translate-script')) return;

    (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit = () => {
      const googleObj = (window as unknown as {
        google?: { translate?: { TranslateElement?: new (opts: object, id: string) => unknown } };
      }).google;
      if (!googleObj?.translate?.TranslateElement) return;
      try {
        new googleObj.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,de,ta,hi,fr,es,it,pt' },
          'google_translate_element',
        );
      } catch {
        // ignore translate init errors in unsupported runtimes
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    // Initial sync on mount
    const initSync = async () => {
      console.info('[DB][App] initSync:start');
      await SyncService.ensureSeededFromCurrentAppData(INITIAL_STUDENTS, INITIAL_UPDATES, INITIAL_SPONSORS);
      const { localStudents, localUpdates, localSponsors } = await SyncService.syncBothWays();
      if (localStudents.length > 0) setStudents(localStudents);
      if (localUpdates.length > 0) setUpdates(localUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      if (localSponsors.length > 0) setSponsors(localSponsors);
      console.info('[DB][App] initSync:done', {
        students: localStudents.length,
        updates: localUpdates.length,
        sponsors: localSponsors.length,
      });
    };
    initSync();
  }, []);

  const handleAddUpdate = async (newUpdate: Omit<Update, 'id' | 'date'>) => {
    const update: Update = {
      ...newUpdate,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    console.debug('[DB][App] handleAddUpdate', { updateId: update.id, type: update.type, studentId: update.studentId });
    setUpdates([update, ...updates]);
    await SyncService.saveUpdateLocally(update);
  };

  const handleAddStudent = async (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: Math.random().toString(36).substr(2, 9),
    };
    console.debug('[DB][App] handleAddStudent', { studentId: student.id, name: student.name });
    setStudents([student, ...students]);
    await SyncService.saveStudentLocally(student);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    console.debug('[DB][App] handleUpdateStudent', { studentId: updatedStudent.id, name: updatedStudent.name });
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    await SyncService.saveStudentLocally(updatedStudent);
  };

  const handleDeleteStudent = async (id: string) => {
    console.debug('[DB][App] handleDeleteStudent', { studentId: id });
    setStudents(students.filter(s => s.id !== id));
    await SyncService.deleteStudentLocally(id);
  };

  const handleManualSync = async () => {
    console.info('[DB][App] handleManualSync:start');
    const { localStudents, localUpdates, localSponsors } = await SyncService.syncBothWays();
    setStudents(localStudents);
    setUpdates(localUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setSponsors(localSponsors);
    console.info('[DB][App] handleManualSync:done', {
      students: localStudents.length,
      updates: localUpdates.length,
      sponsors: localSponsors.length,
    });
  };

  const addUserRecord = async (input: { name: string; email: string; role: Role }): Promise<void> => {
    const existing = JSON.parse(localStorage.getItem('nandri_users') || '[]') as Array<{ id: string; email: string; name: string; role: Role }>;
    const nextUser = {
      id: Math.random().toString(36).slice(2, 9),
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
    };
    localStorage.setItem('nandri_users', JSON.stringify([nextUser, ...existing]));
  };

  const executeChatCommand = async (command: ParsedCommand): Promise<string> => {
    if (!user) {
      throw new Error('Login required');
    }

    if (command.type === 'add_student') {
      const payload = command.payload;
      await handleAddStudent({
        name: payload.name,
        age: Number(payload.age || 10),
        school: payload.school || 'Primary Village School',
        village: payload.village || 'Irular Village A',
        grade: payload.grade || '5th Grade',
        photoUrl: payload.photoUrl || `https://i.pravatar.cc/150?u=${payload.name}`,
        sponsorName: payload.sponsorName || '',
        sponsorEmail: payload.sponsorEmail || '',
        donationAmount: Number(payload.donationAmount || 0),
        bio: payload.bio || `${payload.name} added via live chat command.`,
      });
      return 'student added';
    }

    if (command.type === 'add_user') {
      const payload = command.payload;
      const roleInput = (payload.role || 'sponsor').toLowerCase();
      const allowedRole: Role = roleInput === 'superadmin' || roleInput === 'employee' ? (roleInput as Role) : 'sponsor';
      await addUserRecord({ name: payload.name, email: payload.email, role: allowedRole });
      return 'user added';
    }

    if (command.type === 'email_information') {
      const payload = command.payload;
      const existing = JSON.parse(localStorage.getItem('nandri_email_outbox') || '[]') as Array<{ to: string; subject: string; body: string; createdAt: string }>;
      const emailItem = {
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('nandri_email_outbox', JSON.stringify([emailItem, ...existing]));
      return 'email queued';
    }

    if (command.type === 'post_content') {
      const payload = command.payload;
      await handleAddUpdate({
        authorName: user.name,
        content: payload.message,
        type: payload.studentId ? 'student' : 'general',
        studentId: payload.studentId,
        photoUrl: payload.photoUrl,
      });
      setCurrentTab('feed');
      return 'content posted';
    }

    if (command.type === 'social_post') {
      const platform = (command.payload.platform || '').toLowerCase();
      const message = command.payload.message || '';
      if (!['facebook', 'instagram', 'linkedin'].includes(platform) || !message.trim()) {
        throw new Error('Invalid social post payload');
      }

      const queued = JSON.parse(localStorage.getItem('nandri_social_posts') || '[]') as Array<{
        platform: 'facebook' | 'instagram' | 'linkedin';
        message: string;
        photoUrl?: string;
        createdAt: string;
      }>;
      queued.unshift({
        platform: platform as 'facebook' | 'instagram' | 'linkedin',
        message: message.trim(),
        photoUrl: command.payload.photoUrl || undefined,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('nandri_social_posts', JSON.stringify(queued.slice(0, 200)));
      return `queued ${platform} post`;
    }

    throw new Error('Unsupported command');
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
      case 'sponsors': return <SponsorsList sponsors={sponsors} />;
      case 'dashboard': return (role === 'employee' || role === 'superadmin') ? <Dashboard students={students} /> : null;
      case 'add': return (role === 'employee' || role === 'superadmin') ? <AddUpdate students={students} onAddUpdate={handleAddUpdate} onSuccess={() => setCurrentTab('feed')} /> : null;
      case 'crm': return (role === 'employee' || role === 'superadmin') ? <CrmDashboard students={students} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} onSyncNow={handleManualSync} /> : null;
      case 'admin':
        return (role === 'employee' || role === 'superadmin') ? (
          <AdminSqlPage
            onDataChanged={({ students: nextStudents, updates: nextUpdates, sponsors: nextSponsors }) => {
              setStudents(nextStudents);
              setUpdates(nextUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
              setSponsors(nextSponsors);
              console.info('[DB][App] admin:dataChanged', {
                students: nextStudents.length,
                updates: nextUpdates.length,
                sponsors: nextSponsors.length,
              });
            }}
          />
        ) : null;
      case 'profile': return <Profile />;
      case 'contact': return <ContactUs />;
      case 'features': return <Features />;
      default: return null;
    }
  };

  const tabOptions: TabOption[] = [
    { id: 'feed', label: t('updates'), visible: true },
    { id: 'students', label: t('students'), visible: true },
    { id: 'sponsors', label: t('sponsors'), visible: true },
    { id: 'features', label: 'Features', visible: true },
    { id: 'dashboard', label: t('dashboard'), visible: isStaff },
    { id: 'add', label: t('post'), visible: isStaff },
    { id: 'crm', label: t('crm'), visible: isStaff },
    { id: 'admin', label: 'Admin', visible: isStaff },
    { id: 'contact', label: t('contactUs'), visible: true },
    { id: 'profile', label: t('settings'), visible: true },
  ];

  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-950 flex flex-col font-sans selection:bg-green-100 selection:text-green-900 transition-colors duration-300">
      <div className="light-surface dark:bg-gray-900 dark:border-gray-800 px-4 py-3 flex justify-between items-center z-[100] relative transition-colors duration-300">
        <h1 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded-md"></div>
          <span className="hidden sm:inline">Nandri Connect</span>
        </h1>
        <div className="flex items-center gap-4">
          <a 
            href={donateUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#0070ba] text-white rounded-lg text-sm font-medium hover:bg-[#003087] transition-colors shadow-sm"
          >
            <span>Donate Now</span>
          </a>
          <div className="relative">
            <button
              onClick={() => setShowTranslatePanel((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              aria-label="Google Translate options"
            >
              <Languages className="w-4 h-4" />
              Translate
            </button>
            {showTranslatePanel && (
              <div className="absolute right-0 top-11 z-[120] w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Google Translate</div>
                <div id="google_translate_element" className="min-h-8" />
              </div>
            )}
          </div>
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
        </div>
      </div>
      <div className="hidden md:block light-surface-muted dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-2">
          {tabOptions
            .filter((tab) => tab.visible)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-emerald-100 dark:bg-green-900/40 text-emerald-800 dark:text-green-300 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex justify-center relative">
        <div className="w-full bg-transparent dark:bg-gray-900 flex flex-col transition-all duration-500 ease-in-out">
          <div className="light-surface dark:bg-gray-900 dark:border-gray-800 px-4 py-3 flex justify-between items-center shrink-0 z-50 transition-colors duration-300">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg border border-slate-200 dark:border-gray-700 transition-colors text-sm font-medium"
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

          <div ref={scrollRef} className="flex-1 overflow-y-auto pb-safe scroll-smooth max-w-7xl w-full mx-auto px-2 sm:px-3 md:px-4">
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
              href={`https://wa.me/${waNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors mt-2"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            {user && isStaff && <LiveChatOps onExecuteCommand={executeChatCommand} />}
            {user && isStaff && (
              <VoiceAssistant
                students={students}
                onAddStudent={handleAddStudent}
                onAddUser={addUserRecord}
                onSetLanguage={setLanguage}
              />
            )}
          </div>
          
          {user && <div className="md:hidden"><BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} /></div>}
        </div>
      </div>

      <footer className="light-surface dark:bg-gray-900 dark:border-gray-800 py-3 px-4 text-xs text-gray-600 dark:text-gray-400 text-center">
        Latest deploy date: {deployedAt}
      </footer>
    </div>
  );
}

