import React, { useState } from 'react';
import { Language, UserLoanInput } from '../types';
import { translations } from '../translations';
import { calculateRentVsBuy, RentVsBuyInput } from '../utils/indiaAdvisorMath';
import { formatINR } from '../utils/loanCalculations';
import { 
  Building, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  HelpCircle, 
  ArrowRight,
  Home,
  Briefcase
} from 'lucide-react';

interface RentVsBuyProps {
  input: UserLoanInput;
  currentLang: Language;
}

export const RentVsBuyEngine: React.FC<RentVsBuyProps> = ({
  input,
  currentLang,
}) => {
  const t = translations[currentLang];

  // Default values based on user's current loan profile
  const defaultPropertyPrice = input.propertyValue || (input.amount > 0 ? Math.round(input.amount * 1.25) : 7500000);
  const defaultRent = Math.round(defaultPropertyPrice * 0.0035); // standard Indian 3.5% rental yield

  const [propertyPrice, setPropertyPrice] = useState<number>(defaultPropertyPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [monthlyRent, setMonthlyRent] = useState<number>(defaultRent);
  const [rentEscalation, setRentEscalation] = useState<number>(6); // 6% annual rent hike in Indian cities
  const [propertyAppreciation, setPropertyAppreciation] = useState<number>(6); // 6% real estate CAGR
  const [sipReturn, setSipReturn] = useState<number>(12); // 12% Nifty 50 equity CAGR
  const [maintenance, setMaintenance] = useState<number>(3500);

  const analysis = calculateRentVsBuy({
    propertyPrice,
    downPaymentPercent: downPaymentPct,
    loanInterestRate: input.interestRate || 8.4,
    loanTenureYears: input.tenureYears || 20,
    monthlyRent,
    annualRentIncreasePercent: rentEscalation,
    propertyAppreciationPercent: propertyAppreciation,
    monthlyMaintenance: maintenance,
    sipReturnPercent: sipReturn,
    taxBracketPercent: 30,
  });

  const finalYear = analysis.yearlyTrajectory[analysis.yearlyTrajectory.length - 1];
  const year10 = analysis.yearlyTrajectory[9] || finalYear;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Indian "Rent vs. Buy" Wealth Decision Engine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Indian Real Estate vs SIP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mathematically compares buying a house with a 20-year EMI vs. renting and investing the down payment + monthly difference into Nifty 50 Equity SIPs.
            </p>
          </div>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Target Property Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
            <input
              type="number"
              value={propertyPrice}
              step={100000}
              onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
              className="w-full pl-6 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Down payment (20%): {formatINR((propertyPrice * downPaymentPct) / 100)}
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Equivalent Monthly Rent
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
            <input
              type="number"
              value={monthlyRent}
              step={1000}
              onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
              className="w-full pl-6 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Annual rent hike: {rentEscalation}%
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Property Appreciation (CAGR)
          </label>
          <input
            type="number"
            step={0.5}
            value={propertyAppreciation}
            onChange={(e) => setPropertyAppreciation(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Indian metro avg: 5%–7%
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Equity Mutual Fund SIP (CAGR)
          </label>
          <input
            type="number"
            step={0.5}
            value={sipReturn}
            onChange={(e) => setSipReturn(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Nifty 50 historical 15-yr avg: 12%
          </span>
        </div>
      </div>

      {/* Monthly Outflow Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-600" />
            Option A: Buy Property
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatINR(analysis.monthlyEmi + maintenance)} <span className="text-xs text-slate-400 font-normal">/ month (EMI + Maint)</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Initial cash required: {formatINR(analysis.initialDownPayment + propertyPrice * 0.06)} (Down Payment + Stamp Duty)
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Option B: Rent & SIP The Difference
          </span>
          <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatINR(monthlyRent)} <span className="text-xs text-slate-400 font-normal">/ month Rent</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Saves {formatINR((analysis.monthlyEmi + maintenance) - monthlyRent)} / month invested directly into 12% Equity SIP
          </span>
        </div>
      </div>

      {/* Year-by-Year Wealth Trajectory Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Net Worth Comparison Over Time (Property Equity vs. Mutual Fund SIP)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 5 Years */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>After 5 Years</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                analysis.year5Verdict.winner === 'buy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
              }`}>
                {analysis.year5Verdict.winner === 'buy' ? 'Buying Leads' : 'Renting Leads'}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer Net Equity:</span>
                <strong className="text-slate-900 dark:text-white">{formatINR(analysis.yearlyTrajectory[4]?.homeBuyerNetWorth || 0)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renter SIP Corpus:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{formatINR(analysis.yearlyTrajectory[4]?.renterNetWorth || 0)}</strong>
              </div>
            </div>
          </div>

          {/* 10 Years */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>After 10 Years</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                analysis.year10Verdict.winner === 'buy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
              }`}>
                {analysis.year10Verdict.winner === 'buy' ? 'Buying Leads' : 'Renting Leads'}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer Net Equity:</span>
                <strong className="text-slate-900 dark:text-white">{formatINR(year10.homeBuyerNetWorth)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renter SIP Corpus:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{formatINR(year10.renterNetWorth)}</strong>
              </div>
            </div>
          </div>

          {/* 20 Years */}
          <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>After 20 Years (Full Term)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                Loan Fully Paid!
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">House Market Value:</span>
                <strong className="text-emerald-700 dark:text-emerald-400">{formatINR(finalYear.propertyValue)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renter SIP Corpus:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{formatINR(finalYear.renterNetWorth)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Advisor Verdict */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-2 border border-indigo-800/40 text-xs">
        <h5 className="font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
          Financial Advisor Verdict for Your City:
        </h5>
        <p className="text-slate-200 leading-relaxed">
          {finalYear.propertyValue > finalYear.renterNetWorth
            ? `Buying this ₹${(propertyPrice / 100000).toFixed(0)} Lakh property creates higher net wealth in the long run (${formatINR(finalYear.propertyValue)} house value vs ${formatINR(finalYear.renterNetWorth)} in SIP), plus provides emotional security and rental inflation immunity.`
            : `Renting and strictly investing the ₹${formatINR((analysis.monthlyEmi + maintenance) - monthlyRent)} monthly difference into a 12% Nifty 50 Index Fund generates ${formatINR(finalYear.renterNetWorth - finalYear.propertyValue)} more wealth than buying, because Indian residential rental yields are low (3.5%) relative to equity compounding.`}
        </p>
        <span className="text-[10px] text-slate-400 block pt-1">
          *Also factors in ₹{formatINR(analysis.totalTaxSavedOverTenure)} saved in income tax deductions under Section 24(b) & 80C over 20 years.
        </span>
      </div>
    </div>
  );
};
