import React, { useState, useEffect } from 'react';
import { UserLoanInput, Language, EmiCalculationResult, AiResponseData } from '../types';
import { translations } from '../translations';
import { formatINR } from '../utils/loanCalculations';
import { 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Users, 
  ShieldAlert, 
  TrendingDown, 
  Layers,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface TaxBenefitsProps {
  input: UserLoanInput;
  calculation: EmiCalculationResult;
  currentLang: Language;
}

export const TaxBenefitsSection: React.FC<TaxBenefitsProps> = ({
  input,
  calculation,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [taxRegime, setTaxRegime] = useState<'old' | 'new'>('old');
  const [taxSlab, setTaxSlab] = useState<number>(30); // 30% standard highest slab
  const [data, setData] = useState<AiResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Approximate year 1 interest and principal from amortization
  const year1 = calculation.yearlySchedule[0] || { interestPaid: 200000, principalPaid: 100000 };
  const annualInterest = year1.interestPaid;
  const annualPrincipal = year1.principalPaid;

  // Tax calculations under Old Regime
  // Sec 24(b) - Home Loan Interest: max ₹2,00,000 for self-occupied
  let sec24bLimit = input.loanType === 'home' ? Math.min(annualInterest, 200000) : 0;
  // Sec 80C - Principal Repayment: max ₹1,50,000
  let sec80cLimit = input.loanType === 'home' ? Math.min(annualPrincipal, 150000) : 0;
  // Sec 80EEB - EV Car Loan Interest: max ₹1,50,000
  let sec80eebLimit = input.loanType === 'car' && input.fuelType === 'ev' ? Math.min(annualInterest, 150000) : 0;
  // Sec 80E - Education Loan: No upper cap on interest deduction for up to 8 years!
  let sec80eLimit = input.loanType === 'education' ? annualInterest : 0;

  // Co-applicant double benefit
  const isCoApp = input.isCoApplicant;
  if (isCoApp && input.loanType === 'home') {
    // Both can claim up to 2L interest and 1.5L principal each (up to total actuals)
    sec24bLimit = Math.min(annualInterest, 400000);
    sec80cLimit = Math.min(annualPrincipal, 300000);
  }

  const totalDeductionClaimable = taxRegime === 'old' 
    ? (sec24bLimit + sec80cLimit + sec80eebLimit + sec80eLimit)
    : 0; // Under New Tax Regime (default since 2023-24), 24b and 80C are disallowed on self-occupied

  const estimatedTaxSaved = Math.round(totalDeductionClaimable * (taxSlab / 100) * 1.04); // including 4% cess

  // Fetch AI grounded details
  const fetchLegalAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/tax-and-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: t.loanTypes[input.loanType],
          annualInterest,
          annualPrincipal,
          state: input.state,
          isWomanCoApplicant: input.isWomanApplicant,
          isCoApplicant: input.isCoApplicant,
          language: currentLang,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn('[TaxBenefitsSection] Advice fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegalAdvice();
  }, [input.loanType, input.isCoApplicant, input.isWomanApplicant, currentLang]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-300">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Income Tax Savings & Legal Benefits (Finance Act)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate tax deductions under Section 24(b), 80C, 80EEB, 80E & explore New vs Old Regime.
            </p>
          </div>
        </div>

        <button
          onClick={fetchLegalAdvice}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Tax Regime Selector & Tax Slab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Your Income Tax Regime
          </label>
          <div className="inline-flex w-full rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 text-xs">
            <button
              onClick={() => setTaxRegime('old')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                taxRegime === 'old'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Old Tax Regime (Allows 24b & 80C)
            </button>
            <button
              onClick={() => setTaxRegime('new')}
              className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                taxRegime === 'new'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              New Tax Regime (Lower Slabs)
            </button>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {taxRegime === 'new' 
              ? 'Note: Home loan interest (24b) and principal (80C) deductions are NOT available in New Regime.' 
              : 'Deductions can significantly reduce taxable income in Old Regime.'}
          </span>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Your Income Tax Bracket
          </label>
          <div className="flex gap-2">
            {[20, 30].map((slab) => (
              <button
                key={slab}
                onClick={() => setTaxSlab(slab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  taxSlab === slab
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {slab}% Slab ({slab === 30 ? 'Income > ₹15L' : 'Income ₹10L - ₹15L'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tax Deduction Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Section 24b */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Section 24(b) (Interest)
            </span>
            <span className="text-[10px] font-bold text-slate-400">Max ₹2L {isCoApp ? '(₹4L Joint)' : ''}</span>
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {taxRegime === 'old' ? formatINR(sec24bLimit) : '₹0 (New Regime)'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Applied against Year 1 interest of {formatINR(annualInterest)}
          </span>
        </div>

        {/* Section 80C */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Section 80C (Principal)
            </span>
            <span className="text-[10px] font-bold text-slate-400">Max ₹1.5L {isCoApp ? '(₹3L Joint)' : ''}</span>
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {taxRegime === 'old' ? formatINR(sec80cLimit) : '₹0 (New Regime)'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Applied against Year 1 principal of {formatINR(annualPrincipal)}
          </span>
        </div>

        {/* Section 80EEB / 80E */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              {input.loanType === 'car' ? 'Sec 80EEB (EV Car)' : input.loanType === 'education' ? 'Sec 80E (Education)' : 'Other Sections'}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {input.loanType === 'education' ? 'No Upper Limit' : 'Up to ₹1.5L'}
            </span>
          </div>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">
            {taxRegime === 'old' ? formatINR(sec80eebLimit || sec80eLimit) : '₹0'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {input.loanType === 'car' ? 'EV purchase interest deduction' : 'Full interest deductible for 8 yrs'}
          </span>
        </div>
      </div>

      {/* Tax Saved Summary Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-purple-700/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-purple-300 font-bold block mb-1">
            Estimated Annual Income Tax Saved
          </span>
          <div className="text-3xl font-black text-white">
            {formatINR(estimatedTaxSaved)}
          </div>
          <span className="text-xs text-purple-200/80 mt-1 block">
            Total tax deductions claimed: {formatINR(totalDeductionClaimable)} at {taxSlab}% bracket + cess
          </span>
        </div>

        {isCoApp && (
          <div className="px-3.5 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-xs text-purple-200 max-w-xs">
            ✨ <strong>Double Benefit Active:</strong> By adding a co-owner co-applicant, your household tax deduction cap doubled from ₹3.5 Lakh to ₹7 Lakh!
          </div>
        )}
      </div>

      {/* Live AI Legal Rights & Negotiation Strategy */}
      {data && (
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Lesser-Known Legal Rights & RBI Circular Protections
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {data.content}
          </div>
        </div>
      )}
    </div>
  );
};
