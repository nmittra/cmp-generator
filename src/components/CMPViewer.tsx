import { useState } from 'react';
import { ArrowLeft, Download, FileText, Globe, Eye, Edit3, CheckCircle, Clock, AlertTriangle, Sparkles, Crown, RefreshCw } from 'lucide-react';
import { ContractManagementPlan, UserProfile } from '../types';
import { generateWordDocument, downloadHTML } from '../utils/documentGenerator';
import { aiAnalyseContract } from '../utils/aiAnalysis';

interface CMPViewerProps {
  cmp: ContractManagementPlan;
  user: UserProfile;
  onBack: () => void;
  onUpgrade: () => void;
}

export function CMPViewer({ cmp, user, onBack, onUpgrade }: CMPViewerProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showUpdatePanel, setShowUpdatePanel] = useState(false);
  const [updateText, setUpdateText] = useState('');

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await generateWordDocument(cmp);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setIsExporting(false);
  };

  const handleExportHTML = () => {
    downloadHTML(cmp);
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await aiAnalyseContract('', aiQuery);
      setAiResponse(response);
    } catch (err) {
      setAiResponse('Failed to get AI response. Please try again.');
    }
    setIsAiLoading(false);
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    review: 'bg-amber-100 text-amber-700',
    complete: 'bg-emerald-100 text-emerald-700',
    approved: 'bg-blue-100 text-blue-700',
    archived: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{cmp.contractName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[cmp.status]}`}>
                {cmp.status.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500">Version {cmp.version}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500">{new Date(cmp.updatedAt).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> AI Assistant
          </button>
          {user.tier === 'premium' && (
            <button
              onClick={() => setShowUpdatePanel(!showUpdatePanel)}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Update CMP
            </button>
          )}
          <button
            onClick={handleExportWord}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Word
          </button>
          <button
            onClick={handleExportHTML}
            className="flex items-center gap-1.5 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-4 h-4" /> HTML
          </button>
        </div>
      </div>

      {/* Update Panel (Premium only) */}
      {showUpdatePanel && user.tier === 'premium' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> Upload Contract Changes
          </h3>
          <p className="text-sm text-emerald-700 mb-4">
            Paste the updated contract text or describe the changes. AI will analyse the differences and suggest CMP updates.
          </p>
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            className="w-full h-32 p-3 border border-emerald-200 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            placeholder="Paste updated contract text or describe changes..."
          />
          <button className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Analyse Changes & Update CMP
          </button>
        </div>
      )}

      {/* Update Panel (Free tier - locked) */}
      {showUpdatePanel && user.tier === 'free' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Premium Feature</h3>
              <p className="text-sm text-amber-700 mt-1">
                Contract update analysis is available on the Premium plan. Upgrade to automatically update your CMP when contracts change.
              </p>
              <button onClick={onUpgrade} className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat */}
      {showAIChat && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> AI Contract Assistant
          </h3>
          <div className="flex gap-2">
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAIQuery()}
              className="flex-1 p-2.5 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              placeholder="Ask about risks, obligations, compliance gaps..."
            />
            <button
              onClick={handleAIQuery}
              disabled={isAiLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isAiLoading ? '...' : 'Ask'}
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button onClick={() => setAiQuery('What are the key risks in this contract?')} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
              Key risks?
            </button>
            <button onClick={() => setAiQuery('Summarise the contract')} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
              Summarise
            </button>
            <button onClick={() => setAiQuery('What are the compliance requirements?')} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
              Compliance?
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-24">
            <h3 className="font-semibold text-slate-700 text-sm mb-3">CMP Sections</h3>
            <nav className="space-y-1">
              {cmp.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === index
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="line-clamp-1">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {/* Section header */}
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {cmp.sections[activeSection]?.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                {cmp.sections[activeSection]?.pa23Reference && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {cmp.sections[activeSection].pa23Reference}
                  </span>
                )}
                {cmp.sections[activeSection]?.gcfAlignment && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {cmp.sections[activeSection].gcfAlignment}
                  </span>
                )}
              </div>
            </div>

            {/* Section content */}
            <div className="prose prose-sm max-w-none">
              {cmp.sections[activeSection]?.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h3 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-3">{line.substring(3)}</h3>;
                }
                if (line.startsWith('### ')) {
                  return <h4 key={i} className="text-base font-semibold text-slate-700 mt-4 mb-2">{line.substring(4)}</h4>;
                }
                if (line.startsWith('• ') || line.startsWith('- ')) {
                  return (
                    <div key={i} className="flex items-start gap-2 ml-4 mb-1.5">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm text-slate-700">{line.substring(2)}</span>
                    </div>
                  );
                }
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-slate-700 mb-2 leading-relaxed">{line}</p>;
              })}
            </div>

            {/* Section actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  cmp.sections[activeSection]?.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                  cmp.sections[activeSection]?.status === 'review' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {cmp.sections[activeSection]?.status === 'complete' ? '✓ Complete' :
                   cmp.sections[activeSection]?.status === 'review' ? '⏳ In Review' : '📝 Draft'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous Section
            </button>
            <span className="text-xs text-slate-500">
              {activeSection + 1} of {cmp.sections.length}
            </span>
            <button
              onClick={() => setActiveSection(Math.min(cmp.sections.length - 1, activeSection + 1))}
              disabled={activeSection === cmp.sections.length - 1}
              className="text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Section →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
