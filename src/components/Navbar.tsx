import React from 'react';
import { Language, LoanType } from '../types';
import { translations } from '../translations';
import { 
  Building2, 
  Car, 
  Coins, 
  GraduationCap, 
  Briefcase, 
  User, 
  ShieldAlert, 
  Landmark, 
  Sparkles, 
  Moon, 
  Sun, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeLoanType: LoanType;
  onSelectLoanType: (type: LoanType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenChat: () => void;
  activeSection: string;
  onNavigateSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeLoanType,
  onSelectLoanType,
  darkMode,
  onToggleDarkMode,
  onOpenChat,
  activeSection,
  onNavigateSection,
}) => {
  const t = translations[currentLang];

  const loanNavItems: { type: LoanType; label: string; icon: any }[] = [
    { type: 'home', label: t.loanTypes.home, icon: Building2 },
    { type: 'car', label: t.loanTypes.car, icon: Car },
    { type: 'lap', label: t.loanTypes.lap, icon: Landmark },
    { type: 'gold', label: t.loanTypes.gold, icon: Coins },
    { type: 'education', label: t.loanTypes.education, icon: GraduationCap },
    { type: 'personal', label: t.loanTypes.personal, icon: User },
    { type: 'business', label: t.loanTypes.business, icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onNavigateSection('calculator')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  Loan<span className="text-emerald-600 dark:text-emerald-400">Guru</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                RBI Compliant • Grounded Rates • Zero Bias
              </p>
            </div>
          </div>

          {/* Quick Action Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onNavigateSection('calculator')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'calculator'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navCalculator}
            </button>
            <button
              onClick={() => onNavigateSection('rates')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'rates'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navBankRates}
            </button>
            <button
              onClick={() => onNavigateSection('schemes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'schemes'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navSchemes}
            </button>
            <button
              onClick={() => onNavigateSection('tax')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'tax'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navTaxLegal}
            </button>
            <button
              onClick={() => onNavigateSection('traps')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'traps'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.navHiddenTraps}
            </button>
          </nav>

          {/* Right Controls: Language, Dark Mode, Ask AI */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLang === 'en'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLang === 'hi'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('gu')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  currentLang === 'gu'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Ask AI Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">Ask LoanGuru</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar: Loan Type Selector Horizontal Scroll */}
      <div className="bg-slate-50/80 dark:bg-slate-950/40 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto no-scrollbar py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 min-w-max">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
            Loans:
          </span>
          {loanNavItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeLoanType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => {
                  onSelectLoanType(item.type);
                  onNavigateSection('calculator');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
