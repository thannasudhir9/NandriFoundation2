import { List, MessageCircle, Settings, Users, Database, Globe } from 'lucide-react';

export function Features() {
  const featuresList = [
    {
      title: 'Feed',
      description: 'View real-time updates and posts from students and sponsors. Support for image attachments.',
      icon: <List className="w-6 h-6 text-green-600 dark:text-green-400" />
    },
    {
      title: 'Students List',
      description: 'Browse the complete list of students, with search functionality by name or location.',
      icon: <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
    },
    {
      title: 'CRM Dashboard',
      description: 'Advanced data management for employees. Supports Excel Import/Export, and inline editing.',
      icon: <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
    },
    {
      title: 'Multi-language & Translation',
      description: 'Integrated Google Translate widget to translate content seamlessly on the fly.',
      icon: <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
    },
    {
      title: 'WhatsApp Integration',
      description: 'Quickly connect with support via WhatsApp directly from the application interface.',
      icon: <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
    },
    {
      title: 'Role-based Access Control',
      description: 'Supports dynamic user roles (Super Admin, Admin, Sponsor) to control feature visibility.',
      icon: <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
    }
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Application Features</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Explore everything you can do</p>
      </div>

      <div className="space-y-4">
        {featuresList.map((feature, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-start transition-colors duration-300">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
