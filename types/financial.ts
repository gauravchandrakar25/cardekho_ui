export interface BankRate {
  id: string;
  name: string;
  rate: number; // Annual rate in percentage (e.g., 8.75)
}

export interface RuleCheckDetails {
  downPaymentMet: boolean;
  loanTenureMet: boolean;
  emiLimitMet: boolean;
  cashflowHealthy: boolean;
}

export interface AffordabilityResult {
  status: 'Safe' | 'Stretching' | 'Unsafe';
  score: number; // 0 - 100
  maxCarPrice: number; // in Lakhs
  maxAllowedEMI: number; // in Rs
  actualCarEMI: number; // in Rs
  downPaymentRequired: number; // in Lakhs
  loanAmount: number; // in Lakhs
  totalFixedCommitmentPercent: number; // (fixedExpenses + actualEMI) / monthlySalary * 100
  ruleChecks: RuleCheckDetails;
}

export interface PricingBreakdown {
  exShowroom: number; // Lakhs
  rtoRegistration: number; // Lakhs
  insurance: number; // Lakhs
  tcs: number; // Lakhs
  fastag: number; // Lakhs
  essentialKit: number; // Lakhs
  handlingCharges: number; // Lakhs
  extendedWarranty: number; // Lakhs
  onRoadPrice: number; // Lakhs
}

export interface HiddenFeeChecklist {
  name: string;
  amount: number; // Rs
  status: 'Negotiable' | 'Waivable' | 'Optional' | 'Recommended but Negotiable';
  description: string;
  tactic: string;
}

export interface NegotiationScriptPhase {
  phaseName: string;
  dealerOpening: string;
  yourResponse: string;
}

export interface NegotiationScript {
  strategy: string;
  phases: NegotiationScriptPhase[];
}

export interface NegotiationKit {
  carName: string;
  variant: string;
  pricing: PricingBreakdown;
  hiddenFeesChecklist: HiddenFeeChecklist[];
  negotiationScript: NegotiationScript;
}
