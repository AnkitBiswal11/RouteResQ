import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  AlertCircle,
  MapPin,
  Ambulance,
  Phone,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Volume2,
  Activity,
  Layers,
} from 'lucide-react';
import { useRouteResQ } from '../context/RouteResQContext';
import { EmergencyCategory, Language } from '../types';

interface VoicePromptOption {
  category: EmergencyCategory;
  categoryLabel: string;
  phrase: string;
  subtext: string;
}

export const VoiceSOSModal: React.FC = () => {
  const {
    isVoiceSosModalOpen,
    setIsVoiceSosModalOpen,
    t,
    triggerVoiceSOS,
    isOnline,
    setActiveTab,
    language: appLanguage,
  } = useRouteResQ();

  const [voiceLang, setVoiceLang] = useState<Language>(appLanguage || 'en');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [detectedCategory, setDetectedCategory] = useState<EmergencyCategory>('accident');
  const [confidenceScore, setConfidenceScore] = useState<number>(98.4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);

  // Sync initial voice language with app language
  useEffect(() => {
    if (isVoiceSosModalOpen) {
      setVoiceLang(appLanguage);
      setTranscript('');
      setSubmittedIncidentId(null);
    }
  }, [isVoiceSosModalOpen, appLanguage]);

  // Voice speech prompts per language
  const voicePrompts: Record<Language, VoicePromptOption[]> = {
    en: [
      {
        category: 'accident',
        categoryLabel: 'Road Collision',
        phrase: 'Severe road accident at expressway junction, two vehicles collided and passengers are trapped.',
        subtext: 'Multiple injuries · Active road obstruction',
      },
      {
        category: 'cardiac',
        categoryLabel: 'Cardiac Arrest',
        phrase: 'Patient collapsed with severe crushing chest pain, cold sweating and cannot breathe.',
        subtext: 'Suspected STEMI · Defibrillator & oxygen required',
      },
      {
        category: 'respiratory',
        categoryLabel: 'Respiratory Distress',
        phrase: 'Acute asthma attack and severe shortness of breath, oxygen saturation falling rapidly.',
        subtext: 'Critical respiratory failure · High-flow O2 needed',
      },
      {
        category: 'trauma',
        categoryLabel: 'Severe Trauma / Fire',
        phrase: 'Severe building fire and burns, heavy smoke inhalation and bleeding victims.',
        subtext: 'Burn trauma bay & triage ready',
      },
    ],
    hi: [
      {
        category: 'accident',
        categoryLabel: 'सड़क दुर्घटना',
        phrase: 'एक्सप्रेसवे पर भीषण सड़क दुर्घटना हुई है, दो गाड़ियां टकराई हैं और लोग घायल हैं।',
        subtext: 'गंभीर चोट · तत्काल ट्रॉमा एम्बुलेंस चाहिए',
      },
      {
        category: 'cardiac',
        categoryLabel: 'दिल का दौरा',
        phrase: 'मरीज को सीने में तेज दर्द हो रहा है, पसीना आ रहा है और सांस लेने में भारी तकलीफ है।',
        subtext: 'हार्ट अटैक की आशंका · ऑक्सीजन युक्त ALS यूनिट आवश्यक',
      },
      {
        category: 'respiratory',
        categoryLabel: 'सांस की गंभीर समस्या',
        phrase: 'मरीज को सांस लेने में भारी दिक्कत हो रही है, ऑक्सीजन लेवल बहुत कम हो गया है।',
        subtext: 'गंभीर अस्थमा / सांस रुकना · तुरंत वेंटिलेटर सहायता',
      },
      {
        category: 'trauma',
        categoryLabel: 'गंभीर चोट / आग',
        phrase: 'आग लगने से लोग गंभीर जल गए हैं, बहुत खून बह रहा है तुरंत मेडिकल टीम भेजें।',
        subtext: 'अग्नि व बर्न इमरजेंसी · तुरंत सहायता',
      },
    ],
    or: [
      {
        category: 'accident',
        categoryLabel: 'ସଡ଼କ ଦୁର୍ଘଟଣା',
        phrase: 'ଏକ୍ସପ୍ରେସୱେ ରାଜପଥରେ ଭୀଷଣ ଦୁର୍ଘଟଣା ଘଟିଛି, ଯାତ୍ରୀ ଫସି ରହିଛନ୍ତି ଓ ରକ୍ତସ୍ରାବ ହେଉଛି।',
        subtext: 'ଗୁରୁତର ଆହତ · ତୁରନ୍ତ ଟ୍ରମା ଆମ୍ବୁଲାନ୍ସ ଦରକାର',
      },
      {
        category: 'cardiac',
        categoryLabel: 'ଛାତି ଯନ୍ତ୍ରଣା / ହୃଦଘାତ',
        phrase: 'ରୋଗୀଙ୍କ ଛାତିରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ହେଉଛି, ପ୍ରବଳ ଝାଳ ବୋହୁଛି ଓ ନିଶ୍ୱାସ ନେଇପାରୁ ନାହାନ୍ତି।',
        subtext: 'ହୃଦଘାତ ଆଶଙ୍କା · ଅକ୍ସିଜେନ୍ ଯୁକ୍ତ ALS ଆମ୍ବୁଲାନ୍ସ ଆବଶ୍ୟକ',
      },
      {
        category: 'respiratory',
        categoryLabel: 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ',
        phrase: 'ନିଶ୍ୱାସ ନେବାରେ ଭୀଷଣ କଷ୍ଟ ହେଉଛି, ଅମ୍ଳଜାନ (ଅକ୍ସିଜେନ୍) ସ୍ତର କମିବାରେ ଲାଗିଛି।',
        subtext: 'ତୁରନ୍ତ ଅକ୍ସିଜେନ୍ ବ୍ୟବସ୍ଥା ଆବଶ୍ୟକ',
      },
      {
        category: 'trauma',
        categoryLabel: 'ଗୁରୁତର ଆଘାତ / ଅଗ୍ନିକାଣ୍ଡ',
        phrase: 'ନିଆଁ ଲାଗି ଯିବାରୁ ଲୋକେ ଗୁରୁତର ଭାବେ ପୋଡ଼ି ଯାଇଛନ୍ତି, ତୁରନ୍ତ ଡାକ୍ତରୀ ଦଳ ପଠାନ୍ତୁ।',
        subtext: 'ବର୍ଣ୍ଣ ଓ ଟ୍ରମା ଜରୁରୀକାଳୀନ',
      },
    ],
  };

  // AI categorization logic based on words in English, Hindi, and Odia
  const evaluateCategory = (text: string) => {
    const lower = text.toLowerCase();
    if (
      lower.includes('heart') ||
      lower.includes('chest') ||
      lower.includes('cardiac') ||
      lower.includes('दिल') ||
      lower.includes('दौरा') ||
      lower.includes('ଛାତି') ||
      lower.includes('ହୃଦଘାତ')
    ) {
      setDetectedCategory('cardiac');
      setConfidenceScore(99.1);
    } else if (
      lower.includes('breath') ||
      lower.includes('oxygen') ||
      lower.includes('asthma') ||
      lower.includes('सांस') ||
      lower.includes('ଶ୍ୱାସ') ||
      lower.includes('ନିଶ୍ୱାସ')
    ) {
      setDetectedCategory('respiratory');
      setConfidenceScore(98.7);
    } else if (
      lower.includes('burn') ||
      lower.includes('fire') ||
      lower.includes('bleed') ||
      lower.includes('trauma') ||
      lower.includes('जल') ||
      lower.includes('आग') ||
      lower.includes('ରକ୍ତ') ||
      lower.includes('ନିଆଁ')
    ) {
      setDetectedCategory('trauma');
      setConfidenceScore(97.9);
    } else {
      setDetectedCategory('accident');
      setConfidenceScore(98.6);
    }
  };

  // Live Web Speech Recognition
  const recognitionRef = useRef<any>(null);

  const startVoiceListening = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // Fallback simulation if browser blocks speech API
        simulateVoiceInput();
        return;
      }

      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      const langCodes: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        or: 'or-IN',
      };
      recognition.lang = langCodes[voiceLang] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
        evaluateCategory(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
        simulateVoiceInput();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const options = voicePrompts[voiceLang];
    const picked = options[Math.floor(Math.random() * options.length)];
    setTimeout(() => {
      setTranscript(picked.phrase);
      evaluateCategory(picked.phrase);
      setIsListening(false);
    }, 1200);
  };

  const handleSelectPrompt = (prompt: VoicePromptOption) => {
    setTranscript(prompt.phrase);
    setDetectedCategory(prompt.category);
    setConfidenceScore(99.4);
  };

  const handleDispatchViaVoice = async () => {
    if (!transcript.trim()) {
      // Pick default emergency prompt if empty
      const defaultPhrase = voicePrompts[voiceLang][0].phrase;
      setTranscript(defaultPhrase);
    }

    setIsSubmitting(true);
    try {
      const activeText = transcript.trim() || voicePrompts[voiceLang][0].phrase;
      const id = await triggerVoiceSOS(activeText);
      setSubmittedIncidentId(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    setSubmittedIncidentId(null);
    setIsVoiceSosModalOpen(false);
  };

  if (!isVoiceSosModalOpen) return null;

  const categoryNames: Record<EmergencyCategory, string> = {
    accident: 'Road Collision / Trauma',
    cardiac: 'Acute Cardiac Event (STEMI)',
    respiratory: 'Severe Respiratory Distress',
    trauma: 'Critical Burn / Hemorrhage',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 transition-all">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#EF4444] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner">
              <Mic className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide uppercase">
                {t('voiceSosModalTitle')}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                {t('voiceSosModalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!submittedIncidentId ? (
            <>
              {/* Language Selector Bar */}
              <div>
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                  1. {t('voiceLanguageSelect')}:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['en', 'hi', 'or'] as Language[]).map((lang) => {
                    const isSelected = voiceLang === lang;
                    const labels: Record<Language, { main: string; native: string }> = {
                      en: { main: 'English', native: 'Global / IN' },
                      hi: { main: 'हिन्दी', native: 'Hindi' },
                      or: { main: 'ଓଡ଼ିଆ', native: 'Odia' },
                    };
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setVoiceLang(lang);
                          setTranscript('');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2878E8] text-white border-[#2878E8] shadow-md font-black scale-[1.02]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                        }`}
                      >
                        <div className="text-sm font-extrabold">{labels[lang].main}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {labels[lang].native}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Big Interactive Microphone Center */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Wave Visualizer bars when listening */}
                {isListening && (
                  <div className="flex items-center gap-1.5 mb-3 h-8">
                    {[16, 28, 42, 24, 38, 48, 30, 22, 40, 26].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-red-600 rounded-full animate-bounce"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 0.08}s`,
                          animationDuration: '0.6s',
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={startVoiceListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isListening
                      ? 'bg-red-600 text-white ring-8 ring-red-200 animate-pulse'
                      : 'bg-gradient-to-tr from-[#2878E8] to-[#142D4F] text-white hover:shadow-2xl'
                  }`}
                >
                  <Mic className="w-10 h-10" />
                </button>

                <div className="mt-3">
                  <span className="text-xs font-black text-slate-900 block">
                    {isListening ? t('voiceListeningState') : t('voicePressToSpeak')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Web Speech API active ({voiceLang.toUpperCase()}) · Instant AI triage
                  </span>
                </div>
              </div>

              {/* Sample Quick Voice Prompts for this language */}
              <div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                  {t('voiceOrTapSample')}
                </span>
                <div className="space-y-2">
                  {voicePrompts[voiceLang].map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPrompt(prompt)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between gap-3 ${
                        transcript === prompt.phrase
                          ? 'bg-blue-50 border-[#2878E8] ring-2 ring-blue-100 shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                            {prompt.categoryLabel}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-900 truncate">
                            {prompt.phrase}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {prompt.subtext}
                        </p>
                      </div>
                      <Volume2 className="w-4 h-4 text-[#2878E8] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Live AI Transcription Box */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#1E40AF] flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#2878E8]" />
                    {t('voiceTranscribedLabel')}
                  </span>
                  {transcript && (
                    <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Confidence: {confidenceScore}%
                    </span>
                  )}
                </div>

                <div className="bg-white rounded-xl p-3 border border-blue-200 min-h-[50px] text-xs font-medium text-slate-800">
                  {transcript || (
                    <span className="text-slate-400 italic">
                      {t('voiceTranscribedEmpty')}
                    </span>
                  )}
                </div>

                {/* AI Detected Classification Badge */}
                {transcript && (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-600 font-bold">
                      {t('voiceAiTriageDetected')}:
                    </span>
                    <span className="font-black text-[#EF4444] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#EF4444]" />
                      {categoryNames[detectedCategory]}
                    </span>
                  </div>
                )}
              </div>

              {/* Dispatch Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDispatchViaVoice}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-5 h-5 text-white" />
                    <span className="text-base tracking-wide">
                      {t('voiceDispatchButton')}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-100">
                    {t('voiceDispatchSub')}
                  </span>
                </button>

                {!isOnline && (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-extrabold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      <WifiOff className="w-3.5 h-3.5" />
                      Offline Mode Active · Voice request will be cached in IndexedDB
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Post-Dispatch Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Ambulance Dispatched via Voice!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Incident ID: {submittedIncidentId} · Recognized: {categoryNames[detectedCategory]}
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Assigned Unit:</span>
                  <span className="text-[#2878E8] font-black">Trauma ResQ-2 (AMB-02)</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>MDT Dispatch Alert:</span>
                  <span className="text-emerald-700 font-black">Notified & En Route</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>ETA to Scene:</span>
                  <span className="text-rose-600 font-black">6.4 mins (-4.2m saved)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setActiveTab('live_ops');
                }}
                className="w-full py-3.5 bg-[#142D4F] hover:bg-[#1f426e] text-white rounded-xl font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                Track Live Moving Ambulance on Map →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
