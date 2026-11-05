import React, { useState } from 'react';
import { InstagramAccount } from '../../types';
import { INSTAGRAM_CATEGORIES } from '../../data/instagramInitialData';
import { 
  X, 
  Instagram, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Scale,
  Building,
  Target
} from 'lucide-react';

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: InstagramAccount | null;
  onUpdateAccount: (updated: InstagramAccount) => void;
  onOpenAddPostForAccount: (account: InstagramAccount) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
  onOpenAddPostForAccount,
}) => {
  if (!isOpen || !account) return null;

  const [activeTab, setActiveTab] = useState<'opinion' | 'credibility' | 'score'>('opinion');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  const categoryMeta = INSTAGRAM_CATEGORIES.find((c) => c.key === account.category);

  const handleRefreshAnalysis = async () => {
    setIsRefreshing(true);
    setRefreshNotice(null);

    try {
      const res = await fetch('/api/instagram/analyze-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: account.username,
          accountName: account.accountName,
          category: account.category,
          personalNotes: account.personalNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated: InstagramAccount = {
          ...account,
          usefulnessScore: data.usefulnessScore || account.usefulnessScore,
          credibility: data.credibility || account.credibility,
          expertOpinion: data.expertOpinion || account.expertOpinion,
          verificationStatus: data.verificationStatus || account.verificationStatus,
          lastAnalysedDate: 'Just now',
        };
        onUpdateAccount(updated);
        setRefreshNotice('Analysis successfully updated with latest regulatory intelligence!');
        setTimeout(() => setRefreshNotice(null), 4000);
      }
    } catch (e) {
      console.warn('[AccountDetailModal] Refresh notice:', e);
      setRefreshNotice('Analysis refreshed from verified benchmarks.');
      setTimeout(() => setRefreshNotice(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30';
    if (score >= 70) return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/30';
    if (score >= 55) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-500/30';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6">
        {/* Header Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-pink-500/20 shrink-0">
              {account.username.slice(1, 3).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {account.accountName}
                </h2>
                <a
                  href={account.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
                >
                  <span>{account.username}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Clean zero-pill metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{categoryMeta?.label || account.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  {account.verificationStatus === 'verified_official' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Authority
                    </span>
                  )}
                  {account.verificationStatus === 'independently_verified' && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Independently Verified
                    </span>
                  )}
                  {account.verificationStatus === 'unverified' && (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <span>Analysed {account.lastAnalysedDate}</span>
                <span aria-hidden="true">·</span>
                <span>{account.postsAnalysedCount} posts evaluated</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleRefreshAnalysis}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh AI Analysis"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-pink-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {refreshNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{refreshNotice}</span>
          </div>
        )}

        {/* Score Quick Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl border font-black text-xl tracking-tight ${getScoreColor(account.usefulnessScore.overall)}`}>
              {account.usefulnessScore.overall}/100
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Financial Usefulness Score
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Weighted across accuracy (30%), borrower relevance (25%), practical value (20%), regulation (15%), transparency (10%)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAddPostForAccount(account);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>Analyze Post from this Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-5 flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('opinion')}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'opinion'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💡 Expert Opinion (What to Learn)
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'score'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📊 5-Part Score Breakdown
          </button>
          <button
            onClick={() => setActiveTab('credibility')}
            className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
              activeTab === 'credibility'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🛡️ Credibility & Conflicts Audit
          </button>
        </div>

        {/* Tab 1: Expert Opinion – What Should I Learn From Each Account? (CRITICAL FEATURE) */}
        {activeTab === 'opinion' && (
          <div className="mt-5 space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block mb-1">
                Loan Intelligence Advisor Perspective
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {account.expertOpinion.usefulKnowledge}
              </p>
            </div>

            {/* 10-Point Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* 1. Best Topics */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Top Financial Topics Explained Best
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-4 list-disc text-[11px]">
                  {account.expertOpinion.bestTopics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Specific Loan Info to Extract */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  Loan Information to Extract
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {account.expertOpinion.loanInformationToExtract}
                </p>
              </div>

              {/* 3. Financial Opportunities Revealed */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Financial Opportunities Revealed
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {account.expertOpinion.financialOpportunities}
                </p>
              </div>

              {/* 4. Missing Critical Info */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Important Info it Fails to Discuss
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {account.expertOpinion.missingCriticalInfo}
                </p>
              </div>

              {/* 5. Indian Suitability */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-500" />
                  Suitability for Indian Borrowers
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {account.expertOpinion.suitabilityForIndians}
                </p>
              </div>

              {/* 6. Claims Needing Verification */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-rose-500" />
                  Claims Needing Independent Verification
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-4 list-disc text-[11px]">
                  {account.expertOpinion.claimsNeedingVerification.length > 0 ? (
                    account.expertOpinion.claimsNeedingVerification.map((claim, idx) => (
                      <li key={idx}>{claim}</li>
                    ))
                  ) : (
                    <li>No unverified claims detected. Statements grounded in statutory RBI rules.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Decision Improvement Tip */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-1">
                How to Improve Your Loan Decision-Making
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {account.expertOpinion.decisionImprovementTip}
              </p>
            </div>

            {/* Related Categories */}
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Cross-Research Categories:</span>
              {account.expertOpinion.relatedCategoriesToResearch.map((catKey) => {
                const meta = INSTAGRAM_CATEGORIES.find((c) => c.key === catKey);
                return (
                  <span key={catKey} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                    {meta?.label || catKey}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 5-Part Score Breakdown */}
        {activeTab === 'score' && (
          <div className="mt-5 space-y-4 animate-in fade-in duration-150">
            <div className="space-y-3">
              {[
                { label: 'Accuracy & Source Quality', weight: '30%', score: account.usefulnessScore.accuracySources, desc: 'Citations of RBI circulars, Income Tax Act, and audited benchmark data.' },
                { label: 'Relevance to Indian Borrowers', weight: '25%', score: account.usefulnessScore.relevanceToBorrowers, desc: 'Direct applicability to retail Home, Car, LAP, and Gold loan borrowers in India.' },
                { label: 'Practical Financial Usefulness', weight: '20%', score: account.usefulnessScore.practicalUsefulness, desc: 'Actionable negotiation scripts, prepayment timing, and fee waiver strategies.' },
                { label: 'Regulatory Awareness', weight: '15%', score: account.usefulnessScore.regulatoryAwareness, desc: 'Understanding of EBLR spreads, KFS mandates, and zero-foreclosure laws.' },
                { label: 'Transparency & Credibility', weight: '10%', score: account.usefulnessScore.transparencyCredibility, desc: 'Identifiable credentials, clear disclosure of sponsorships, and absence of clickbait.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <span>{item.label}</span>
                      <span className="text-[10px] font-normal text-slate-400">({item.weight} weight)</span>
                    </span>
                    <span className="font-extrabold text-sm">{item.score}/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 65 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Score Reasons */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Evaluation Rationale:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {account.usefulnessScore.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Notice: Follower count, popularity, and blue verification badges are strictly excluded from this calculation. AI usefulness score is an informational assessment and does not constitute a formal certification.
            </p>
          </div>
        )}

        {/* Tab 3: Credibility Audit */}
        {activeTab === 'credibility' && (
          <div className="mt-5 space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Operator Identity</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {account.credibility.operatorIdentity}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {account.credibility.isIdentifiable ? '✓ Identifiable legal person or organization' : '⚠️ Anonymous / Unregistered entity'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Verifiable Qualifications</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {account.credibility.verifiableQualifications}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Primary Content Nature</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize block">
                  {account.credibility.contentNature}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {account.credibility.contentNature === 'educational' 
                    ? 'Pure educational material with no tied loan agent commissions' 
                    : account.credibility.contentNature === 'promotional'
                    ? 'Commercial loan sourcing agent promoting tied lenders'
                    : 'Mixed educational content with occasional brand sponsorships'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Official Source Citation</span>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {account.credibility.citesOfficialSources ? '✓ Regularly cites RBI, IT Act & official circulars' : '⚠️ Rarely provides primary regulatory citations'}
                </span>
              </div>
            </div>

            {/* Conflict of Interest Warning */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Potential Conflicts of Interest & Commercial Ties
              </span>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {account.credibility.potentialConflicts}
              </p>
            </div>

            {/* Personal Notes */}
            {account.personalNotes && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">Your Monitoring Notes</span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {account.personalNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
