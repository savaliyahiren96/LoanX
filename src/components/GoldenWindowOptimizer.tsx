import React, { useState } from 'react';
import { UserLoanInput, Language } from '../types';
import { translations } from '../translations';
import { calculateGoldenWindowMultipliers } from '../utils/indiaAdvisorMath';
import { formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { 
  Flame, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  HelpCircle, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface GoldenWindowProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const GoldenWindowOptimizer: React.FC<GoldenWindowProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const effectiveRate = calculateEffectiveInterestRate(input);
  const tenureYears = input.tenureYears || 20;

  const [lumpSumPrepay, setLumpSumPrepay] = useState<number>(100000);

  const savingsData = calculateGoldenWindowMultipliers(
    input.amount,
    effectiveRate,
    tenureYears,
    lumpSumPrepay
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Flame className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                The "Golden Window" Prepayment Timing Optimizer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Years 1 to 7
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Why prepaying early yields 300%+ returns on interest saved compared to prepaying late in your loan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Prepay Amount:</span>
          <select
            value={lumpSumPrepay}
            onChange={(e) => setLumpSumPrepay(Number(e.target.value))}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value={50000}>₹50,000</option>
            <option value={100000}>₹1,00,000</option>
            <option value={200000}>₹2,00,000</option>
            <option value={500000}>₹5,00,000</option>
          </select>
        </div>
      </div>

      {/* Visual Golden Window Multiplier Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {savingsData.map((s) => {
          const isGolden = s.year <= 5;
          const isSilver = s.year > 5 && s.year <= 7;

          return (
            <div
              key={s.year}
              className={`p-3 rounded-xl border text-center transition-all ${
                isGolden
                  ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-400 dark:border-amber-700/80 shadow-xs ring-1 ring-amber-400/20'
                  : isSilver
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700'
                  : 'bg-slate-50/40 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold block ${
                isGolden ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'
              }`}>
                Year {s.year} {isGolden ? '🔥 Prime' : ''}
              </span>

              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                {s.savingsMultiplier}x
              </div>
              <span className="text-[10px] text-slate-500 block">Interest Return</span>

              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Saves {formatINR(s.interestSavedOnLumpSum)}
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                -{s.tenureReducedMonths} months
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          The Financial Mathematics of Front-Loaded EMIs:
        </h5>
        <p className="leading-relaxed">
          In India, home loan interest is front-loaded. In the first 5 years of a 20-year loan, nearly <strong>75% of every monthly EMI goes directly towards interest</strong>, and only 25% reduces principal.
        </p>
        <p className="leading-relaxed">
          Therefore, paying an extra {formatINR(lumpSumPrepay)} in <strong>Year 2</strong> stops interest from compounding for 18 full years, saving you <strong>{formatINR(savingsData[1]?.interestSavedOnLumpSum || 0)}</strong>. Waiting until Year 15 to make the same payment only saves <strong>{formatINR(savingsData[savingsData.length - 1]?.interestSavedOnLumpSum || 0)}</strong> because the loan is already 80% paid off.
        </p>
      </div>
    </div>
  );
};
