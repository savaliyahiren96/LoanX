export type LoanType = 
  | 'home' 
  | 'car' 
  | 'lap' 
  | 'gold' 
  | 'education' 
  | 'personal' 
  | 'business';

export type Language = 'en' | 'hi' | 'gu';

export type EmploymentType = 'salaried' | 'self_employed' | 'business' | 'professional';

export type CibilRange = '750_plus' | '700_749' | '650_699' | 'below_650';

export type SocialCategory = 'general' | 'obc' | 'sc' | 'st' | 'ews';

export interface UserLoanInput {
  loanType: LoanType;
  amount: number;
  tenureYears: number;
  tenureMonths: number;
  tenureUnit: 'years' | 'months';
  interestRate: number; // in %
  isCustomRate: boolean;

  // Applicant info
  age: number;
  monthlyIncome: number;
  employmentType: EmploymentType;
  cibilScore: CibilRange;
  existingEmis: number;
  state: string;
  city: string;

  // Category & profile options
  category: SocialCategory;
  isWomanApplicant: boolean;
  isFirstTimeBuyer: boolean;
  isFarmer: boolean;
  isGovtOrDefence: boolean;

  // Home / LAP specific
  propertyValue?: number;
  isNewProperty?: boolean; // new vs resale
  isUrban?: boolean; // urban vs rural
  isCoApplicant?: boolean;

  // Car specific
  isNewCar?: boolean;
  fuelType?: 'petrol_diesel' | 'ev' | 'cng';
  onRoadPrice?: number;
  downPayment?: number;

  // Gold specific
  goldWeightGrams?: number;
  goldPurity?: '24k' | '22k' | '18k';
  goldRatePerGram?: number;
  lenderType?: 'psu_bank' | 'private_bank' | 'nbfc';
  repaymentType?: 'monthly_interest' | 'bullet_repayment';
}

export interface AmortizationRow {
  period: number; // Month or Year number
  label: string;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  loanAmount: number;
  interestRatio: number; // percentage
  principalRatio: number;

  // FOIR / Eligibility
  foirPercentage: number;
  maxAllowableEmi: number;
  maxLoanEligibility: number;
  eligibilityStatus: 'excellent' | 'moderate' | 'stretched' | 'ineligible';

  // True Cost
  processingFee: number;
  gstOnProcessing: number;
  stampDuty: number;
  insuranceEstimate: number;
  trueTotalCost: number;
  effectiveApr: number;

  // Schedules
  yearlySchedule: AmortizationRow[];
  monthlySchedule: AmortizationRow[];
}

export interface PrepaymentSimulationResult {
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  originalTenureMonths: number;
  newTenureMonths: number;
  tenureReducedMonths: number;
  tenureReducedYears: number;
  originalEmi: number;
  newEmi?: number;
}

export interface BalanceTransferResult {
  currentOutstanding: number;
  currentRate: number;
  newRate: number;
  remainingTenureMonths: number;
  currentEmi: number;
  newEmi: number;
  monthlySaving: number;
  totalInterestSaved: number;
  transferCost: number; // processing fees + legal + MODT
  netLifetimeSaving: number;
  breakevenMonths: number;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AiResponseData {
  content: string;
  sources: GroundingSource[];
  lastUpdated: string;
  fallback?: boolean;
}
