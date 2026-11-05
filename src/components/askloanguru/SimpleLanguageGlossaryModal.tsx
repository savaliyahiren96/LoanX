import React, { useState } from 'react';
import { BEGINNER_FINANCIAL_GLOSSARY } from '../../data/askLoanGuruData';
import { SimpleTermDefinition } from '../../types';
import { BookOpen, Search, X, CheckCircle, IndianRupee, HelpCircle } from 'lucide-react';

interface SimpleLanguageGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

export const SimpleLanguageGlossaryModal: React.FC<SimpleLanguageGlossaryModalProps> = ({
  isOpen,
  onClose,
  onSelectTerm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    'all',
    'Loan Basics',
    'Interest & Pricing',
    'Repayment',
    'Fees & Charges',
    'Credit',
    'RBI Rules',
    'Traps to Avoid',
  ];

  const filteredTerms = BEGINNER_FINANCIAL_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Explain in Simple Language – Financial Glossary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complex Indian banking terms explained with everyday examples & ₹ rupees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search banking terms (e.g. Prepayment, Foreclosure, EBLR, KFS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Terms' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No matching financial terms found.</p>
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-400/50 dark:hover:border-emerald-600/50 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {item.term}
                  </h4>
                  {item.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                  {item.simpleExplanation}
                </p>

                {item.rupeeExample && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Practical Example:</strong> {item.rupeeExample}
                    </span>
                  </div>
                )}

                {onSelectTerm && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectTerm(item.term);
                        onClose();
                      }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Ask AI about this term &rarr;
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Rule: Never feel embarrassed to ask basic questions. Banking is designed to confuse.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
