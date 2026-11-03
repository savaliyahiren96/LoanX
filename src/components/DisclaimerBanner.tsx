import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { ShieldCheck, Lock, Info, Scale } from 'lucide-react';

interface DisclaimerBannerProps {
  currentLang: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Badges: Privacy, Ethical, RBI Compliant */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Lock className="w-4 h-4" />
              100% Client-Side Privacy (Zero Data Stored)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
              <Scale className="w-4 h-4" />
              Strictly Legal & Ethical Tax/Loan Guidance
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              RBI & IRDAI Guidelines Referenced
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            LoanGuru India © 2026 • Made for Indian Borrowers
          </span>
        </div>

        {/* Disclaimer Text */}
        <div className="space-y-1.5 leading-relaxed text-[11px]">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            ⚠️ {t.disclaimerShort}
          </p>
          <p>
            {t.disclaimerFull}
          </p>
          <p className="text-[10px] text-slate-400">
            Bank interest rates change dynamically based on RBI Monetary Policy Committee (MPC) repo rate decisions, borrower credit bureau score (CIBIL/Experian), loan-to-value (LTV), and lender discretion. All government subsidy amounts (PMAY-U 2.0, Mudra, Stand-Up India, Agri Subventions) are subject to official ministry budgetary sanctions and applicant verification by authorized nodal agencies.
          </p>
        </div>
      </div>
    </footer>
  );
};
