import { ArrowLeft, Check, Crown, Zap, Shield, Brain, RefreshCw, Bell, FileText, Globe } from 'lucide-react';
import { UserProfile } from '../types';
import { useUser } from '../context/UserContext';

interface PricingPageProps {
  user: UserProfile;
  onBack: () => void;
}

export function PricingPage({ user, onBack }: PricingPageProps) {
  const { upgradeToPremium } = useUser();
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Choose Your Plan</h1>
          <p className="text-slate-500 text-sm">Select the plan that fits your contract management needs</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 relative">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Free</h2>
            <p className="text-slate-500 text-sm mt-1">Get started with contract management</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-slate-800">£0</span>
              <span className="text-slate-500 text-sm">/forever</span>
            </div>
          </div>
          
          <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-medium mb-6 cursor-default">
            {user.tier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Includes:</p>
            {[
              { text: 'Upload & analyse contracts', included: true },
              { text: '5 AI analyses per month', included: true },
              { text: 'Standard AI model', included: true },
              { text: 'PA23 & GCF compliant CMP', included: true },
              { text: 'Word document export', included: true },
              { text: 'HTML export (SharePoint)', included: true },
              { text: 'Basic reminders', included: true },
              { text: 'Contract update analysis', included: false },
              { text: 'Premium AI models', included: false },
              { text: 'Unlimited analyses', included: false },
              { text: 'Portfolio management', included: false },
              { text: 'Priority support', included: false },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                {feature.included ? (
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 flex-shrink-0" />
                )}
                <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-2xl border-2 border-amber-400 p-8 relative shadow-lg shadow-amber-100">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMMENDED
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Premium <Crown className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-slate-500 text-sm mt-1">For professional contract managers</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-slate-800">£29</span>
              <span className="text-slate-500 text-sm">/month per user</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Volume licensing available for teams</p>
          </div>
          
          <button
            onClick={upgradeToPremium}
            disabled={user.tier === 'premium'}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-medium mb-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-default"
          >
            {user.tier === 'premium' ? '✓ Active' : 'Upgrade Now'}
          </button>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Everything in Free, plus:</p>
            {[
              { text: 'Unlimited AI analyses', included: true },
              { text: 'Premium AI models (Gemini Flash, DeepSeek)', included: true },
              { text: 'Contract change analysis & CMP auto-update', included: true },
              { text: 'Advanced reminders with email/SMS', included: true },
              { text: 'Portfolio management (multiple contracts)', included: true },
              { text: 'Collaboration & sharing', included: true },
              { text: 'Custom CMP templates', included: true },
              { text: 'Compliance monitoring dashboard', included: true },
              { text: 'Audit trail & version history', included: true },
              { text: 'Priority support', included: true },
              { text: 'API access for integration', included: true },
              { text: 'Bulk contract processing', included: true },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Models Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" /> AI Model Comparison
        </h2>
        <p className="text-sm text-slate-500 mb-6">Choose the right AI model for your analysis needs</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 font-semibold text-slate-700">Model</th>
                <th className="text-left py-3 font-semibold text-slate-700">Provider</th>
                <th className="text-left py-3 font-semibold text-slate-700">Speed</th>
                <th className="text-left py-3 font-semibold text-slate-700">Quality</th>
                <th className="text-left py-3 font-semibold text-slate-700">Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-800">Standard AI</td>
                <td className="py-3 text-slate-600">Built-in</td>
                <td className="py-3"><span className="text-amber-600">●●○</span></td>
                <td className="py-3"><span className="text-amber-600">●●○</span></td>
                <td className="py-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">Free</span></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-800">Gemini Flash</td>
                <td className="py-3 text-slate-600">Google</td>
                <td className="py-3"><span className="text-emerald-600">●●●</span></td>
                <td className="py-3"><span className="text-emerald-600">●●●</span></td>
                <td className="py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Premium</span></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-800">DeepSeek Flash</td>
                <td className="py-3 text-slate-600">DeepSeek</td>
                <td className="py-3"><span className="text-emerald-600">●●●</span></td>
                <td className="py-3"><span className="text-emerald-600">●●●</span></td>
                <td className="py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Premium</span></td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-800">GPT-4o Mini</td>
                <td className="py-3 text-slate-600">OpenAI</td>
                <td className="py-3"><span className="text-emerald-600">●●○</span></td>
                <td className="py-3"><span className="text-emerald-600">●●●</span></td>
                <td className="py-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">Premium</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-bold mb-4">Why Premium Pays for Itself</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">80%</div>
            <p className="text-sm text-slate-300">Time saved on CMP creation</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
            <p className="text-sm text-slate-300">PA23 compliance coverage</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">24/7</div>
            <p className="text-sm text-slate-300">AI-powered contract monitoring</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-slate-300 text-center">
            The average government contract manager spends 40+ hours creating a CMP manually. 
            Our AI does it in minutes, with full PA23 and GCF compliance built in.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is my contract data secure?', a: 'Yes. All data is processed locally in your browser. No contract text is stored on our servers. The tool is designed for OFFICIAL classification data.' },
            { q: 'What AI models are available?', a: 'Free users get our Standard AI model. Premium users can choose from Gemini Flash, DeepSeek Flash, or GPT-4o Mini for higher quality analysis.' },
            { q: 'Can I update my CMP when the contract changes?', a: 'Yes, with Premium. Upload the updated contract and our AI will identify changes and suggest CMP updates automatically.' },
            { q: 'Is the HTML export really SharePoint compatible?', a: 'Yes. The HTML follows GOV.UK design patterns and includes metadata for direct import into SharePoint pages.' },
            { q: 'Do you offer team/enterprise licensing?', a: 'Yes. Contact us for volume licensing with SSO integration, admin controls, and dedicated support.' },
          ].map((faq, i) => (
            <div key={i} className="border-b border-slate-100 pb-4 last:border-0">
              <h3 className="font-medium text-slate-800 text-sm">{faq.q}</h3>
              <p className="text-sm text-slate-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
