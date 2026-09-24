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
import { AuthPage } from './components/AuthPage';
import { UserProvider, useUser } from './context/UserContext';

type Page = 'landing' | 'auth' | 'dashboard' | 'upload' | 'viewer' | 'settings' | 'reminders' | 'pricing';

function AppContent() {
  const { user, isAuthenticated } = useUser();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentCMP, setCurrentCMP] = useState<ContractManagementPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
      setCurrentPage('auth');
    }
  }, [isAuthenticated, currentPage]);

  // Load from localStorage
  useEffect(() => {
    const savedCMPs = localStorage.getItem('cmp_plans');
    const savedContracts = localStorage.getItem('cmp_contracts');
    
    if (savedCMPs) {
      const plans = JSON.parse(savedCMPs);
      if (plans.length > 0) setCurrentCMP(plans[plans.length - 1]);
    }
    if (savedContracts) setContracts(JSON.parse(savedContracts));
  }, []);

  useEffect(() => {
    localStorage.setItem('cmp_contracts', JSON.stringify(contracts));
  }, [contracts]);

  const handleCMPGenerated = (cmp: ContractManagementPlan) => {
    setCurrentCMP(cmp);
    const savedCMPs = JSON.parse(localStorage.getItem('cmp_plans') || '[]');
    savedCMPs.push(cmp);
    localStorage.setItem('cmp_plans', JSON.stringify(savedCMPs));
    setCurrentPage('viewer');
  };

  const navigate = (page: Page) => setCurrentPage(page);

  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => navigate('auth')} onPricing={() => navigate('pricing')} />;
  }

  if (currentPage === 'auth') {
    return <AuthPage onSuccess={() => navigate('dashboard')} />;
  }

  if (!isAuthenticated || !user) {
    return <AuthPage onSuccess={() => navigate('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onNavigate={navigate}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <Dashboard 
            user={user}
            contracts={contracts}
            currentCMP={currentCMP}
            onUploadNew={() => navigate('upload')}
            onViewCMP={() => navigate('viewer')}
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
          />
        )}
        
        {currentPage === 'settings' && (
          <Settings user={user} />
        )}
        
        {currentPage === 'reminders' && (
          <Reminders cmp={currentCMP} user={user} />
        )}
        
        {currentPage === 'pricing' && (
          <PricingPage user={user} onBack={() => navigate('dashboard')} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
