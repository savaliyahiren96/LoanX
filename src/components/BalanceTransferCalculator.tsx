import React, { useState } from 'react';
import { Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { calculateBalanceTransfer, formatINR } from '../utils/loanCalculations';
import { ArrowLeftRight, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';

interface BalanceTransferProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const BalanceTransferCalculator: React.FC<BalanceTransferProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [currentOutstanding, setCurrentOutstanding] = useState<number>(Math.round(input.amount * 0.85));
  const [currentRate, setCurrentRate] = useState<number>(9.5);
  const [newRate, setNewRate] = useState<number>(8.4);
  const [remainingYears, setRemainingYears] = useState<number>(15);

  const btResult = calculateBalanceTransfer(
    currentOutstanding,
    currentRate,
    newRate,
    remainingYears * 12
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.balanceTransferTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.btDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Current Outstanding Principal
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
            <input
              type="number"
              value={currentOutstanding}
              step={50000}
              onChange={(e) => setCurrentOutstanding(Number(e.target.value) || 0)}
              className="w-full pl-6 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Current Bank Rate (% p.a.)
          </label>
          <input
            type="number"
            step={0.1}
            value={currentRate}
            onChange={(e) => setCurrentRate(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            New Bank Offer Rate (% p.a.)
          </label>
          <input
            type="number"
            step={0.1}
            value={newRate}
            onChange={(e) => setNewRate(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Remaining Tenure (Years)
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={remainingYears}
            onChange={(e) => setRemainingYears(Number(e.target.value) || 1)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
            Current EMI vs New EMI
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs line-through text-slate-400">{formatINR(btResult.currentEmi)}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatINR(btResult.newEmi)}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
            Saves {formatINR(btResult.monthlySaving)} / month
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
            Transfer Costs (PF + MODT)
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
            {formatINR(btResult.transferCost)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Break-even in ~{btResult.breakevenMonths} months
          </span>
        </div>

        <div className="sm:col-span-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-lg shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-100 block">
            Net Lifetime Savings (After All Costs)
          </span>
          <div className="text-xl sm:text-2xl font-black mt-0.5">
            {formatINR(btResult.netLifetimeSaving)}
          </div>
          <span className="text-[11px] text-emerald-100/90 block mt-0.5">
            {btResult.netLifetimeSaving > 50000 
              ? '✅ Strong recommendation to transfer loan! Substantial savings.' 
              : '⚠️ Modest savings. Negotiate rate reduction with current bank first.'}
          </span>
        </div>
      </div>
    </div>
  );
};
