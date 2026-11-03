import React, { useState } from 'react';
import { AmortizationRow, Language } from '../types';
import { translations } from '../translations';
import { formatINR } from '../utils/loanCalculations';
import { BarChart3, ChevronDown, ChevronRight, Calendar, Layers } from 'lucide-react';

interface AmortizationTableProps {
  yearlySchedule: AmortizationRow[];
  monthlySchedule: AmortizationRow[];
  currentLang: Language;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  yearlySchedule,
  monthlySchedule,
  currentLang,
}) => {
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // Calculate highest yearly EMI for chart scaling
  const maxYearlyPayment = Math.max(...yearlySchedule.map((r) => r.principalPaid + r.interestPaid), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Amortization Schedule & Payment Chart
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See how your EMI payment shifts from high-interest early on to principal-heavy later in the loan.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setViewMode('yearly')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'yearly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yearly View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly View
          </button>
        </div>
      </div>

      {/* Visual Chart: Stacked Bar Chart of Yearly Principal vs Interest */}
      <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">Principal vs Interest Trend</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              Principal Repaid
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
              Interest Paid
            </span>
          </div>
        </div>

        {/* SVG/CSS Chart Bars */}
        <div className="h-44 w-full flex items-end gap-1 sm:gap-2 pt-4 px-1 overflow-x-auto no-scrollbar">
          {yearlySchedule.slice(0, 30).map((row) => {
            const total = row.principalPaid + row.interestPaid;
            const principalPct = total > 0 ? (row.principalPaid / total) * 100 : 0;
            const interestPct = total > 0 ? (row.interestPaid / total) * 100 : 0;
            const barHeightPct = Math.min(100, Math.max(15, (total / maxYearlyPayment) * 90));

            return (
              <div
                key={row.period}
                className="flex-1 min-w-[20px] sm:min-w-[28px] flex flex-col items-center h-full justify-end group cursor-pointer"
                title={`${row.label}: Principal ${formatINR(row.principalPaid)}, Interest ${formatINR(row.interestPaid)}, Balance ${formatINR(row.closingBalance)}`}
              >
                <div
                  style={{ height: `${barHeightPct}%` }}
                  className="w-full flex flex-col justify-end rounded-t overflow-hidden group-hover:brightness-110 transition-all"
                >
                  <div
                    style={{ height: `${interestPct}%` }}
                    className="w-full bg-amber-400 transition-all"
                  />
                  <div
                    style={{ height: `${principalPct}%` }}
                    className="w-full bg-emerald-500 transition-all"
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
                  Y{row.period}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-3 text-right">Opening Balance</th>
              <th className="py-2.5 px-3 text-right">EMI Paid</th>
              <th className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">Principal</th>
              <th className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">Interest</th>
              <th className="py-2.5 px-3 text-right">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {viewMode === 'yearly' ? (
              yearlySchedule.map((row) => (
                <tr
                  key={row.period}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">
                    {formatINR(row.openingBalance)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold">
                    {formatINR(row.emi)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(row.principalPaid)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                    {formatINR(row.interestPaid)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatINR(row.closingBalance)}
                  </td>
                </tr>
              ))
            ) : (
              monthlySchedule.slice(0, 120).map((row) => (
                <tr
                  key={row.period}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.label}
                  </td>
                  <td className="py-2 px-3 text-right font-medium">
                    {formatINR(row.openingBalance)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold">
                    {formatINR(row.emi)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatINR(row.principalPaid)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                    {formatINR(row.interestPaid)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatINR(row.closingBalance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewMode === 'monthly' && monthlySchedule.length > 120 && (
        <p className="text-center text-xs text-slate-400">
          Showing first 120 months. Switch to Yearly view for complete loan lifetime schedule.
        </p>
      )}
    </div>
  );
};
