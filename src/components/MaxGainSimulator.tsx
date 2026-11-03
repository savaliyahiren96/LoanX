import React, { useState } from 'react';
import { UserLoanInput, Language } from '../types';
import { translations } from '../translations';
import { calculateMaxGainSavings } from '../utils/indiaAdvisorMath';
import { formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { 
  Wallet, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  TrendingDown, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface MaxGainSimulatorProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const MaxGainSimulator: React.FC<MaxGainSimulatorProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const effectiveRate = calculateEffectiveInterestRate(input);
  const tenureMonths = input.tenureUnit === 'years' ? (input.tenureYears || 20) * 12 : (input.tenureMonths || 240);

  // Parked balance state (default ~10% of loan amount or ₹3 Lakhs)
  const defaultParked = Math.min(Math.round(input.amount * 0.1), 500000);
  const [parkedSavings, setParkedSavings] = useState<number>(defaultParked);

  const result = calculateMaxGainSavings(
    input.amount,
    effectiveRate,
    tenureMonths,
    parkedSavings
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Wallet className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Home Loan Overdraft (SBI MaxGain / BoB Advantage)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Liquid
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Park emergency funds or monthly surplus to slash interest, while retaining instant 24x7 ATM/UPI withdrawal access!
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          Active Rate: {effectiveRate}% p.a.
        </span>
      </div>

      {/* Simulator Slider */}
      <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Average Liquid Savings Parked in Overdraft Account
            </label>
            <p className="text-[11px] text-slate-500">
              Salary, emergency reserve, or business working capital kept in the linked OD current account.
            </p>
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 text-right">
            {formatINR(parkedSavings)}
          </div>
        </div>

        <input
          type="range"
          min={50000}
          max={Math.round(input.amount * 0.75)}
          step={25000}
          value={parkedSavings}
          onChange={(e) => setParkedSavings(Number(e.target.value))}
          className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />

        <div className="flex flex-wrap gap-1.5">
          {[100000, 250000, 500000, 1000000, 1500000].map((amt) => {
            if (amt > input.amount * 0.75) return null;
            return (
              <button
                key={amt}
                onClick={() => setParkedSavings(amt)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                  parkedSavings === amt
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Park {formatINR(amt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Impact Results Cards */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-5 border border-emerald-800/40 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="sm:border-r sm:border-slate-800 sm:pr-4">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              Direct Interest Saved
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatINR(result.interestSaved)}
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-0.5 block">
              Interest reduced automatically without prepayment locks
            </span>
          </div>

          <div className="sm:border-r sm:border-slate-800 sm:pr-4">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Loan Closes Earlier By
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline justify-center sm:justify-start gap-1">
              <span>{result.tenureSavedYears}</span>
              <span className="text-sm font-semibold text-slate-400">Years</span>
              <span className="text-xs text-slate-500">({result.tenureSavedMonths} mos)</span>
            </div>
            <span className="text-[11px] text-amber-300/80 mt-0.5 block">
              Effective tenure down to {(result.maxGainTenureMonths / 12).toFixed(1)} years
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block mb-1">
              Liquidity Freedom
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              100% Available
            </div>
            <span className="text-[11px] text-slate-300 mt-0.5 block">
              Withdraw via ATM / NetBanking 24x7 anytime
            </span>
          </div>
        </div>
      </div>

      {/* Comparison: Standard Loan vs MaxGain Overdraft */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Feature</th>
              <th className="py-2.5 px-3">Regular Term Home Loan</th>
              <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Overdraft Loan (SBI MaxGain / BoB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Interest Calculation</td>
              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">Calculated on full outstanding principal</td>
              <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Calculated on (Principal minus Parked Savings)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Total Interest for this loan</td>
              <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-medium">{formatINR(result.standardTotalInterest)}</td>
              <td className="py-2.5 px-3 font-extrabold text-emerald-700 dark:text-emerald-400">{formatINR(result.maxGainTotalInterest)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Liquidity of Prepaid Money</td>
              <td className="py-2.5 px-3 text-rose-500 font-medium">Locked! Cannot withdraw prepaid funds</td>
              <td className="py-2.5 px-3 text-emerald-600 font-bold">100% Liquid via Debit card / Cheque book / UPI</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Interest Rate Differential</td>
              <td className="py-2.5 px-3 text-slate-600">Base rate ({effectiveRate}%)</td>
              <td className="py-2.5 px-3 text-slate-600">Typically identical or +0.10% to +0.25% premium</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>Advisor Secret:</strong> Link your salary account or business operating account to your MaxGain account. As salary credits on the 1st of every month, your daily loan interest drops immediately until you spend the money throughout the month!
        </p>
      </div>
    </div>
  );
};
