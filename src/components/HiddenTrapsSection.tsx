import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  XCircle, 
  FileWarning, 
  HelpCircle,
  Coins,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface HiddenTrapsProps {
  currentLang: Language;
}

export const HiddenTrapsSection: React.FC<HiddenTrapsProps> = ({
  currentLang,
}) => {
  const t = translations[currentLang];

  // Interactive Red Flag Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    insurance: false,
    resetClause: false,
    foreclosure: false,
    penalInterest: false,
    processingFeeCap: false,
    modtCharges: false,
    sanctionCopy: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  const traps = [
    {
      title: '1. The Forced Insurance Bundling Trap',
      risk: 'High Financial Loss',
      badge: 'Up to ₹1.5L Extra Loan Added',
      desc: 'Banks frequently tell borrowers that buying single-premium Credit Protect or Property Insurance is "mandatory" to sanction the loan. They bundle this premium directly into your loan, so you pay 8.5% interest on that insurance for 20 years!',
      solution: 'IRDAI and RBI circulars explicitly state insurance bundling is voluntary. You can buy standard Term Life Insurance independently online for 1/3rd the price, or submit an existing term policy as collateral.',
    },
    {
      title: '2. The MCLR / EBLR Spread Widening Trap',
      risk: 'Sneaky Rate Increases',
      badge: 'Unfair Rate Spreads',
      desc: 'When RBI cuts repo rates, banks often increase their "spread" (the margin added above repo rate) for existing borrowers while offering lower spreads to new customers. Your rate stays high while newcomers get cheap loans.',
      solution: 'Demand an internal spread conversion (under RBI guidelines, banks must let you switch to their prevailing lower spread for a nominal fee of ₹1,000–₹5,000 instead of paying high rates).',
    },
    {
      title: '3. Teaser Rates & Step-Up Schemes',
      risk: 'Payment Shock in Year 3',
      badge: 'Hidden Rate Jump',
      desc: 'Some lenders advertise alluring initial rates (e.g. 7.9% for Year 1 and 2), which silently jump to 9.5%+ from Year 3 onward in the fine print.',
      solution: 'Always ask for the "floating benchmark equation": (e.g., RBI Repo 6.50% + Bank Spread 1.90% = 8.40%). Never sign on teaser rate slabs.',
    },
    {
      title: '4. Penal Interest vs Penal Charges',
      risk: 'Compounding Debt Spiral',
      badge: 'RBI Revised Guidelines',
      desc: 'Previously, banks added penal interest directly into the principal balance, charging "interest on penalty".',
      solution: 'Under recent RBI Fair Lending Practice circulars, lenders CANNOT compound penal charges. Penal charges must be reasonable, separate, and clearly disclosed.',
    },
    {
      title: '5. MODT & Stamp Duty Duplication',
      risk: 'Hidden Upfront Costs',
      badge: '0.2% - 0.5% Extra',
      desc: 'On home and property loans, in addition to property stamp duty, banks charge MODT (Memorandum of Deposit of Title Deeds) stamp duty, legal verification fees, and valuation charges often totaling ₹25,000 to ₹50,000.',
      solution: 'Request a written "Schedule of All Charges" before paying the non-refundable file login fee.',
    },
    {
      title: '6. Gold Loan Valuation Cut & Auction Traps',
      risk: 'Loss of Family Gold',
      badge: 'Strict 15-day Notice Rule',
      desc: 'NBFCs aggressively deduct stone weight, calculate purity at 20K instead of 22K, and initiate gold auctions with short notice if interest is delayed.',
      solution: 'Insist on receiving the official appraiser purity certificate on the spot. Know that RBI mandates lenders must give a minimum notice in local newspapers before auctioning pledge gold.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-amber-100 dark:border-amber-950 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hidden Charges, Fine Print Traps & Red Flags
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unethical lending practices in India and how to legally protect yourself using RBI & IRDAI consumer guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Traps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {traps.map((trap, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {trap.title}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {trap.risk}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {trap.desc}
            </p>

            <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] text-emerald-900 dark:text-emerald-200">
              <span className="font-bold">🛡️ How to avoid: </span>
              {trap.solution}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Red Flag Checklist */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white p-5 border border-amber-800/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Borrower's Pre-Disbursal Red Flag Checklist
            </h4>
            <p className="text-xs text-amber-200/80">
              Verify these critical points with your loan officer before signing the sanction letter:
            </p>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 self-start sm:self-auto">
            {completedCount} of {totalCount} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label
            onClick={() => toggleCheck('insurance')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.insurance}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.insurance ? 'line-through text-slate-400' : 'text-slate-200'}>
              Confirmed that loan insurance is NOT added into my principal without explicit consent.
            </span>
          </label>

          <label
            onClick={() => toggleCheck('resetClause')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.resetClause}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.resetClause ? 'line-through text-slate-400' : 'text-slate-200'}>
              Spread above Repo/EBLR is clearly written in the sanction letter (e.g. Repo + 1.90%).
            </span>
          </label>

          <label
            onClick={() => toggleCheck('foreclosure')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.foreclosure}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.foreclosure ? 'line-through text-slate-400' : 'text-slate-200'}>
              Confirmed ZERO foreclosure or part-payment charges for individual floating rate loan.
            </span>
          </label>

          <label
            onClick={() => toggleCheck('penalInterest')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.penalInterest}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.penalInterest ? 'line-through text-slate-400' : 'text-slate-200'}>
              Checked cheque bounce / NACH failure fees (should be flat fee, not compounded penalty).
            </span>
          </label>

          <label
            onClick={() => toggleCheck('processingFeeCap')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.processingFeeCap}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.processingFeeCap ? 'line-through text-slate-400' : 'text-slate-200'}>
              Got written confirmation of maximum processing fee cap (e.g. max ₹10,000 + GST).
            </span>
          </label>

          <label
            onClick={() => toggleCheck('sanctionCopy')}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={checklist.sanctionCopy}
              onChange={() => {}}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <span className={checklist.sanctionCopy ? 'line-through text-slate-400' : 'text-slate-200'}>
              Retained a signed duplicate copy of the Sanction Letter & Key Fact Statement (KFS).
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
