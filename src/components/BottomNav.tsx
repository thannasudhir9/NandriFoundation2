import { Home, Users, PlusCircle, Settings, Database, Sparkles, LayoutDashboard, HandCoins, Mail } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import Link from 'next/link';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
}

export function BottomNav({ currentTab, setCurrentTab, role }: BottomNavProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 sm:px-6 py-2 pb-safe z-50 shrink-0 transition-colors duration-300">
      <div className="flex justify-between items-center w-full max-w-md mx-auto">
        <button 
          onClick={() => setCurrentTab('feed')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'feed' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">{t('updates')}</span>
        </button>
        
        <button 
          onClick={() => setCurrentTab('students')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'students' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Users className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">{t('students')}</span>
        </button>

        <button
          onClick={() => setCurrentTab('sponsors')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'sponsors' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <HandCoins className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">{t('sponsors')}</span>
        </button>

        <button 
          onClick={() => setCurrentTab('features')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'features' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Sparkles className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">Features</span>
        </button>
        
        {(role === 'employee' || role === 'superadmin') && (
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'dashboard' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium hidden sm:block">{t('dashboard')}</span>
          </button>
        )}

        {(role === 'employee' || role === 'superadmin') && (
          <Link
            href="/reports"
            className="flex flex-col items-center p-2 flex-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="w-6 h-6 mb-1 text-center font-bold">R</span>
            <span className="text-[10px] font-medium hidden sm:block">Reports</span>
          </Link>
        )}

        {(role === 'employee' || role === 'superadmin') && (
          <button 
            onClick={() => setCurrentTab('add')}
            className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'add' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <PlusCircle className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium hidden sm:block">{t('post')}</span>
          </button>
        )}

        {(role === 'employee' || role === 'superadmin') && (
          <button 
            onClick={() => setCurrentTab('crm')}
            className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'crm' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Database className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium hidden sm:block">{t('crm')}</span>
          </button>
        )}

        {(role === 'employee' || role === 'superadmin') && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'admin' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Database className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium hidden sm:block">Admin</span>
          </button>
        )}
        
        <button 
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'profile' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">{t('settings')}</span>
        </button>

        <button
          onClick={() => setCurrentTab('contact')}
          className={`flex flex-col items-center p-2 flex-1 ${currentTab === 'contact' ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Mail className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium hidden sm:block">{t('contactUs')}</span>
        </button>
      </div>
    </div>
  );
}
