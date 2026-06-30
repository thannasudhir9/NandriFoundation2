import { UserCircle, LogOut, Bell, Shield, Heart } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';

interface ProfileProps {
  role: 'employee' | 'sponsor';
  setRole: (role: 'employee' | 'sponsor') => void;
}

export function Profile({ role, setRole }: ProfileProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{t('settingsTitle')}</h1>
        <p className="text-sm text-gray-500 font-medium">{t('settingsSubtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center space-x-4">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.name} className="w-14 h-14 rounded-full border border-gray-200 object-cover" />
        ) : (
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700">
            <UserCircle className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
          <p className="text-xs font-medium text-green-600 mt-0.5 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-sm font-medium">{t('appRole')}</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                className="text-green-600 focus:ring-green-500 w-4 h-4"
                checked={role === 'employee'}
                onChange={() => setRole('employee')}
              />
              <span className="ml-3 text-sm text-gray-900 font-medium">{t('employeeIndia')}</span>
            </label>
            <p className="ml-7 text-xs text-gray-500 mb-2">{t('employeeRoleDesc')}</p>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                className="text-green-600 focus:ring-green-500 w-4 h-4"
                checked={role === 'sponsor'}
                onChange={() => setRole('sponsor')}
              />
              <span className="ml-3 text-sm text-gray-900 font-medium">{t('sponsorGermany')}</span>
            </label>
            <p className="ml-7 text-xs text-gray-500">{t('sponsorRoleDesc')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full px-4 py-4 flex items-center text-gray-700 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 mr-3 text-gray-400" />
            <span className="text-sm font-medium">{t('notifications')}</span>
          </button>
          
          {role === 'sponsor' && (
             <button className="w-full px-4 py-4 border-t border-gray-50 flex items-center text-gray-700 hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5 mr-3 text-red-400" />
              <span className="text-sm font-medium">{t('manageDonation')}</span>
            </button>
          )}
        </div>
      </div>

      <button 
        onClick={logout}
        className="w-full py-4 flex items-center justify-center text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        {t('signOut')}
      </button>
    </div>
  );
}
