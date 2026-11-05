import React, { useState } from 'react';
import { LoanType, LoanOfferAuditResult, UserLoanInput } from '../../types';
import { BORROWER_PROTECTION_CHECKLIST } from '../../data/askLoanGuruData';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw,
  Building,
  Percent,
  IndianRupee,
  FileCheck2
} from 'lucide-react';

interface BorrowerProtectionViewProps {
  input: UserLoanInput;
  onAskAuditQuestion: (prompt: string) => void;
}

export const BorrowerProtectionView: React.FC<BorrowerProtectionViewProps> = ({
  input,
  onAskAuditQuestion,
}) => {
  // Offer inputs
  const [bankName, setBankName] = useState<string>('HDFC Bank');
  const [sanctionAmount, setSanctionAmount] = useState<number>(input.amount || 3000000);
  const [offeredRate, setOfferedRate] = useState<number>(input.interestRate || 8.65);
  const [benchmarkType, setBenchmarkType] = useState<'EBLR' | 'Repo' | 'MCLR' | 'Fixed'>('EBLR');
  const [processingFee, setProcessingFee] = useState<number>(15000);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(120000);
  const [insuranceMandatoryClaimed, setInsuranceMandatoryClaimed] = useState<boolean>(true);
  const [foreclosurePenaltyMentioned, setForeclosurePenaltyMentioned] = useState<boolean>(false);

  // Audit state
  const [auditResult, setAuditResult] = useState<LoanOfferAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Pre-fill scenarios
  const applyScenario = (type: 'typical_private' | 'psu_bank' | 'predatory_broker') => {
    if (type === 'typical_private') {
      setBankName('Top Private Bank');
      setSanctionAmount(3500000);
      setOfferedRate(8.75);
      setBenchmarkType('EBLR');
      setProcessingFee(18000);
      setInsuranceAmount(140000);
      setInsuranceMandatoryClaimed(true);
      setForeclosurePenaltyMentioned(false);
    } else if (type === 'psu_bank') {
      setBankName('State Bank of India (SBI)');
      setSanctionAmount(3500000);
      setOfferedRate(8.50);
      setBenchmarkType('Repo');
      setProcessingFee(5000);
      setInsuranceAmount(0);
      setInsuranceMandatoryClaimed(false);
      setForeclosurePenaltyMentioned(false);
    } else {
      setBankName('Unverified NBFC / DSA Broker');
      setSanctionAmount(2500000);
      setOfferedRate(11.5);
      setBenchmarkType('MCLR');
      setProcessingFee(45000);
      setInsuranceAmount(185000);
      setInsuranceMandatoryClaimed(true);
      setForeclosurePenaltyMentioned(true);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/gemini/audit-loan-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName,
          loanType: input.loanType,
          sanctionAmount,
          offeredRate,
          benchmarkType,
          processingFee,
          insuranceAmount,
          insuranceMandatoryClaimed,
          foreclosurePenaltyMentioned,
        }),
      });
      const data = await response.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const copyNegotiationScript = () => {
    if (auditResult?.negotiationScript) {
      navigator.clipboard.writeText(auditResult.negotiationScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Borrower Protection Mode: &ldquo;Don&rsquo;t Get Trapped in a Bad Loan&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-rose-100">
              Audit bank sanction letters, unmask tied single-premium insurance, and enforce RBI consumer protection rights
            </p>
          </div>
        </div>
        <p className="text-xs text-white/90 max-w-2xl mt-1">
          Lenders frequently conceal high margins, add mandatory insurance policies, or use non-repo benchmarks. Enter the terms of any loan offer below to receive an instant statutory compliance score.
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Quick Test Profiles:
        </span>
        <button
          onClick={() => applyScenario('typical_private')}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap font-medium"
        >
          Typical Private Bank (Bundled Insurance)
        </button>
        <button
          onClick={() => applyScenario('psu_bank')}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 whitespace-nowrap font-medium"
        >
          Clean PSU Bank (Low Fee, No Insurance)
        </button>
        <button
          onClick={() => applyScenario('predatory_broker')}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 whitespace-nowrap font-medium"
        >
          High-Risk NBFC / Broker Trap
        </button>
      </div>

      {/* Offer Input Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-500" />
          <span>Enter Loan Sanction Letter Terms</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bank / Lender Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              placeholder="e.g. HDFC, SBI, Axis"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Sanction Amount (₹)
            </label>
            <input
              type="number"
              value={sanctionAmount}
              onChange={(e) => setSanctionAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Offered Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.05"
              value={offeredRate}
              onChange={(e) => setOfferedRate(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Benchmark Type
            </label>
            <select
              value={benchmarkType}
              onChange={(e) => setBenchmarkType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              <option value="EBLR">EBLR (External Repo Benchmark) - Recommended</option>
              <option value="Repo">Direct RBI Repo Linked</option>
              <option value="MCLR">MCLR (Internal Bank Rate) - Opaque</option>
              <option value="Fixed">Fixed Rate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Processing Fee (₹)
            </label>
            <input
              type="number"
              value={processingFee}
              onChange={(e) => setProcessingFee(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bundled Insurance Premium (₹)
            </label>
            <input
              type="number"
              value={insuranceAmount}
              onChange={(e) => setInsuranceAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col justify-end">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={insuranceMandatoryClaimed}
                  onChange={(e) => setInsuranceMandatoryClaimed(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Bank officer claims loan insurance is <strong>compulsory</strong> for sanction/disbursal</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={foreclosurePenaltyMentioned}
                  onChange={(e) => setForeclosurePenaltyMentioned(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Sanction letter mentions <strong>foreclosure or part-payment penalty</strong> fee</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Against Central Bank Directives...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Due Diligence Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Results View */}
      {auditResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Score & Verdict Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Score Meter */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      auditResult.safetyScore >= 80
                        ? 'text-emerald-500'
                        : auditResult.safetyScore >= 60
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }
                    strokeDasharray={`${auditResult.safetyScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {auditResult.safetyScore}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Audit Safety Verdict:
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                      auditResult.finalVerdict === 'safe_to_proceed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : auditResult.finalVerdict === 'proceed_with_caution'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                    }`}
                  >
                    {auditResult.finalVerdict.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {auditResult.verdictExplanation}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Hidden / Unnecessary expenses flagged: <strong className="text-rose-600 font-bold">₹{auditResult.hiddenExpensesEstimate.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => onAskAuditQuestion(`Explain the audit score of ${auditResult.safetyScore}/100 for ${auditResult.bankName} and give me exact steps to protect myself.`)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:scale-105 transition-all shrink-0"
            >
              Discuss Audit with AskLoanGuru AI &rarr;
            </button>
          </div>

          {/* Audit Breakdown Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Detailed Compliance Breakdown (RBI & Statutory Norms)
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {auditResult.auditItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.status === 'danger'
                      ? 'border-rose-300 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20'
                      : item.status === 'warning'
                      ? 'border-amber-300 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20'
                      : 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      {item.status === 'danger' ? (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      ) : item.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'danger'
                          ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                          : item.status === 'warning'
                          ? 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                          : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 ml-7 leading-relaxed">
                    {item.details}
                  </p>

                  <div className="ml-7 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">
                      Statutory Reference: {item.rbiRule}
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      Action: {item.borrowerAction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Negotiation Script */}
          {auditResult.negotiationScript && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">
                    Generated Negotiation Letter for {auditResult.bankName}
                  </h4>
                </div>
                <button
                  onClick={copyNegotiationScript}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-300 transition-colors"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
                {auditResult.negotiationScript}
              </pre>

              <p className="text-[11px] text-slate-400">
                Send this formal email or submit this written letter to your branch loan manager before signing the loan contract.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
