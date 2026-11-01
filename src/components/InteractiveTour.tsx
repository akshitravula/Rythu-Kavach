'use client';

import React, { useState } from 'react';
import { Language } from '@/types/claim';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  RotateCcw,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectClaim: (claimId: string) => void;
  onSwitchTab: (tab: 'SUMMARY' | 'CADASTRAL' | 'WEATHER' | 'DOCS' | 'AI_AUDIT') => void;
  onOpenDecisionModal: (type: 'APPROVE' | 'RETURN' | 'REJECT') => void;
}

// Simple Web Audio API Synthesizer for tactile game sounds
const playChime = (type: 'next' | 'jump' | 'complete') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'next') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'complete') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    }
  } catch {
    // Audio context may be restricted by autoplay policy
  }
};

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectClaim,
  onSwitchTab,
  onOpenDecisionModal
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const tourSteps = [
    {
      id: 'queue',
      missionNum: 1,
      targetClaim: 'RK-2026-0101',
      targetTab: 'AI_AUDIT' as const,
      title: {
        te: 'మిషన్ 1: క్లెయిమ్‌ల ప్రాధాన్యత క్యూ (SDRF Triage)',
        en: 'Mission 1: Claims Priority & SLA Triage Queue',
        hi: 'मिशन 1: दावा प्राथमिकता और एसएलए कतार'
      },
      badge: {
        te: 'దశ 1/4 • కేస్ ఎంపిక',
        en: 'Step 1 of 4 • Case Selection',
        hi: 'चरण 1/4 • मामला चयन'
      },
      objective: {
        te: 'లక్ష్యం: 15 రోజుల పౌర సేవా చార్టర్ ప్రకారం అత్యవసర క్లెయిమ్‌లను పరిశీలించండి.',
        en: 'Objective: Triage priority claims under the 15-day statutory Citizen\'s Charter deadline.',
        hi: 'उद्देश्य: 15 दिवसीय सांविधिक नागरिक चार्टर के तहत प्राथमिकता वाले दावों की जांच करें।'
      },
      description: {
        te: 'ఎడమ వైపున ఉన్న క్యూలో రెడ్ అలర్ట్స్ (అసమానతలు) మరియు గడువు తేదీ ఆధారంగా క్లెయిమ్‌లు అమర్చబడ్డాయి. ప్రారంభించడానికి మొదటి క్లీన్ క్లెయిమ్ (ముత్యాల రాములు • 2.5 ఎకరాలు • పత్తి) ను ఎంచుకోండి.',
        en: 'The queue prioritizes claims by statutory 15-day SLA and risk. Clean claims, extent anomalies, and GPS breaches are automatically flagged. Let\'s inspect our first clean claim (Mutyala Ramulu).',
        hi: 'कतार 15 दिनों के सांविधिक एसएलए और जोखिम के अनुसार दावों को प्राथमिकता देती है। आइए हमारे पहले साफ मामले (मुत्याला रामुलु) की जांच करें।'
      },
      actionText: {
        te: 'ఈ క్లెయిమ్‌ను పరిశీలించు (Jump to Case) 🎯',
        en: 'Jump to Clean Case 🎯',
        hi: 'इस मामले पर जाएं 🎯'
      },
      executeAction: () => {
        onSelectClaim('RK-2026-0101');
        onSwitchTab('AI_AUDIT');
      }
    },
    {
      id: 'matrix',
      missionNum: 2,
      targetClaim: 'RK-2026-0101',
      targetTab: 'AI_AUDIT' as const,
      title: {
        te: 'మిషన్ 2: 5-పాయింట్ శాసనబద్ధమైన ఆడిట్ మ్యాట్రిక్స్',
        en: 'Mission 2: 5-Point Statutory Verification Matrix',
        hi: 'मिशन 2: 5-बिंदु सांविधिक सत्यापन मैट्रिक्स'
      },
      badge: {
        te: 'దశ 2/4 • ఆటోమేటెడ్ సరిపోలిక',
        en: 'Step 2 of 4 • Automated Cross-Check',
        hi: 'चरण 2/4 • स्वचालित मिलान'
      },
      objective: {
        te: 'లక్ష్యం: 4 వేర్వేరు మాన్యువల్ పోర్టల్స్ స్థానంలో ఏకీకృత ఆటోమేటిక్ ధ్రువీకరణను చూడండి.',
        en: 'Objective: Experience the automated multi-registry matrix replacing 4 disparate government databases.',
        hi: 'उद्देश्य: 4 अलग-अलग सरकारी पोर्टलों के स्थान पर एकीकृत स्वचालित सत्यापन देखें।'
      },
      description: {
        te: 'ధరణి పట్టాదారు పాస్‌బుక్, ఈ-పంట నమోదు, సమీప ఆటోమేటిక్ వాతావరణ కేంద్రం (AWS 78.5 మి.మీ వర్షం), SDRF 33% నష్ట పరిమితి, మరియు ట్రెజరీ DBT కొరకు NPCI ఆధార్ సీడింగ్ అన్నీ సెకన్లలో సరిపోల్చబడ్డాయి.',
        en: 'Dharani land title, e-Panta crop registration, nearest Automatic Weather Station telemetry (78.5mm rain verified), SDRF 33% loss threshold, and NPCI Aadhaar bank seeding are verified instantly.',
        hi: 'धरणी भूमि शीर्षक, ई-पंटा फसल पंजीकरण, एडब्ल्यूएस मौसम टेलीमेट्री (78.5 मिमी वर्षा), 33% न्यूनतम नुकसान और एनपीसीआई आधार सीडिंग सब कुछ एक क्लिक में जांचा गया है।'
      },
      actionText: {
        te: 'మ్యాట్రిక్స్ తెరవండి (Open Matrix) 🔍',
        en: 'Open Verification Matrix 🔍',
        hi: 'सत्यापन मैट्रिक्स खोलें 🔍'
      },
      executeAction: () => {
        onSelectClaim('RK-2026-0101');
        onSwitchTab('AI_AUDIT');
      }
    },
    {
      id: 'cadastral',
      missionNum: 3,
      targetClaim: 'RK-2026-0103',
      targetTab: 'CADASTRAL' as const,
      title: {
        te: 'మిషన్ 3: కాడాస్ట్రల్ GIS & మోసం గుర్తింపు (Fraud Audit)',
        en: 'Mission 3: Cadastral GIS & Fraud Anomaly Detection',
        hi: 'मिशन 3: कैडस्ट्रल जीआईएस और धोखाधड़ी की पहचान'
      },
      badge: {
        te: 'దశ 3/4 • సరిహద్దు & ఫోటో తనిఖీ',
        en: 'Step 3 of 4 • Boundary & Geotag Audit',
        hi: 'चरण 3/4 • भूखंड सीमा और जियोटैग जांच'
      },
      objective: {
        te: 'లక్ష్యం: సర్వే ప్లాట్ వెలుపల తీసిన నకిలీ జియోట్యాగ్ ఫోటోలను గుర్తించండి.',
        en: 'Objective: Detect fraudulent geotags captured outside registered land parcels.',
        hi: 'उद्देश्य: पंजीकृत सर्वेक्षण भूखंड के बाहर खींची गई संदिग्ध फोटो की पहचान करें।'
      },
      description: {
        te: 'క్లెయిమ్ RK-2026-0103 (బొల్లం లక్ష్మమ్మ) లో సమర్పించిన ఫోటో సర్వే ప్లాట్ 88/B వెలుపల 680 మీటర్ల దూరంలో తీయబడింది! సిస్టమ్ దీనిని వెంటనే ఎరుపు రంగులో ఫ్లాగ్ చేసింది.',
        en: 'In Claim RK-2026-0103 (Bollam Laxmamma), the photo EXIF GPS location was captured 680 meters OUTSIDE Survey Plot 88/B! The Cadastral GIS layer automatically flags this spatial breach in red.',
        hi: 'दावा RK-2026-0103 में क्षति फोटो सर्वेक्षण संख्या 88/B के 680 मीटर बाहर ली गई थी! जीआईएस परत ने इस उल्लंघन को तुरंत लाल रंग में चिह्नित कर दिया।'
      },
      actionText: {
        te: '680m ఉల్లంఘనను చూడండి (Inspect 680m Out-of-Bounds) 🛰️',
        en: 'Inspect 680m Boundary Breach 🛰️',
        hi: '680 मीटर भूखंड उल्लंघन देखें 🛰️'
      },
      executeAction: () => {
        onSelectClaim('RK-2026-0103');
        onSwitchTab('CADASTRAL');
      }
    },
    {
      id: 'decision',
      missionNum: 4,
      targetClaim: 'RK-2026-0101',
      targetTab: 'AI_AUDIT' as const,
      title: {
        te: 'మిషన్ 4: అధికారిక మంజూరు ప్రొసీడింగ్స్ (Official Sanctions)',
        en: 'Mission 4: Statutory Sanction Proceedings Issuance',
        hi: 'मिशन 4: आधिकारिक स्वीकृति कार्यवाही जारी करना'
      },
      badge: {
        te: 'దశ 4/4 • చట్టబద్ధమైన నిర్ణయం',
        en: 'Step 4 of 4 • Legal Adjudication',
        hi: 'चरण 4/4 • कानूनी स्वीकृति आदेश'
      },
      objective: {
        te: 'లక్ష్యం: అధికారిగా డిజిటల్ సంతకంతో ప్రభుత్వ మంజూరు ఉత్తర్వును రూపొందించండి.',
        en: 'Objective: Issue an official Government Sanction Order with digital signature & QR code.',
        hi: 'उद्देश्य: डिजिटल हस्ताक्षर और क्यूआर कोड के साथ सरकारी मंजूरी आदेश जारी करें।'
      },
      description: {
        te: 'G.O. Ms 17 ప్రకారం ₹8,500/ఎకరానికి ముత్యాల రాములుకు ₹21,250 పరిహారం సిఫార్సు చేయబడింది. అధికారిగా మీరు ఆమోదించవచ్చు, సవరించవచ్చు లేదా తిరస్కరించవచ్చు. ఇప్పుడే ఆమోదం ప్రారంభించండి.',
        en: 'Under G.O. Ms 17 norms, ₹21,250 relief is computed for Mutyala Ramulu. The officer holds sole legal sanctioning authority. Click the button below to initiate official digital approval.',
        hi: 'जी.ओ. सुश्री 17 के तहत ₹21,250 की राहत की गणना की गई है। अधिकारी के पास अंतिम मंजूरी अधिकार है। अनुमोदन प्रक्रिया शुरू करने के लिए नीचे क्लिक करें।'
      },
      actionText: {
        te: 'మంజూరు ప్రక్రియను ప్రారంభించండి (Start Sanction) ✍️',
        en: 'Start Sanction Process ✍️',
        hi: 'मंजूरी प्रक्रिया शुरू करें ✍️'
      },
      executeAction: () => {
        onSelectClaim('RK-2026-0101');
        onSwitchTab('AI_AUDIT');
        onOpenDecisionModal('APPROVE');
      }
    }
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      if (soundEnabled) playChime('next');
      tourSteps[nextIndex].executeAction();
    } else {
      if (soundEnabled) playChime('complete');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      if (soundEnabled) playChime('next');
      tourSteps[prevIndex].executeAction();
    }
  };

  const handleJump = () => {
    if (soundEnabled) playChime('jump');
    step.executeAction();
  };

  return (
    <>
      {/* 1. Minimized Floating Quest Orb */}
      {isMinimized && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-1000">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-emerald-400 hover:scale-105 transition-all text-xs font-bold"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>🎮 {lang === 'te' ? `మిషన్ ${currentStep + 1}/4` : `Mission ${currentStep + 1}/4`}</span>
            <span className="text-emerald-300">({lang === 'te' ? 'విస్తరించు' : 'Open'})</span>
          </button>
        </div>
      )}

      {/* 2. Expanded Game Walkthrough Card */}
      {!isMinimized && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] max-w-[500px]">
          <div className="bg-slate-900/95 text-white rounded-2xl shadow-2xl border-2 border-emerald-500/60 backdrop-blur-md overflow-hidden transition-all duration-300">
            {/* Top Bar with Game Quest HUD */}
            <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-4 py-2.5 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 font-mono">
                  {lang === 'te' ? 'ఆఫీసర్ ఇంటరాక్టివ్ గైడ్' : 'Officer Interactive Guide'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio Mute/Unmute */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-white/5"
                  title="Minimize"
                >
                  _
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Exit Tour"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quest Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 flex">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 transition-all duration-500 ${
                    idx <= currentStep ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Mission Body */}
            <div className="p-4 sm:p-5 space-y-3">
              {/* Badge & Title */}
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1.5 font-mono">
                  {step.badge[lang] || step.badge.en}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{step.title[lang] || step.title.en}</span>
                </h3>
              </div>

              {/* Objective Box */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 text-xs text-emerald-200 flex items-start gap-2">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  {step.objective[lang] || step.objective.en}
                </p>
              </div>

              {/* Story/Explanation */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {step.description[lang] || step.description.en}
              </p>

              {/* Interactive Jump Button (Game Action) */}
              <button
                onClick={handleJump}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] border border-emerald-400/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{step.actionText[lang] || step.actionText.en}</span>
              </button>

              {/* Navigation Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
                  <span>{currentStep + 1} / {tourSteps.length}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrev}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'te' ? 'వెనుకకు' : 'Previous'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-xs"
                  >
                    <span>
                      {currentStep === tourSteps.length - 1
                        ? (lang === 'te' ? 'ముగించు (Complete)' : 'Complete')
                        : (lang === 'te' ? 'తదుపరి మిషన్ ➜' : 'Next Mission ➜')}
                    </span>
                    {currentStep < tourSteps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
