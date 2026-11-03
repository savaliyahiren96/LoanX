import React, { useState } from 'react';
import { Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { calculateMonthlyEmi, formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { Scale, Check, X, AlertCircle, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface FixedVsFloatingProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const FixedVsFloating: React.FC<FixedVsFloatingProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const baseRate = calculateEffectiveInterestRate(input);
  const tenureMonths = input.tenureUnit === 'years' ? (input.tenureYears || 20) * 12 : (input.tenureMonths || 240);

  // Sensitivity scenarios
  const [rateShift, setRateShift] = useState<number>(0);

  const floatingCurrentEmi = calculateMonthlyEmi(input.amount, baseRate, tenureMonths);
  const floatingShiftedEmi = calculateMonthlyEmi(input.amount, baseRate + rateShift, tenureMonths);

  // Typical Fixed rate is 1.5% to 2% higher in India
  const fixedRate = baseRate + 1.75;
  const fixedEmi = calculateMonthlyEmi(input.amount, fixedRate, tenureMonths);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fixed vs Floating Rate Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understand RBI regulations, interest rate sensitivity, and foreclosure charge traps.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Floating Rate Box */}
        <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Floating Rate (External Benchmark / Repo)
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
              ~95% Indian Borrowers Choose This
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(floatingCurrentEmi)}
            </span>
            <span className="text-xs text-slate-500">at {baseRate}% p.a.</span>
          </div>

          <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>0% Foreclosure Penalty:</strong> RBI strictly mandates zero prepayment charges for individual borrowers.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Automatic Rate Cuts:</strong> When RBI slashes repo rates, your interest rate reduces within 3 months (quarterly reset).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Rate Hike Risk:</strong> If inflation rises and RBI raises repo rates, your tenure or EMI increases automatically.</span>
            </li>
          </ul>
        </div>

        {/* Fixed Rate Box */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Fixed Rate Loan
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Premium Interest
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(fixedEmi)}
            </span>
            <span className="text-xs text-slate-500">at ~{fixedRate.toFixed(2)}% p.a.</span>
          </div>

          <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-1.5">
              <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Predictable EMI:</strong> EMI does not change even during aggressive RBI rate hiking cycles.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>Prepayment Penalties:</strong> Banks often levy 2%–4% penalty + GST if you prepay or close early.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>Reset Clause Trap:</strong> Most "fixed" loans in India are actually semi-fixed, with rates reset every 2–5 years!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating Rate RBI Repo Sensitivity Simulator */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              RBI Repo Rate Sensitivity Simulator
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              See how your EMI changes if RBI increases or slashes repo rates:
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[-0.5, 0, 0.5, 1.0, 1.5].map((shift) => (
              <button
                key={shift}
                onClick={() => setRateShift(shift)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  rateShift === shift
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {shift > 0 ? `+${shift}%` : shift === 0 ? 'Current' : `${shift}%`}
              </button>
            ))}
          </div>
        </div>

        {rateShift !== 0 && (
          <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>
              At revised rate of <strong>{(baseRate + rateShift).toFixed(2)}%</strong>:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                New EMI: {formatINR(floatingShiftedEmi)}
              </span>
              <span className={`text-[11px] font-bold ${rateShift > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                ({rateShift > 0 ? `+${formatINR(floatingShiftedEmi - floatingCurrentEmi)}` : `-${formatINR(floatingCurrentEmi - floatingShiftedEmi)}`})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
