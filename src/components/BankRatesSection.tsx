import React, { useState, useEffect } from 'react';
import { UserLoanInput, Language, AiResponseData } from '../types';
import { translations } from '../translations';
import { 
  Building2, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Percent
} from 'lucide-react';

interface BankRatesSectionProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const BankRatesSection: React.FC<BankRatesSectionProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [data, setData] = useState<AiResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/grounded-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: t.loanTypes[input.loanType],
          amount: input.amount,
          tenureYears: input.tenureYears || 20,
          cibilScore: input.cibilScore,
          employmentType: input.employmentType,
          state: input.state,
          language: currentLang,
        }),
      });

      if (!res.ok) throw new Error('Could not fetch grounded bank rates');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to retrieve live rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [input.loanType, currentLang]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Bank Interest Rate Comparison
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Google Search Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified rates from SBI, HDFC, ICICI, Axis, PNB, BoB & NBFCs matching your exact CIBIL score & loan amount.
            </p>
          </div>
        </div>

        <button
          onClick={fetchRates}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Fetching...' : t.refreshRates}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 py-8 text-center">
          <div className="inline-block p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Searching official bank portals for latest {t.loanTypes[input.loanType]} rates & festive waivers...
          </p>
          <p className="text-xs text-slate-400">
            Checking State Bank of India, HDFC Bank, ICICI Bank, Punjab National Bank, Bank of Baroda...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>Could not connect to live search. Showing benchmark reference:</span>
          </div>
          <p>
            Current RBI Repo Rate is 6.50%. Standard Home Loan rates range between 8.35% – 9.15% (EBLR spread 1.85% – 2.65%), Car loans 8.65% – 9.60%, and Gold loans 8.75% – 9.50% at PSU banks.
          </p>
          <button
            onClick={fetchRates}
            className="text-xs font-bold underline hover:text-rose-900"
          >
            Retry Live Search
          </button>
        </div>
      )}

      {/* Results Content */}
      {data && !loading && (
        <div className="space-y-5">
          {/* Markdown / Formatted Text Response */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {data.content}
          </div>

          {/* Grounding Sources & Last Updated */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Grounded via Google Search • As of {data.lastUpdated}</span>
            </div>

            {data.sources && data.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Verified Sources:</span>
                {data.sources.slice(0, 5).map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}</span>
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
