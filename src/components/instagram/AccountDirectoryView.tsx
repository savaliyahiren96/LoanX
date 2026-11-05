import React, { useState } from 'react';
import { InstagramAccount, InstagramCategory } from '../../types';
import { INSTAGRAM_CATEGORIES } from '../../data/instagramInitialData';
import { 
  Instagram, 
  Search, 
  Plus, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical, 
  Pause, 
  Play, 
  Trash2, 
  Edit3, 
  FileText, 
  Scale, 
  Download,
  Filter,
  ArrowRight
} from 'lucide-react';

interface AccountDirectoryViewProps {
  accounts: InstagramAccount[];
  onOpenAddModal: () => void;
  onOpenDiscoverModal: () => void;
  onSelectAccount: (account: InstagramAccount) => void;
  onEditAccount: (account: InstagramAccount) => void;
  onDeleteAccount: (id: string) => void;
  onToggleMonitoring: (id: string) => void;
  onOpenAnalyzePost: (account: InstagramAccount) => void;
  onNavigateToComparison: () => void;
}

export const AccountDirectoryView: React.FC<AccountDirectoryViewProps> = ({
  accounts,
  onOpenAddModal,
  onOpenDiscoverModal,
  onSelectAccount,
  onEditAccount,
  onDeleteAccount,
  onToggleMonitoring,
  onOpenAnalyzePost,
  onNavigateToComparison,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'name'>('score');
  const [labelFilter, setLabelFilter] = useState<string>('all');

  const filteredAccounts = accounts
    .filter((acc) => {
      if (categoryFilter !== 'all' && acc.category !== categoryFilter) return false;
      if (labelFilter !== 'all' && acc.label !== labelFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchUser = acc.username.toLowerCase().includes(q);
        const matchName = acc.accountName.toLowerCase().includes(q);
        const matchNotes = acc.personalNotes.toLowerCase().includes(q);
        const matchDesc = acc.description.toLowerCase().includes(q);
        if (!matchUser && !matchName && !matchNotes && !matchDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.usefulnessScore.overall - a.usefulnessScore.overall;
      if (sortBy === 'name') return a.accountName.localeCompare(b.accountName);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleExportInsights = () => {
    const exportData = accounts.map((acc) => ({
      username: acc.username,
      accountName: acc.accountName,
      category: acc.category,
      usefulnessScore: acc.usefulnessScore.overall,
      credibilityOperator: acc.credibility.operatorIdentity,
      verificationStatus: acc.verificationStatus,
      bestTopics: acc.expertOpinion.bestTopics.join('; '),
      loanInformationToExtract: acc.expertOpinion.loanInformationToExtract,
      decisionImprovementTip: acc.expertOpinion.decisionImprovementTip,
      personalNotes: acc.personalNotes,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanGuru_Instagram_Intelligence_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLabelBadge = (label: InstagramAccount['label']) => {
    switch (label) {
      case 'priority':
        return { text: 'Priority', color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' };
      case 'trusted':
        return { text: 'Trusted Source', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' };
      case 'needs_verification':
        return { text: 'Needs Verification', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' };
      case 'promotional':
        return { text: 'Promotional / Agent', color: 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-800' };
      default:
        return { text: 'Low Relevance', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Open Account Directory
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300">{accounts.length} Monitored Profiles</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
            Curated Indian Banking & Financial Influencer List
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Manage your personal research list. Analyze public financial guidance, audit qualifications, track hidden bank charges, and transfer verified insights into your borrowing plan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenDiscoverModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Discover</span>
          </button>

          <button
            onClick={onNavigateToComparison}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compare</span>
          </button>

          <button
            onClick={handleExportInsights}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Directory and Insights as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search username, name, or personal notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shrink-0"
          >
            <option value="all">All 13 Categories</option>
            {INSTAGRAM_CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Label Filter */}
          <select
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shrink-0"
          >
            <option value="all">All Status Labels</option>
            <option value="priority">Priority</option>
            <option value="trusted">Trusted Source</option>
            <option value="needs_verification">Needs Verification</option>
            <option value="promotional">Promotional</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shrink-0"
          >
            <option value="score">Sort: Usefulness Score</option>
            <option value="recent">Sort: Recently Added</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.length === 0 ? (
          <div className="col-span-full p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Instagram className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No accounts found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add your first Instagram financial educator or check your search filters.
            </p>
          </div>
        ) : (
          filteredAccounts.map((acc) => {
            const catMeta = INSTAGRAM_CATEGORIES.find((c) => c.key === acc.category);
            const labelBadge = getLabelBadge(acc.label);

            return (
              <div
                key={acc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-pink-500/20 shrink-0">
                        {acc.username.slice(1, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {acc.accountName}
                          </h3>
                        </div>
                        <a
                          href={acc.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>{acc.username}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Usefulness Score Pill */}
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-black text-xs">
                        {acc.usefulnessScore.overall}/100
                      </span>
                    </div>
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span>{catMeta?.label || acc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-0.5">
                      {acc.verificationStatus === 'verified_official' && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Official
                        </span>
                      )}
                      {acc.verificationStatus === 'independently_verified' && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {acc.verificationStatus === 'unverified' && (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{acc.postsAnalysedCount} posts</span>
                  </div>

                  {/* Description / Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {acc.description}
                  </p>

                  {/* Personal Notes if present */}
                  {acc.personalNotes && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      <strong>Note:</strong> {acc.personalNotes}
                    </div>
                  )}

                  {/* Label badge */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${labelBadge.color}`}>
                      {labelBadge.text}
                    </span>
                    {!acc.isMonitoring && (
                      <span className="text-[10px] text-slate-400 italic">
                        (Monitoring Paused)
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectAccount(acc)}
                    className="font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-1"
                  >
                    <span>View Expert Opinion</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenAnalyzePost(acc)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Analyze Post from this Account"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    </button>

                    <button
                      onClick={() => onToggleMonitoring(acc.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title={acc.isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
                    >
                      {acc.isMonitoring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>

                    <button
                      onClick={() => onEditAccount(acc)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Account"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteAccount(acc.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600"
                      title="Delete Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
