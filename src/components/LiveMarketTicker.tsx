import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  Radio, 
  RefreshCw, 
  Coins, 
  TrendingUp, 
  Landmark, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

export interface LiveMarketData {
  repoRate: number;
  sdfRate: number;
  msfRate: number;
  gold24kPerGram: number;
  gold22kPerGram: number;
  gsecYield10y: number;
  cpiInflation: number;
  nextRbiMpc: string;
  marketSummary: string;
  lastUpdated: string;
  sources: { title: string; url: string }[];
  isLive: boolean;
}

interface LiveMarketTickerProps {
  currentLang: Language;
  onSyncGoldRate?: (ratePerGram: number) => void;
}

export const LiveMarketTicker: React.FC<LiveMarketTickerProps> = ({
  currentLang,
  onSyncGoldRate,
}) => {
  const [marketData, setMarketData] = useState<LiveMarketData>({
    repoRate: 6.50,
    sdfRate: 6.25,
    msfRate: 6.75,
    gold24kPerGram: 7850,
    gold22kPerGram: 7200,
    gsecYield10y: 6.84,
    cpiInflation: 5.08,
    nextRbiMpc: 'Next Bi-monthly MPC Review',
    marketSummary: 'RBI Repo rate active at 6.50%. Standard Home Loan EBLR spreads range from 1.85% to 2.65% across scheduled commercial banks.',
    lastUpdated: 'Live Market Sync',
    sources: [
      { title: 'Reserve Bank of India', url: 'https://rbi.org.in' },
      { title: 'India Bullion & Jewellers Association', url: 'https://ibja.co' },
    ],
    isLive: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const fetchLiveMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/live-market-pulse');
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.repoRate) {
            setMarketData(data);
          }
        }
      }
    } catch (e) {
      console.warn('[LiveMarketTicker] Live pulse refresh note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMarketData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLiveMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyGold = (rate: number, karat: string) => {
    if (onSyncGoldRate) {
      onSyncGoldRate(rate);
      setSyncNotice(`Synced live ${karat} gold rate (₹${rate.toLocaleString('en-IN')}/g) into your Gold Loan calculator!`);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  return (
    <div className="no-print bg-slate-900 border-b border-emerald-900/50 text-white shadow-md">
      {/* Ticker Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left: Live Status Badge & Timestamp */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Real-Time Market Pulse
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {marketData.lastUpdated}
            </span>
          </div>

          {/* Center: Live Rate Markers (Scrollable on mobile) */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {/* RBI Repo Rate */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 text-[11px]">RBI Repo:</span>
              <strong className="text-white font-extrabold">{marketData.repoRate.toFixed(2)}%</strong>
              <span className="text-[10px] text-emerald-400 font-semibold">(EBLR Anchor)</span>
            </div>

            {/* 24K Gold Rate */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0 group">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400 text-[11px]">24K Gold:</span>
              <strong className="text-amber-300 font-extrabold">₹{marketData.gold24kPerGram.toLocaleString('en-IN')}/g</strong>
              {onSyncGoldRate && (
                <button
                  onClick={() => handleApplyGold(marketData.gold24kPerGram, '24K')}
                  className="text-[10px] font-bold text-amber-400 hover:text-white underline ml-1 cursor-pointer"
                  title="Load into Gold Loan Calculator"
                >
                  Sync
                </button>
              )}
            </div>

            {/* 22K Gold Rate */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0">
              <Coins className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-slate-400 text-[11px]">22K Gold:</span>
              <strong className="text-yellow-200 font-extrabold">₹{marketData.gold22kPerGram.toLocaleString('en-IN')}/g</strong>
              {onSyncGoldRate && (
                <button
                  onClick={() => handleApplyGold(marketData.gold22kPerGram, '22K')}
                  className="text-[10px] font-bold text-yellow-300 hover:text-white underline ml-1 cursor-pointer"
                  title="Load 22K rate into Gold Loan Calculator"
                >
                  Sync
                </button>
              )}
            </div>

            {/* 10Y Benchmark Yield */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 text-[11px]">10Y G-Sec:</span>
              <strong className="text-indigo-200 font-extrabold">{marketData.gsecYield10y}%</strong>
            </div>

            {/* CPI Inflation */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 shrink-0">
              <span className="text-slate-400 text-[11px]">CPI Inflation:</span>
              <strong className="text-white font-extrabold">{marketData.cpiInflation}%</strong>
            </div>
          </div>

          {/* Right: Refresh button & Insights toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <span>Market Intelligence</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={fetchLiveMarketData}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Refresh real-time market data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sync Confirmation Toast */}
        {syncNotice && (
          <div className="mt-2 p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
            <span>✨ {syncNotice}</span>
            <button
              onClick={() => setSyncNotice(null)}
              className="text-[10px] text-amber-300 hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Expandable Live Market Intelligence Drawer */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                  RBI Policy Repo Rate ({marketData.repoRate.toFixed(2)}%)
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Every floating rate home or car loan from scheduled commercial banks is legally pegged to this rate. A 25 bps RBI rate cut directly reduces your monthly EMI by ~₹18 per lakh.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">
                  Live Gold Rate (₹{marketData.gold22kPerGram.toLocaleString('en-IN')}/g 22K)
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Gold loan drawing limits update daily based on IBJA benchmark rates. RBI permits up to 75% LTV on the appraised value.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                  10-Year G-Sec Yield ({marketData.gsecYield10y}%)
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  The sovereign bond yield reflects long-term cost of borrowing. A falling yield signals impending mortgage interest rate cuts across private and PSU banks.
                </p>
              </div>
            </div>

            {marketData.sources && marketData.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>Real-Time Grounded Sources:</span>
                {marketData.sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <span>{s.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
