import React from 'react';
import { UserLoanInput, Language } from '../types';
import { translations } from '../translations';
import { calculateCibilImpact } from '../utils/indiaAdvisorMath';
import { formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { 
  ShieldAlert, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  CreditCard,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CibilRoadmapProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const CibilRoadmapSection: React.FC<CibilRoadmapProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const baseRate = 8.40;
  const tenureYears = input.tenureYears || 20;

  const tiers = calculateCibilImpact(input.amount, baseRate, tenureYears);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CIBIL Score Financial Penalty Meter & 60-Day Recovery Roadmap
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                TransUnion CIBIL
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              See the exact rupee loss caused by risk spread surcharges across Indian banks, and how to rapidly boost your score.
            </p>
          </div>
        </div>
      </div>

      {/* CIBIL Tiers Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">CIBIL Range</th>
              <th className="py-2.5 px-3">Applied Interest Rate</th>
              <th className="py-2.5 px-3">Monthly EMI</th>
              <th className="py-2.5 px-3 text-rose-600 dark:text-rose-400">Monthly Surcharge Penalty</th>
              <th className="py-2.5 px-3 text-rose-600 dark:text-rose-400 text-right">Lifetime Rupee Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tiers.map((tier, idx) => (
              <tr
                key={idx}
                className={idx === 0 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}
              >
                <td className="py-2.5 px-3">
                  <span className="font-bold text-slate-900 dark:text-white block">{tier.scoreRange}</span>
                  <span className="text-[10px] text-slate-400 block">{tier.slab}</span>
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                  {tier.interestRate}% p.a.
                  {tier.spreadAdjustment > 0 && (
                    <span className="text-[10px] text-rose-500 block">+{tier.spreadAdjustment}% surcharge</span>
                  )}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                  {formatINR(tier.monthlyEmi)}
                </td>
                <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                  {tier.monthlyPenalty > 0 ? `+${formatINR(tier.monthlyPenalty)} / mo` : '₹0 (Best Rate)'}
                </td>
                <td className="py-2.5 px-3 text-right font-black text-rose-600 dark:text-rose-400">
                  {tier.lifetimeInterestLoss > 0 ? `+${formatINR(tier.lifetimeInterestLoss)}` : '₹0 (Benchmark)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 60-Day Recovery Blueprint */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          The 60-Day Indian Credit Score Recovery Blueprint
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. The 30% Utilization "Statement Date" Hack
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Banks report your balance to CIBIL on your <strong>bill generation date</strong>, not the due date. Pay 80% of your credit card balance 3 days BEFORE the bill generates. This instantly drops your credit utilization below 30%, adding 20–40 points within 30 days.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Remove "Settled" / "Written-Off" Tags
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If an old credit card or personal loan shows "Settled", banks view it as a partial default. Approach the lender, pay the waived principal/interest difference, and insist on getting a formal <strong>"No Due Certificate (NDC)"</strong> and status update to <strong>"Closed"</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. The Fixed Deposit (FD) Credit Card Hack
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If your score is below 680 and banks are rejecting you, open a ₹25,000 fixed deposit in Kotak or IDFC to get a 100% approval secured credit card. Spend ₹2,000 on groceries and pay on time every month. Your score will climb past 740 in 90 days.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Stop Spamming Loan Inquiries
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Every time a bank checks your CIBIL for an application, a "Hard Inquiry" is recorded. Applying to 4 banks in 1 week knocks 15–25 points off your score and signals debt desperation. Always check soft eligibility before formally logging in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
