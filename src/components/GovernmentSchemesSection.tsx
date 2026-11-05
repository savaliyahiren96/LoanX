import React, { useState, useEffect } from 'react';
import { UserLoanInput, Language, AiResponseData } from '../types';
import { translations } from '../translations';
import { 
  Gift, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  FileText,
  BadgePercent,
  HelpCircle
} from 'lucide-react';

interface GovernmentSchemesProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const GovernmentSchemesSection: React.FC<GovernmentSchemesProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [data, setData] = useState<AiResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: t.loanTypes[input.loanType],
          amount: input.amount,
          category: input.category,
          isFirstTimeBuyer: input.isFirstTimeBuyer,
          isWomanCoApplicant: input.isWomanApplicant || input.isCoApplicant,
          isFarmer: input.isFarmer,
          isGovtEmployee: input.isGovtOrDefence,
          state: input.state,
          annualIncome: input.monthlyIncome * 12,
          language: currentLang,
        }),
      });

      if (!res.ok) throw new Error('Could not fetch schemes');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.warn('[GovernmentSchemesSection] Schemes fetch notice:', err?.message || err);
      setError(err.message || 'Failed to search government schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [input.loanType, input.category, input.state, currentLang]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Government Schemes, Subsidies & Grants
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PMAY-U 2.0, PM Mudra, Stand-Up India, PM Vishwakarma, Agri Subventions & State subsidies.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSchemes}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Searching...' : t.checkSchemes}</span>
        </button>
      </div>

      {/* User Qualified Criteria Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-semibold self-center mr-1">Your Profile Tags:</span>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          Category: {input.category.toUpperCase()}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          State: {input.state}
        </span>
        {input.isFirstTimeBuyer && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-300 dark:border-emerald-700">
            ✓ 1st Time Home Buyer (PMAY eligible)
          </span>
        )}
        {input.isWomanApplicant && (
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300 font-medium border border-pink-300 dark:border-pink-700">
            ✓ Woman Borrower (Stamp duty rebate)
          </span>
        )}
        {input.isFarmer && (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium border border-amber-300 dark:border-amber-700">
            ✓ Farmer (3% Interest Subvention)
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4 py-8 text-center">
          <div className="inline-block p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 animate-pulse">
            <Gift className="w-8 h-8 animate-bounce" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Scanning Ministry portals for subsidies matching your profile in {input.state}...
          </p>
        </div>
      )}

      {/* Content */}
      {data && !loading && (
        <div className="space-y-5">
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {data.content}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Grounded via Google Search • Last verified {data.lastUpdated}</span>
            </div>

            {data.sources && data.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Official Portals:</span>
                {data.sources.slice(0, 4).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
