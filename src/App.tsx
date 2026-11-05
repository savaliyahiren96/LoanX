/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LoanType, 
  Language, 
  UserLoanInput, 
  EmiCalculationResult 
} from './types';
import { translations } from './translations';
import { calculateFullLoan, BASE_MARKET_RATES, formatINR } from './utils/loanCalculations';

// Components
import { Navbar } from './components/Navbar';
import { LoanTypeCards } from './components/LoanTypeCards';
import { LoanInputForm } from './components/LoanInputForm';
import { EmiSummaryCard } from './components/EmiSummaryCard';
import { AmortizationTable } from './components/AmortizationTable';
import { PrepaymentSimulator } from './components/PrepaymentSimulator';
import { BalanceTransferCalculator } from './components/BalanceTransferCalculator';
import { FixedVsFloating } from './components/FixedVsFloating';
import { GoldLoanSection } from './components/GoldLoanSection';
import { BankRatesSection } from './components/BankRatesSection';
import { GovernmentSchemesSection } from './components/GovernmentSchemesSection';
import { TaxBenefitsSection } from './components/TaxBenefitsSection';
import { HiddenTrapsSection } from './components/HiddenTrapsSection';
import { DocumentChecklistSection } from './components/DocumentChecklistSection';
import { AllBanksDirectory } from './components/AllBanksDirectory';
import { MaxGainSimulator } from './components/MaxGainSimulator';
import { RentVsBuyEngine } from './components/RentVsBuyEngine';
import { CibilRoadmapSection } from './components/CibilRoadmapSection';
import { GoldenWindowOptimizer } from './components/GoldenWindowOptimizer';
import { BankHeadToHeadArena } from './components/BankHeadToHeadArena';
import { LiveMarketTicker } from './components/LiveMarketTicker';
import { AskLoanGuruModal } from './components/AskLoanGuruModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { InstagramIntelligenceDashboard } from './components/instagram/InstagramIntelligenceDashboard';
import { AskLoanGuruDashboard } from './components/askloanguru/AskLoanGuruDashboard';
import { INITIAL_KNOWLEDGE_LIBRARY } from './data/instagramInitialData';
import { SavedInsight } from './types';

import { 
  Sparkles, 
  MessageSquare, 
  Calculator, 
  Percent, 
  Gift, 
  FileCheck2, 
  ShieldAlert, 
  FileText,
  Layers,
  ArrowRight,
  Instagram
} from 'lucide-react';

export default function App() {
  // 1. Language state
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // Instagram Intelligence Saved Knowledge Library state (persisted)
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>(() => {
    try {
      const saved = localStorage.getItem('loanguru_saved_insights');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('[App] Could not load saved insights:', e);
    }
    return INITIAL_KNOWLEDGE_LIBRARY;
  });

  const handleUpdateInsights = (insights: SavedInsight[]) => {
    setSavedInsights(insights);
    try {
      localStorage.setItem('loanguru_saved_insights', JSON.stringify(insights));
    } catch (e) {
      console.warn('[App] Error storing insights:', e);
    }
  };

  // 2. Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // 3. Active Section State
  const [activeSection, setActiveSection] = useState<string>('calculator');

  // 4. Chat modal state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Applied Bank rate notification toast
  const [appliedBankNotice, setAppliedBankNotice] = useState<string | null>(null);

  const handleApplyBankRate = (bankName: string, rate: number) => {
    setLoanInput((prev) => ({
      ...prev,
      isCustomRate: true,
      interestRate: rate,
    }));
    setAppliedBankNotice(`Applied ${bankName}'s rate of ${rate}% p.a. to your loan calculator!`);
    setActiveSection('calculator');
    setTimeout(() => {
      setAppliedBankNotice(null);
    }, 5000);
  };

  const handleSyncGoldRate = (ratePerGram: number) => {
    setLoanInput((prev) => ({
      ...prev,
      goldRatePerGram: ratePerGram,
    }));
  };

  // 5. Loan Input State (Adaptive)
  const [loanInput, setLoanInput] = useState<UserLoanInput>({
    loanType: 'home',
    amount: 5000000, // ₹50 Lakhs
    tenureYears: 20,
    tenureMonths: 240,
    tenureUnit: 'years',
    interestRate: 8.40,
    isCustomRate: false,

    age: 32,
    monthlyIncome: 125000,
    employmentType: 'salaried',
    cibilScore: '750_plus',
    existingEmis: 10000,
    state: 'Maharashtra',
    city: 'Mumbai',

    category: 'general',
    isWomanApplicant: false,
    isFirstTimeBuyer: true,
    isFarmer: false,
    isGovtOrDefence: false,

    propertyValue: 6500000,
    isNewProperty: true,
    isUrban: true,
    isCoApplicant: true,

    isNewCar: true,
    fuelType: 'petrol_diesel',
    onRoadPrice: 1500000,
    downPayment: 300000,

    goldWeightGrams: 50,
    goldPurity: '22k',
    goldRatePerGram: 7650,
    lenderType: 'psu_bank',
    repaymentType: 'monthly_interest',
  });

  const handleUpdateInput = (updated: Partial<UserLoanInput>) => {
    setLoanInput((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectLoanType = (type: LoanType) => {
    // Reset standard amounts/tenures when switching loan types
    let newAmount = loanInput.amount;
    let newTenureYears = loanInput.tenureYears;

    if (type === 'home' || type === 'lap') {
      newAmount = 5000000;
      newTenureYears = 20;
    } else if (type === 'car') {
      newAmount = 1000000;
      newTenureYears = 5;
    } else if (type === 'gold') {
      newAmount = 300000;
      newTenureYears = 1;
    } else if (type === 'education') {
      newAmount = 2500000;
      newTenureYears = 10;
    } else if (type === 'personal') {
      newAmount = 500000;
      newTenureYears = 3;
    } else if (type === 'business') {
      newAmount = 1500000;
      newTenureYears = 5;
    }

    setLoanInput((prev) => ({
      ...prev,
      loanType: type,
      amount: newAmount,
      tenureYears: newTenureYears,
      tenureMonths: newTenureYears * 12,
      isCustomRate: false,
      interestRate: BASE_MARKET_RATES[type] || 8.5,
    }));
  };

  // Instant loan calculation result
  const calculationResult: EmiCalculationResult = useMemo(() => {
    return calculateFullLoan(loanInput);
  }, [loanInput]);

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeLoanType={loanInput.loanType}
        onSelectLoanType={handleSelectLoanType}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenChat={() => setIsChatOpen(true)}
        activeSection={activeSection}
        onNavigateSection={setActiveSection}
      />

      {/* Real-Time Indian Market Pulse Ticker (RBI Repo, Live Gold Rates, 10Y Yield, CPI) */}
      <LiveMarketTicker
        currentLang={currentLang}
        onSyncGoldRate={handleSyncGoldRate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Printable Header (Visible only when printing) */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">LoanGuru India - Loan Analysis Report</h1>
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        {/* Home Screen Cards: Loan types & 3 key features */}
        <section className="no-print">
          <LoanTypeCards
            currentLang={currentLang}
            activeLoanType={loanInput.loanType}
            onSelectLoanType={handleSelectLoanType}
            onNavigateSection={setActiveSection}
          />
        </section>

        {/* Toast / Notification Banner if a bank rate was clicked */}
        {appliedBankNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-600 text-white flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg animate-in slide-in-from-top-2 duration-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              {appliedBankNotice}
            </span>
            <button
              onClick={() => setAppliedBankNotice(null)}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Navigation Pills (Quick In-page Jump) */}
        <div className="no-print flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSection('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'calculator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculator & Summary</span>
          </button>
          <button
            onClick={() => setActiveSection('rates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'rates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Compare Banks</span>
          </button>
          <button
            onClick={() => setActiveSection('advisor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'advisor'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Advisor Tools</span>
          </button>
          <button
            onClick={() => setActiveSection('schemes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'schemes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Schemes & Subsidies</span>
          </button>
          <button
            onClick={() => setActiveSection('tax')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'tax'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Tax & Legal</span>
          </button>
          <button
            onClick={() => setActiveSection('traps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'traps'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hidden Charges</span>
          </button>
          <button
            onClick={() => setActiveSection('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'documents'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents & Apply</span>
          </button>
          <button
            onClick={() => setActiveSection('instagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'instagram'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-xs'
                : 'text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 font-semibold'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram Intel</span>
          </button>
          <button
            onClick={() => setActiveSection('askloanguru')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              activeSection === 'askloanguru'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow-sm ring-2 ring-emerald-400/30'
                : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 font-bold border border-emerald-300/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AskLoanGuru AI</span>
          </button>
        </div>

        {/* SECTION 1: CALCULATOR & SUMMARY */}
        {activeSection === 'calculator' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Input Form & Instant EMI Card Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <LoanInputForm
                  input={loanInput}
                  onChange={handleUpdateInput}
                  currentLang={currentLang}
                />
              </div>

              <div className="lg:col-span-5">
                <EmiSummaryCard
                  calculation={calculationResult}
                  input={loanInput}
                  currentLang={currentLang}
                  onNavigateSection={setActiveSection}
                />
              </div>
            </div>

            {/* If Gold loan is chosen, render dedicated Gold Loan Section */}
            {loanInput.loanType === 'gold' && (
              <GoldLoanSection
                input={loanInput}
                currentLang={currentLang}
              />
            )}

            {/* Amortization Schedule & Chart */}
            <AmortizationTable
              yearlySchedule={calculationResult.yearlySchedule}
              monthlySchedule={calculationResult.monthlySchedule}
              currentLang={currentLang}
            />

            {/* Prepayment Simulator */}
            <PrepaymentSimulator
              input={loanInput}
              currentLang={currentLang}
            />

            {/* Fixed vs Floating Comparison */}
            <FixedVsFloating
              input={loanInput}
              currentLang={currentLang}
            />

            {/* Golden Window Prepayment Optimizer */}
            <GoldenWindowOptimizer
              input={loanInput}
              currentLang={currentLang}
            />

            {/* If Home loan, also render Home Loan Overdraft (SBI Maxgain) Simulator */}
            {loanInput.loanType === 'home' && (
              <MaxGainSimulator
                input={loanInput}
                currentLang={currentLang}
              />
            )}

            {/* Balance Transfer Calculator */}
            <BalanceTransferCalculator
              input={loanInput}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 2: COMPARE ALL BANKS & LIVE GROUNDED RATES */}
        {activeSection === 'rates' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Complete Indian Banks & NBFCs Directory */}
            <AllBanksDirectory
              input={loanInput}
              currentLang={currentLang}
              onApplyBankRate={handleApplyBankRate}
            />

            {/* Head-to-Head Bank Comparison Arena */}
            <BankHeadToHeadArena
              input={loanInput}
              currentLang={currentLang}
            />

            {/* Live Search Grounded Rate Verification */}
            <BankRatesSection
              input={loanInput}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION: EXPERT ADVISOR TOOLS */}
        {activeSection === 'advisor' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Indian Rent vs Buy Calculator */}
            <RentVsBuyEngine
              input={loanInput}
              currentLang={currentLang}
            />

            {/* 2. Home Loan Overdraft (MaxGain) Simulator */}
            <MaxGainSimulator
              input={loanInput}
              currentLang={currentLang}
            />

            {/* 3. CIBIL Score Penalty Meter & 60-Day Recovery Blueprint */}
            <CibilRoadmapSection
              input={loanInput}
              currentLang={currentLang}
            />

            {/* 4. Golden Window Prepayment Timing */}
            <GoldenWindowOptimizer
              input={loanInput}
              currentLang={currentLang}
            />

            {/* 5. Head-to-Head Sanction Letter Arena */}
            <BankHeadToHeadArena
              input={loanInput}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 3: SCHEMES & SUBSIDIES (Grounded AI) */}
        {activeSection === 'schemes' && (
          <div className="animate-in fade-in duration-300">
            <GovernmentSchemesSection
              input={loanInput}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 4: TAX & LEGAL BENEFITS */}
        {activeSection === 'tax' && (
          <div className="animate-in fade-in duration-300">
            <TaxBenefitsSection
              input={loanInput}
              calculation={calculationResult}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 5: HIDDEN CHARGES & RED FLAGS */}
        {activeSection === 'traps' && (
          <div className="animate-in fade-in duration-300">
            <HiddenTrapsSection
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 6: DOCUMENTS & APPLY */}
        {activeSection === 'documents' && (
          <div className="animate-in fade-in duration-300">
            <DocumentChecklistSection
              input={loanInput}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* SECTION 7: INSTAGRAM ACCOUNT INTELLIGENCE */}
        {activeSection === 'instagram' && (
          <div className="animate-in fade-in duration-300">
            <InstagramIntelligenceDashboard
              onBackToCalculator={() => setActiveSection('calculator')}
              onOpenLoanAdvisor={() => setActiveSection('askloanguru')}
              savedInsights={savedInsights}
              onUpdateInsights={handleUpdateInsights}
            />
          </div>
        )}

        {/* SECTION 8: ASKLOANGURU AI - MULTILINGUAL VOICE & TEXT ASSISTANT */}
        {activeSection === 'askloanguru' && (
          <div className="animate-in fade-in duration-300">
            <AskLoanGuruDashboard
              input={loanInput}
              calculation={calculationResult}
              verifiedInsights={savedInsights}
              onNavigateToCalculator={() => setActiveSection('calculator')}
              onNavigateToInstagram={() => setActiveSection('instagram')}
              onNavigateToComparison={() => setActiveSection('rates')}
            />
          </div>
        )}
      </main>

      {/* Floating Ask LoanGuru Chat Button (bottom right) */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="no-print fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
        <span>Ask LoanGuru AI</span>
      </button>

      {/* Floating Chat Assistant Modal with Verified Instagram Intelligence Transfer */}
      <AskLoanGuruModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        input={loanInput}
        currentLang={currentLang}
        verifiedInsights={savedInsights}
      />

      {/* Footer & Disclaimer */}
      <DisclaimerBanner currentLang={currentLang} />
    </div>
  );
}
