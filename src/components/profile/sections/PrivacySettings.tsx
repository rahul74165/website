import { useState } from 'react';
import { Shield, Download, ToggleLeft, ToggleRight } from 'lucide-react';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultSettings: PrivacySetting[] = [
  {
    id: 'personalization',
    title: 'Personalized Recommendations',
    description: 'Allow us to use your browsing history to show relevant products',
    enabled: true
  },
  {
    id: 'analytics',
    title: 'Analytics & Improvements',
    description: 'Help us improve our services by sharing usage data',
    enabled: true
  },
  {
    id: 'marketing',
    title: 'Marketing Communications',
    description: 'Receive personalized marketing communications',
    enabled: false
  },
  {
    id: 'thirdParty',
    title: 'Third-Party Sharing',
    description: 'Share data with trusted partners for better services',
    enabled: false
  }
];

export default function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySetting[]>(defaultSettings);

  const handleToggle = (id: string) => {
    setSettings(current =>
      current.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>

      <div className="bg-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Data Privacy</h3>
            <p className="text-white/70">Manage how your data is used and shared</p>
          </div>
        </div>

        <div className="space-y-6">
          {settings.map(setting => (
            <div key={setting.id} className="flex items-center justify-between pb-6 border-b border-white/10 last:border-0">
              <div>
                <h4 className="font-medium">{setting.title}</h4>
                <p className="text-sm text-white/70">{setting.description}</p>
              </div>
              <button
                onClick={() => handleToggle(setting.id)}
                className="text-accent-400"
              >
                {setting.enabled ? (
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-white/50" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Data Export</h3>
        <p className="text-white/70 mb-6">
          Download a copy of your personal data in a machine-readable format
        </p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-accent-600 rounded-lg hover:bg-accent-700">
          <Download className="w-5 h-5" />
          <span>Request Data Export</span>
        </button>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h4 className="font-medium mb-2">What's included:</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Profile information</li>
            <li>• Order history</li>
            <li>• Saved addresses</li>
            <li>• Payment methods (last 4 digits only)</li>
            <li>• Communication preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}