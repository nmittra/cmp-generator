import { Shield, LayoutDashboard, Upload, FileText, Settings, Bell, Crown, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

type Page = 'landing' | 'dashboard' | 'upload' | 'viewer' | 'settings' | 'reminders' | 'pricing';

interface HeaderProps {
  user: UserProfile;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Header({ user, currentPage, onNavigate, onLogout }: HeaderProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as Page, label: 'Upload', icon: Upload },
    { id: 'viewer' as Page, label: 'CMP Viewer', icon: FileText },
    { id: 'reminders' as Page, label: 'Reminders', icon: Bell },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 hidden sm:block">CMP Generator</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user.tier === 'free' && (
              <button
                onClick={() => onNavigate('pricing')}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-medium text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-slate-600 hidden lg:block text-sm">{user.organisation}</span>
            </div>

            <button onClick={onLogout} className="text-slate-400 hover:text-slate-600 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
