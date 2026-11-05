import React, { useState } from 'react';
import { TEACHING_LESSONS } from '../../data/askLoanGuruData';
import { TeachingLesson } from '../../types';
import { 
  GraduationCap, 
  ChevronRight, 
  Calculator, 
  TrendingUp, 
  ShieldAlert, 
  MessageSquare, 
  Award,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Clock
} from 'lucide-react';

interface TeachMeModeViewProps {
  onAskTopicInChat: (question: string) => void;
  language: string;
}

export const TeachMeModeView: React.FC<TeachMeModeViewProps> = ({
  onAskTopicInChat,
  language,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<TeachingLesson | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5 text-emerald-500" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-teal-500" />;
      case 'Award': return <Award className="w-5 h-5 text-purple-500" />;
      default: return <GraduationCap className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getLocalizedTitle = (lesson: TeachingLesson) => {
    if (language === 'hi' && lesson.titleHi) return lesson.titleHi;
    if (language === 'gu' && lesson.titleGu) return lesson.titleGu;
    return lesson.title;
  };

  if (selectedLesson) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Back Button & Lesson Banner */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Lessons</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {selectedLesson.difficulty.toUpperCase()}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedLesson.readTime}
            </span>
          </div>
        </div>

        {/* Lesson Hero */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
              {getIcon(selectedLesson.icon)}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {getLocalizedTitle(selectedLesson)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {selectedLesson.summary}
            </p>
          </div>
        </div>

        {/* Core Question Box */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block text-amber-800 dark:text-amber-400">
              The Big Question Ordinary Borrowers Ask:
            </span>
            <p className="text-sm font-semibold mt-0.5">{selectedLesson.coreQuestion}</p>
          </div>
        </div>

        {/* Interactive Steps */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Step-by-Step Educational Breakdown
          </h3>

          {selectedLesson.interactiveSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {step.title}
                </h4>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-10">
                {step.explanation}
              </p>

              {step.mathExample && (
                <div className="ml-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Real-Life Numbers (Math Example):</span>
                  </div>
                  {step.mathExample}
                </div>
              )}

              <div className="ml-10 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Insider Pro-Tip:</strong> {step.proTip}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Key Takeaway */}
        <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-md flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Key Takeaway to Remember</h4>
            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {selectedLesson.keyTakeaway}
            </p>
          </div>
        </div>

        {/* Questions to Ask Bank */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Exact Questions to Ask Your Bank Manager or Loan Agent:</span>
          </h4>
          <ul className="space-y-2">
            {selectedLesson.questionsToAskBank.map((q, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between gap-3 group"
              >
                <span>&ldquo;{q}&rdquo;</span>
                <button
                  onClick={() => onAskTopicInChat(`Explain this in my loan context: "${q}"`)}
                  className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold opacity-90 group-hover:opacity-100 hover:bg-emerald-700 transition-all shrink-0"
                >
                  Ask AI &rarr;
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Teach Me Before I Borrow – Financial Literacy Masterclass
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100">
              Interactive lessons explaining the hidden mechanics of Indian bank loans with zero jargon
            </p>
          </div>
        </div>
        <p className="text-xs text-white/80 max-w-2xl mt-1">
          Banks rely on borrowers not understanding how interest compounds. Spend 3 minutes on any lesson below to safeguard lakhs in interest!
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEACHING_LESSONS.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(lesson.icon)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {lesson.difficulty.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.readTime}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {getLocalizedTitle(lesson)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Start interactive lesson</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
