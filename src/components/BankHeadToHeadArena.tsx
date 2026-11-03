import React, { useState } from 'react';
import { UserLoanInput, Language } from '../types';
import { translations } from '../translations';
import { ALL_INDIAN_BANKS } from '../data/bankDetails';
import { compareTwoBankOffers } from '../utils/indiaAdvisorMath';
import { formatINR } from '../utils/loanCalculations';
import { 
  Swords, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Award,
  HelpCircle
} from 'lucide-react';

interface BankHeadToHeadProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const BankHeadToHeadArena: React.FC<BankHeadToHeadProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];

  // Bank A state (defaults to SBI)
  const [bank1Name, setBank1Name] = useState<string>('State Bank of India (SBI)');
  const [bank1Rate, setBank1Rate] = useState<number>(8.40);
  const [bank1Fee, setBank1Fee] = useState<number>(10000);

  // Bank B state (defaults to HDFC Bank)
  const [bank2Name, setBank2Name] = useState<string>('HDFC Bank');
  const [bank2Rate, setBank2Rate] = useState<number>(8.65);
  const [bank2Fee, setBank2Fee] = useState<number>(5000);

  const tenureYears = input.tenureYears || 20;

  const comparison = compareTwoBankOffers(
    input.amount,
    tenureYears,
    { name: bank1Name, rate: bank1Rate, processingFee: bank1Fee },
    { name: bank2Name, rate: bank2Rate, processingFee: bank2Fee }
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Swords className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bank Sanction Letter Face-Off Arena (Bank A vs. Bank B)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Head-to-Head
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hold competing loan sanction letters? Compare the interest rate, processing fee, and total outflow to pick the winner.
            </p>
          </div>
        </div>
      </div>

      {/* Head to Head Dual Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Bank 1 */}
        <div className="p-4 rounded-2xl border-2 border-blue-500/40 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Bank Offer 1
            </span>
            <select
              value={bank1Name}
              onChange={(e) => {
                const b = ALL_INDIAN_BANKS.find((item) => item.name === e.target.value);
                setBank1Name(e.target.value);
                if (b && b.rates[input.loanType]) {
                  setBank1Rate(b.rates[input.loanType]!.minRate);
                }
              }}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white"
            >
              {ALL_INDIAN_BANKS.map((b) => (
                <option key={b.id} value={b.name}>{b.shortName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">Offered Rate (% p.a.)</label>
              <input
                type="number"
                step={0.05}
                value={bank1Rate}
                onChange={(e) => setBank1Rate(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">Processing Fee (₹)</label>
              <input
                type="number"
                step={1000}
                value={bank1Fee}
                onChange={(e) => setBank1Fee(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 space-y-1 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Monthly EMI:</span>
              <strong className="text-base text-slate-900 dark:text-white">{formatINR(comparison.bank1Emi)}</strong>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-slate-100 dark:border-slate-700 text-[11px]">
              <span className="text-slate-500">Total Outflow ({tenureYears} yrs + GST):</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatINR(comparison.bank1TotalCost)}</strong>
            </div>
          </div>
        </div>

        {/* Bank 2 */}
        <div className="p-4 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Bank Offer 2
            </span>
            <select
              value={bank2Name}
              onChange={(e) => {
                const b = ALL_INDIAN_BANKS.find((item) => item.name === e.target.value);
                setBank2Name(e.target.value);
                if (b && b.rates[input.loanType]) {
                  setBank2Rate(b.rates[input.loanType]!.minRate);
                }
              }}
              className="text-xs font-semibold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white"
            >
              {ALL_INDIAN_BANKS.map((b) => (
                <option key={b.id} value={b.name}>{b.shortName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">Offered Rate (% p.a.)</label>
              <input
                type="number"
                step={0.05}
                value={bank2Rate}
                onChange={(e) => setBank2Rate(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-semibold block mb-1">Processing Fee (₹)</label>
              <input
                type="number"
                step={1000}
                value={bank2Fee}
                onChange={(e) => setBank2Fee(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 space-y-1 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Monthly EMI:</span>
              <strong className="text-base text-slate-900 dark:text-white">{formatINR(comparison.bank2Emi)}</strong>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-slate-100 dark:border-slate-700 text-[11px]">
              <span className="text-slate-500">Total Outflow ({tenureYears} yrs + GST):</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatINR(comparison.bank2TotalCost)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Verdict Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 border border-emerald-700/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
              Clear Advisor Verdict
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white">
            {comparison.cheaperBankName} is Cheaper by {formatINR(comparison.tenureTotalDifference)}!
          </div>
          <p className="text-xs text-emerald-200/80">
            Saves {formatINR(comparison.monthlyDifference)} on every monthly EMI.
            {comparison.breakEvenMonthsIfHigherPf > 0 && (
              <span> Any higher upfront processing fee is recovered in ~{comparison.breakEvenMonthsIfHigherPf} months.</span>
            )}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-200 self-start sm:self-auto">
          {comparison.bank1Rate === comparison.bank2Rate 
            ? 'Rates are identical; choose lowest processing fee & fastest service' 
            : 'Rate spread outweighs one-time fee difference!'}
        </div>
      </div>
    </div>
  );
};
