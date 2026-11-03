import React, { useState, useRef, useEffect } from 'react';
import { Language, UserLoanInput, GroundingSource } from '../types';
import { translations } from '../translations';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}

interface AskLoanGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: UserLoanInput;
  currentLang: Language;
}

export const AskLoanGuruModal: React.FC<AskLoanGuruModalProps> = ({
  isOpen,
  onClose,
  input,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in user's language
  const suggestedQuestions: Record<Language, string[]> = {
    en: [
      'Can the bank force me to buy loan insurance?',
      'How do husband and wife claim double tax benefits on home loan?',
      'What is the RBI rule on foreclosure and prepayment penalty?',
      'How can I negotiate a lower EBLR spread with my bank?',
      'Can a farmer get interest subvention on agri gold loans?',
    ],
    hi: [
      'क्या बैंक लोन के साथ इंश्योरेंस लेना अनिवार्य कर सकता है?',
      'पति-पत्नी मिलकर होम लोन पर दोहरा टैक्स लाभ कैसे ले सकते हैं?',
      'लोन समय से पहले बंद करने पर आरबीआई का क्या नियम है?',
      'बैंक से ब्याज दर कम करने के लिए बातचीत कैसे करें?',
      'किसान क्रेडिट कार्ड (KCC) पर 3% ब्याज छूट कैसे मिलती है?',
    ],
    gu: [
      'શું બેંક લોન સાથે વીમો લેવાની ફરજ પાડી શકે?',
      'પતિ અને પત્ની બંને હોમ લોન પર ડબલ ટેક્સ બેનિફિટ કેવી રીતે મેળવી શકે?',
      'લોન સમય પહેલાં બંધ કરવા પર RBI નો શું નિયમ છે?',
      'બેંક સાથે વ્યાજ દર ઘટાડવા માટે કેવી રીતે વાતચીત કરવી?',
      'ખેડૂતોને કૃષિ લોન પર 3% વ્યાજ સહાય કેવી રીતે મળે?',
    ],
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Record<Language, string> = {
        en: `Hello! I am LoanGuru, your ethical loan advisor. I have loaded your current ${t.loanTypes[input.loanType]} plan (₹${(input.amount / 100000).toFixed(1)} Lakhs). Ask me anything about bank interest rates, RBI rules, hidden charges, tax benefits, or negotiations!`,
        hi: `नमस्ते! मैं लोनगुरु हूँ, आपका विश्वसनीय लोन सलाहकार। मैंने आपकी वर्तमान ${t.loanTypes[input.loanType]} योजना लोड कर ली है। मुझसे बैंक दरों, आरबीआई नियमों, टैक्स छूट या बातचीत के बारे में कुछ भी पूछें!`,
        gu: `નમસ્તે! હું લોનગુરુ છું, તમારો વિશ્વાસુ લોન સલાહકાર. મેં તમારી ${t.loanTypes[input.loanType]} ની વિગતો નોંધી લીધી છે. વ્યાજદર, RBI ના નિયમો કે ટેક્સ બચત વિશે મને કોઈપણ પ્રશ્ન પૂછો!`,
      };

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: greeting[currentLang],
        },
      ]);
    }
  }, [isOpen, currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          loanContext: {
            loanType: t.loanTypes[input.loanType],
            amount: input.amount,
            tenureYears: input.tenureYears || 20,
            monthlyIncome: input.monthlyIncome,
            cibilScore: input.cibilScore,
            state: input.state,
          },
          language: currentLang,
        }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'I could not connect right now. Please verify your internet connection or ask again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ask LoanGuru AI
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Google Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ethical Indian loan, RBI regulations & tax advisor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <span className="font-bold block">Verified Sources:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.slice(0, 3).map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>{s.title.length > 25 ? s.title.substring(0, 25) + '...' : s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Searching RBI circulars & official bank data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase">Try asking:</span>
          {suggestedQuestions[currentLang].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask in ${currentLang === 'hi' ? 'हिन्दी' : currentLang === 'gu' ? 'ગુજરાતી' : 'English'} (e.g. foreclosure fees, tax double benefit, CIBIL)...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            LoanGuru is an informational tool adhering strictly to RBI guidelines. Always verify sanction terms with your lender.
          </p>
        </div>
      </div>
    </div>
  );
};
