export interface Contract {
  id: string;
  name: string;
  uploadedAt: Date;
  fileSize: number;
  status: 'uploaded' | 'processing' | 'analysed' | 'cmp-generated';
  aiModel: string;
  content?: string;
}

export interface CMPSection {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'complete' | 'review';
  pa23Reference?: string;
  gcfAlignment?: string;
}

export interface ContractManagementPlan {
  id: string;
  contractId: string;
  contractName: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  sections: CMPSection[];
  status: 'draft' | 'review' | 'approved' | 'archived';
  nextReviewDate?: Date;
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: Date;
  type: 'review' | 'milestone' | 'kpi' | 'report' | 'custom';
  completed: boolean;
  contractId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organisation: string;
  tier: 'free' | 'premium';
  aiCreditsRemaining: number;
  contractsCount: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tier: 'free' | 'premium';
  costPerCredit: number;
}

export interface RiskItem {
  id: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  owner: string;
}

export interface KPI {
  id: string;
  name: string;
  target: string;
  frequency: string;
  responsible: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organisation: string;
  responsibility: string;
  contactMethod: string;
}
