import { FileText, Upload, Bell, Crown, TrendingUp, Shield, Clock, AlertTriangle, Brain, Calendar, CheckCircle, Globe } from 'lucide-react';
import { UserProfile, Contract, ContractManagementPlan } from '../types';

import { useUser } from '../context/UserContext';

interface DashboardProps {
  user: UserProfile;
  contracts: Contract[];
  currentCMP: ContractManagementPlan | null;
  onUploadNew: () => void;
  onViewCMP: () => void;
}

export function Dashboard({ user, contracts, currentCMP, onUploadNew, onViewCMP }: DashboardProps) {
  const { upgradeToPremium } = useUser();
  const upcomingReminders = currentCMP?.reminders.filter(r => !r.completed) || [];
  const urgentReminders = upcomingReminders.filter(r => {
    const daysUntil = Math.ceil((new Date(r.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 14;
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-blue-100 mb-4">
          {user.tier === 'free' 
            ? `You have ${user.aiCreditsRemaining} AI credits remaining. Upgrade for unlimited access.`
            : 'Premium access active. Unlimited AI analysis and contract updates.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onUploadNew} className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Contract
          </button>
          {currentCMP && (
            <button onClick={onViewCMP} className="bg-blue-500/30 border border-blue-400/30 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500/40 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" /> View Current CMP
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Active Contracts" value={contracts.length.toString()} color="blue" />
        <StatCard icon={Shield} label="Compliance Score" value={currentCMP ? '95%' : 'N/A'} color="emerald" />
        <StatCard icon={Clock} label="Pending Reviews" value={upcomingReminders.length.toString()} color="amber" />
        <StatCard icon={TrendingUp} label="AI Credits" value={user.tier === 'premium' ? '∞' : user.aiCreditsRemaining.toString()} color="purple" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionButton icon={Upload} label="Upload New Contract" desc="Generate a CMP from a contract document" onClick={onUploadNew} />
            <ActionButton icon={FileText} label="View CMP" desc="Review and edit your Contract Management Plan" onClick={onViewCMP} disabled={!currentCMP} />
            <ActionButton icon={Bell} label="Manage Reminders" desc="Set up review dates and notifications" onClick={() => {}} />
            <ActionButton icon={Crown} label="Upgrade Plan" desc="Unlock premium features and unlimited AI" onClick={upgradeToPremium} highlight={user.tier === 'free'} />
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Upcoming Reminders
          </h2>
          {urgentReminders.length > 0 ? (
            <div className="space-y-3">
              {urgentReminders.slice(0, 4).map(reminder => (
                <div key={reminder.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{reminder.title}</p>
                    <p className="text-xs text-slate-500">Due: {new Date(reminder.dueDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No urgent reminders. Upload a contract to generate reminders.</p>
          )}
        </div>
      </div>

      {/* Commercial Health Check */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" /> Commercial Health Check
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Contract Governance', score: 92, color: 'emerald' },
            { label: 'Risk Management', score: 78, color: 'amber' },
            { label: 'Performance', score: 85, color: 'emerald' },
            { label: 'Compliance', score: 96, color: 'emerald' },
            { label: 'Financial Control', score: 88, color: 'emerald' },
            { label: 'Stakeholder Engagement', score: 72, color: 'amber' },
            { label: 'Supply Chain', score: 65, color: 'amber' },
            { label: 'Exit Readiness', score: 45, color: 'red' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    stroke={item.color === 'emerald' ? '#10b981' : item.color === 'amber' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="4"
                    strokeDasharray={`${(item.score / 100) * 176} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
                  {item.score}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <strong>Overall Health Score: 78/100</strong> — Good. Key improvement areas: Exit Readiness and Supply Chain visibility. 
            {user.tier === 'free' && ' Upgrade for detailed improvement recommendations.'}
          </p>
        </div>
      </div>

      {/* PA23 Compliance Info */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">PA23 & GCF Compliance Coverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Contracting Principles', status: 'covered' },
            { label: 'Contract Terms', status: 'covered' },
            { label: 'Performance Management', status: 'covered' },
            { label: 'Risk Management', status: 'covered' },
            { label: 'Financial Management', status: 'covered' },
            { label: 'Change Control', status: 'covered' },
            { label: 'Stakeholder Management', status: 'covered' },
            { label: 'Exit Strategy', status: 'covered' },
            { label: 'Social Value', status: 'covered' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" /> Contract Lifecycle Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          <div className="space-y-6">
            {[
              { phase: 'Mobilisation', status: 'complete', date: 'Apr 2025', desc: 'Contract signed, team onboarded, kick-off completed' },
              { phase: 'Steady State', status: 'current', date: 'Now', desc: 'Services running, monthly reviews, KPI monitoring active' },
              { phase: 'Mid-Term Review', status: 'upcoming', date: 'Apr 2026', desc: 'Comprehensive review, market testing consideration, extension decision' },
              { phase: 'Exit Planning', status: 'future', date: 'Oct 2027', desc: 'Transition planning, knowledge transfer, re-procurement preparation' },
              { phase: 'Contract Close', status: 'future', date: 'Mar 2028', desc: 'Final handover, lessons learned, archive' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 pl-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  item.status === 'complete' ? 'bg-emerald-500' :
                  item.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100' :
                  item.status === 'upcoming' ? 'bg-amber-500' :
                  'bg-slate-300'
                }`}>
                  {item.status === 'complete' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-slate-800">{item.phase}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      item.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'current' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'upcoming' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration & Export Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-500" /> Export & Integration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium text-sm text-slate-800">Word Document</h3>
            <p className="text-xs text-slate-500 mt-1">.docx format for editing and printing</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
            <Globe className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-medium text-sm text-slate-800">SharePoint HTML</h3>
            <p className="text-xs text-slate-500 mt-1">Import directly to SharePoint pages</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 text-center">
            <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-medium text-sm text-slate-800">Compliance Report</h3>
            <p className="text-xs text-slate-500 mt-1">PA23 & GCF compliance summary</p>
          </div>
        </div>
      </div>

      {/* Lessons Learned Quick Capture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-500" /> Lessons Learned & Continuous Improvement
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
            <p className="text-sm font-medium text-teal-800">📝 What went well</p>
            <p className="text-xs text-teal-600 mt-1">Supplier response times exceeded SLA targets consistently</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
            <p className="text-sm font-medium text-rose-800">📝 What could improve</p>
            <p className="text-xs text-rose-600 mt-1">Monthly reporting format needs standardisation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Add a lesson learned..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            Add
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Lessons are automatically categorised and can be shared across your contract portfolio.
          {user.tier === 'premium' && ' AI will suggest relevant lessons from similar contracts.'}
        </p>
      </div>

      {/* Regulatory Monitoring */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-800">Regulatory Update Available</p>
          <p className="text-xs text-indigo-600 mt-0.5">
            Cabinet Office has published updated guidance on PA23 Section 72 modifications (PPN 01/26). 
            Review your change management provisions to ensure continued compliance.
          </p>
          <button className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded font-medium hover:bg-indigo-700 transition-colors">
            Review Impact on CMP
          </button>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" /> Strategic Insights & Recommendations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium text-sm text-blue-300 mb-2">🔍 Market Intelligence</h3>
            <p className="text-xs text-slate-300">Consider market testing at next anniversary. Current contract appears 12% above market rate for similar services.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium text-sm text-emerald-300 mb-2">📊 Performance Trend</h3>
            <p className="text-xs text-slate-300">Supplier performance improving over last 2 quarters. SLA compliance at 97.3% — above target.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium text-sm text-amber-300 mb-2">⚠️ Risk Alert</h3>
            <p className="text-xs text-slate-300">Single point of failure identified in supply chain. Recommend developing alternative supplier for critical component.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium text-sm text-purple-300 mb-2">💡 Innovation Opportunity</h3>
            <p className="text-xs text-slate-300">Supplier has proposed AI-driven monitoring solution. Estimated 15% efficiency gain. Recommend pilot programme.</p>
          </div>
        </div>
        {user.tier === 'free' && (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-2">Full strategic insights with AI-powered recommendations available on Premium</p>
            <button onClick={upgradeToPremium} className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded font-medium hover:bg-amber-600 transition-colors">
              Unlock Premium Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, desc, onClick, disabled, highlight }: { icon: any; label: string; desc: string; onClick: () => void; disabled?: boolean; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left p-4 rounded-xl border transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' :
        highlight ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300' :
        'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <Icon className={`w-5 h-5 mb-2 ${highlight ? 'text-amber-500' : 'text-blue-500'}`} />
      <p className="font-medium text-slate-800 text-sm">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </button>
  );
}
