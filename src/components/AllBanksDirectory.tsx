import React, { useState, useMemo } from 'react';
import { LoanType, Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { ALL_INDIAN_BANKS, BankDetail } from '../data/bankDetails';
import { calculateMonthlyEmi, formatINR } from '../utils/loanCalculations';
import { 
  Building2, 
  Search, 
  ArrowUpDown, 
  ExternalLink, 
  Phone, 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';

interface AllBanksDirectoryProps {
  input: UserLoanInput;
  currentLang: Language;
  onApplyBankRate: (bankName: string, rate: number) => void;
}

export const AllBanksDirectory: React.FC<AllBanksDirectoryProps> = ({
  input,
  currentLang,
  onApplyBankRate,
}) => {
  const t = translations[currentLang];

  // Filters state
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>(input.loanType);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'psu' | 'private' | 'nbfc_hfc'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rate_asc' | 'cibil_asc' | 'name'>('rate_asc');
  const [selectedBankModal, setSelectedBankModal] = useState<BankDetail | null>(null);

  // Sync with parent loan type if changed
  React.useEffect(() => {
    setSelectedLoanType(input.loanType);
  }, [input.loanType]);

  // Filter and sort banks
  const filteredBanks = useMemo(() => {
    return ALL_INDIAN_BANKS.filter((bank) => {
      // 1. Must offer the selected loan type
      const hasRate = bank.rates[selectedLoanType] !== undefined;
      if (!hasRate) return false;

      // 2. Category filter
      if (selectedCategory === 'psu' && bank.type !== 'psu') return false;
      if (selectedCategory === 'private' && bank.type !== 'private') return false;
      if (selectedCategory === 'nbfc_hfc' && (bank.type !== 'nbfc' && bank.type !== 'hfc')) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = bank.name.toLowerCase().includes(q) || bank.shortName.toLowerCase().includes(q);
        const matchesCategory = bank.categoryLabel.toLowerCase().includes(q);
        return matchesName || matchesCategory;
      }

      return true;
    }).sort((a, b) => {
      const rateA = a.rates[selectedLoanType]?.minRate || 99;
      const rateB = b.rates[selectedLoanType]?.minRate || 99;

      if (sortBy === 'rate_asc') {
        return rateA - rateB;
      }
      if (sortBy === 'cibil_asc') {
        return a.minCibil - b.minCibil;
      }
      return a.name.localeCompare(b.name);
    });
  }, [selectedLoanType, selectedCategory, searchQuery, sortBy]);

  const tenureMonths = input.tenureUnit === 'years' ? (input.tenureYears || 20) * 12 : (input.tenureMonths || 240);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>All Indian Banks & Interest Rates Directory</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {filteredBanks.length} Lenders Listed
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official verified rates, EBLR spreads, processing fee caps & concessions across public, private banks and NBFCs.
              </p>
            </div>
          </div>

          {/* Current Calculation Context Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs self-start md:self-auto">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">EMIs Calculated For:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatINR(input.amount)} • {input.tenureUnit === 'years' ? `${input.tenureYears} Yrs` : `${input.tenureMonths} Mos`}
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Loan Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              Loan Type
            </label>
            <select
              value={selectedLoanType}
              onChange={(e) => setSelectedLoanType(e.target.value as LoanType)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="home">Home Loan (Housing Finance)</option>
              <option value="car">Car Loan (Auto Loan)</option>
              <option value="lap">Property Loan (LAP / Mortgage)</option>
              <option value="gold">Gold Loan (Jewel Loan)</option>
              <option value="education">Education Loan (Student Finance)</option>
              <option value="personal">Personal Loan (Instant Cash)</option>
              <option value="business">Business Loan (SME / Mudra)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              Institution Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Lenders (PSU + Private + NBFC)</option>
              <option value="psu">Public Sector (SBI, BoB, PNB, Canara, Union)</option>
              <option value="private">Private Banks (HDFC, ICICI, Axis, Kotak, IDFC)</option>
              <option value="nbfc_hfc">NBFCs & HFCs (LIC HFL, Bajaj, Muthoot, Manappuram)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              Search Bank Name
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SBI, HDFC, Muthoot..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="rate_asc">Lowest Interest Rate First</option>
              <option value="cibil_asc">Lowest CIBIL Requirement</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBanks.map((bank) => {
          const rateInfo = bank.rates[selectedLoanType];
          if (!rateInfo) return null;

          const minEmi = calculateMonthlyEmi(input.amount, rateInfo.minRate, tenureMonths);
          const maxEmi = calculateMonthlyEmi(input.amount, rateInfo.maxRate, tenureMonths);
          const isPsu = bank.type === 'psu';
          const isPrivate = bank.type === 'private';

          return (
            <div
              key={bank.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Card Top: Bank Name & Category */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-xs ${
                        isPsu
                          ? 'bg-blue-600'
                          : isPrivate
                          ? 'bg-indigo-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {bank.shortName.substring(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {bank.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {bank.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isPsu
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : isPrivate
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {bank.type.toUpperCase()}
                  </span>
                </div>

                {/* Interest Rate & EMI Display */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Interest Rate (p.a.)
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {rateInfo.minRate}% – {rateInfo.maxRate}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated EMI:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatINR(minEmi)} <span className="text-[10px] font-normal text-slate-400">/ mo</span>
                    </span>
                  </div>

                  <span className="text-[9px] text-slate-400 block pt-0.5 truncate">
                    {rateInfo.spreadInfo}
                  </span>
                </div>

                {/* Processing Fee & Concessions */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-[11px] font-medium text-slate-400 shrink-0">Processing Fee:</span>
                    <span className="font-semibold text-right text-slate-800 dark:text-slate-200 text-[11px]">
                      {bank.processingFees[selectedLoanType] || '0.50% + GST'}
                    </span>
                  </div>

                  {bank.womanConcession && (
                    <div className="flex items-center gap-1.5 text-[10px] text-pink-700 dark:text-pink-300 font-semibold bg-pink-50 dark:bg-pink-950/40 px-2 py-1 rounded-md">
                      <span>♀</span>
                      <span>{bank.womanConcession}</span>
                    </div>
                  )}

                  {bank.specialOffer && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{bank.specialOffer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Apply this rate to user's calculator */}
                  <button
                    onClick={() => onApplyBankRate(bank.name, rateInfo.minRate)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>Use {rateInfo.minRate}%</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* View Full Details Button */}
                  <button
                    onClick={() => setSelectedBankModal(bank)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                    title="View all loan rates & details"
                  >
                    Details
                  </button>

                  {/* Direct Bank Portal Link */}
                  <a
                    href={bank.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
                    title="Open official bank website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Modal for Selected Bank */}
      {selectedBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {selectedBankModal.shortName.substring(0, 3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedBankModal.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedBankModal.categoryLabel} • Helpline: {selectedBankModal.helpline}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBankModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* All Loan Rates Table for This Bank */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Complete Interest Rate Schedule by Loan Category
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Loan Type</th>
                        <th className="py-2.5 px-3">Interest Rate</th>
                        <th className="py-2.5 px-3">Processing Fee</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(Object.keys(selectedBankModal.rates) as LoanType[]).map((type) => {
                        const r = selectedBankModal.rates[type];
                        if (!r) return null;
                        const pf = selectedBankModal.processingFees[type] || 'Standard fee';

                        return (
                          <tr key={type} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white capitalize">
                              {t.loanTypes[type] || type}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                              {r.minRate}% – {r.maxRate}%
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                              {pf}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  onApplyBankRate(selectedBankModal.name, r.minRate);
                                  setSelectedBankModal(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                Calculate
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Highlights & Rules */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Features & Bank Rules
                </h4>
                <div className="space-y-1.5">
                  {selectedBankModal.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foreclosure Policy */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Foreclosure & Prepayment Penalty Policy
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedBankModal.foreclosureFloating}
                </p>
              </div>

              {/* Official Link */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Official Phone: <strong>{selectedBankModal.helpline}</strong>
                </span>
                <a
                  href={selectedBankModal.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  <span>Visit {selectedBankModal.shortName} Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
