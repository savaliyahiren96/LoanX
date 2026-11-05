import React from 'react';
import { LoanType, Language } from '../types';
import { translations } from '../translations';
import { 
  Building2, 
  Car, 
  Coins, 
  GraduationCap, 
  Briefcase, 
  User, 
  Landmark, 
  ShieldAlert, 
  Percent, 
  ArrowRight,
  Gift
} from 'lucide-react';

interface LoanTypeCardsProps {
  currentLang: Language;
  activeLoanType: LoanType;
  onSelectLoanType: (type: LoanType) => void;
  onNavigateSection: (section: string) => void;
}

export const LoanTypeCards: React.FC<LoanTypeCardsProps> = ({
  currentLang,
  activeLoanType,
  onSelectLoanType,
  onNavigateSection,
}) => {
  const t = translations[currentLang];

  const loanOptions: {
    type: LoanType;
    name: string;
    icon: any;
    rateHint: string;
    maxTenure: string;
    accentColor: string;
    badge?: string;
  }[] = [
    {
      type: 'home',
      name: t.loanTypes.home,
      icon: Building2,
      rateHint: 'From 8.35% p.a.',
      maxTenure: 'Up to 30 Years',
      accentColor: 'from-emerald-500 to-teal-600',
      badge: 'PMAY-U 2.0 Subsidy',
    },
    {
      type: 'car',
      name: t.loanTypes.car,
      icon: Car,
      rateHint: 'From 8.65% p.a.',
      maxTenure: 'Up to 7 Years',
      accentColor: 'from-blue-500 to-cyan-600',
      badge: 'EV 80EEB Tax Benefit',
    },
    {
      type: 'lap',
      name: t.loanTypes.lap,
      icon: Landmark,
      rateHint: 'From 9.00% p.a.',
      maxTenure: 'Up to 15 Years',
      accentColor: 'from-indigo-500 to-violet-600',
    },
    {
      type: 'gold',
      name: t.loanTypes.gold,
      icon: Coins,
      rateHint: 'From 8.75% p.a.',
      maxTenure: 'Up to 36 Months',
      accentColor: 'from-amber-500 to-yellow-600',
      badge: 'RBI 75% LTV Rule',
    },
    {
      type: 'education',
      name: t.loanTypes.education,
      icon: GraduationCap,
      rateHint: 'From 9.05% p.a.',
      maxTenure: 'Up to 15 Years',
      accentColor: 'from-purple-500 to-pink-600',
      badge: '100% Tax Deduction (80E)',
    },
    {
      type: 'personal',
      name: t.loanTypes.personal,
      icon: User,
      rateHint: 'From 10.50% p.a.',
      maxTenure: 'Up to 5 Years',
      accentColor: 'from-rose-500 to-red-600',
    },
    {
      type: 'business',
      name: t.loanTypes.business,
      icon: Briefcase,
      rateHint: 'From 11.00% p.a.',
      maxTenure: 'Up to 7 Years',
      accentColor: 'from-teal-500 to-emerald-700',
      badge: 'Mudra / CGTMSE Cover',
    },
  ];

  return (
    <div className="space-y-6">
      {/* AskLoanGuru AI Multilingual Voice Hero Banner */}
      <div 
        onClick={() => onNavigateSection('askloanguru')}
        className="group relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-900 via-teal-950 to-indigo-950 text-white cursor-pointer shadow-xl hover:shadow-emerald-500/20 border border-emerald-500/30 transition-all hover:-translate-y-0.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  AskLoanGuru AI
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Voice & Text in 11 Languages
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
                &ldquo;Ask Before You Borrow. Understand Before You Sign.&rdquo;
              </p>
              <p className="text-xs text-slate-300/80 mt-1 max-w-xl">
                Speak or type in Hindi, Gujarati, English, Marathi, Bengali, Tamil, Telugu, etc. Audits loan sanction letters, detects hidden insurance traps & teaches loan math in simple words.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md group-hover:scale-105 transition-all flex items-center gap-1.5">
              <span>Talk to AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* 4 Featured Master Cards: Compare Banks, Schemes & Subsidies, Hidden Traps, Instagram Intelligence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compare Banks Card */}
        <div
          onClick={() => onNavigateSection('rates')}
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white cursor-pointer shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all border border-indigo-700/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Live Grounded
            </span>
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors flex items-center gap-1.5">
            Compare Banks <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-indigo-200/80 leading-relaxed">
            SBI, HDFC, ICICI, Axis, BoB, PNB & NBFC rates fetched live via Google Search grounding.
          </p>
        </div>

        {/* Schemes and Subsidies Card */}
        <div
          onClick={() => onNavigateSection('schemes')}
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white cursor-pointer shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all border border-emerald-700/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Up to ₹2.67 Lakh
            </span>
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-emerald-200 transition-colors flex items-center gap-1.5">
            Schemes & Subsidies <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-emerald-200/80 leading-relaxed">
            PMAY-U 2.0, PM Mudra, Stand-Up India, PM Vishwakarma, Agri 3% subvention & EV rebates.
          </p>
        </div>

        {/* Hidden Charges and Traps Card */}
        <div
          onClick={() => onNavigateSection('traps')}
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white cursor-pointer shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all border border-amber-700/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30">
              Red Flag Audit
            </span>
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
            Hidden Charges & Traps <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-amber-200/80 leading-relaxed">
            Insurance bundling traps, MCLR spread resets, teaser rates, and zero foreclosure rules.
          </p>
        </div>

        {/* NEW: Instagram Account Intelligence Card */}
        <div
          onClick={() => onNavigateSection('instagram')}
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-pink-950 via-rose-950 to-slate-950 text-white cursor-pointer shadow-lg hover:shadow-pink-500/20 hover:-translate-y-0.5 transition-all border border-pink-700/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 group-hover:scale-110 transition-transform">
              <span className="font-bold text-lg">IG</span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/30">
              New Intelligence
            </span>
          </div>
          <h3 className="mt-4 text-base sm:text-lg font-bold text-white group-hover:text-pink-200 transition-colors flex items-center gap-1.5">
            Instagram Intel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-pink-200/80 leading-relaxed">
            Audit financial creators, extract loan secrets, verify claims & transfer verified insights.
          </p>
        </div>
      </div>

      {/* Grid of Loan Types */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Loan Category
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Click to configure EMI & planning
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {loanOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeLoanType === opt.type;
            return (
              <div
                key={opt.type}
                onClick={() => {
                  onSelectLoanType(opt.type);
                  onNavigateSection('calculator');
                }}
                className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                }`}
              >
                {opt.badge && (
                  <span className="absolute -top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                    {opt.badge}
                  </span>
                )}
                <div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 bg-gradient-to-tr ${opt.accentColor} text-white shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {opt.name}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {opt.rateHint}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                    {opt.maxTenure}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
