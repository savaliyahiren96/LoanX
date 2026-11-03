import { calculateMonthlyEmi } from './loanCalculations';

// 1. Home Loan Overdraft (SBI MaxGain / BoB Advantage / ICICI Money Saver)
export interface MaxGainResult {
  standardTotalInterest: number;
  maxGainTotalInterest: number;
  interestSaved: number;
  standardTenureMonths: number;
  maxGainTenureMonths: number;
  tenureSavedMonths: number;
  tenureSavedYears: number;
  monthlyEmi: number;
}

export function calculateMaxGainSavings(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  averageParkedSavings: number
): MaxGainResult {
  const emi = calculateMonthlyEmi(principal, annualRate, tenureMonths);
  const standardTotalInterest = Math.max(0, emi * tenureMonths - principal);

  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  let totalInterest = 0;
  let month = 0;

  while (balance > 1 && month < tenureMonths * 2) {
    month++;
    // In MaxGain, interest is calculated only on (Principal Balance - Parked Savings in OD account)
    const effectiveDrawingPower = Math.max(0, balance - averageParkedSavings);
    const monthlyInterest = effectiveDrawingPower * monthlyRate;
    totalInterest += monthlyInterest;

    // Remaining EMI goes to reduce principal
    const principalPaid = Math.min(balance, emi - monthlyInterest);
    balance -= principalPaid;

    if (balance <= 0) break;
  }

  const maxGainTotalInterest = Math.round(totalInterest);
  const interestSaved = Math.max(0, standardTotalInterest - maxGainTotalInterest);
  const tenureSavedMonths = Math.max(0, tenureMonths - month);

  return {
    standardTotalInterest,
    maxGainTotalInterest,
    interestSaved,
    standardTenureMonths: tenureMonths,
    maxGainTenureMonths: month,
    tenureSavedMonths,
    tenureSavedYears: Number((tenureSavedMonths / 12).toFixed(1)),
    monthlyEmi: emi,
  };
}

// 2. Indian Rent vs Buy Calculator
export interface RentVsBuyInput {
  propertyPrice: number; // e.g. ₹75,00,000
  downPaymentPercent: number; // e.g. 20%
  loanInterestRate: number; // e.g. 8.4%
  loanTenureYears: number; // e.g. 20
  monthlyRent: number; // e.g. ₹25,000
  annualRentIncreasePercent: number; // e.g. 6% (standard Indian rental escalation)
  propertyAppreciationPercent: number; // e.g. 6% (standard Indian real estate appreciation)
  monthlyMaintenance: number; // e.g. ₹3,500
  sipReturnPercent: number; // e.g. 12% (Nifty 50 historical equity CAGR)
  taxBracketPercent: number; // e.g. 30%
}

export interface RentVsBuyYearResult {
  year: number;
  homeBuyerNetWorth: number; // Property market value - outstanding loan
  renterNetWorth: number; // SIP Corpus from down payment + monthly savings
  propertyValue: number;
  outstandingLoan: number;
  cumulativeRentPaid: number;
  cumulativeEmiPaid: number;
}

export interface RentVsBuyOutput {
  yearlyTrajectory: RentVsBuyYearResult[];
  year5Verdict: { winner: 'buy' | 'rent'; difference: number };
  year10Verdict: { winner: 'buy' | 'rent'; difference: number };
  year20Verdict: { winner: 'buy' | 'rent'; difference: number };
  monthlyEmi: number;
  initialDownPayment: number;
  totalTaxSavedOverTenure: number;
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyOutput {
  const downPayment = (input.propertyPrice * input.downPaymentPercent) / 100;
  const stampDutyAndRegistration = input.propertyPrice * 0.06; // approx 6% in India
  const initialCashOutflowBuyer = downPayment + stampDutyAndRegistration;

  const loanAmount = input.propertyPrice - downPayment;
  const tenureMonths = input.loanTenureYears * 12;
  const emi = calculateMonthlyEmi(loanAmount, input.loanInterestRate, tenureMonths);

  let currentPropertyValue = input.propertyPrice;
  let loanBalance = loanAmount;
  const monthlyLoanRate = input.loanInterestRate / 12 / 100;

  // Renter starts with the down payment + stamp duty invested in an equity SIP
  let renterCorpus = initialCashOutflowBuyer;
  const monthlySipRate = input.sipReturnPercent / 12 / 100;

  let currentRent = input.monthlyRent;
  let cumulativeRent = 0;
  let cumulativeEmi = 0;
  let totalTaxSaved = 0;

  const yearlyTrajectory: RentVsBuyYearResult[] = [];

  for (let year = 1; year <= input.loanTenureYears; year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      if (loanBalance > 0) {
        const interest = loanBalance * monthlyLoanRate;
        const principal = Math.min(loanBalance, emi - interest);
        yearInterest += interest;
        yearPrincipal += principal;
        loanBalance -= principal;
      }

      // Total monthly cost for buyer: EMI + Maintenance - Tax benefit
      const monthlyBuyerCost = emi + input.monthlyMaintenance;

      // Total monthly cost for renter: Rent
      const monthlyRenterCost = currentRent;

      // Difference: If Buyer pays more than Renter, Renter invests the difference into SIP
      const monthlyDifference = monthlyBuyerCost - monthlyRenterCost;

      // Compound renter's corpus
      renterCorpus = renterCorpus * (1 + monthlySipRate);
      if (monthlyDifference > 0) {
        renterCorpus += monthlyDifference;
      }

      cumulativeRent += currentRent;
      cumulativeEmi += emi;
    }

    // Annual tax deduction under Sec 24b (max 2L) + 80C (max 1.5L)
    const taxDeduction = Math.min(yearInterest, 200000) + Math.min(yearPrincipal, 150000);
    const annualTaxBenefit = taxDeduction * (input.taxBracketPercent / 100);
    totalTaxSaved += annualTaxBenefit;

    // Property appreciation at year end
    currentPropertyValue = currentPropertyValue * (1 + input.propertyAppreciationPercent / 100);

    // Rent escalation for next year
    currentRent = currentRent * (1 + input.annualRentIncreasePercent / 100);

    // Net worths
    const buyerNetWorth = Math.round(currentPropertyValue - loanBalance);
    const renterNetWorthRounded = Math.round(renterCorpus);

    yearlyTrajectory.push({
      year,
      homeBuyerNetWorth: buyerNetWorth,
      renterNetWorth: renterNetWorthRounded,
      propertyValue: Math.round(currentPropertyValue),
      outstandingLoan: Math.round(Math.max(0, loanBalance)),
      cumulativeRentPaid: Math.round(cumulativeRent),
      cumulativeEmiPaid: Math.round(cumulativeEmi),
    });
  }

  const y5 = yearlyTrajectory[4] || yearlyTrajectory[yearlyTrajectory.length - 1];
  const y10 = yearlyTrajectory[9] || yearlyTrajectory[yearlyTrajectory.length - 1];
  const y20 = yearlyTrajectory[yearlyTrajectory.length - 1];

  return {
    yearlyTrajectory,
    year5Verdict: {
      winner: y5.homeBuyerNetWorth >= y5.renterNetWorth ? 'buy' : 'rent',
      difference: Math.abs(y5.homeBuyerNetWorth - y5.renterNetWorth),
    },
    year10Verdict: {
      winner: y10.homeBuyerNetWorth >= y10.renterNetWorth ? 'buy' : 'rent',
      difference: Math.abs(y10.homeBuyerNetWorth - y10.renterNetWorth),
    },
    year20Verdict: {
      winner: y20.homeBuyerNetWorth >= y20.renterNetWorth ? 'buy' : 'rent',
      difference: Math.abs(y20.homeBuyerNetWorth - y20.renterNetWorth),
    },
    monthlyEmi: emi,
    initialDownPayment: downPayment,
    totalTaxSavedOverTenure: Math.round(totalTaxSaved),
  };
}

// 3. CIBIL Score Financial Impact Meter
export interface CibilImpactTier {
  slab: string;
  scoreRange: string;
  spreadAdjustment: number;
  interestRate: number;
  monthlyEmi: number;
  monthlyPenalty: number;
  lifetimeInterestLoss: number;
  approvalRisk: 'Low' | 'Medium' | 'High' | 'Very High';
}

export function calculateCibilImpact(
  loanAmount: number,
  baseRate: number,
  tenureYears: number
): CibilImpactTier[] {
  const tenureMonths = tenureYears * 12;
  const primeEmi = calculateMonthlyEmi(loanAmount, baseRate, tenureMonths);
  const primeTotalInterest = (primeEmi * tenureMonths) - loanAmount;

  const tiers: { slab: string; scoreRange: string; spread: number; risk: any }[] = [
    { slab: 'Tier 1 (Prime)', scoreRange: '750 – 900', spread: 0.0, risk: 'Low' },
    { slab: 'Tier 2 (Standard)', scoreRange: '700 – 749', spread: 0.35, risk: 'Medium' },
    { slab: 'Tier 3 (Sub-Prime)', scoreRange: '650 – 699', spread: 0.85, risk: 'High' },
    { slab: 'Tier 4 (High Risk)', scoreRange: 'Below 650', spread: 1.80, risk: 'Very High' },
  ];

  return tiers.map((t) => {
    const rate = Number((baseRate + t.spread).toFixed(2));
    const emi = calculateMonthlyEmi(loanAmount, rate, tenureMonths);
    const totalInterest = (emi * tenureMonths) - loanAmount;
    const monthlyPenalty = Math.max(0, emi - primeEmi);
    const lifetimeInterestLoss = Math.max(0, totalInterest - primeTotalInterest);

    return {
      slab: t.slab,
      scoreRange: t.scoreRange,
      spreadAdjustment: t.spread,
      interestRate: rate,
      monthlyEmi: emi,
      monthlyPenalty,
      lifetimeInterestLoss,
      approvalRisk: t.risk,
    };
  });
}

// 4. Prepayment "Golden Window" Timing
export interface GoldenWindowYearSavings {
  year: number;
  interestSavedOnLumpSum: number;
  tenureReducedMonths: number;
  savingsMultiplier: number; // e.g. 2.8x saved per ₹1 prepaid
}

export function calculateGoldenWindowMultipliers(
  principal: number,
  annualRate: number,
  tenureYears: number,
  lumpSumAmount: number = 100000
): GoldenWindowYearSavings[] {
  const originalMonths = tenureYears * 12;
  const originalEmi = calculateMonthlyEmi(principal, annualRate, originalMonths);
  const originalTotalInterest = (originalEmi * originalMonths) - principal;
  const monthlyRate = annualRate / 12 / 100;

  const sampleYears = [1, 2, 3, 5, 7, 10, 15];
  const results: GoldenWindowYearSavings[] = [];

  for (const yr of sampleYears) {
    if (yr >= tenureYears) continue;
    const prepayMonth = yr * 12;

    let balance = principal;
    let totalInterest = 0;
    let month = 0;

    while (balance > 1 && month < originalMonths * 2) {
      month++;
      if (month === prepayMonth) {
        balance = Math.max(0, balance - lumpSumAmount);
      }
      const interest = balance * monthlyRate;
      totalInterest += interest;
      const principalPaid = Math.min(balance, originalEmi - interest);
      balance -= principalPaid;
      if (balance <= 0) break;
    }

    const interestSaved = Math.max(0, originalTotalInterest - Math.round(totalInterest));
    const tenureReducedMonths = Math.max(0, originalMonths - month);
    const savingsMultiplier = Number((interestSaved / lumpSumAmount).toFixed(2));

    results.push({
      year: yr,
      interestSavedOnLumpSum: interestSaved,
      tenureReducedMonths,
      savingsMultiplier,
    });
  }

  return results;
}

// 5. Head-to-Head Bank Comparison
export interface BankComparisonResult {
  bank1Name: string;
  bank2Name: string;
  bank1Rate: number;
  bank2Rate: number;
  bank1Emi: number;
  bank2Emi: number;
  bank1TotalCost: number;
  bank2TotalCost: number;
  tenureYears: number;
  loanAmount: number;
  cheaperBankName: string;
  monthlyDifference: number;
  tenureTotalDifference: number;
  breakEvenMonthsIfHigherPf: number;
}

export function compareTwoBankOffers(
  loanAmount: number,
  tenureYears: number,
  bank1: { name: string; rate: number; processingFee: number },
  bank2: { name: string; rate: number; processingFee: number }
): BankComparisonResult {
  const months = tenureYears * 12;
  const emi1 = calculateMonthlyEmi(loanAmount, bank1.rate, months);
  const emi2 = calculateMonthlyEmi(loanAmount, bank2.rate, months);

  const totalPayable1 = (emi1 * months) + (bank1.processingFee * 1.18);
  const totalPayable2 = (emi2 * months) + (bank2.processingFee * 1.18);

  const diff = Math.abs(totalPayable1 - totalPayable2);
  const cheaperName = totalPayable1 <= totalPayable2 ? bank1.name : bank2.name;
  const monthlyDiff = Math.abs(emi1 - emi2);

  // If one bank has higher fee but lower EMI
  const pfDiff = Math.abs(bank1.processingFee - bank2.processingFee);
  const breakEvenMonths = monthlyDiff > 0 ? Math.ceil(pfDiff / monthlyDiff) : 0;

  return {
    bank1Name: bank1.name,
    bank2Name: bank2.name,
    bank1Rate: bank1.rate,
    bank2Rate: bank2.rate,
    bank1Emi: emi1,
    bank2Emi: emi2,
    bank1TotalCost: Math.round(totalPayable1),
    bank2TotalCost: Math.round(totalPayable2),
    tenureYears,
    loanAmount,
    cheaperBankName: cheaperName,
    monthlyDifference: monthlyDiff,
    tenureTotalDifference: Math.round(diff),
    breakEvenMonthsIfHigherPf: breakEvenMonths,
  };
}
