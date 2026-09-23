import { CMPSection, ContractManagementPlan, RiskItem, KPI, Stakeholder } from '../types';

// Simulated AI analysis - in production, this would call an actual LLM API
export async function analyseContract(
  contractText: string,
  model: string = 'free-model'
): Promise<ContractManagementPlan> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract basic info from contract text
  const contractName = extractContractName(contractText);
  const sections = generateCMPSections(contractText, model);
  
  return {
    id: crypto.randomUUID(),
    contractId: crypto.randomUUID(),
    contractName,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    sections,
    status: 'draft',
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    reminders: generateReminders(contractName)
  };
}

function extractContractName(text: string): string {
  const lines = text.split('\n').filter(l => l.trim());
  // Try to find contract title
  for (const line of lines.slice(0, 10)) {
    if (line.toLowerCase().includes('contract') || line.toLowerCase().includes('agreement')) {
      return line.trim().substring(0, 100);
    }
  }
  return lines[0]?.trim().substring(0, 80) || 'Untitled Contract';
}

function generateCMPSections(contractText: string, model: string): CMPSection[] {
  const isPremium = model !== 'free-model';
  const depth = isPremium ? 'detailed' : 'standard';

  return [
    {
      id: crypto.randomUUID(),
      title: '1. Contract Summary & Key Information',
      content: `## Contract Overview

This Contract Management Plan (CMP) has been developed in accordance with the Procurement Act 2023 (PA23) and aligned with the Government Commercial Function (GCF) best practice guidelines.

## Key Contract Details

• Contract Title: As identified from uploaded documentation
• Contract Type: ${detectContractType(contractText)}
• Contract Value: To be confirmed from contract documentation
• Contract Duration: To be confirmed from contract documentation
• Contract Start Date: To be confirmed
• Contract End Date: To be confirmed
• Extension Options: To be assessed
• Supplier: To be identified from contract

## PA23 Compliance Statement

This CMP ensures compliance with the following PA23 requirements:
• Section 11: Contracting principles and procurement objectives
• Section 52-55: Contract terms and conditions
• Section 72-74: Contract modification and termination
• Section 93-95: Supplier performance management

## GCF Alignment

This plan aligns with the GCF Contract Management Standard including:
• Commercial assurance throughout contract lifecycle
• Proactive relationship management
• Performance monitoring and reporting
• Risk management and mitigation
• Value for money assurance`,
      status: 'draft',
      pa23Reference: 'PA23 Sections 11, 52-55, 72-74, 93-95',
      gcfAlignment: 'GCF Contract Management Standard - All Modules'
    },
    {
      id: crypto.randomUUID(),
      title: '2. Governance & Accountability',
      content: `## Governance Structure

### Strategic Level
• Senior Responsible Owner (SRO): [To be appointed]
• Contract Committee: [To be established]
• Escalation path to Board/Executive level

### Operational Level
• Contract Manager: [To be appointed]
• Technical Lead: [To be appointed]
• Commercial Lead: [To be appointed]
• Financial Lead: [To be appointed]

### Supplier Relationship
• Supplier Account Manager: [To be confirmed]
• Supplier Delivery Manager: [To be confirmed]
• Supplier Technical Lead: [To be confirmed]

## Decision-Making Framework

• Decisions up to £50k: Contract Manager
• Decisions £50k-£250k: Head of Commercial
• Decisions £250k-£1M: Director level
• Decisions >£1M: Board approval required

## Meeting Cadence

• Weekly operational meetings
• Monthly performance reviews
• Quarterly strategic reviews
• Annual contract health check

## Roles & Responsibilities Matrix (RACI)

• R = Responsible, A = Accountable, C = Consulted, I = Informed
• Detailed RACI to be developed for each contract activity`,
      status: 'draft',
      pa23Reference: 'PA23 Section 11 - Contracting principles',
      gcfAlignment: 'GCF Module 1 - Governance & Accountability'
    },
    {
      id: crypto.randomUUID(),
      title: '3. Performance Management Framework',
      content: `## Key Performance Indicators (KPIs)

### Delivery KPIs
• Milestone achievement rate (Target: >95%)
• Quality acceptance rate (Target: >98%)
• Defect resolution time (Target: <5 working days)
• Service availability/uptime (Target: 99.5%)

### Commercial KPIs
• Invoice accuracy (Target: >99%)
• Payment within terms (Target: 100% within 30 days)
• Cost variance (Target: <5% of contract value)
• Savings achieved against baseline

### Relationship KPIs
• Stakeholder satisfaction score (Target: >4/5)
• Issue resolution time (Target: <10 working days)
• Innovation proposals received (Target: >2/year)
• Contract compliance rate (Target: >95%)

## Performance Monitoring

• Monthly performance reports from supplier
• Quarterly performance review meetings
• Annual comprehensive performance assessment
• Real-time dashboard for critical metrics

## Performance Improvement Process

• Performance Improvement Notices (PINs) issued for underperformance
• 30-day remediation period
• Escalation to formal breach notice if unresolved
• Termination as last resort with proper notice periods

## Incentives & Penalties

• Payment mechanisms linked to KPI achievement
• Bonus provisions for exceeding targets
• Service credits for underperformance
• Termination rights for persistent failure`,
      status: 'draft',
      pa23Reference: 'PA23 Section 93 - Supplier performance',
      gcfAlignment: 'GCF Module 3 - Performance Management'
    },
    {
      id: crypto.randomUUID(),
      title: '4. Risk Management',
      content: `## Risk Register

The following risk categories have been identified and should be maintained throughout the contract lifecycle:

### Commercial Risks
• Supplier financial instability - Mitigation: Regular financial health checks
• Price escalation beyond agreed terms - Mitigation: Fixed pricing with clear variation mechanisms
• Scope creep without proper change control - Mitigation: Robust change control process

### Delivery Risks
• Supplier resource constraints - Mitigation: Resource monitoring and early warning indicators
• Quality failures - Mitigation: Quality gates and acceptance criteria
• Timeline slippage - Mitigation: Milestone tracking with early intervention triggers

### Compliance Risks
• Regulatory changes affecting contract - Mitigation: Regular regulatory horizon scanning
• Data protection breaches - Mitigation: DPA compliance monitoring
• Modern slavery statement compliance - Mitigation: Annual supplier assurance

### Strategic Risks
• Supplier lock-in - Mitigation: Exit strategy and transition planning
• Market changes affecting value - Mitigation: Market intelligence and benchmarking
• Organisational changes - Mitigation: Knowledge transfer and documentation

## Risk Management Process

• Monthly risk register reviews
• Risk owner assigned for each identified risk
• Risk appetite statements agreed at outset
• Escalation triggers defined for each risk category
• Contingency plans for high/critical risks

## Assurance Activities

• Internal audit schedule
• Supplier assurance visits
• Independent quality reviews
• Peer reviews of commercial decisions`,
      status: 'draft',
      pa23Reference: 'PA23 Section 11 - Procurement objectives',
      gcfAlignment: 'GCF Module 4 - Risk Management'
    },
    {
      id: crypto.randomUUID(),
      title: '5. Financial Management',
      content: `## Payment Management

### Payment Schedule
• Payment terms: As per contract (typically 30 days from valid invoice)
• Payment mechanism: [Milestone/Time & Materials/Unit Price/Output-based]
• Invoicing requirements: Detailed breakdown required
• Approval authority: As per delegation of authority

### Financial Controls
• Monthly budget monitoring against contract value
• Variance reporting (>5% triggers review)
• Commitment tracking and forecasting
• Year-end financial reconciliation

### Payment Mechanisms
• Mechanism 1: [To be detailed based on contract type]
• Mechanism 2: [To be detailed based on contract type]
• Retention arrangements: [If applicable]
• Performance-linked payments: [If applicable]

## Financial Reporting

• Monthly financial position report
• Quarterly forecast to outturn
• Annual financial statement
• Whole-life cost tracking

## Value for Money Assurance

• Baseline VfM assessment at contract award
• Annual VfM review
• Market testing at appropriate intervals
• Benchmarking against comparable contracts
• Social value measurement and reporting

## Commercial Confidentiality

• Pricing information: Commercially Confidential
• Financial reports: Internal use only
• Cost breakdowns: Need-to-know basis
• Audit trail maintained for all financial decisions`,
      status: 'draft',
      pa23Reference: 'PA23 Section 52 - Contract terms',
      gcfAlignment: 'GCF Module 5 - Financial Management'
    },
    {
      id: crypto.randomUUID(),
      title: '6. Change Management & Contract Variations',
      content: `## Change Control Process

### Types of Change
• Minor changes (<£10k): Contract Manager approval
• Moderate changes (£10k-£100k): Head of Commercial approval
• Major changes (>£100k): Director/Board approval
• Fundamental changes: Re-procurement consideration

### Change Request Process
1. Change request submitted with business justification
2. Impact assessment (cost, timeline, risk, quality)
3. Commercial evaluation and negotiation
4. Approval through appropriate delegation
5. Contract variation executed
6. CMP and related documents updated
7. Stakeholders informed

## PA23 Contract Modification Rules

Under PA23, contract modifications must comply with:
• Section 72: Permitted modifications without new procurement
• Section 73: Substantial modification test
• Section 74: Notice requirements for modifications

### Modification Triggers Requiring New Procurement
• Change in scope that would have attracted different bidders
• Change in economic balance in supplier's favour
• Extension beyond original contract term (beyond permitted extensions)
• Replacement of supplier

## Variation Register

• All variations logged with unique reference
• Impact on contract value, timeline, and scope recorded
• Approval documentation retained
• Cumulative impact assessed against substantial modification threshold

## Lessons Learned Integration

• Changes analysed for patterns
• Root cause assessment for frequent changes
• Process improvements implemented
• Future procurement considerations documented`,
      status: 'draft',
      pa23Reference: 'PA23 Sections 72-74 - Contract modifications',
      gcfAlignment: 'GCF Module 6 - Change Management'
    },
    {
      id: crypto.randomUUID(),
      title: '7. Stakeholder Management & Communication',
      content: `## Stakeholder Register

### Internal Stakeholders
• Senior Responsible Owner - Strategic oversight
• Contract Manager - Day-to-day management
• Budget Holder - Financial accountability
• End Users - Service recipients
• Legal Team - Contractual advice
• Finance Team - Payment processing
• Procurement Team - Commercial support
• Information Assurance - Data/security oversight

### External Stakeholders
• Supplier Senior Management - Strategic relationship
• Supplier Delivery Team - Operational delivery
• Cabinet Office/GCF - Policy compliance
• National Audit Office - Audit and assurance
• Other Government Bodies - Cross-government coordination
• Citizens/Service Users - Ultimate beneficiaries

## Communication Plan

### Regular Communications
• Weekly: Operational team stand-up
• Monthly: Performance report distribution
• Quarterly: Strategic review with supplier
• Annually: Contract health check report

### Ad-hoc Communications
• Issue escalation: Within 24 hours
• Change notifications: Within 5 working days
• Risk alerts: Immediate for critical risks
• Financial alerts: Within 48 hours

## Engagement Strategy

• Build collaborative partnerships based on mutual respect
• Maintain transparency while protecting commercial confidentiality
• Regular feedback loops with all stakeholder groups
• Proactive issue identification and resolution
• Knowledge sharing and continuous improvement culture

## Reporting Lines

• Operational issues: Contract Manager → Head of Commercial
• Strategic issues: Head of Commercial → Director
• Crisis issues: Immediate escalation to SRO
• Cross-government: Via Cabinet Office channels`,
      status: 'draft',
      pa23Reference: 'PA23 Section 11 - Transparency requirements',
      gcfAlignment: 'GCF Module 7 - Stakeholder Management'
    },
    {
      id: crypto.randomUUID(),
      title: '8. Exit Strategy & Contract Close-out',
      content: `## Exit Planning

### Exit Triggers
• Contract natural expiry
• Termination for convenience (if permitted)
• Termination for default/breach
• Supplier insolvency
• Fundamental change in requirements
• Better value available through re-procurement

### Transition Planning
• Minimum 12-month transition period planned
• Knowledge transfer programme
• Data and asset transfer requirements
• TUPE considerations for staff
• Interim service arrangements
• New supplier mobilisation support

## Contract Close-out Process

### Pre-Close Activities (6 months before end)
• Review all outstanding obligations
• Assess extension/re-procurement options
• Initiate transition planning
• Conduct final performance assessment
• Settle all financial matters

### Close-out Activities
• Final acceptance of all deliverables
• Resolution of all outstanding disputes
• Return of all supplier-held assets/data
• Final payment and financial reconciliation
• Lessons learned workshop
• Contract file archival

### Post-Close Activities
• Warranty period management
• Lessons learned documentation
• Supplier performance record update
• Knowledge transfer to successor arrangement
• Market feedback to supplier

## Continuity Planning

• Business continuity requirements throughout transition
• Data migration and integrity assurance
• Service continuity during transition
• Contingency arrangements if transition fails
• Communication plan for service users

## Knowledge Management

• Contract file properly archived per retention policy
• Lessons learned shared across organisation
• Market intelligence captured for future procurements
• Supplier relationship records maintained`,
      status: 'draft',
      pa23Reference: 'PA23 Section 74 - Termination provisions',
      gcfAlignment: 'GCF Module 8 - Contract Close-out'
    },
    {
      id: crypto.randomUUID(),
      title: '9. Social Value & Public Benefit',
      content: `## Social Value Delivery

### PA23 National Procurement Policy Statement Alignment
This contract supports the following national priorities:
• Taking account of supplier capability and capacity
• Having regard to the public good
• Acting with integrity and treating suppliers equally
• Not acting in a way that discriminates between suppliers

### Social Value Themes
• Economic growth: Local employment, SME engagement, supply chain development
• Social wellbeing: Community engagement, equality & diversity, skills development
• Environmental: Carbon reduction, waste minimisation, sustainable procurement

## Monitoring & Reporting

### Social Value KPIs
• % spend with local/SME suppliers
• Number of apprenticeships created
• Carbon footprint reduction achieved
• Community engagement activities delivered
• Volunteer days contributed

### Reporting Requirements
• Quarterly social value report from supplier
• Annual social value assessment
• Measurement against baseline established at contract award
• Alignment with Cabinet Office PPN 06/20

## Supplier Engagement on Social Value

• Regular dialogue on social value delivery
• Support for innovation in social value approaches
• Recognition of good practice
• Collaborative improvement where targets not met

## Public Benefit Maximisation

• Ensure contract delivers maximum public benefit
• Consider wider economic impacts
• Support government priorities (Net Zero, Levelling Up)
• Contribute to local community outcomes`,
      status: 'draft',
      pa23Reference: 'PA23 Section 8 - National Procurement Policy Statement',
      gcfAlignment: 'GCF Social Value Guidance & PPN 06/20'
    },
    {
      id: crypto.randomUUID(),
      title: '10. Information Security & Data Protection',
      content: `## Information Security Requirements

### Classification & Handling
• Contract information classification: OFFICIAL
• Special handling requirements: [If applicable]
• Personnel security requirements: [As per contract]
• Physical security requirements: [As per contract]

### Cyber Security
• Cyber Essentials Plus required (minimum)
• NCSC Cyber Assessment Framework compliance (if applicable)
• Regular security testing and assurance
• Incident response procedures agreed
• Supply chain cyber security requirements

## Data Protection

### GDPR Compliance
• Data Processing Agreement in place
• Data Protection Impact Assessment completed
• Lawful basis for processing documented
• Data subject rights procedures agreed
• Data breach notification procedures (72 hours)

### Data Management
• Data inventory maintained
• Data retention periods defined
• Secure data transfer mechanisms
• Data deletion at contract end
• Cross-border data transfer restrictions

### Freedom of Information
• FOI response procedures agreed
• Commercial confidentiality exemptions identified
• Proactive transparency commitments
• Publication scheme considerations

## Business Continuity

• Supplier BCP reviewed and assured
• Incident management procedures tested
• Disaster recovery arrangements confirmed
• Communication procedures for incidents
• Alternative service arrangements identified`,
      status: 'draft',
      pa23Reference: 'PA23 Section 11 - Public good considerations',
      gcfAlignment: 'GCF Module 9 - Information Security & GPG 03/21'
    },
    {
      id: crypto.randomUUID(),
      title: '11. Audit Trail & Compliance',
      content: `## Audit Requirements

### Internal Audit
• Annual audit of contract management processes
• Spot checks on compliance with CMP
• Financial audit of payments and variations
• Performance data verification

### External Audit
• National Audit Office access rights maintained
• Cabinet Office commercial standards compliance
• Sector-specific regulatory audits
• Supplier audit rights exercised as needed

## Compliance Monitoring

### PA23 Compliance Checklist
• ☐ Contracting principles applied throughout
• ☐ Procurement objectives considered in decisions
• ☐ Transparency requirements met
• ☐ National Procurement Policy Statement alignment
• ☐ Modification rules followed for all changes
• ☐ Termination provisions properly applied
• ☐ Supplier performance managed effectively

### GCF Standards Compliance
• ☐ Commercial assurance activities completed
• ☐ Governance arrangements effective
• ☐ Risk management processes operating
• ☐ Performance management framework active
• ☐ Stakeholder engagement maintained
• ☐ Exit planning current and tested

## Record Keeping

### Document Retention
• Contract documents: Life of contract + 7 years
• Financial records: Life of contract + 7 years
• Performance records: Life of contract + 5 years
• Correspondence: Life of contract + 3 years
• Audit records: Life of contract + 7 years

### Record Management
• Central contract file maintained
• Electronic document management system used
• Version control applied to all documents
• Access controls implemented
• Regular backup procedures in place

## Continuous Improvement

• Lessons learned captured and shared
• Process improvements identified and implemented
• Benchmarking against best practice
• Staff development and training needs addressed
• CMP reviewed and updated regularly`,
      status: 'draft',
      pa23Reference: 'PA23 All sections - Compliance framework',
      gcfAlignment: 'GCF All Modules - Standards compliance'
    }
  ];
}

function detectContractType(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('service') && lowerText.includes('level')) return 'Service Contract with SLA';
  if (lowerText.includes('supply') || lowerText.includes('goods')) return 'Supply Contract';
  if (lowerText.includes('works') || lowerText.includes('construction')) return 'Works Contract';
  if (lowerText.includes('consultancy') || lowerText.includes('professional')) return 'Professional Services Contract';
  if (lowerText.includes('framework')) return 'Framework Agreement';
  return 'Mixed/General Contract';
}

function generateReminders(contractName: string) {
  const now = new Date();
  return [
    {
      id: crypto.randomUUID(),
      title: 'Quarterly Performance Review',
      dueDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      type: 'review' as const,
      completed: false,
      contractId: ''
    },
    {
      id: crypto.randomUUID(),
      title: 'Risk Register Review',
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      type: 'review' as const,
      completed: false,
      contractId: ''
    },
    {
      id: crypto.randomUUID(),
      title: 'KPI Assessment',
      dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      type: 'kpi' as const,
      completed: false,
      contractId: ''
    }
  ];
}

// AI-powered contract analysis (simulated)
export async function aiAnalyseContract(text: string, prompt: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulated AI response based on prompt type
  if (prompt.includes('risk')) {
    return `Based on analysis of the contract, the following key risks have been identified:

1. **Delivery Risk** - The contract contains complex deliverables with tight timelines. Recommend establishing early warning indicators and regular milestone reviews.

2. **Financial Risk** - Payment terms suggest potential cash flow pressure. Recommend monitoring supplier financial health quarterly.

3. **Scope Risk** - Requirements appear broad. Recommend establishing clear acceptance criteria and change control procedures.

4. **Dependency Risk** - Contract references external dependencies. Recommend mapping all dependencies and establishing contingency plans.

5. **Compliance Risk** - Multiple regulatory references. Recommend establishing a compliance monitoring schedule.`;
  }
  
  if (prompt.includes('summary')) {
    return `## Contract Summary

This contract appears to be a [type] agreement with the following key characteristics:

- **Scope**: [To be detailed based on full analysis]
- **Duration**: [To be extracted from contract dates]
- **Value**: [To be extracted from financial terms]
- **Key Deliverables**: [To be listed from scope section]
- **Payment Terms**: [To be extracted from commercial terms]
- **Key Risks**: [To be detailed from risk analysis]
- **Governance**: [To be extracted from management provisions]

### Key Observations
- Contract structure suggests [observation]
- Notable clauses include [details]
- Potential areas of concern: [details]`;
  }

  return `AI analysis complete. The contract has been reviewed against PA23 and GCF requirements. Key findings and recommendations have been incorporated into the Contract Management Plan sections above. For detailed analysis, please review each section of the generated CMP.`;
}

export async function analyseContractChanges(
  originalText: string,
  newText: string
): Promise<{ changes: string[]; impactAssessment: string; recommendedActions: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    changes: [
      'Contract scope modifications detected',
      'Payment terms potentially updated',
      'Timeline adjustments identified',
      'New obligations or requirements added',
      'Risk allocation changes noted'
    ],
    impactAssessment: 'The identified changes may affect the Contract Management Plan in the following areas: Performance metrics, Risk register, Financial management, and Stakeholder responsibilities. A comprehensive review of all CMP sections is recommended.',
    recommendedActions: [
      'Review and update Performance Management Framework (Section 3)',
      'Update Risk Register with any new risks identified (Section 4)',
      'Assess financial impact and update Financial Management (Section 5)',
      'Review Change Management provisions (Section 6)',
      'Update Stakeholder communication plan if roles change (Section 7)',
      'Reassess Exit Strategy if contract duration changes (Section 8)',
      'Update Social Value commitments if scope changes (Section 9)',
      'Review Information Security requirements if data handling changes (Section 10)'
    ]
  };
}
