import {
  UserLoanInput,
  EmiCalculationResult,
  AmortizationRow,
  PrepaymentSimulationResult,
  BalanceTransferResult,
  LoanType,
} from '../types';

export const BASE_MARKET_RATES: Record<LoanType, number> = {
  home: 8.40,
  car: 8.75,
  lap: 9.25,
  gold: 8.85,
  education: 9.15,
  personal: 10.75,
  business: 11.25,
};

export const STATE_STAMP_DUTY: Record<string, { standard: number; woman: number }> = {
  'Maharashtra': { standard: 5.0, woman: 4.0 },
  'Gujarat': { standard: 4.9, woman: 3.9 },
  'Delhi': { standard: 6.0, woman: 4.0 },
  'Karnataka': { standard: 5.0, woman: 5.0 },
  'Tamil Nadu': { standard: 7.0, woman: 7.0 },
  'Uttar Pradesh': { standard: 7.0, woman: 6.0 },
  'Telangana': { standard: 6.0, woman: 6.0 },
  'Rajasthan': { standard: 5.0, woman: 4.0 },
  'West Bengal': { standard: 5.0, woman: 5.0 },
  'Haryana': { standard: 7.0, woman: 5.0 },
  'Kerala': { standard: 8.0, woman: 8.0 },
  'Madhya Pradesh': { standard: 7.5, woman: 7.5 },
  'Punjab': { standard: 7.0, woman: 6.0 },
  'Bihar': { standard: 6.0, woman: 5.5 },
  'Andhra Pradesh': { standard: 5.0, woman: 5.0 },
};

export const INDIAN_STATES = [
  'Maharashtra',
  'Gujarat',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Telangana',
  'Rajasthan',
  'West Bengal',
  'Haryana',
  'Kerala',
  'Madhya Pradesh',
  'Punjab',
  'Bihar',
  'Andhra Pradesh',
  'Odisha',
  'Assam',
  'Goa',
  'Chandigarh',
  'Other',
];

// Determine effective interest rate based on CIBIL and Woman applicant concession
export function calculateEffectiveInterestRate(input: UserLoanInput): number {
  if (input.isCustomRate && input.interestRate > 0) {
    return input.interestRate;
  }

  let rate = BASE_MARKET_RATES[input.loanType] || 8.5;

  // CIBIL adjustment
  if (input.cibilScore === '700_749') rate += 0.25;
  else if (input.cibilScore === '650_699') rate += 0.75;
  else if (input.cibilScore === 'below_650') rate += 1.50;

  // Woman concession on Home loan (standard 0.05% discount across PSU banks)
  if (input.loanType === 'home' && input.isWomanApplicant) {
    rate = Math.max(7.5, rate - 0.05);
  }

  // Govt/Defence employee concession
  if (input.isGovtOrDefence) {
    rate = Math.max(7.5, rate - 0.10);
  }

  // EV car discount (often 0.15% - 0.25% green car discount by SBI/Union)
  if (input.loanType === 'car' && input.fuelType === 'ev') {
    rate = Math.max(7.5, rate - 0.20);
  }

  return Number(rate.toFixed(2));
}

// Calculate standard EMI: P * r * (1 + r)^n / ((1 + r)^n - 1)
export function calculateMonthlyEmi(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

// Full loan calculation with FOIR, stamp duty, processing fees, amortization
export function calculateFullLoan(input: UserLoanInput): EmiCalculationResult {
  const principal = input.amount || 0;
  const effectiveRate = calculateEffectiveInterestRate(input);
  const tenureMonths = input.tenureUnit === 'years' 
    ? (input.tenureYears || 1) * 12 
    : (input.tenureMonths || 12);

  const monthlyEmi = calculateMonthlyEmi(principal, effectiveRate, tenureMonths);
  const totalAmount = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalAmount - principal);

  const interestRatio = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;
  const principalRatio = totalAmount > 0 ? (principal / totalAmount) * 100 : 0;

  // FOIR & Eligibility calculations
  const monthlyIncome = input.monthlyIncome || 50000;
  let foirPercentage = 50;
  if (monthlyIncome < 40000) foirPercentage = 45;
  else if (monthlyIncome <= 100000) foirPercentage = 50;
  else if (monthlyIncome <= 200000) foirPercentage = 55;
  else foirPercentage = 60;

  const totalAllowableEmiAllLoans = (monthlyIncome * foirPercentage) / 100;
  const maxAllowableEmi = Math.max(0, totalAllowableEmiAllLoans - (input.existingEmis || 0));

  // Reverse calculate max loan eligibility from max allowable EMI
  let maxLoanEligibility = 0;
  if (maxAllowableEmi > 0 && effectiveRate > 0) {
    const r = effectiveRate / 12 / 100;
    const factor = Math.pow(1 + r, tenureMonths);
    maxLoanEligibility = Math.round((maxAllowableEmi * (factor - 1)) / (r * factor));
  }

  let eligibilityStatus: 'excellent' | 'moderate' | 'stretched' | 'ineligible' = 'excellent';
  const currentTotalEmi = monthlyEmi + (input.existingEmis || 0);
  const foirUsed = monthlyIncome > 0 ? (currentTotalEmi / monthlyIncome) * 100 : 100;

  if (foirUsed <= foirPercentage * 0.8) eligibilityStatus = 'excellent';
  else if (foirUsed <= foirPercentage) eligibilityStatus = 'moderate';
  else if (foirUsed <= foirPercentage * 1.25) eligibilityStatus = 'stretched';
  else eligibilityStatus = 'ineligible';

  // Processing fee + 18% GST
  let pfRate = 0.0035; // 0.35% default
  if (input.loanType === 'personal' || input.loanType === 'business') pfRate = 0.0125;
  else if (input.loanType === 'car') pfRate = 0.005;
  else if (input.loanType === 'gold') pfRate = 0.0025;

  let processingFee = Math.round(principal * pfRate);
  if (input.loanType === 'home') processingFee = Math.min(Math.max(processingFee, 3000), 25000);
  if (input.isGovtOrDefence) processingFee = Math.round(processingFee * 0.7); // 30% waiver for defense/govt

  const gstOnProcessing = Math.round(processingFee * 0.18);

  // Stamp duty calculation (relevant for property / home loans)
  let stampDuty = 0;
  if (input.loanType === 'home' || input.loanType === 'lap') {
    const propVal = input.propertyValue || principal * 1.25;
    const stateInfo = STATE_STAMP_DUTY[input.state] || { standard: 5.0, woman: 4.5 };
    const dutyPercent = input.isWomanApplicant ? stateInfo.woman : stateInfo.standard;
    stampDuty = Math.round((propVal * dutyPercent) / 100);
  }

  // Insurance estimate
  const insuranceEstimate = input.loanType === 'home' || input.loanType === 'lap' 
    ? Math.round(principal * 0.008) 
    : 0;

  const trueTotalCost = totalAmount + processingFee + gstOnProcessing + stampDuty + insuranceEstimate;
  
  // Effective APR calculation approximation
  const upfrontCosts = processingFee + gstOnProcessing + stampDuty;
  const netDisbursed = Math.max(1000, principal - upfrontCosts);
  const effectiveApr = Number((((totalAmount + upfrontCosts - principal) / (principal * (tenureMonths / 12))) * 100).toFixed(2));

  // Amortization Schedules
  const { monthlySchedule, yearlySchedule } = generateAmortizationSchedules(
    principal,
    effectiveRate,
    tenureMonths,
    monthlyEmi
  );

  return {
    monthlyEmi,
    totalInterest,
    totalAmount,
    loanAmount: principal,
    interestRatio,
    principalRatio,
    foirPercentage,
    maxAllowableEmi,
    maxLoanEligibility,
    eligibilityStatus,
    processingFee,
    gstOnProcessing,
    stampDuty,
    insuranceEstimate,
    trueTotalCost,
    effectiveApr: isNaN(effectiveApr) ? effectiveRate : effectiveApr,
    yearlySchedule,
    monthlySchedule,
  };
}

function generateAmortizationSchedules(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  monthlyEmi: number
) {
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const monthlySchedule: AmortizationRow[] = [];
  const yearlySchedule: AmortizationRow[] = [];

  let currentYearPrincipal = 0;
  let currentYearInterest = 0;
  let yearOpeningBalance = principal;
  let yearNum = 1;

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = Math.round(balance * monthlyRate);
    const principalPaid = Math.min(balance, monthlyEmi - interest);
    const closingBalance = Math.max(0, balance - principalPaid);

    monthlySchedule.push({
      period: m,
      label: `Month ${m}`,
      openingBalance: Math.round(balance),
      emi: monthlyEmi,
      principalPaid,
      interestPaid: interest,
      closingBalance: Math.round(closingBalance),
    });

    currentYearPrincipal += principalPaid;
    currentYearInterest += interest;
    balance = closingBalance;

    // End of year or last month
    if (m % 12 === 0 || m === tenureMonths) {
      yearlySchedule.push({
        period: yearNum,
        label: `Year ${yearNum}`,
        openingBalance: Math.round(yearOpeningBalance),
        emi: currentYearPrincipal + currentYearInterest,
        principalPaid: Math.round(currentYearPrincipal),
        interestPaid: Math.round(currentYearInterest),
        closingBalance: Math.round(closingBalance),
      });

      yearNum++;
      yearOpeningBalance = closingBalance;
      currentYearPrincipal = 0;
      currentYearInterest = 0;
    }

    if (balance <= 0) break;
  }

  return { monthlySchedule, yearlySchedule };
}

// Prepayment Simulator
export function simulatePrepayment(
  principal: number,
  annualRate: number,
  originalTenureMonths: number,
  prepayment: {
    extraMonthlyEmi: number;
    lumpSumAmount: number;
    lumpSumMonth: number;
    annualStepUpPercent: number; // e.g. 5% or 10%
  }
): PrepaymentSimulationResult {
  const originalEmi = calculateMonthlyEmi(principal, annualRate, originalTenureMonths);
  const originalTotalInterest = Math.max(0, originalEmi * originalTenureMonths - principal);

  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  let currentEmi = originalEmi + (prepayment.extraMonthlyEmi || 0);
  let totalInterest = 0;
  let month = 0;

  while (balance > 1 && month < originalTenureMonths * 2) {
    month++;

    // Step-up EMI at the start of each year (month 13, 25, 37...)
    if (prepayment.annualStepUpPercent > 0 && month > 1 && (month - 1) % 12 === 0) {
      currentEmi = Math.round(currentEmi * (1 + prepayment.annualStepUpPercent / 100));
    }

    // Lump sum prepayment
    if (prepayment.lumpSumAmount > 0 && month === prepayment.lumpSumMonth) {
      balance = Math.max(0, balance - prepayment.lumpSumAmount);
    }

    const interest = balance * monthlyRate;
    totalInterest += interest;

    const principalPaid = Math.min(balance, currentEmi - interest);
    balance -= principalPaid;

    if (balance <= 0) break;
  }

  const newTotalInterest = Math.round(totalInterest);
  const interestSaved = Math.max(0, originalTotalInterest - newTotalInterest);
  const newTenureMonths = month;
  const tenureReducedMonths = Math.max(0, originalTenureMonths - newTenureMonths);

  return {
    originalTotalInterest,
    newTotalInterest,
    interestSaved,
    originalTenureMonths,
    newTenureMonths,
    tenureReducedMonths,
    tenureReducedYears: Number((tenureReducedMonths / 12).toFixed(1)),
    originalEmi,
  };
}

// Balance Transfer Calculator
export function calculateBalanceTransfer(
  currentOutstanding: number,
  currentRate: number,
  newRate: number,
  remainingTenureMonths: number
): BalanceTransferResult {
  const currentEmi = calculateMonthlyEmi(currentOutstanding, currentRate, remainingTenureMonths);
  const newEmi = calculateMonthlyEmi(currentOutstanding, newRate, remainingTenureMonths);

  const monthlySaving = Math.max(0, currentEmi - newEmi);
  const originalTotalInterest = (currentEmi * remainingTenureMonths) - currentOutstanding;
  const newTotalInterest = (newEmi * remainingTenureMonths) - currentOutstanding;
  const totalInterestSaved = Math.max(0, originalTotalInterest - newTotalInterest);

  // Transfer costs: 0.35% processing fee + approx ₹10,000 legal, valuation and MODT stamp duty
  const transferCost = Math.round(currentOutstanding * 0.0035 * 1.18 + 10000);
  const netLifetimeSaving = Math.max(0, totalInterestSaved - transferCost);
  const breakevenMonths = monthlySaving > 0 ? Math.ceil(transferCost / monthlySaving) : 0;

  return {
    currentOutstanding,
    currentRate,
    newRate,
    remainingTenureMonths,
    currentEmi,
    newEmi,
    monthlySaving,
    totalInterestSaved,
    transferCost,
    netLifetimeSaving,
    breakevenMonths,
  };
}

// Gold Loan Math (RBI 75% LTV Cap)
export function calculateGoldLoan(
  weightGrams: number,
  purity: '24k' | '22k' | '18k',
  goldRatePerGram: number,
  tenureMonths: number,
  annualInterestRate: number
) {
  // Purity coefficient
  let purityFactor = 0.916; // 22K default
  if (purity === '24k') purityFactor = 0.999;
  if (purity === '18k') purityFactor = 0.750;

  const grossAppraisedValue = Math.round(weightGrams * goldRatePerGram * (purity === '24k' ? 1 : purityFactor));
  const maxRbiLtvLoan = Math.round(grossAppraisedValue * 0.75); // RBI 75% limit

  // Monthly Regular Interest vs Bullet Repayment
  const monthlyInterestPayable = Math.round((maxRbiLtvLoan * (annualInterestRate / 100)) / 12);
  const totalMonthlyInterest = monthlyInterestPayable * tenureMonths;

  // Bullet Repayment: Interest compounds or accrues until maturity
  // Typically compound interest or simple interest for up to 12 months
  const bulletInterest = Math.round(maxRbiLtvLoan * (annualInterestRate / 100) * (tenureMonths / 12));
  const bulletTotalPayable = maxRbiLtvLoan + bulletInterest;

  return {
    grossAppraisedValue,
    maxRbiLtvLoan,
    monthlyInterestPayable,
    totalMonthlyInterest,
    bulletInterest,
    bulletTotalPayable,
  };
}

// Indian Numbering Formatter: e.g. ₹ 50,00,000 / ₹ 1.50 Crore / ₹ 25 Lakhs
export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

export function formatCompactINR(val: number): string {
  if (isNaN(val) || val === 0) return '₹0';
  const abs = Math.abs(val);
  if (abs >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `₹${(val / 1000).toFixed(1)} K`;
  }
  return `₹${Math.round(val)}`;
}
