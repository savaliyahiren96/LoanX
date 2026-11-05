import React, { useState } from 'react';
import { DiscoveredAccount, InstagramAccount } from '../../types';
import { INSTAGRAM_CATEGORIES } from '../../data/instagramInitialData';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface DiscoverExpertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredAccounts: DiscoveredAccount[];
  existingAccounts: InstagramAccount[];
  onAddDiscoveredAccount: (discovered: DiscoveredAccount) => void;
}

export const DiscoverExpertsModal: React.FC<DiscoverExpertsModalProps> = ({
  isOpen,
  onClose,
  discoveredAccounts,
  existingAccounts,
  onAddDiscoveredAccount,
}) => {
  if (!isOpen) return null;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const existingUsernames = new Set(existingAccounts.map((a) => a.username.toLowerCase()));

  const filtered = discoveredAccounts.filter((acc) => {
    if (activeCategoryFilter !== 'all' && acc.category !== activeCategoryFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Discover Financial Experts on Instagram
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated public educators covering Indian loans, RBI circulars, and tax laws
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on Verifiable Identity */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
          <strong>Integrity Standard:</strong> We do not fabricate follower counts or qualifications. Accounts with unverified commercial affiliations are labeled "Unverified" with an explicit Skip recommendation.
        </div>

        {/* Discovered Cards */}
        <div className="mt-5 space-y-4">
          {filtered.map((expert) => {
            const isAlreadyAdded = existingUsernames.has(expert.username.toLowerCase());
            const catMeta = INSTAGRAM_CATEGORIES.find((c) => c.key === expert.category);

            return (
              <div
                key={expert.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  expert.recommendation === 'add'
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {expert.accountName}
                      </h3>
                      <a
                        href={expert.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{expert.username}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    {/* Clean unboxed metadata */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{catMeta?.label || expert.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={expert.isVerifiable ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                        {expert.isVerifiable ? '✓ Identifiable Identity' : '⚠️ Unverified Identity'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Button */}
                  <div className="flex items-center gap-2">
                    {isAlreadyAdded ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Directory
                      </span>
                    ) : (
                      <button
                        onClick={() => onAddDiscoveredAccount(expert)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          expert.recommendation === 'add'
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-sm'
                            : 'bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {expert.recommendation === 'add' ? (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Directory</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Add with Caution</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Main Area of Expertise:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                      {expert.mainAreaOfExpertise}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Why Relevant to You:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                      {expert.whyRelevant}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50 space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      Evidence of Credibility:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                      {expert.evidenceOfCredibility}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      Potential Limitations:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                      {expert.potentialLimitations}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
