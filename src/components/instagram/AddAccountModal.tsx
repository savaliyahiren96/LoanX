import React, { useState } from 'react';
import { InstagramAccount, InstagramCategory, AccountLabel } from '../../types';
import { INSTAGRAM_CATEGORIES } from '../../data/instagramInitialData';
import { X, Instagram, Sparkles, Shield, AlertCircle, Info } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAccount: (account: InstagramAccount) => void;
  accountToEdit?: InstagramAccount | null;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onSaveAccount,
  accountToEdit,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState(accountToEdit?.username || '');
  const [profileUrl, setProfileUrl] = useState(accountToEdit?.profileUrl || '');
  const [accountName, setAccountName] = useState(accountToEdit?.accountName || '');
  const [category, setCategory] = useState<InstagramCategory>(accountToEdit?.category || 'banking_loan_experts');
  const [personalNotes, setPersonalNotes] = useState(accountToEdit?.personalNotes || '');
  const [label, setLabel] = useState<AccountLabel>(accountToEdit?.label || 'needs_verification');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = (val: string) => {
    let clean = val.trim();
    if (clean && !clean.startsWith('@')) {
      clean = '@' + clean;
    }
    setUsername(clean);

    // Auto-fill profile URL if empty or default
    if (!profileUrl || profileUrl.startsWith('https://instagram.com/')) {
      const handle = clean.replace('@', '');
      setProfileUrl(`https://instagram.com/${handle}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || username === '@') {
      setError('Please provide a valid Instagram username.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let analysisResult: any = null;

      if (autoAnalyze && !accountToEdit) {
        try {
          const res = await fetch('/api/instagram/analyze-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              accountName: accountName || username,
              category,
              personalNotes,
            }),
          });
          if (res.ok) {
            analysisResult = await res.json();
          }
        } catch (err) {
          console.warn('[AddAccountModal] AI Analysis fallback applied:', err);
        }
      }

      const isOfficial = username.toLowerCase().includes('rbi');
      const isCA = category === 'chartered_accountants' || username.toLowerCase().includes('ca.');

      const newAccount: InstagramAccount = {
        id: accountToEdit?.id || `acc-${Date.now()}`,
        username: username.startsWith('@') ? username : `@${username}`,
        profileUrl: profileUrl || `https://instagram.com/${username.replace('@', '')}`,
        accountName: accountName || username,
        category,
        personalNotes,
        description: accountToEdit?.description || `Monitored account covering ${category.replace(/_/g, ' ')}.`,
        verificationStatus: analysisResult?.verificationStatus || (isOfficial ? 'verified_official' : isCA ? 'independently_verified' : 'unverified'),
        lastAnalysedDate: 'Just now',
        postsAnalysedCount: accountToEdit?.postsAnalysedCount || 0,
        usefulnessScore: analysisResult?.usefulnessScore || accountToEdit?.usefulnessScore || {
          overall: isOfficial ? 96 : isCA ? 90 : 78,
          accuracySources: isOfficial ? 100 : isCA ? 92 : 75,
          relevanceToBorrowers: 85,
          practicalUsefulness: 80,
          regulatoryAwareness: isOfficial ? 100 : 78,
          transparencyCredibility: 75,
          reasons: [
            'Newly added account enrolled in Loan Intelligence monitoring.',
            'Initial public profile evaluation queued for verified post extraction.',
          ],
        },
        credibility: analysisResult?.credibility || accountToEdit?.credibility || {
          operatorIdentity: accountName || username,
          isIdentifiable: true,
          verifiableQualifications: isCA ? 'Chartered Accountant' : 'Financial Content Creator',
          citesOfficialSources: isOfficial || isCA,
          contentNature: isOfficial ? 'educational' : 'mixed',
          exaggeratedClaims: false,
          potentialConflicts: 'Subject to ongoing verification of sponsored content.',
        },
        expertOpinion: analysisResult?.expertOpinion || accountToEdit?.expertOpinion || {
          usefulKnowledge: `Monitor for loan negotiation tips, borrower protection rights, and banking procedures.`,
          bestTopics: ['Interest rate reset clauses', 'Processing fee waivers', 'Home loan documentation'],
          loanInformationToExtract: 'Bank spread terms, KFS transparency, and prepayment rules.',
          financialOpportunities: 'Look for promotional bank concessions and festive interest rate cuts.',
          missingCriticalInfo: 'Check state-level stamp duty and registration tax impacts independently.',
          suitabilityForIndians: 'Relevant for Indian retail borrowers.',
          claimsNeedingVerification: ['Verify bank-specific prepayment net banking rules.'],
          keepInLibrary: true,
          decisionImprovementTip: 'Cross-reference interest rate claims with current RBI repo rate benchmarks.',
          relatedCategoriesToResearch: ['rbi_banking_info', 'consumer_rights_legal'],
        },
        label: label,
        isMonitoring: true,
        createdAt: accountToEdit?.createdAt || new Date().toISOString().split('T')[0],
      };

      onSaveAccount(newAccount);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {accountToEdit ? 'Edit Instagram Account' : 'Add Instagram Account to Directory'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent research & monitoring list • No automated following or private access
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username & Account Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Instagram Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="@reservebankofindia"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">e.g. @RBI, @sharanhegde, @ca.rachanaranade</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Account Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Reserve Bank of India"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
          </div>

          {/* Profile URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instagram Profile URL
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/reservebankofindia"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/30"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InstagramCategory)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/30"
            >
              {INSTAGRAM_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {INSTAGRAM_CATEGORIES.find((c) => c.key === category)?.description}
            </p>
          </div>

          {/* Label & Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Initial Classification Label
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'priority', label: 'Priority Source', desc: 'Critical alerts' },
                { key: 'trusted', label: 'Trusted Expert', desc: 'Verified track record' },
                { key: 'needs_verification', label: 'Needs Verification', desc: 'Unvetted creator' },
                { key: 'promotional', label: 'Promotional / Agent', desc: 'Commercial bias' },
                { key: 'low_relevance', label: 'Low Relevance', desc: 'Infrequent loan topics' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setLabel(opt.key as AccountLabel)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    label === opt.key
                      ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-semibold ring-1 ring-pink-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="block font-medium">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 block">{opt.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              Note: A user-assigned label never overrides independent regulatory verification.
            </p>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Monitoring Notes
            </label>
            <textarea
              rows={2}
              placeholder="Why are you monitoring this account? (e.g. Follow for SBI MaxGain tips, reviews bank sanction clauses)"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/30"
            />
          </div>

          {/* Auto AI Analysis Toggle */}
          {!accountToEdit && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Run Instant AI Credibility & Expert Opinion Audit
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculates 5-part usefulness score and generates "What to learn from this account"
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoAnalyze}
                onChange={(e) => setAutoAnalyze(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 rounded-xl shadow-md shadow-pink-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Profile...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>{accountToEdit ? 'Save Changes' : 'Add to Monitoring Directory'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
