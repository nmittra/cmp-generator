import { useState, useCallback } from 'react';
import { Upload, FileText, Brain, ArrowLeft, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile, ContractManagementPlan } from '../types';
import { analyseContract } from '../utils/aiAnalysis';

interface ContractUploadProps {
  user: UserProfile;
  onCMPGenerated: (cmp: ContractManagementPlan) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onBack: () => void;
}

export function ContractUpload({ user, onCMPGenerated, isLoading, setIsLoading, onBack }: ContractUploadProps) {
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedModel, setSelectedModel] = useState('free-model');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const models = [
    { id: 'free-model', name: 'Standard AI', desc: 'Good quality analysis', tier: 'free' as const },
    { id: 'gemini-flash', name: 'Gemini Flash', desc: 'Fast, high-quality analysis', tier: 'premium' as const },
    { id: 'deepseek-flash', name: 'DeepSeek Flash', desc: 'Advanced reasoning', tier: 'premium' as const },
    { id: 'gpt4-mini', name: 'GPT-4o Mini', desc: 'Balanced performance', tier: 'premium' as const },
  ];

  const handleFileUpload = useCallback((file: File) => {
    setError('');
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContractText(text);
    };
    reader.onerror = () => setError('Failed to read file. Please try a different format.');
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleGenerate = async () => {
    if (!contractText.trim()) {
      setError('Please upload a contract or paste contract text.');
      return;
    }

    if (user.tier === 'free' && user.aiCreditsRemaining <= 0) {
      setError('No AI credits remaining. Please upgrade to continue.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const cmp = await analyseContract(contractText, selectedModel);
      onCMPGenerated(cmp);
    } catch (err) {
      setError('Failed to generate CMP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleContract = () => {
    const sample = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is made on 1 January 2025 between:

(1) HM TREASURY, a government department of the United Kingdom ("Authority"); and
(2) DIGITAL SOLUTIONS LTD, a company registered in England and Wales ("Supplier").

1. SCOPE OF SERVICES
The Supplier shall provide IT infrastructure management services including:
- Cloud hosting and management
- 24/7 monitoring and incident response
- Security operations and compliance monitoring
- Quarterly performance reporting

2. CONTRACT VALUE AND TERM
2.1 The total contract value is £2,500,000 over 3 years.
2.2 The contract commences on 1 April 2025 and ends on 31 March 2028.
2.3 Extension option: 12 months at Authority's discretion.

3. PAYMENT TERMS
3.1 Monthly payments of £69,444.44 plus VAT.
3.2 Payment within 30 days of valid invoice.
3.3 Performance-linked: 5% held as retention, released quarterly.

4. PERFORMANCE REQUIREMENTS
4.1 Service availability: 99.9% uptime.
4.2 Incident response: Critical within 15 minutes, High within 1 hour.
4.3 Monthly performance reports due by 5th of each month.
4.4 Service credits: £5,000 per 0.1% below availability target.

5. KEY PERSONNEL
5.1 Supplier Account Director: Jane Smith
5.2 Technical Lead: John Doe
5.3 Authority Contract Manager: To be appointed

6. CHANGE CONTROL
6.1 All changes require written approval.
6.2 Changes valued over £50,000 require Director approval.
6.3 Change requests must include impact assessment.

7. TERMINATION
7.1 Termination for convenience: 6 months notice.
7.2 Termination for default: 30 days remedy period.
7.3 Termination for insolvency: Immediate.

8. DATA PROTECTION
8.1 All data classified as OFFICIAL.
8.2 Data Processing Agreement attached as Schedule 1.
8.3 Data to be held within UK data centres only.

9. SOCIAL VALUE
9.1 Supplier to create minimum 5 apprenticeships.
9.2 25% of supply chain spend with SMEs.
9.3 Carbon neutral operations by 2027.

10. GOVERNANCE
10.1 Monthly operational meetings.
10.2 Quarterly strategic reviews.
10.3 Annual contract health check.

This Agreement is governed by the laws of England and Wales.`;
    
    setContractText(sample);
    setFileName('Sample_Service_Agreement.txt');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Upload Contract</h1>
          <p className="text-slate-500 text-sm">Upload your contract document to generate a compliant CMP</p>
        </div>
      </div>

      {/* AI Credits Warning */}
      {user.tier === 'free' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Free tier: {user.aiCreditsRemaining} AI credits remaining
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Each contract analysis uses 1 credit. Upgrade for unlimited access with premium AI models.
            </p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-700 font-medium mb-2">
          Drag & drop your contract file here
        </p>
        <p className="text-slate-500 text-sm mb-4">
          Supports .txt, .doc, .docx, .pdf (text extraction)
        </p>
        <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          Browse Files
          <input
            type="file"
            className="hidden"
            accept=".txt,.doc,.docx,.pdf,.rtf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </label>
        <button onClick={loadSampleContract} className="block mx-auto mt-3 text-sm text-blue-600 hover:text-blue-700 underline">
          Or load a sample contract for demo
        </button>
      </div>

      {/* File info */}
      {fileName && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-emerald-800">{fileName}</p>
            <p className="text-xs text-emerald-600">Contract text loaded successfully</p>
          </div>
        </div>
      )}

      {/* Contract text preview */}
      {contractText && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Contract Text Preview
            </h3>
            <span className="text-xs text-slate-500">{contractText.length} characters</span>
          </div>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            className="w-full h-48 p-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contract text will appear here..."
          />
        </div>
      )}

      {/* Model Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4" /> Select AI Model
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => {
                if (model.tier === 'premium' && user.tier === 'free') {
                  setError('This model requires a premium subscription.');
                  return;
                }
                setSelectedModel(model.id);
                setError('');
              }}
              disabled={model.tier === 'premium' && user.tier === 'free'}
              className={`text-left p-3 rounded-lg border transition-all ${
                selectedModel === model.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : model.tier === 'premium' && user.tier === 'free'
                  ? 'border-slate-200 opacity-50 cursor-not-allowed'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-slate-800">{model.name}</span>
                {model.tier === 'premium' && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Premium</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{model.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !contractText.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Contract Management Plan...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            Generate CMP
          </>
        )}
      </button>

      {/* Info */}
      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-600 mb-1">How it works:</p>
        <ul className="space-y-1">
          <li>• Your contract is analysed against PA23 and GCF requirements</li>
          <li>• A comprehensive 11-section CMP is generated automatically</li>
          <li>• Each section includes PA23 references and GCF alignment notes</li>
          <li>• Export as Word (.docx) or HTML (SharePoint compatible)</li>
          <li className="text-amber-600">• Premium: Upload contract changes to auto-update your CMP</li>
        </ul>
      </div>
    </div>
  );
}
