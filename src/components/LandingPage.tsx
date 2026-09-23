import { Shield, FileText, Brain, Clock, Crown, Zap, ArrowRight, CheckCircle2, Building2, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onPricing: () => void;
}

export function LandingPage({ onGetStarted, onPricing }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CMP Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onPricing} className="text-blue-200 hover:text-white transition-colors text-sm">
              Pricing
            </button>
            <button onClick={onGetStarted} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">PA23 & GCF Compliant • AI-Powered</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Contract Management Plans,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"> Generated in Minutes</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload your contract and instantly generate a comprehensive, compliant Contract Management Plan aligned with the Procurement Act 2023 and Government Commercial Function standards.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button onClick={onGetStarted} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Free <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={onPricing} className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors w-full sm:w-auto">
              View Pricing
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 free AI analyses</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Word & HTML export</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: 'PA23 Compliant CMP', desc: 'Every section references Procurement Act 2023 requirements and GCF standards' },
            { icon: Brain, title: 'AI-Powered Analysis', desc: 'Intelligent contract analysis extracts key terms, risks, and obligations automatically' },
            { icon: Shield, title: 'GCF Aligned', desc: 'Built-in alignment with Government Commercial Function best practice modules' },
            { icon: Clock, title: 'Smart Reminders', desc: 'Never miss a review date with automated reminders for KPIs, milestones, and reports' },
            { icon: Crown, title: 'Premium Updates', desc: 'Upload contract changes and automatically update your CMP with AI-assisted impact analysis' },
            { icon: Building2, title: 'SharePoint Ready', desc: 'Export as HTML importable directly to SharePoint, or download as Word documents' },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-white/5 border-t border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Government Compliance</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Every Contract Management Plan generated follows the latest regulatory framework and commercial best practice standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-blue-400 font-semibold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" /> Procurement Act 2023
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Section 11: Contracting principles & objectives</li>
                <li>• Section 52-55: Contract terms & conditions</li>
                <li>• Section 72-74: Contract modifications</li>
                <li>• Section 93-95: Performance management</li>
                <li>• National Procurement Policy Statement alignment</li>
                <li>• Transparency & publication requirements</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-emerald-400 font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Government Commercial Function
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Module 1: Governance & Accountability</li>
                <li>• Module 3: Performance Management</li>
                <li>• Module 4: Risk Management</li>
                <li>• Module 5: Financial Management</li>
                <li>• Module 7: Stakeholder Management</li>
                <li>• Module 8: Contract Close-out</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your contract management?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          Join government organisations using AI to create compliant, comprehensive Contract Management Plans in minutes, not days.
        </p>
        <button onClick={onGetStarted} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-all hover:scale-105 inline-flex items-center gap-2">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>CLASSIFICATION: OFFICIAL | CMP Generator © 2026 | PA23 & GCF Compliant</p>
          <p className="mt-2">This tool assists with contract management planning. Professional judgement should always be applied.</p>
        </div>
      </footer>
    </div>
  );
}
