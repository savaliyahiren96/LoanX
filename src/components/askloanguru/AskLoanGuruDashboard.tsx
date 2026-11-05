import React, { useState, useEffect, useRef } from 'react';
import { 
  UserLoanInput, 
  EmiCalculationResult, 
  SavedInsight, 
  IndianLanguageCode, 
  ResponseLevel, 
  AskLoanGuruTab, 
  AskLoanGuruMessage 
} from '../../types';
import { INDIAN_LANGUAGES } from '../../data/askLoanGuruData';

// Sub components
import { VoiceAssistantView } from './VoiceAssistantView';
import { BorrowerProtectionView } from './BorrowerProtectionView';
import { VoiceDocumentAnalysisView } from './VoiceDocumentAnalysisView';
import { TeachMeModeView } from './TeachMeModeView';
import { SimpleLanguageGlossaryModal } from './SimpleLanguageGlossaryModal';

import { 
  Sparkles, 
  Mic, 
  MessageSquare, 
  FileText, 
  ShieldAlert, 
  GraduationCap, 
  BookOpen, 
  Send, 
  Volume2, 
  VolumeX, 
  Languages, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Calculator,
  RefreshCw,
  HelpCircle,
  FileCheck2,
  SlidersHorizontal,
  Instagram
} from 'lucide-react';

interface AskLoanGuruDashboardProps {
  input: UserLoanInput;
  calculation: EmiCalculationResult;
  verifiedInsights: SavedInsight[];
  onNavigateToCalculator: () => void;
  onNavigateToInstagram: () => void;
  onNavigateToComparison: () => void;
}

export const AskLoanGuruDashboard: React.FC<AskLoanGuruDashboardProps> = ({
  input,
  calculation,
  verifiedInsights,
  onNavigateToCalculator,
  onNavigateToInstagram,
  onNavigateToComparison,
}) => {
  // 1. Language & Mode state
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguageCode>('en');
  const [responseLevel, setResponseLevel] = useState<ResponseLevel>('simple');
  const [activeTab, setActiveTab] = useState<AskLoanGuruTab>('ask_anything');

  // 2. Glossary Modal state
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  // 3. Conversation Messages (Persisted in localStorage)
  const [messages, setMessages] = useState<AskLoanGuruMessage[]>(() => {
    try {
      const saved = localStorage.getItem('loanguru_assistant_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read chat history:', e);
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: `**Namaste! Welcome to AskLoanGuru AI.**\n\nAre you planning to take a loan? Don't worry. Ask me anything. I will explain everything in simple language so you can make an informed financial decision.\n\n### How I Can Help You Right Now:\n- **Speak naturally in 11 Indian languages** (English, हिन्दी, ગુજરાતી, मराठी, বাংলা, etc.)\n- **Check your loan eligibility and EMI** based on your salary\n- **Audit any loan offer or sanction letter** for hidden insurance and fee markups\n- **Teach you the secrets of loan prepayment** and saving lakhs in interest\n\nWhat loan are you planning to take or what questions are on your mind?`,
        detectedLanguage: 'English',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'How much home loan can I afford on my salary?',
          'Why is my bank charging a high processing fee?',
          'Is loan insurance compulsory by RBI rules?'
        ]
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [attachedDocName, setAttachedDocName] = useState<string>('');
  const [attachedDocContent, setAttachedDocContent] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('loanguru_assistant_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not store chat history:', e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentLangMeta = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  // Send message to AskLoanGuru AI backend
  const handleSendMessage = async (text: string, isVoice = false): Promise<AskLoanGuruMessage | null> => {
    const trimmed = text.trim();
    if (!trimmed && !attachedDocContent) return null;

    const userMessage: AskLoanGuruMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceInput: isVoice,
      attachedDocumentName: attachedDocName || undefined,
      responseLevel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const approvedInsights = verifiedInsights.filter((i) => i.approvedForLoanAdvisor);

      const response = await fetch('/api/gemini/ask-loanguru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language: selectedLanguage,
          responseMode: responseLevel,
          assistantMode: activeTab,
          loanContext: {
            loanType: input.loanType,
            amount: input.amount,
            tenureYears: input.tenureYears,
            monthlyIncome: input.monthlyIncome,
            monthlyEmi: calculation.monthlyEmi,
            cibilScore: input.cibilScore,
            state: input.state,
          },
          verifiedInsights: approvedInsights,
          documentText: attachedDocContent,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: AskLoanGuruMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'I am ready to help with your loan questions.',
        detectedLanguage: data.detectedLanguage || currentLangMeta.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        simpleTerms: data.simpleTerms,
        borrowerTraps: data.borrowerTraps,
        suggestedFollowUps: data.suggestedFollowUps,
        sources: data.sources,
        responseLevel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);
      return assistantMessage;
    } catch (err) {
      console.error('AskLoanGuru AI error:', err);
      const fallbackMessage: AskLoanGuruMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: `According to RBI guidelines, individual floating rate retail loans carry zero prepayment penalty. Always request your 1-page Key Fact Statement (KFS) before signing.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: currentLangMeta.name,
        responseLevel,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setIsProcessing(false);
      return fallbackMessage;
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear your conversation history with AskLoanGuru AI?')) {
      const resetMsg: AskLoanGuruMessage = {
        id: 'msg-reset',
        role: 'assistant',
        text: `History cleared. Namaste! How can I assist you with your loan planning today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
      localStorage.removeItem('loanguru_assistant_history');
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`~\[\]]/g, ' ').substring(0, 500);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = currentLangMeta.voiceLangCode || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleDocAnalysisRequest = (docText: string, docName: string, query?: string) => {
    setAttachedDocName(docName);
    setAttachedDocContent(docText);
    setActiveTab('ask_anything');
    const promptToSend = query || `Please analyze this uploaded document (${docName}) in ${currentLangMeta.name}. Highlight any hidden charges, tied insurance mandates, or unfavorable clauses.`;
    handleSendMessage(promptToSend, false);
  };

  const lastAssistantMessage = messages.filter((m) => m.role === 'assistant').slice(-1)[0] || null;

  return (
    <div className="space-y-6">
      {/* 1. MASTER BANNER WITH TAGLINE & PHILOSOPHY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -top-24 -right-24" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/30">
                ₹
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    ASKLOANGURU AI
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Multilingual Voice & Text
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 italic">
                  &ldquo;{currentLangMeta.tagline}&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Action: Open Glossary */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>Financial Glossary</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white font-semibold">Core Philosophy:</strong> Every person deserves to understand a loan before taking it, regardless of their language, education, financial knowledge or technical background. No borrower should sign a contract simply because they did not understand what the bank or loan agent explained.
            </p>
          </div>

          {/* Connected Context Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-400">Connected Modules:</span>
            <button
              onClick={onNavigateToCalculator}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{input.loanType.toUpperCase()} Loan ₹{(input.amount / 100000).toFixed(1)}L (EMI ₹{calculation.monthlyEmi.toLocaleString('en-IN')})</span>
            </button>
            <button
              onClick={onNavigateToInstagram}
              className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 flex items-center gap-1 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{verifiedInsights.filter((i) => i.approvedForLoanAdvisor).length} Verified Expert Insights Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP TOOLBAR: 11 INDIAN LANGUAGES & 3 RESPONSE LEVELS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Language Picker */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>Language:</span>
          </span>
          {INDIAN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{lang.nativeName}</span>
              {lang.code !== 'en' && <span className="text-[10px] opacity-75 ml-1">({lang.name})</span>}
            </button>
          ))}
        </div>

        {/* 3 Response Style Levels */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0 text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-2 hidden sm:inline">
            Mode:
          </span>
          <button
            onClick={() => setResponseLevel('simple')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              responseLevel === 'simple'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Explain Like I'm a Beginner (Zero Jargon)"
          >
            Simple Answer
          </button>
          <button
            onClick={() => setResponseLevel('detailed')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              responseLevel === 'detailed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Calculations, Math, and Pros & Cons"
          >
            Detailed
          </button>
          <button
            onClick={() => setResponseLevel('expert')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              responseLevel === 'expert'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Banking Regulations, RBI Directives, and Clause Analysis"
          >
            Expert RBI
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setActiveTab('ask_anything')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'ask_anything'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Anything (Text)</span>
        </button>

        <button
          onClick={() => setActiveTab('talk_voice')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'talk_voice'
              ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Mic className="w-4 h-4 text-amber-300" />
          <span>Talk by Voice (Voice-to-Voice)</span>
        </button>

        <button
          onClick={() => setActiveTab('check_offer')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'check_offer'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Check My Loan (Borrower Protection)</span>
        </button>

        <button
          onClick={() => setActiveTab('upload_agreement')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'upload_agreement'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Upload Document (Voice Analysis)</span>
        </button>

        <button
          onClick={() => setActiveTab('teach_me')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'teach_me'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Teach Me Before I Borrow</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB A: TALK BY VOICE */}
      {activeTab === 'talk_voice' && (
        <VoiceAssistantView
          input={input}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          responseLevel={responseLevel}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          activeTurnMessage={lastAssistantMessage}
        />
      )}

      {/* TAB B: BORROWER PROTECTION MODE */}
      {activeTab === 'check_offer' && (
        <BorrowerProtectionView
          input={input}
          onAskAuditQuestion={(prompt) => {
            setActiveTab('ask_anything');
            handleSendMessage(prompt, false);
          }}
        />
      )}

      {/* TAB C: VOICE DOCUMENT ANALYSIS */}
      {activeTab === 'upload_agreement' && (
        <VoiceDocumentAnalysisView
          onAnalyzeDocumentWithVoice={handleDocAnalysisRequest}
          language={selectedLanguage}
        />
      )}

      {/* TAB D: TEACH ME BEFORE I BORROW */}
      {activeTab === 'teach_me' && (
        <TeachMeModeView
          onAskTopicInChat={(prompt) => {
            setActiveTab('ask_anything');
            handleSendMessage(prompt, false);
          }}
          language={selectedLanguage}
        />
      )}

      {/* TAB E: CONVERSATIONAL CHAT (DEFAULT) */}
      {activeTab === 'ask_anything' && (
        <div className="space-y-4">
          {/* Messages Stream */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm min-h-[450px] max-h-[650px] overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-0.5">
                    ₹
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {/* Message Meta Info */}
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                    <span className="font-semibold">
                      {msg.role === 'user' ? (msg.isVoiceInput ? 'You (Spoken Voice)' : 'You') : 'AskLoanGuru AI'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="hover:opacity-100 hover:text-emerald-500 transition-colors"
                            title="Read Aloud"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="hover:opacity-100 hover:text-emerald-500 transition-colors"
                            title="Copy Answer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Attached Document Pill */}
                  {msg.attachedDocumentName && (
                    <div className="p-2 rounded-lg bg-black/10 dark:bg-white/10 text-xs font-mono flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Document Attached: {msg.attachedDocumentName}</span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>

                  {/* Simple Terms Explained Drawer */}
                  {msg.simpleTerms && msg.simpleTerms.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-800 dark:text-emerald-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Simple Language Explanations:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.simpleTerms.map((st, sIdx) => (
                          <div key={sIdx} className="bg-white/60 dark:bg-black/20 p-2 rounded-lg">
                            <strong className="font-bold text-slate-900 dark:text-white">{st.term}:</strong>{' '}
                            <span>{st.simpleExplanation}</span>
                            {st.rupeeExample && (
                              <span className="block mt-0.5 text-emerald-700 dark:text-emerald-300 italic">
                                Example: {st.rupeeExample}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Borrower Protection Warnings */}
                  {msg.borrowerTraps && msg.borrowerTraps.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-rose-800 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Borrower Trap / Red Flag Identified:</span>
                      </div>
                      {msg.borrowerTraps.map((bt, bIdx) => (
                        <div key={bIdx} className="bg-white/60 dark:bg-black/20 p-2 rounded-lg space-y-1">
                          <strong className="font-bold text-rose-900 dark:text-rose-300">{bt.title}</strong>
                          <p className="text-[11px] leading-relaxed">{bt.explanation}</p>
                          <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                            Action: {bt.actionableAdvice}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grounding Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] flex flex-wrap items-center gap-2">
                      <span className="text-slate-400">Verified Sources:</span>
                      {msg.sources.map((s, sIdx) => (
                        <a
                          key={sIdx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-up Chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((fu, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSendMessage(fu, false)}
                            className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 text-left transition-colors"
                          >
                            &ldquo;{fu}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 text-xs text-slate-400 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>AskLoanGuru is checking Indian banking regulations & calculating numbers...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputQuery, false);
                  }
                }}
                placeholder={
                  selectedLanguage === 'gu'
                    ? 'તમારી ભાષામાં પૂછો (દા.ત. 30 લાખની હોમ લોન પર કઈ બેંક સારી?)'
                    : selectedLanguage === 'hi'
                    ? 'अपनी भाषा में पूछें (उदा. 25 लाख के लोन पर कितनी EMI आएगी?)'
                    : 'Ask anything (e.g. Can the bank force me to buy insurance? How to waive processing fee?)'
                }
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />

              {/* Voice Trigger */}
              <button
                onClick={() => setActiveTab('talk_voice')}
                className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                title="Speak by Voice"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Submit Button */}
              <button
                onClick={() => handleSendMessage(inputQuery, false)}
                disabled={!inputQuery.trim() || isProcessing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>Ask</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Supports mixed Hinglish, Gujlish & 11 Indian languages. Instant RBI grounded verification.</span>
              <button
                onClick={handleClearHistory}
                className="hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. GLOSSARY MODAL */}
      <SimpleLanguageGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onSelectTerm={(term) => {
          setActiveTab('ask_anything');
          handleSendMessage(`Explain "${term}" in simple everyday words with rupee calculations.`, false);
        }}
      />
    </div>
  );
};
