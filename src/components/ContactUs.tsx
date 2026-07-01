import { Mail, MessageSquareWarning } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function ContactUs() {
  const { t } = useLanguage();
  const subject = encodeURIComponent('Nandri Connect Support Request');
  const body = encodeURIComponent(
    [
      'Hi Team,',
      '',
      'I am facing an issue in Nandri Connect.',
      '',
      'Issue summary:',
      '- ',
      '',
      'Steps to reproduce:',
      '1. ',
      '2. ',
      '',
      'Expected behavior:',
      '- ',
      '',
      'Actual behavior:',
      '- ',
      '',
      'Thanks,',
    ].join('\n'),
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('contactUs')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('contactUsSubtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
            <MessageSquareWarning className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{t('contactUsHelpText')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {t('contactEmailLabel')}: <span className="font-medium">sthanna@salesforce.com</span>
            </p>
            <a
              href={`mailto:sthanna@salesforce.com?subject=${subject}&body=${body}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('emailSupport')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
