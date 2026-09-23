import { useState, useEffect } from 'react';
import { ContractManagementPlan, UserProfile, Contract } from './types';
import { Dashboard } from './components/Dashboard';
import { ContractUpload } from './components/ContractUpload';
import { CMPViewer } from './components/CMPViewer';
import { Settings } from './components/Settings';
import { Reminders } from './components/Reminders';
import { PricingPage } from './components/PricingPage';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';

type Page = 'landing' | 'dashboard' | 'upload' | 'viewer' | 'settings' | 'reminders' | 'pricing';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'Government User',
    email: 'user@gov.uk',
    organisation: 'HM Government',
    tier: 'free',
    aiCreditsRemaining: 5,
    contractsCount: 0
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentCMP, setCurrentCMP] = useState<ContractManagementPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cmp_user');
    const savedCMPs = localStorage.getItem('cmp_plans');
    const savedContracts = localStorage.getItem('cmp_contracts');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCMPs) {
      const plans = JSON.parse(savedCMPs);
      if (plans.length > 0) setCurrentCMP(plans[plans.length - 1]);
    }
    if (savedContracts) setContracts(JSON.parse(savedContracts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cmp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cmp_contracts', JSON.stringify(contracts));
  }, [contracts]);

  const handleCMPGenerated = (cmp: ContractManagementPlan) => {
    setCurrentCMP(cmp);
    const savedCMPs = JSON.parse(localStorage.getItem('cmp_plans') || '[]');
    savedCMPs.push(cmp);
    localStorage.setItem('cmp_plans', JSON.stringify(savedCMPs));
    setUser(prev => ({ ...prev, contractsCount: prev.contractsCount + 1 }));
    setCurrentPage('viewer');
  };

  const handleUpgrade = () => {
    setUser(prev => ({ ...prev, tier: 'premium', aiCreditsRemaining: 999 }));
  };

  const navigate = (page: Page) => setCurrentPage(page);

  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => navigate('dashboard')} onPricing={() => navigate('pricing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onNavigate={navigate}
        onLogout={() => navigate('landing')}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <Dashboard 
            user={user}
            contracts={contracts}
            currentCMP={currentCMP}
            onUploadNew={() => navigate('upload')}
            onViewCMP={() => navigate('viewer')}
            onUpgrade={handleUpgrade}
          />
        )}
        
        {currentPage === 'upload' && (
          <ContractUpload
            user={user}
            onCMPGenerated={handleCMPGenerated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onBack={() => navigate('dashboard')}
          />
        )}
        
        {currentPage === 'viewer' && currentCMP && (
          <CMPViewer
            cmp={currentCMP}
            user={user}
            onBack={() => navigate('dashboard')}
            onUpgrade={handleUpgrade}
          />
        )}
        
        {currentPage === 'settings' && (
          <Settings user={user} setUser={setUser} onUpgrade={handleUpgrade} />
        )}
        
        {currentPage === 'reminders' && (
          <Reminders cmp={currentCMP} user={user} onUpgrade={handleUpgrade} />
        )}
        
        {currentPage === 'pricing' && (
          <PricingPage user={user} onUpgrade={handleUpgrade} onBack={() => navigate('dashboard')} />
        )}
      </main>
    </div>
  );
}

export default App;
