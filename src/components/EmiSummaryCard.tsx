import React from 'react';
import { EmiCalculationResult, Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { formatINR, formatCompactINR } from '../utils/loanCalculations';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Percent, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface EmiSummaryCardProps {
  calculation: EmiCalculationResult;
  input: UserLoanInput;
  currentLang: Language;
  onNavigateSection: (section: string) => void;
}

export const EmiSummaryCard: React.FC<EmiSummaryCardProps> = ({
  calculation,
  input,
  currentLang,
  onNavigateSection,
}) => {
  const t = translations[currentLang];

  // WhatsApp share message preparation
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*LoanGuru India Calculation Summary*\n` +
      `📋 *Loan Type:* ${t.loanTypes[input.loanType]}\n` +
      `💰 *Loan Amount:* ${formatINR(calculation.loanAmount)}\n` +
      `📅 *Tenure:* ${input.tenureUnit === 'years' ? `${input.tenureYears} Years` : `${input.tenureMonths} Months`}\n` +
      `📊 *Monthly EMI:* ${formatINR(calculation.monthlyEmi)}\n` +
      `📈 *Total Interest:* ${formatINR(calculation.totalInterest)}\n` +
      `💵 *True Outflow (incl. Stamp Duty & Fees):* ${formatINR(calculation.trueTotalCost)}\n` +
      `🎯 *Max Loan Eligibility:* ${formatINR(calculation.maxLoanEligibility)}\n` +
      `\nPlan your loan smartly with live RBI grounded bank rates on LoanGuru India!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  // Eligibility Status styling & messaging
  const getEligibilityBadge = () => {
    switch (calculation.eligibilityStatus) {
      case 'excellent':
        return {
          label: 'High Approval Probability (Safe FOIR)',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
          icon: CheckCircle2,
          desc: 'Your total proposed EMIs are well within 40-50% of your take-home income. Banks will readily sanction this amount.',
        };
      case 'moderate':
        return {
          label: 'Moderate Eligibility (Acceptable)',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700',
          icon: CheckCircle2,
          desc: 'Total EMI is close to 50% FOIR limit. You qualify, but keep emergency savings intact.',
        };
      case 'stretched':
        return {
          label: 'Stretched Eligibility (Borderline)',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
          icon: AlertTriangle,
          desc: 'Your EMI exceeds standard 50% limit. Add an earning co-applicant or lengthen tenure to boost eligibility.',
        };
      case 'ineligible':
        return {
          label: 'Overleveraged (High Risk)',
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-700',
          icon: AlertTriangle,
          desc: 'Existing EMIs take up too much of your income. Clear smaller personal/card debts before applying.',
        };
    }
  };

  const elig = getEligibilityBadge();
  const EligIcon = elig.icon;

  return (
    <div className="space-y-6">
      {/* 1. Main Hero EMI Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40">
        {/* Glow decoration */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 block mb-1">
              {t.monthlyEmi}
            </span>
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
              <span>{formatINR(calculation.monthlyEmi)}</span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">/ month</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.shareWhatsApp}</span>
            </button>
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.downloadPdf}</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>
        </div>

        {/* Repayment Breakdown: Principal vs Interest Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Principal Loan: {formatINR(calculation.loanAmount)} ({calculation.principalRatio.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Total Interest: {formatINR(calculation.totalInterest)} ({calculation.interestRatio.toFixed(1)}%)
            </span>
          </div>

          {/* Visual Bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.max(5, calculation.principalRatio)}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
            />
            <div
              style={{ width: `${Math.max(5, calculation.interestRatio)}%` }}
              className="bg-amber-400 h-full transition-all duration-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Total Repayment (Principal + Interest):</span>
            <span className="font-extrabold text-white text-sm">{formatINR(calculation.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 2. True Cost of Loan Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.trueCostOfLoan}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Banks only show EMI. We calculate processing fees, GST, stamp duty & insurance for real cash outflow.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
            APR ~{calculation.effectiveApr}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Processing Fee
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {formatINR(calculation.processingFee)}
            </span>
            <span className="text-[9px] text-slate-400 block">+18% GST ({formatINR(calculation.gstOnProcessing)})</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Stamp Duty ({input.state})
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {calculation.stampDuty > 0 ? formatINR(calculation.stampDuty) : 'Exempt / Nil'}
            </span>
            <span className="text-[9px] text-slate-400 block">State Registration</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Insurance (Est.)
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {calculation.insuranceEstimate > 0 ? formatINR(calculation.insuranceEstimate) : 'Optional'}
            </span>
            <span className="text-[9px] text-slate-400 block">Term / Property Cover</span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block uppercase font-bold">
              Total True Outflow
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatINR(calculation.trueTotalCost)}
            </span>
            <span className="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 block">All-Inclusive</span>
          </div>
        </div>
      </div>

      {/* 3. FOIR / Eligibility Meter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.foirTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.foirExplanation}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${elig.bg}`}>
            <EligIcon className="w-3.5 h-3.5" />
            <span>{elig.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {t.maxEligibleLoan}
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {formatINR(calculation.maxLoanEligibility)}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Based on net monthly income of {formatINR(input.monthlyIncome)} and current {input.tenureYears || 20} year tenure.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              {t.maxAllowableEmi}
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {formatINR(calculation.maxAllowableEmi)} / mo
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Available quota after deducting {formatINR(input.existingEmis)} existing EMIs.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          💡 <strong>Tip to boost eligibility:</strong> {elig.desc}
        </p>
      </div>

      {/* 4. Top 3 Money Saving Insights */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-indigo-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Top 3 Money-Saving Tips For Your Loan
          </h4>
        </div>

        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
            <p>
              <strong>Prepay just 1 extra EMI every year:</strong> Closing a 20-year loan with 1 extra EMI per year can reduce your loan tenure by ~4 years and save over ₹5–8 Lakhs in interest!
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
            <p>
              <strong>Decline single-premium insurance bundling:</strong> Banks cannot force you to buy their bundled loan insurance. Term life insurance bought independently is up to 60% cheaper.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
            <p>
              <strong>RBI Zero Prepayment Charge Mandate:</strong> Banks are legally prohibited from charging any penalty on floating-rate individual loan prepayments or foreclosures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
