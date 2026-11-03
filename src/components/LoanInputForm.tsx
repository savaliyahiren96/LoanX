import React from 'react';
import { UserLoanInput, Language, LoanType } from '../types';
import { translations } from '../translations';
import { INDIAN_STATES, formatINR, calculateEffectiveInterestRate } from '../utils/loanCalculations';
import { 
  Building2, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  BadgePercent,
  Coins,
  CheckCircle2
} from 'lucide-react';

interface LoanInputFormProps {
  input: UserLoanInput;
  onChange: (updated: Partial<UserLoanInput>) => void;
  currentLang: Language;
}

export const LoanInputForm: React.FC<LoanInputFormProps> = ({
  input,
  onChange,
  currentLang,
}) => {
  const t = translations[currentLang];
  const effectiveRate = calculateEffectiveInterestRate(input);

  // Quick preset amounts based on loan type
  const getPresetAmounts = () => {
    switch (input.loanType) {
      case 'home':
      case 'lap':
        return [2500000, 5000000, 7500000, 10000000, 15000000];
      case 'car':
        return [500000, 800000, 1200000, 1800000, 2500000];
      case 'gold':
        return [100000, 250000, 500000, 1000000, 2000000];
      case 'education':
        return [500000, 1000000, 2000000, 4000000, 7500000];
      default:
        return [200000, 500000, 1000000, 1500000, 2500000];
    }
  };

  const getMaxAmount = () => {
    switch (input.loanType) {
      case 'home':
      case 'lap':
        return 30000000; // 3 Cr
      case 'car':
        return 6000000; // 60 Lakh
      case 'gold':
        return 5000000; // 50 Lakh
      case 'education':
        return 15000000; // 1.5 Cr
      default:
        return 5000000;
    }
  };

  const getMaxTenureYears = () => {
    switch (input.loanType) {
      case 'home':
        return 30;
      case 'lap':
        return 15;
      case 'car':
        return 7;
      case 'gold':
        return 3;
      case 'education':
        return 15;
      case 'personal':
        return 5;
      case 'business':
        return 7;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header of Form */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.loanDetails}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
              {t.loanTypes[input.loanType]}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust loan parameters to see instant EMI, eligibility, and hidden cost calculations.
          </p>
        </div>

        {/* Calculated Effective Rate indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none">
              Applied Rate
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {effectiveRate}% p.a.
            </span>
          </div>
        </div>
      </div>

      {/* 1. Loan Amount */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            {t.loanAmount}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              value={input.amount || ''}
              min={10000}
              max={getMaxAmount()}
              step={25000}
              onChange={(e) => onChange({ amount: Number(e.target.value) || 0 })}
              className="w-40 sm:w-48 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>

        <input
          type="range"
          min={50000}
          max={getMaxAmount()}
          step={50000}
          value={input.amount}
          onChange={(e) => onChange({ amount: Number(e.target.value) })}
          className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />

        {/* Quick Amount Pills */}
        <div className="flex flex-wrap gap-1.5">
          {getPresetAmounts().map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onChange({ amount: amt })}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                input.amount === amt
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {formatINR(amt)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tenure (Years or Months) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.tenure}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={input.tenureUnit === 'years' ? input.tenureYears : input.tenureMonths}
              min={1}
              max={input.tenureUnit === 'years' ? getMaxTenureYears() : getMaxTenureYears() * 12}
              onChange={(e) => {
                const val = Number(e.target.value) || 1;
                if (input.tenureUnit === 'years') {
                  onChange({ tenureYears: val, tenureMonths: val * 12 });
                } else {
                  onChange({ tenureMonths: val, tenureYears: Number((val / 12).toFixed(1)) });
                }
              }}
              className="w-20 text-right font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                type="button"
                onClick={() => onChange({ tenureUnit: 'years' })}
                className={`px-2 py-1 rounded font-medium ${
                  input.tenureUnit === 'years'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.years}
              </button>
              <button
                type="button"
                onClick={() => onChange({ tenureUnit: 'months' })}
                className={`px-2 py-1 rounded font-medium ${
                  input.tenureUnit === 'months'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.months}
              </button>
            </div>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={input.tenureUnit === 'years' ? getMaxTenureYears() : getMaxTenureYears() * 12}
          value={input.tenureUnit === 'years' ? input.tenureYears : input.tenureMonths}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (input.tenureUnit === 'years') {
              onChange({ tenureYears: val, tenureMonths: val * 12 });
            } else {
              onChange({ tenureMonths: val, tenureYears: Math.max(1, Math.round(val / 12)) });
            }
          }}
          className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
      </div>

      {/* 3. Interest Rate (Optional / Custom) */}
      <div className="space-y-2 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.interestRate}
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.marketRateNote}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step={0.05}
              min={5}
              max={28}
              placeholder={`${effectiveRate}`}
              value={input.isCustomRate ? input.interestRate : ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isNaN(val) || val === 0) {
                  onChange({ isCustomRate: false, interestRate: 0 });
                } else {
                  onChange({ isCustomRate: true, interestRate: val });
                }
              }}
              className="w-24 text-right font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
        </div>
        {input.isCustomRate && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onChange({ isCustomRate: false, interestRate: 0 })}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Reset to Market Rate
            </button>
          </div>
        )}
      </div>

      {/* 4. Loan-Specific Dynamic Sections */}
      {/* HOME / LAP PROPERTY DETAILS */}
      {(input.loanType === 'home' || input.loanType === 'lap') && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.propertyDetails}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.propertyValue}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  value={input.propertyValue || Math.round(input.amount * 1.25)}
                  step={50000}
                  onChange={(e) => onChange({ propertyValue: Number(e.target.value) || 0 })}
                  className="w-full pl-6 pr-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.propertyType}
              </label>
              <select
                value={input.isNewProperty ? 'new' : 'resale'}
                onChange={(e) => onChange({ isNewProperty: e.target.value === 'new' })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="new">{t.newProperty}</option>
                <option value="resale">{t.resaleProperty}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.urbanRural}
              </label>
              <select
                value={input.isUrban ? 'urban' : 'rural'}
                onChange={(e) => onChange({ isUrban: e.target.value === 'urban' })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="urban">{t.urban}</option>
                <option value="rural">{t.rural}</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.isCoApplicant || false}
                  onChange={(e) => onChange({ isCoApplicant: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {t.coApplicant}
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* CAR LOAN SPECIFIC */}
      {input.loanType === 'car' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.carDetails}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.carCondition}
              </label>
              <select
                value={input.isNewCar ? 'new' : 'used'}
                onChange={(e) => onChange({ isNewCar: e.target.value === 'new' })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="new">{t.newCar}</option>
                <option value="used">{t.usedCar}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.fuelType}
              </label>
              <select
                value={input.fuelType || 'petrol_diesel'}
                onChange={(e) => onChange({ fuelType: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="petrol_diesel">{t.petrolDiesel}</option>
                <option value="ev">{t.ev}</option>
                <option value="cng">{t.cng}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* GOLD LOAN SPECIFIC */}
      {input.loanType === 'gold' && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              {t.goldDetails}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              RBI Limit: 75% LTV
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.goldWeight}
              </label>
              <input
                type="number"
                value={input.goldWeightGrams || 50}
                min={1}
                max={5000}
                onChange={(e) => onChange({ goldWeightGrams: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.goldPurity}
              </label>
              <select
                value={input.goldPurity || '22k'}
                onChange={(e) => onChange({ goldPurity: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="24k">24 Karat (99.9% pure)</option>
                <option value="22k">22 Karat (91.6% standard jewelry)</option>
                <option value="18k">18 Karat (75.0% diamond jewelry)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.goldRate}
              </label>
              <input
                type="number"
                value={input.goldRatePerGram || 7650}
                step={50}
                onChange={(e) => onChange({ goldRatePerGram: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.lenderType}
              </label>
              <select
                value={input.lenderType || 'psu_bank'}
                onChange={(e) => onChange({ lenderType: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="psu_bank">{t.psuBank}</option>
                <option value="private_bank">{t.privateBank}</option>
                <option value="nbfc">{t.nbfc}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                {t.repaymentScheme}
              </label>
              <select
                value={input.repaymentType || 'monthly_interest'}
                onChange={(e) => onChange({ repaymentType: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="monthly_interest">{t.monthlyInterest}</option>
                <option value="bullet_repayment">{t.bulletRepayment}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. Applicant Profile & FOIR Eligibility Inputs */}
      <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          {t.applicantProfile}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Monthly Income */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.monthlyIncome}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
              <input
                type="number"
                value={input.monthlyIncome || ''}
                step={5000}
                min={15000}
                onChange={(e) => onChange({ monthlyIncome: Number(e.target.value) || 0 })}
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Existing EMIs */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.existingEmis}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
              <input
                type="number"
                value={input.existingEmis || 0}
                step={1000}
                min={0}
                onChange={(e) => onChange({ existingEmis: Number(e.target.value) || 0 })}
                className="w-full pl-6 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.employmentType}
            </label>
            <select
              value={input.employmentType}
              onChange={(e) => onChange({ employmentType: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="salaried">{t.salaried}</option>
              <option value="self_employed">{t.selfEmployed}</option>
              <option value="business">{t.business}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* CIBIL Score */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.cibilScore}
            </label>
            <select
              value={input.cibilScore}
              onChange={(e) => onChange({ cibilScore: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="750_plus">750+ (Excellent - Lowest Interest)</option>
              <option value="700_749">700 - 749 (Good - Standard Rates)</option>
              <option value="650_699">650 - 699 (Fair - +0.75% Higher)</option>
              <option value="below_650">Below 650 (Poor - High Risk)</option>
            </select>
          </div>

          {/* State Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.state}
            </label>
            <select
              value={input.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Social Category for Schemes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              {t.socialCategory}
            </label>
            <select
              value={input.category}
              onChange={(e) => onChange({ category: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="general">{t.general}</option>
              <option value="obc">{t.obc}</option>
              <option value="sc">{t.sc}</option>
              <option value="st">{t.st}</option>
              <option value="ews">{t.ews}</option>
            </select>
          </div>
        </div>

        {/* Demographics / Concessions Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isWomanApplicant}
              onChange={(e) => onChange({ isWomanApplicant: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {t.womanApplicant}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isFirstTimeBuyer}
              onChange={(e) => onChange({ isFirstTimeBuyer: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {t.firstTimeBuyer}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isFarmer}
              onChange={(e) => onChange({ isFarmer: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {t.farmerCategory}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={input.isGovtOrDefence}
              onChange={(e) => onChange({ isGovtOrDefence: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {t.govtDefence}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
