import React from 'react';
import { Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { calculateGoldLoan, formatINR } from '../utils/loanCalculations';
import { Coins, ShieldCheck, AlertCircle, Sparkles, Scale, Info } from 'lucide-react';

interface GoldLoanSectionProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const GoldLoanSection: React.FC<GoldLoanSectionProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];

  const weight = input.goldWeightGrams || 50;
  const purity = input.goldPurity || '22k';
  const goldPrice = input.goldRatePerGram || 7650;
  const tenureMonths = input.tenureMonths || 12;

  // PSU vs NBFC rate
  let annualRate = 9.0;
  if (input.lenderType === 'nbfc') annualRate = 14.5;
  else if (input.lenderType === 'private_bank') annualRate = 11.0;

  const goldCalc = calculateGoldLoan(weight, purity, goldPrice, tenureMonths, annualRate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="border-b border-amber-100 dark:border-amber-950 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gold Loan LTV & Repayment Simulator (RBI Cap 75%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RBI mandates max 75% Loan-to-Value on net gold weight. Stones & gems are deducted.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
          Live Benchmark: ₹{goldPrice.toLocaleString('en-IN')}/g ({purity.toUpperCase()})
        </span>
      </div>

      {/* Valuation & RBI Max Loan Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Net Gold Weight & Purity
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {weight} grams ({purity.toUpperCase()})
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Only precious metal weight is evaluated
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Gross Market Value
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {formatINR(goldCalc.grossAppraisedValue)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            100% full benchmark value
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
            Max Loan Possible (RBI 75% LTV)
          </span>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
            {formatINR(goldCalc.maxRbiLtvLoan)}
          </div>
          <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block mt-0.5">
            Legal maximum any bank/NBFC can disburse
          </span>
        </div>
      </div>

      {/* Monthly Interest vs Bullet Repayment */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Repayment Scheme Comparison
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Regular Interest */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Monthly Regular Interest Scheme
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Cheapest Total Interest
              </span>
            </div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatINR(goldCalc.monthlyInterestPayable)} <span className="text-xs text-slate-500 font-normal">/ month</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              You pay only interest every month. The principal of {formatINR(goldCalc.maxRbiLtvLoan)} is repaid at the end of {tenureMonths} months.
            </p>
            <div className="text-xs pt-1 border-t border-slate-200 dark:border-slate-700 text-slate-500 flex justify-between">
              <span>Total Interest for {tenureMonths} months:</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatINR(goldCalc.totalMonthlyInterest)}</strong>
            </div>
          </div>

          {/* Bullet Repayment */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Bullet Repayment Scheme
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                Zero Monthly Cash Outflow
              </span>
            </div>
            <div className="text-xl font-extrabold text-amber-700 dark:text-amber-300">
              {formatINR(goldCalc.bulletTotalPayable)} <span className="text-xs text-slate-500 font-normal">at maturity</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pay ₹0 per month. Principal + all compounded interest is paid in a single "bullet" shot at tenure end (allowed up to 12 months under RBI guidelines).
            </p>
            <div className="text-xs pt-1 border-t border-amber-200 dark:border-amber-800 text-slate-500 flex justify-between">
              <span>Accrued Interest:</span>
              <strong className="text-amber-700 dark:text-amber-300">{formatINR(goldCalc.bulletInterest)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Public vs NBFC Trap Warning */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
        <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          PSU Bank vs NBFC Tip:
        </p>
        <p>
          State Bank of India (SBI), Bank of Baroda, and PNB offer gold loans starting at ~<strong>8.75% to 9.5%</strong>. Gold NBFCs (Muthoot, Manappuram) disburse in 15 minutes but charge <strong>12% to 24%</strong> plus steep penal interest if delayed even by 1 day! Choose PSU banks if you have 1–2 days.
        </p>
      </div>
    </div>
  );
};
