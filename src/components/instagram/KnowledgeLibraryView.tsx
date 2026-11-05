import React, { useState } from 'react';
import { SavedInsight, FinancialKnowledgeCategory } from '../../types';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Scale, 
  AlertTriangle, 
  Filter, 
  Check, 
  Edit3, 
  Trash2,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';

interface KnowledgeLibraryViewProps {
  insights: SavedInsight[];
  onToggleApproval: (id: string) => void;
  onDeleteInsight: (id: string) => void;
  onEditInsight: (insight: SavedInsight) => void;
}

export const KNOWLEDGE_CATEGORY_LABELS: Record<FinancialKnowledgeCategory, string> = {
  home_loan_negotiation: 'Home Loan Negotiation',
  lowest_interest_rate: 'Lowest Effective Interest Rate',
  hidden_bank_charges: 'Hidden Bank Charges',
  fee_waivers: 'Processing Fee Waivers',
  loan_foreclosure: 'Loan Foreclosure Rules',
  part_prepayment: 'Part-Prepayment Optimization',
  balance_transfer: 'Balance Transfer Economics',
  cibil_score: 'CIBIL & Bureau Repair',
  loan_eligibility: 'FOIR & Loan Eligibility',
  rbi_regulations: 'RBI Regulatory Mandates',
  borrower_protection: 'Borrower Legal Protection',
  insurance_conditions: 'Insurance Bundling Safeguards',
  property_docs: 'Property Due Diligence & RERA',
  agreement_loopholes: 'Sanction Letter Loopholes',
  fraud_prevention: 'Banking Fraud Prevention',
  govt_benefits: 'Government Housing Benefits',
};

export const KnowledgeLibraryView: React.FC<KnowledgeLibraryViewProps> = ({
  insights,
  onToggleApproval,
  onDeleteInsight,
  onEditInsight,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState<string>('');

  const activeApprovedCount = insights.filter((i) => i.approvedForLoanAdvisor).length;

  const filteredInsights = insights.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchFact = item.verifiedFact.toLowerCase().includes(q);
      const matchAccount = item.sourceAccount.toLowerCase().includes(q);
      const matchClaim = item.originalClaim.toLowerCase().includes(q);
      if (!matchTitle && !matchFact && !matchAccount && !matchClaim) return false;
    }
    return true;
  });

  const handleStartEdit = (insight: SavedInsight) => {
    setEditingId(insight.id);
    setEditedNotes(insight.userNotes || '');
  };

  const handleSaveNotes = (insight: SavedInsight) => {
    onEditInsight({
      ...insight,
      userNotes: editedNotes,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white border border-emerald-900/60 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Loan Intelligence Knowledge Repository
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300">{insights.length} Extracted Insights</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
              Verified Financial Intelligence Library
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Every verified insight here is linked to its originating Instagram expert source and statutory RBI or Tax laws. Approved insights are automatically made accessible to your AI Loan Advisor!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/50 flex items-center gap-3 shrink-0">
            <BookmarkCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">
                {activeApprovedCount} of {insights.length} Active in AI Memory
              </span>
              <span className="text-[10px] text-emerald-300">
                Live in Ask LoanGuru Advisor Context
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified knowledge by topic, claim, or source account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shrink-0"
        >
          <option value="all">All 16 Knowledge Topics</option>
          {Object.entries(KNOWLEDGE_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Knowledge Cards */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No insights in this category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Analyze new posts or select a different knowledge category above.
            </p>
          </div>
        ) : (
          filteredInsights.map((item) => {
            const isApproved = item.approvedForLoanAdvisor;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
                  isApproved
                    ? 'border-emerald-300/80 dark:border-emerald-900/60 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                    </div>

                    {/* Clean unboxed metadata */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-pink-600 dark:text-pink-400">
                        {item.sourceAccount}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{KNOWLEDGE_CATEGORY_LABELS[item.category] || item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Verified {item.createdAt}</span>
                    </div>
                  </div>

                  {/* Advisor Approval Toggle */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => onToggleApproval(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active in AI Advisor</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Excluded from AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Edit Notes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteInsight(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600"
                      title="Delete Insight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Side-by-Side Claim vs Verified Fact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Original Creator Claim */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Creator's Original Claim ({item.sourceAccount})
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed">
                      "{item.originalClaim}"
                    </p>
                  </div>

                  {/* Independently Verified Fact */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/60 dark:border-emerald-800/60 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Independently Verified Regulatory Fact
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed font-medium">
                      {item.verifiedFact}
                    </p>
                  </div>
                </div>

                {/* Loan Implications & Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">
                      Loan Decision Implication
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {item.loanImplication}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                      Overlooked Opportunity
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {item.overlookedOpportunity}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                      Potential Risk / Trap
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {item.potentialRisk}
                    </p>
                  </div>
                </div>

                {/* User Notes or Edit Form */}
                {isEditing ? (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Edit User Notes & Loan Advisor Instructions:
                    </label>
                    <textarea
                      rows={2}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item)}
                        className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : item.userNotes ? (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>
                      <strong className="text-slate-900 dark:text-white">Your Notes:</strong> {item.userNotes}
                    </span>
                  </div>
                ) : null}

                {/* Sources */}
                {item.verifiedSources && item.verifiedSources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span>Grounded Citations:</span>
                    {item.verifiedSources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
