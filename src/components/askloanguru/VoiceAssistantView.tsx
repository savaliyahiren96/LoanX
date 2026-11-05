import React, { useState, useEffect, useRef } from 'react';
import { AskLoanGuruMessage, IndianLanguageCode, LanguageMeta, ResponseLevel, UserLoanInput } from '../../types';
import { INDIAN_LANGUAGES } from '../../data/askLoanGuruData';
import { 
  Mic, 
  MicOff, 
  Square, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  StopCircle,
  HelpCircle,
  Settings2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface VoiceAssistantViewProps {
  input: UserLoanInput;
  selectedLanguage: IndianLanguageCode;
  onLanguageChange: (lang: IndianLanguageCode) => void;
  responseLevel: ResponseLevel;
  onSendMessage: (query: string, isVoice: boolean) => Promise<AskLoanGuruMessage | null>;
  isProcessing: boolean;
  activeTurnMessage: AskLoanGuruMessage | null;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({
  input,
  selectedLanguage,
  onLanguageChange,
  responseLevel,
  onSendMessage,
  isProcessing,
  activeTurnMessage,
}) => {
  // Voice Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(true);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentLangMeta = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLangMeta.voiceLangCode || 'en-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setLiveTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsRecording(false);
          clearInterval(timerRef.current);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not init speech recognition:', e);
      setSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      clearInterval(timerRef.current);
    };
  }, [currentLangMeta.voiceLangCode]);

  // Start recording
  const handleStartRecording = () => {
    if (isPlayingAudio) {
      handleInterruptSpeech();
    }
    setLiveTranscript('');
    setRecordingSeconds(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = currentLangMeta.voiceLangCode || 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop recording and send
  const handleStopRecording = async () => {
    setIsRecording(false);
    clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const queryToSend = liveTranscript.trim();
    if (queryToSend) {
      const response = await onSendMessage(queryToSend, true);
      if (response && !isMuted) {
        playResponseAudio(response.text);
      }
    }
  };

  // Interrupt AI speech immediately
  const handleInterruptSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
  };

  // Play response audio using TTS endpoint or fallback
  const playResponseAudio = async (textToSpeak: string) => {
    if (isMuted || !textToSpeak) return;

    handleInterruptSpeech();
    setIsPlayingAudio(true);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice: selectedVoice,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
        audio.playbackRate = speechSpeed;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackWebSpeech(textToSpeak);
        audioRef.current = audio;
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('TTS server call failed, falling back to Web Speech Synthesis:', e);
    }

    fallbackWebSpeech(textToSpeak);
  };

  // Browser speech synthesis fallback
  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~\[\]]/g, ' ').substring(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLangMeta.voiceLangCode || 'en-IN';
    utterance.rate = speechSpeed;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleRepeatAnswer = () => {
    if (activeTurnMessage?.text) {
      playResponseAudio(activeTurnMessage.text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Assistant Master Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -bottom-20 -right-20" />

        {/* Top Status & Controls */}
        <div className="w-full flex items-center justify-between mb-8 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
              Voice-to-Voice AI Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute Toggle */}
            <button
              onClick={() => {
                if (!isMuted && isPlayingAudio) handleInterruptSpeech();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
              title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
            </button>

            {/* Speech Speed Toggle */}
            <button
              onClick={() => setSpeechSpeed((prev) => (prev === 1.0 ? 1.25 : prev === 1.25 ? 1.5 : 1.0))}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-200"
              title="Speech Speed"
            >
              {speechSpeed}x
            </button>
          </div>
        </div>

        {/* Center Big Circular Microphone Button */}
        <div className="relative z-10 my-4 flex flex-col items-center">
          {/* Animated audio wave rings when recording */}
          {isRecording && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full bg-rose-500/10 animate-pulse pointer-events-none" />
            </>
          )}

          {/* Animated audio wave rings when speaking */}
          {isPlayingAudio && !isRecording && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              <div className="absolute w-52 h-52 rounded-full bg-emerald-500/10 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl relative z-10 ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/50 scale-105 ring-4 ring-rose-400'
                : isPlayingAudio
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/50 scale-105'
                : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 hover:scale-105 text-white shadow-emerald-500/30'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-8 h-8 fill-current mb-1" />
                <span className="text-[10px] font-black uppercase tracking-wider">Tap to Stop</span>
              </>
            ) : isPlayingAudio ? (
              <>
                <Volume2 className="w-8 h-8 mb-1 animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-wider">Speaking</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-wider">Tap to Speak</span>
              </>
            )}
          </button>

          {/* Recording Timer / State */}
          <div className="mt-4 text-xs font-semibold">
            {isRecording ? (
              <span className="text-rose-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Listening in {currentLangMeta.name}... ({recordingSeconds}s)
              </span>
            ) : isPlayingAudio ? (
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  Responding in {currentLangMeta.name}...
                </span>
                <button
                  onClick={handleInterruptSpeech}
                  className="px-2.5 py-1 rounded-md bg-rose-500/30 text-rose-300 hover:bg-rose-500/50 text-[11px] font-bold"
                >
                  Interrupt AI
                </button>
              </div>
            ) : isProcessing ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Preparing expert financial guidance...
              </span>
            ) : (
              <span className="text-slate-400">
                Speak naturally in {currentLangMeta.nativeName} ({currentLangMeta.name})
              </span>
            )}
          </div>
        </div>

        {/* Live Speech-to-Text Transcription Box */}
        {(liveTranscript || isRecording) && (
          <div className="w-full max-w-xl mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left z-10 animate-in fade-in duration-200">
            <span className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
              Live Transcription:
            </span>
            <p className="text-sm font-medium text-white italic">
              &ldquo;{liveTranscript || 'Start speaking your question...'}&rdquo;
            </p>
          </div>
        )}

        {/* AI Spoken Response Card */}
        {activeTurnMessage && activeTurnMessage.role === 'assistant' && (
          <div className="w-full max-w-2xl mt-6 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-left z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AskLoanGuru Answer ({activeTurnMessage.detectedLanguage || currentLangMeta.name})</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRepeatAnswer}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300"
                  title="Repeat Answer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Repeat</span>
                </button>
                {isPlayingAudio && (
                  <button
                    onClick={handleInterruptSpeech}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs"
                  >
                    <StopCircle className="w-3 h-3" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed max-h-48 overflow-y-auto pr-1">
              {activeTurnMessage.text}
            </p>

            {/* Quick Follow-ups */}
            {activeTurnMessage.suggestedFollowUps && activeTurnMessage.suggestedFollowUps.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400 block mb-1.5">Spoken Follow-up Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTurnMessage.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(fu, false)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-600/30 text-slate-200 border border-white/10 transition-colors"
                    >
                      &ldquo;{fu}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Assistant Sample Prompts */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Try Speaking These Real-Life Indian Questions:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onSendMessage('મારે 30 લાખની હોમ લોન લેવી છે. કઈ બેંક સારી રહેશે?', false)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left hover:border-emerald-500 transition-colors group"
          >
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              Gujarati (ગુજરાતી)
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
              &ldquo;મારે 30 લાખની હોમ લોન લેવી છે. કઈ બેંક સારી રહેશે?&rdquo;
            </p>
          </button>

          <button
            onClick={() => onSendMessage('अगर मेरी सैलरी 50 हजार है और 25 लाख का लोन लूं, तो क्या यह सही रहेगा?', false)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left hover:border-emerald-500 transition-colors group"
          >
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
              Hindi (हिन्दी)
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
              &ldquo;अगर मेरी सैलरी 50 हजार है और 25 लाख का लोन लूं, तो क्या यह सही रहेगा?&rdquo;
            </p>
          </button>

          <button
            onClick={() => onSendMessage('The bank is insisting on ₹1.5L insurance before disbursal. Is it compulsory by law?', false)}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left hover:border-emerald-500 transition-colors group"
          >
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">
              English
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-600">
              &ldquo;The bank is insisting on ₹1.5L insurance before disbursal. Is it compulsory by law?&rdquo;
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
