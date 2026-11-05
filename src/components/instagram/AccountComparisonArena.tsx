import React, { useState } from 'react';
import { InstagramAccount } from '../../types';
import { INSTAGRAM_CATEGORIES } from '../../data/instagramInitialData';
import { 
  Scale, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Landmark, 
  Receipt,
  FileCheck2,
  Users
} from 'lucide-react';

interface AccountComparisonArenaProps {
  accounts: InstagramAccount[];
}

export const AccountComparisonArena: React.FC<AccountComparisonArenaProps> = ({ accounts }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Default select first 2 or 3 accounts
    return accounts.slice(0, 3).map((a) => a.id);
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      } else {
        alert('Please keep at least 2 accounts selected for comparison.');
      }
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare up to 4 accounts simultaneously.');
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedAccounts = accounts.filter((a) => selectedIds.includes(a.id));

  // Determine evidence-based recommendations
  const bestForRegulations = [...accounts].sort((a, b) => b.usefulnessScore.regulatoryAwareness - a.usefulnessScore.regulatoryAwareness)[0];
  const bestForNegotiation = [...accounts].sort((a, b) => b.usefulnessScore.practicalUsefulness - a.usefulnessScore.practicalUsefulness)[0];
  const bestForTaxation = accounts.find((a) => a.category === 'chartered_accountants' || a.category === 'taxation_experts') || accounts[0];
  const bestForHiddenCharges = [...accounts].sort((a, b) => b.usefulnessScore.accuracySources - a.usefulnessScore.accuracySources)[0];
  const bestForHomeLoans = accounts.find((a) => a.category === 'home_loan_specialists' || a.category === 'banking_loan_experts') || accounts[0];
  const bestForConsumerRights = accounts.find((a) => a.category === 'consumer_rights_legal') || accounts[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
            Account Comparison Dashboard
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-300">Evidence-Based Evaluation</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
          Compare Financial Expert Profiles Side-by-Side
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Compare credibility, regulatory accuracy, promotional bias, and practical value. Recommendations are grounded in evaluated evidence rather than vanity follower counts.
        </p>

        {/* Account Selector Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Select Accounts (2-4):</span>
          {accounts.map((acc) => {
            const isSelected = selectedIds.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggleSelect(acc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-400/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {acc.username}
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence-Based Category Recommendations */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Independent Category Leaders (Based on Evaluated Audit)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { title: 'Best for Banking Regulations', icon: Landmark, account: bestForRegulations, reason: 'Statutory citations and EBLR rules' },
            { title: 'Best for Loan Negotiation', icon: TrendingUp, account: bestForNegotiation, reason: 'Actionable scripts & fee waiver tactics' },
            { title: 'Best for Home Loan Taxation', icon: Receipt, account: bestForTaxation, reason: 'ICAI-compliant 24(b) & 80C math' },
            { title: 'Best for Hidden Bank Charges', icon: Scale, account: bestForHiddenCharges, reason: 'Exposing unbundled insurance & KFS gaps' },
            { title: 'Best for Home Loan Knowledge', icon: Building2, account: bestForHomeLoans, reason: 'Sanction letter conditions & eligibility' },
            { title: 'Best for Consumer Protection', icon: ShieldCheck, account: bestForConsumerRights, reason: 'SARFAESI Act & Banking Ombudsman remedies' },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {card.title}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                  {card.account?.username || 'Verified Expert'}
                </strong>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {card.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 w-1/4">
                Evaluation Parameter
              </th>
              {comparedAccounts.map((acc) => (
                <th key={acc.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white text-center">
                  <span className="block">{acc.accountName}</span>
                  <span className="text-[11px] font-normal text-pink-600 dark:text-pink-400">{acc.username}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Overall Score */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Financial Usefulness Score
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center">
                  <span className="font-black text-sm text-pink-600 dark:text-pink-400">
                    {acc.usefulnessScore.overall}/100
                  </span>
                </td>
              ))}
            </tr>

            {/* Operator Credibility */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Operator Identity
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 text-[11px]">
                  {acc.credibility.operatorIdentity}
                </td>
              ))}
            </tr>

            {/* Verifiable Qualifications */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Verifiable Qualifications
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 text-[11px]">
                  {acc.credibility.verifiableQualifications}
                </td>
              ))}
            </tr>

            {/* Accuracy & Citations (30%) */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Accuracy & Source Quality
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                  {acc.usefulnessScore.accuracySources}/100
                </td>
              ))}
            </tr>

            {/* Borrower Relevance (25%) */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Indian Borrower Relevance
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                  {acc.usefulnessScore.relevanceToBorrowers}/100
                </td>
              ))}
            </tr>

            {/* Practical Value (20%) */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Practical Negotiation Value
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                  {acc.usefulnessScore.practicalUsefulness}/100
                </td>
              ))}
            </tr>

            {/* Regulatory Awareness (15%) */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Regulatory Awareness
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                  {acc.usefulnessScore.regulatoryAwareness}/100
                </td>
              ))}
            </tr>

            {/* Promotional Bias & Conflicts */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Commercial Bias & Conflicts
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 text-[11px]">
                  {acc.credibility.potentialConflicts}
                </td>
              ))}
            </tr>

            {/* Top Recommended Focus */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                What to Extract from This Account
              </td>
              {comparedAccounts.map((acc) => (
                <td key={acc.id} className="py-3 px-4 text-center text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {acc.expertOpinion.loanInformationToExtract}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
