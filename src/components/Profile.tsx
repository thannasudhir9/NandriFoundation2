import { UserCircle, LogOut, Bell, Shield, Heart, Settings as SettingsIcon, MessageCircle, Users } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import { Role } from '../types';

export function Profile() {
  const { t } = useLanguage();
  const { user, logout, changeUserRole } = useAuth();
  
  const [waNumber, setWaNumber] = useState('');
  const [paypalUrl, setPaypalUrl] = useState('');
  const [applePayUrl, setApplePayUrl] = useState('');
  const [gpayUrl, setGpayUrl] = useState('');
  const [ibanName, setIbanName] = useState('');
  const [ibanNumber, setIbanNumber] = useState('');
  const [ibanBic, setIbanBic] = useState('');
  const [ibanBank, setIbanBank] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [targetRole, setTargetRole] = useState<Role>('employee');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setWaNumber(localStorage.getItem('nandri_wa_number') || '919000668360');
    setPaypalUrl(localStorage.getItem('nandri_paypal_url') || 'https://www.paypal.com/donate');
    setApplePayUrl(localStorage.getItem('nandri_apple_pay_url') || 'https://pay.apple.com');
    setGpayUrl(localStorage.getItem('nandri_gpay_url') || 'https://pay.google.com');
    setIbanName(localStorage.getItem('nandri_iban_name') || 'Nandri Kinderhilfe');
    setIbanNumber(localStorage.getItem('nandri_iban_number') || 'DE00 0000 0000 0000 0000 00');
    setIbanBic(localStorage.getItem('nandri_iban_bic') || 'NANDRIDEFF');
    setIbanBank(localStorage.getItem('nandri_iban_bank') || 'Sample Bank');
  }, []);

  const handleSaveWa = () => {
    localStorage.setItem('nandri_wa_number', waNumber);
    setSuccessMsg('WhatsApp number saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleUpdateRole = () => {
    changeUserRole(targetUserId, targetRole);
    setSuccessMsg(`Role updated for user ${targetUserId}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveDonations = () => {
    localStorage.setItem('nandri_paypal_url', paypalUrl);
    localStorage.setItem('nandri_apple_pay_url', applePayUrl);
    localStorage.setItem('nandri_gpay_url', gpayUrl);
    localStorage.setItem('nandri_iban_name', ibanName);
    localStorage.setItem('nandri_iban_number', ibanNumber);
    localStorage.setItem('nandri_iban_bic', ibanBic);
    localStorage.setItem('nandri_iban_bank', ibanBank);
    localStorage.setItem('nandri_donate_url', paypalUrl || 'https://www.paypal.com/donate');
    setSuccessMsg('Donation integrations saved!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!user) return null;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('settingsTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('settingsSubtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 flex items-center space-x-4 transition-colors duration-300">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.name} className="w-14 h-14 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
        ) : (
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-700 dark:text-green-400">
            <UserCircle className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-0.5 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center text-gray-700 dark:text-gray-200">
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-sm font-medium">Your Role Information</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center">
              <span className="text-sm text-gray-900 dark:text-gray-200 font-medium capitalize">{user.role}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.role === 'superadmin' && 'You have full access to all features and settings.'}
              {user.role === 'employee' && t('employeeRoleDesc')}
              {user.role === 'sponsor' && t('sponsorRoleDesc')}
            </p>
          </div>
        </div>

        {user.role === 'superadmin' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <MessageCircle className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm font-medium">WhatsApp Configuration</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">Support Number (with country code)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <button onClick={handleSaveWa} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Save</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <Users className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm font-medium">User Role Management</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">User ID</label>
                <input 
                  type="text" 
                  value={targetUserId}
                  placeholder="Enter User ID (e.g. admin1)"
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
                />
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mt-2">New Role</label>
                <select 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as Role)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="sponsor">Simple Access (Sponsor)</option>
                  <option value="employee">Admin (Employee)</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <button onClick={handleUpdateRole} className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Update Role</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <Heart className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm font-medium">Donation Integrations</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">PayPal URL</label>
                <input
                  type="url"
                  value={paypalUrl}
                  onChange={(e) => setPaypalUrl(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">Apple Pay URL</label>
                <input
                  type="url"
                  value={applePayUrl}
                  onChange={(e) => setApplePayUrl(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">Google Pay URL</label>
                <input
                  type="url"
                  value={gpayUrl}
                  onChange={(e) => setGpayUrl(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">IBAN Account Name</label>
                    <input
                      type="text"
                      value={ibanName}
                      onChange={(e) => setIbanName(e.target.value)}
                      className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">Bank Name</label>
                    <input
                      type="text"
                      value={ibanBank}
                      onChange={(e) => setIbanBank(e.target.value)}
                      className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">IBAN Number</label>
                <input
                  type="text"
                  value={ibanNumber}
                  onChange={(e) => setIbanNumber(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400">BIC / SWIFT</label>
                <input
                  type="text"
                  value={ibanBic}
                  onChange={(e) => setIbanBic(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <button onClick={handleSaveDonations} className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Save Donation Integrations</button>
              </div>
            </div>
          </>
        )}

        {successMsg && (
          <div className="p-3 bg-green-100 text-green-800 rounded-xl text-sm font-medium text-center">
            {successMsg}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <button className="w-full px-4 py-4 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5 mr-3 text-gray-400" />
            <span className="text-sm font-medium">{t('notifications')}</span>
          </button>
          
          {user.role === 'sponsor' && (
             <button className="w-full px-4 py-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Heart className="w-5 h-5 mr-3 text-red-400" />
              <span className="text-sm font-medium">{t('manageDonation')}</span>
            </button>
          )}
        </div>

        {user.role === 'sponsor' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Donation Ways</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a href={paypalUrl || '#'} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-[#0070ba] text-white text-sm font-medium text-center">PayPal</a>
              <a href={applePayUrl || '#'} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-black text-white text-sm font-medium text-center">Apple Pay</a>
              <a href={gpayUrl || '#'} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium text-center">G Pay</a>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">IBAN Transfer</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{ibanName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{ibanBank}</p>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">IBAN: {ibanNumber}</p>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">BIC: {ibanBic}</p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={logout}
        className="w-full py-4 flex items-center justify-center text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        {t('signOut')}
      </button>
    </div>
  );
}
