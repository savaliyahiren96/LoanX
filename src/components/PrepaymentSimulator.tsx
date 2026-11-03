import React, { useState } from 'react';
import { Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { simulatePrepayment, formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { 
  PiggyBank, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Percent
} from 'lucide-react';

interface PrepaymentSimulatorProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const PrepaymentSimulator: React.FC<PrepaymentSimulatorProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const effectiveRate = calculateEffectiveInterestRate(input);
  const originalTenureMonths = input.tenureUnit === 'years' 
    ? (input.tenureYears || 20) * 12 
    : (input.tenureMonths || 240);

  // Prepayment controls
  const [extraMonthlyEmi, setExtraMonthlyEmi] = useState<number>(2000);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(0);
  const [lumpSumYear, setLumpSumYear] = useState<number>(2);
  const [stepUpPercent, setStepUpPercent] = useState<number>(0);

  const result = simulatePrepayment(
    input.amount,
    effectiveRate,
    originalTenureMonths,
    {
      extraMonthlyEmi,
      lumpSumAmount,
      lumpSumMonth: lumpSumYear * 12,
      annualStepUpPercent: stepUpPercent,
    }
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.prepaymentTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.prepaymentDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Extra Monthly Payment */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.extraMonthly}
            </label>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              +{formatINR(extraMonthlyEmi)}/mo
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={1000}
            value={extraMonthlyEmi}
            onChange={(e) => setExtraMonthlyEmi(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex gap-1.5 flex-wrap pt-1">
            {[1000, 2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => setExtraMonthlyEmi(amt)}
                className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                  extraMonthlyEmi === amt
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                +{formatINR(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. One-Time Lump Sum Prepayment */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.lumpSum}
            </label>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatINR(lumpSumAmount)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.round(input.amount * 0.5)}
            step={25000}
            value={lumpSumAmount}
            onChange={(e) => setLumpSumAmount(Number(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Pay in Year:</span>
            <select
              value={lumpSumYear}
              onChange={(e) => setLumpSumYear(Number(e.target.value))}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-semibold text-xs"
            >
              {[1, 2, 3, 5, 7, 10].map((yr) => (
                <option key={yr} value={yr}>Year {yr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Annual Step-Up EMI */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.annualStepUp}
            </label>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
              {stepUpPercent}% / yr
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={2.5}
            value={stepUpPercent}
            onChange={(e) => setStepUpPercent(Number(e.target.value))}
            className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500 leading-tight pt-1">
            Increase EMI each year as your salary increases by 5% or 10%.
          </p>
        </div>
      </div>

      {/* Impact / Results Box */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-5 border border-emerald-800/40 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          {/* Interest Saved */}
          <div className="sm:border-r sm:border-slate-800 sm:pr-4">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
              {t.interestSaved}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatINR(result.interestSaved)}
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-0.5 block">
              Direct cash saved on total interest
            </span>
          </div>

          {/* Tenure Reduced */}
          <div className="sm:border-r sm:border-slate-800 sm:pr-4">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
              {t.tenureReduced}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline justify-center sm:justify-start gap-1">
              <span>{result.tenureReducedYears}</span>
              <span className="text-sm font-semibold text-slate-400">Years</span>
              <span className="text-xs text-slate-500">({result.tenureReducedMonths} mos)</span>
            </div>
            <span className="text-[11px] text-amber-300/80 mt-0.5 block">
              Loan ends {result.tenureReducedYears} years earlier
            </span>
          </div>

          {/* New Tenure & Interest Outflow */}
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block mb-1">
              New Loan Tenure
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {(result.newTenureMonths / 12).toFixed(1)} <span className="text-sm font-medium text-slate-400">Years</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Down from {(originalTenureMonths / 12)} years originally
            </span>
          </div>
        </div>

        {/* Regulatory Note */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>RBI Guarantee:</strong> Section 2(a) of RBI Guidelines prohibits banks & NBFCs from charging any foreclosure or part-prepayment fees on floating-rate individual loans. You can prepay anytime without penalty!
          </span>
        </div>
      </div>
    </div>
  );
};
