import { useState, useEffect } from 'react';
import { User, Building2, Key, Crown, Bell, Shield, Database, Code, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { useUser, saveApiKey, getApiKey, removeApiKey } from '../context/UserContext';
import { validateOpenRouterKey, OPENROUTER_MODELS, OpenRouterModel } from '../utils/openRouter';

interface SettingsProps {
  user: UserProfile;
}

export function Settings({ user }: SettingsProps) {
  const { updateUser, developerMode, toggleDeveloperMode, upgradeToPremium } = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organisation, setOrganisation] = useState(user.organisation);
  const [saved, setSaved] = useState(false);
  
  // API Key management
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [keyValidating, setKeyValidating] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [keyUsage, setKeyUsage] = useState<{ credits_used: number; credits_remaining: number } | null>(null);
  
  // Model selection
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel>('google/gemini-flash-1.5');

  useEffect(() => {
    // Load existing API key
    getApiKey('openrouter').then(key => {
      if (key) {
        setOpenRouterKey(key);
        setKeyStatus('valid');
      }
    });
  }, []);

  const handleSave = () => {
    updateUser({ name, email, organisation });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveApiKey = async () => {
    if (!openRouterKey.trim()) {
      removeApiKey('openrouter');
      setKeyStatus('idle');
      setKeyUsage(null);
      return;
    }

    setKeyValidating(true);
    setKeyStatus('idle');
    
    try {
      const result = await validateOpenRouterKey(openRouterKey);
      
      if (result.valid) {
        await saveApiKey('openrouter', openRouterKey);
        setKeyStatus('valid');
        if (result.usage) {
          setKeyUsage(result.usage);
        }
      } else {
        setKeyStatus('invalid');
      }
    } catch (error) {
      setKeyStatus('invalid');
    } finally {
      setKeyValidating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account, API keys, and preferences</p>
      </div>

      {/* Developer Mode Banner */}
      {developerMode && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6" />
            <div className="flex-1">
              <p className="font-semibold">Developer Mode Active</p>
              <p className="text-sm text-white/80">Premium features unlocked for testing</p>
            </div>
            <button
              onClick={toggleDeveloperMode}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Disable
            </button>
          </div>
        </div>
      )}

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

      {/* OpenRouter API Key */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-500" /> OpenRouter API Key
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Add your OpenRouter API key to access premium AI models (Gemini Flash, DeepSeek, GPT-4o, Claude, etc.)
        </p>
        
        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <p className="font-semibold mb-1">Security Notice</p>
              <p>Your API key is stored in your browser's local storage. For maximum security in production, use a backend proxy. Get your free API key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">openrouter.ai/keys</a></p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              value={openRouterKey}
              onChange={(e) => {
                setOpenRouterKey(e.target.value);
                setKeyStatus('idle');
              }}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {keyStatus === 'valid' && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>API key validated successfully</span>
              {keyUsage && (
                <span className="text-xs text-slate-500 ml-2">
                  ({keyUsage.credits_remaining} credits remaining)
                </span>
              )}
            </div>
          )}

          {keyStatus === 'invalid' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Invalid API key. Please check and try again.</span>
            </div>
          )}

          <button
            onClick={handleSaveApiKey}
            disabled={keyValidating}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {keyValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate & Save Key'
            )}
          </button>
        </div>

        {/* Model Selection */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="font-medium text-slate-700 mb-3">Preferred AI Model</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(OPENROUTER_MODELS).map(([id, model]) => (
              <button
                key={id}
                onClick={() => setSelectedModel(id as OpenRouterModel)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedModel === id
                    ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-slate-800">{model.name}</span>
                  {model.recommended && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Recommended</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{model.description}</p>
                <p className="text-xs text-slate-400 mt-1">{model.costPer1kTokens} / 1K tokens</p>
              </button>
            ))}
          </div>
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
            <button onClick={upgradeToPremium} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Developer Mode Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-500" /> Developer Mode
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Enable developer mode to unlock all premium features for testing purposes.
        </p>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-800">Developer Mode</p>
            <p className="text-sm text-slate-500 mt-0.5">
              {developerMode ? 'Active - All premium features unlocked' : 'Inactive'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={developerMode}
              onChange={toggleDeveloperMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
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
