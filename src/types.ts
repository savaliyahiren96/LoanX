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

// ==========================================
// INSTAGRAM ACCOUNT INTELLIGENCE MODULE TYPES
// ==========================================

export type InstagramCategory = 
  | 'rbi_banking_info'
  | 'banking_loan_experts'
  | 'home_loan_specialists'
  | 'chartered_accountants'
  | 'financial_planning_experts'
  | 'taxation_experts'
  | 'cibil_credit_score'
  | 'real_estate_property'
  | 'personal_finance_influencers'
  | 'consumer_rights_legal'
  | 'loan_consultants'
  | 'investment_wealth'
  | 'fraud_awareness';

export type AccountLabel = 'priority' | 'trusted' | 'needs_verification' | 'promotional' | 'low_relevance';

export type VerificationStatus = 'verified_official' | 'independently_verified' | 'unverified';

export interface FinancialUsefulnessScore {
  overall: number; // 0-100
  accuracySources: number; // 30% weight
  relevanceToBorrowers: number; // 25% weight
  practicalUsefulness: number; // 20% weight
  regulatoryAwareness: number; // 15% weight
  transparencyCredibility: number; // 10% weight
  reasons: string[];
}

export interface AccountCredibility {
  operatorIdentity: string;
  isIdentifiable: boolean;
  verifiableQualifications: string;
  citesOfficialSources: boolean;
  contentNature: 'educational' | 'promotional' | 'mixed';
  exaggeratedClaims: boolean;
  potentialConflicts: string;
}

export interface ExpertAccountOpinion {
  usefulKnowledge: string;
  bestTopics: string[];
  loanInformationToExtract: string;
  financialOpportunities: string;
  missingCriticalInfo: string;
  suitabilityForIndians: string;
  claimsNeedingVerification: string[];
  keepInLibrary: boolean;
  decisionImprovementTip: string;
  relatedCategoriesToResearch: string[];
}

export interface InstagramAccount {
  id: string;
  username: string; // e.g. @reservebankofindia
  profileUrl: string;
  accountName: string;
  category: InstagramCategory;
  personalNotes: string;
  avatarUrl?: string;
  description: string;
  verificationStatus: VerificationStatus;
  lastAnalysedDate: string;
  postsAnalysedCount: number;
  usefulnessScore: FinancialUsefulnessScore;
  credibility: AccountCredibility;
  expertOpinion: ExpertAccountOpinion;
  label: AccountLabel;
  isMonitoring: boolean;
  createdAt: string;
}

export type PostClassification = 
  | 'highly_useful'
  | 'useful'
  | 'educational'
  | 'promotional'
  | 'needs_verification'
  | 'misleading'
  | 'irrelevant';

export interface AnalysedPost {
  id: string;
  accountId: string;
  accountUsername: string;
  sourceType: 'url' | 'screenshot' | 'reel_video' | 'caption_text' | 'comments' | 'manual_insight';
  postUrl?: string;
  caption: string;
  screenshotUrl?: string;
  publicationDate?: string;
  extracted: {
    mainTopic: string;
    financialClaim: string;
    loanInformation: string;
    bankingInstitution: string;
    interestRatesMentioned: string;
    hiddenChargesDiscussed: string;
    suggestedStrategies: string;
    regulatoryReferences: string;
    potentialBenefits: string;
    potentialRisks: string;
    missingInformation: string;
  };
  classification: PostClassification;
  classificationReason: string;
  verificationStatus: 'verified_true' | 'partially_true' | 'misleading' | 'unverified';
  authoritativeVerification: string;
  verifiedSources: GroundingSource[];
  transferredToLoanCentre: boolean;
  analyzedAt: string;
}

export type FinancialKnowledgeCategory =
  | 'home_loan_negotiation'
  | 'lowest_interest_rate'
  | 'hidden_bank_charges'
  | 'fee_waivers'
  | 'loan_foreclosure'
  | 'part_prepayment'
  | 'balance_transfer'
  | 'cibil_score'
  | 'loan_eligibility'
  | 'rbi_regulations'
  | 'borrower_protection'
  | 'insurance_conditions'
  | 'property_docs'
  | 'agreement_loopholes'
  | 'fraud_prevention'
  | 'govt_benefits';

export interface SavedInsight {
  id: string;
  title: string;
  category: FinancialKnowledgeCategory;
  sourceAccount: string;
  originalClaim: string;
  verifiedFact: string;
  loanImplication: string;
  overlookedOpportunity: string;
  potentialRisk: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedForLoanAdvisor: boolean;
  userNotes?: string;
  createdAt: string;
  verifiedSources: GroundingSource[];
}

export interface DiscoveredAccount {
  id: string;
  username: string;
  profileUrl: string;
  accountName: string;
  category: InstagramCategory;
  isVerifiable: boolean;
  mainAreaOfExpertise: string;
  whyRelevant: string;
  evidenceOfCredibility: string;
  potentialLimitations: string;
  recommendation: 'add' | 'skip';
  addedToDirectory?: boolean;
}

// ============================================================
// ASKLOANGURU AI - MULTILINGUAL VOICE & TEXT ASSISTANT TYPES
// ============================================================

export type IndianLanguageCode = 
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'ur' // Urdu (اردو)
  | 'auto'; // Auto-detect

export interface LanguageMeta {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  greeting: string;
  tagline: string;
  voiceLangCode: string; // for speech synthesis / recognition
}

export type ResponseLevel = 'simple' | 'detailed' | 'expert';

export type AskLoanGuruTab = 
  | 'ask_anything'
  | 'talk_voice'
  | 'explain_loan'
  | 'check_offer'
  | 'upload_agreement'
  | 'analyse_charges'
  | 'compare_offers'
  | 'teach_me'
  | 'borrower_protection';

export interface SimpleTermDefinition {
  term: string;
  simpleExplanation: string;
  rupeeExample?: string;
  category?: string;
}

export interface BorrowerTrapWarning {
  title: string;
  severity: 'high' | 'medium' | 'info';
  explanation: string;
  actionableAdvice: string;
  rbiReference?: string;
}

export interface AskLoanGuruMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  detectedLanguage?: string;
  timestamp: string;
  isVoiceInput?: boolean;
  audioBase64?: string;
  simpleTerms?: SimpleTermDefinition[];
  borrowerTraps?: BorrowerTrapWarning[];
  sources?: GroundingSource[];
  suggestedFollowUps?: string[];
  attachedDocumentName?: string;
  responseLevel?: ResponseLevel;
  calculationContext?: {
    loanAmount?: number;
    monthlyEmi?: number;
    tenureYears?: number;
  };
}

export interface LoanOfferAuditItem {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'danger';
  label: string;
  details: string;
  rbiRule: string;
  borrowerAction: string;
}

export interface LoanOfferAuditResult {
  bankName: string;
  loanType: LoanType;
  sanctionAmount: number;
  offeredRate: number;
  benchmarkType: 'EBLR' | 'Repo' | 'MCLR' | 'Fixed';
  spread: number;
  processingFee: number;
  gstAmount: number;
  insuranceAmount: number;
  insuranceMandatoryClaimed: boolean;
  foreclosurePenaltyClause: string;
  safetyScore: number; // 0 - 100
  auditItems: LoanOfferAuditItem[];
  hiddenExpensesEstimate: number;
  negotiationScript: string;
  finalVerdict: 'safe_to_proceed' | 'proceed_with_caution' | 'high_risk_renegotiate';
  verdictExplanation: string;
}

export interface TeachingLesson {
  id: string;
  title: string;
  titleHi: string;
  titleGu: string;
  category: 'interest_basics' | 'emi_mechanics' | 'prepayment_mastery' | 'credit_scores' | 'bank_negotiation' | 'agreement_clauses' | 'scam_shield';
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  summary: string;
  coreQuestion: string;
  interactiveSteps: Array<{
    stepNumber: number;
    title: string;
    explanation: string;
    mathExample?: string;
    proTip: string;
  }>;
  keyTakeaway: string;
  questionsToAskBank: string[];
}


