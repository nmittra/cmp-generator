import { useState } from 'react';
import { User, Building2, Key, Crown, Bell, Shield, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onUpgrade: () => void;
}

export function Settings({ user, setUser, onUpgrade }: SettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organisation, setOrganisation] = useState(user.organisation);
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    setUser({ ...user, name, email, organisation });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Account Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organisation</label>
            <input
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" /> Subscription
        </h2>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-800">
              Current Plan: <span className={user.tier === 'premium' ? 'text-amber-600' : 'text-slate-600'}>{user.tier.toUpperCase()}</span>
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              {user.tier === 'free' 
                ? `${user.aiCreditsRemaining} AI credits remaining`
                : 'Unlimited AI analysis • Contract updates • All models'}
            </p>
          </div>
          {user.tier === 'free' && (
            <button onClick={onUpgrade} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-500" /> AI API Configuration
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Bring your own API key for premium AI models (Gemini Flash, DeepSeek Flash, GPT-4o Mini).
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Model</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Standard (Free)</option>
              <option>Gemini Flash</option>
              <option>DeepSeek Flash</option>
              <option>GPT-4o Mini</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-500" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Review reminders', desc: 'Get notified before contract review dates' },
            { label: 'Milestone alerts', desc: 'Alerts for upcoming contract milestones' },
            { label: 'KPI reporting', desc: 'Reminders for KPI reporting deadlines' },
            { label: 'CMP update suggestions', desc: 'AI-suggested updates when regulations change' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data & Security */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" /> Data & Security
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">Data Storage</p>
              <p className="text-xs text-slate-500">All data stored locally in your browser</p>
            </div>
            <Database className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">Classification</p>
              <p className="text-xs text-slate-500">OFFICIAL - No data leaves your device</p>
            </div>
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
            Clear all local data
          </button>
        </div>
      </div>
    </div>
  );
}
