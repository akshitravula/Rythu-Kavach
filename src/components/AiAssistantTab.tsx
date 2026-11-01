'use client';

import React, { useState } from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  Calculator, 
  Search, 
  User, 
  HelpCircle,
  Scale,
  Building2,
  FileText,
  MapPin,
  CloudRain,
  CreditCard,
  Layers
} from 'lucide-react';

interface AiAssistantTabProps {
  claim: FarmerClaim;
  lang: Language;
}

interface DocketQueryRecord {
  id: string;
  query: string;
  response: string;
  timestamp: string;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ claim, lang }) => {
  const t = translations[lang];
  const { aiAudit } = claim;

  // Docket Inquiry History
  const [inquiryHistory, setInquiryHistory] = useState<DocketQueryRecord[]>([
    {
      id: 'init-1',
      query: lang === 'te' ? 'ధరణి భూ రికార్డుల సరిపోలిక స్థితి ఏమిటి?' : 'What is the Dharani land registry verification status?',
      response: lang === 'te'
        ? `ధరణి డేటాబేస్ ప్రకారం, సర్వే నం. ${claim.cadastral.surveyNumber} లో పట్టాదారు ${claim.cadastral.dharaniPattadarName} పేరిట నమోదిత విస్తీర్ణం ${claim.cadastral.totalExtentAcres} ఎకరాలు. ${claim.cadastral.claimedExtentAcres > claim.cadastral.totalExtentAcres ? `హెచ్చరిక: దరఖాస్తుదారు క్లెయిమ్ చేసిన విస్తీర్ణం (${claim.cadastral.claimedExtentAcres} ఎకరాలు) ధరణి రికార్డు కంటే ${(claim.cadastral.claimedExtentAcres - claim.cadastral.totalExtentAcres).toFixed(2)} ఎకరాలు అధికంగా ఉంది.` : 'ధరణి రికార్డులతో క్లెయిమ్ విస్తీర్ణం సంపూర్ణంగా సరిపోయింది.'}`
        : `According to the Dharani Land Registry, Survey No. ${claim.cadastral.surveyNumber} holds ${claim.cadastral.totalExtentAcres} acres under Pattadar ${claim.cadastral.dharaniPattadarName}. ${claim.cadastral.claimedExtentAcres > claim.cadastral.totalExtentAcres ? `Exception: Claimed extent (${claim.cadastral.claimedExtentAcres} acres) exceeds Dharani passbook holding by ${(claim.cadastral.claimedExtentAcres - claim.cadastral.totalExtentAcres).toFixed(2)} acres.` : 'All ownership and extent entries match Dharani records perfectly.'}`,
      timestamp: 'Scrutiny Ingest'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Suggested official inquiry queries
  const quickQueries = lang === 'te' ? [
    'SDRF పరిహార గణన సూత్రం ఏమిటి?',
    'ఈ సర్వే నంబర్ పై ఇతర క్లెయిమ్‌లు నమోదయ్యాయా?',
    'సవరణ నోటీసులో ఏ పత్రాలు కోరాలి?'
  ] : [
    'Explain the SDRF scale of norms formula applied.',
    'Are there overlapping claims on this survey number?',
    'List deficient documents required for rectification.'
  ];

  const handleRunInquiry = (queryText: string) => {
    if (!queryText.trim()) return;

    setIsSearching(true);
    const q = queryText.toLowerCase();

    setTimeout(() => {
      let reply = '';

      if (q.includes('sdrf') || q.includes('formula') || q.includes('పరిహారం') || q.includes('గణన') || q.includes('scale') || q.includes('రేటు')) {
        reply = lang === 'te'
          ? `SDRF G.O. Ms No. 17 ప్రకారం: పంట వర్గం (${claim.crop}) నిర్దేశిత రేటు ఎకరాకు ₹${aiAudit.compensation.ratePerAcre.toLocaleString('en-IN')}. అర్హతగల విస్తీర్ణం ${aiAudit.compensation.eligibleAcres} ఎకరాలు (గరిష్ట పరిమితి 5 ఎకరాలు), నిర్ధారించిన నష్టం ${aiAudit.compensation.assessedLossPercentage}%. చట్టబద్ధమైన మొత్తం పరిహార అర్హత: ₹${aiAudit.compensation.finalRecommendedAmount.toLocaleString('en-IN')}.`
          : `Under SDRF G.O. Ms No. 17: Prescribed norm for ${claim.crop} is ₹${aiAudit.compensation.ratePerAcre.toLocaleString('en-IN')}/acre. Multiplying eligible extent (${aiAudit.compensation.eligibleAcres} acres, capped at 5.0 acres ceiling) by assessed damage (${aiAudit.compensation.assessedLossPercentage}%) yields a statutory entitlement of ₹${aiAudit.compensation.finalRecommendedAmount.toLocaleString('en-IN')}.`;
      } else if (q.includes('overlap') || q.includes('claim') || q.includes('సర్వే') || q.includes('ఇతర') || q.includes('dharani') || q.includes('భూమి')) {
        reply = lang === 'te'
          ? `సర్వే నం. ${claim.cadastral.surveyNumber} (${claim.cadastral.village} గ్రామం): ప్రస్తుత సీజన్‌లో ఈ సర్వే సంఖ్యపై వేరే ఎటువంటి క్లెయిమ్ నమోదు కాలేదు. గత విపత్తు చెల్లింపులలో ఎటువంటి బకాయిలు లేదా డూప్లికేట్ ఎంట్రీలు లేవు.`
          : `Survey No. ${claim.cadastral.surveyNumber} (${claim.cadastral.village}): Cross-registry verification confirms zero overlapping claims for the current agricultural season. No duplicate ledger entries detected.`;
      } else if (q.includes('doc') || q.includes('defect') || q.includes('పత్రాలు') || q.includes('సవరణ') || q.includes('నోటీసు') || q.includes('ccrc')) {
        const flaggedDocs = claim.documents.filter(d => d.status !== 'VERIFIED');
        reply = lang === 'te'
          ? flaggedDocs.length > 0 
            ? `ఈ దరఖాస్తులో క్రింది పత్రాల లోపాలు ఉన్నాయి: ${flaggedDocs.map(d => `${d.nameTe} (${d.detailsTe})`).join('; ')}. అధికారి 'సవరణకు తిప్పి పంపండి' ఆప్షన్ ద్వారా నోటీసు జారీ చేయవచ్చు.`
            : 'ఈ దరఖాస్తులోని అన్ని పత్రాలు (ధరణి పాస్‌బుక్, ఈ-పంట, జియోట్యాగ్ ఫోటో, ఆధార్ సీడింగ్) సక్రమంగా ధ్రువీకరించబడ్డాయి.'
          : flaggedDocs.length > 0
            ? `Documentation exceptions identified: ${flaggedDocs.map(d => `${d.name} (${d.details})`).join('; ')}. Select 'Return for Rectification' to notify applicant with official checklist.`
            : 'All mandatory enclosures (Dharani RoR-1B, e-Panta crop entry, geotag photograph, Aadhaar NPCI DBT seeding) are fully verified.';
      } else {
        reply = lang === 'te'
          ? `దరఖాస్తు సంఖ్య ${claim.id} (${claim.farmerNameTe}): చట్టబద్ధమైన సమీక్ష సిఫార్సు: ${aiAudit.recommendationReasonTe}`
          : `Application ${claim.id} (${claim.farmerName}): Statutory scrutiny finding: ${aiAudit.recommendationReasonEn}`;
      }

      setInquiryHistory(prev => [
        ...prev,
        {
          id: `inq-${Date.now()}`,
          query: queryText,
          response: reply,
          timestamp: 'Just now'
        }
      ]);
      setInputQuery('');
      setIsSearching(false);
    }, 350);
  };

  const hasAnomalies = aiAudit.anomalies.length > 0;

  return (
    <div className="space-y-4">
      {/* 1. Official Scrutiny Status & Statutory Compliance Card */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                  {lang === 'te' ? 'చట్టబద్ధమైన పరిశీలన నివేదిక' : 'Statutory Scrutiny & Cross-Verification'}
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  G.O. Ms No. 17
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'te' 
                  ? 'ధరణి భూ రికార్డులు, ఉపగ్రహ సరిహద్దులు, వాతావరణ ఆధారాలు & ఆధార్ DBT సమగ్ర పరిశీలన' 
                  : 'Automated synthesis across Dharani RoR, Cadastral GIS, AWS Telemetry & NPCI DBT'}
              </p>
            </div>
          </div>

          {/* Statutory Qualification Status */}
          <div className="self-start sm:self-auto">
            {!hasAnomalies ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'te' ? 'SDRF నిబంధనల ప్రకారం అర్హత కలిగినది' : 'QUALIFIED AS PER SDRF NORMS'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>{lang === 'te' ? 'వ్యత్యాసాలు కలవు - క్షేత్ర పరిశీలన అవసరం' : 'POLICY EXCEPTIONS DETECTED'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Executive Case Summary */}
        <div className="mt-3.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {t.executiveSummary}
          </span>
          <div className="bg-slate-50/80 p-3.5 rounded-md border border-slate-200 text-xs text-slate-800 leading-relaxed">
            {lang === 'te' ? aiAudit.summaryTe : aiAudit.summaryEn}
          </div>
        </div>
      </div>

      {/* 2. Five-Point Multi-Registry Verification Matrix */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
          <Layers className="w-3.5 h-3.5 text-slate-700" />
          <span>{lang === 'te' ? 'శాసనబద్ధమైన సరిపోలిక నివేదిక (5-పాయింట్ తనిఖీ)' : 'Multi-Registry Statutory Verification Matrix'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {/* Check 1: Dharani Extent */}
          <div className="p-3 rounded border bg-slate-50/60 border-slate-200 flex items-start space-x-2.5">
            <Building2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. {lang === 'te' ? 'ధరణి భూ రికార్డులు (RoR-1B)' : 'Dharani Land Registry'}</span>
                {claim.cadastral.claimedExtentAcres <= claim.cadastral.totalExtentAcres ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {lang === 'te' ? 'సరిపోయింది' : 'Verified'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    {lang === 'te' ? 'విస్తీర్ణం వ్యత్యాసం' : 'Extent Excess'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'te'
                  ? `నమోదిత విస్తీర్ణం: ${claim.cadastral.totalExtentAcres} ఎకరాలు | క్లెయిమ్: ${claim.cadastral.claimedExtentAcres} ఎకరాలు`
                  : `Dharani holding: ${claim.cadastral.totalExtentAcres} ac | Claimed: ${claim.cadastral.claimedExtentAcres} ac`}
              </p>
            </div>
          </div>

          {/* Check 2: Cadastral Satellite GPS */}
          <div className="p-3 rounded border bg-slate-50/60 border-slate-200 flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. {lang === 'te' ? 'ఉపగ్రహ సరిహద్దు (TS-GIS)' : 'Cadastral Boundary'}</span>
                {claim.cadastral.geotagPhotoCoords.distanceFromPlotMeters <= 100 ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {lang === 'te' ? 'సరిహద్దులో ఉంది' : 'Inside Plot'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    {lang === 'te' ? 'సరిహద్దు వెలుపల' : 'Outside Boundary'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'te'
                  ? `ఫోటో తీసిన దూరం: సరిహద్దు నుండి ${claim.cadastral.geotagPhotoCoords.distanceFromPlotMeters} మీటర్లు (పరిమితి: 50మీ)`
                  : `Photo GPS fix: ${claim.cadastral.geotagPhotoCoords.distanceFromPlotMeters}m from boundary (tolerance: 50m)`}
              </p>
            </div>
          </div>

          {/* Check 3: AWS Weather Corroboration */}
          <div className="p-3 rounded border bg-slate-50/60 border-slate-200 flex items-start space-x-2.5">
            <CloudRain className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. {lang === 'te' ? 'వాతావరణ కేంద్ర నివేదిక (AWS)' : 'AWS Weather Telemetry'}</span>
                {claim.weather.recordedRainfallMm >= 30 || claim.weather.hailAlertTriggered ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {lang === 'te' ? 'ధ్రువీకరించబడింది' : 'Corroborated'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {lang === 'te' ? 'తక్కువ తీవ్రత' : 'Sub-Threshold'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'te'
                  ? `${claim.weather.stationName}: వర్షపాతం ${claim.weather.recordedRainfallMm} మి.మీ (సాధారణం: ${claim.weather.normalRainfallMm} మి.మీ)`
                  : `${claim.weather.stationName}: ${claim.weather.recordedRainfallMm}mm rainfall (Norm: ${claim.weather.normalRainfallMm}mm)`}
              </p>
            </div>
          </div>

          {/* Check 4: Statutory Damage Cutoff */}
          <div className="p-3 rounded border bg-slate-50/60 border-slate-200 flex items-start space-x-2.5">
            <Calculator className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">4. {lang === 'te' ? 'కనీస నష్ట పరిమితి (SDRF Sec 3.1)' : 'Statutory 33% Loss Cutoff'}</span>
                {claim.claimedLossPercentage >= 33 ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {lang === 'te' ? 'అర్హత (≥ 33%)' : 'Eligible (≥ 33%)'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    {lang === 'te' ? 'అనర్హత (< 33%)' : 'Ineligible (< 33%)'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'te'
                  ? `నివేదించిన నష్టం: ${claim.claimedLossPercentage}% (SDRF నిబంధనల ప్రకారం కనీసం 33% నష్టం ఉండాలి)`
                  : `Reported crop damage: ${claim.claimedLossPercentage}% (SDRF statutory threshold: min 33%)`}
              </p>
            </div>
          </div>

          {/* Check 5: NPCI Aadhaar Banking DBT */}
          <div className="p-3 rounded border bg-slate-50/60 border-slate-200 flex items-start space-x-2.5 md:col-span-2">
            <CreditCard className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">5. {lang === 'te' ? 'బ్యాంక్ ఖాతా ఆధార్ NPCI సీడింగ్ (ట్రెజరీ DBT)' : 'PFMS / Aadhaar NPCI DBT Seeding'}</span>
                {claim.isAadhaarSeeded ? (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {lang === 'te' ? 'DBT సిద్ధం (Active)' : 'DBT Ready'}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    {lang === 'te' ? 'సీడింగ్ కాలేదు (Failed)' : 'Not Seeded'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'te'
                  ? `${claim.bankName} - ఖాతా: ${claim.accountNoMasked} (IFSC: ${claim.ifscCode}). ${claim.isAadhaarSeeded ? 'నేరుగా నిధుల బదిలీకి అర్హత కలదు.' : 'ట్రెజరీ చెల్లింపు తిరస్కరణకు గురయ్యే అవకాశం ఉంది.'}`
                  : `${claim.bankName} - Acc: ${claim.accountNoMasked} (IFSC: ${claim.ifscCode}). ${claim.isAadhaarSeeded ? 'Electronic direct benefit transfer enabled.' : 'DBT transfer will fail at Treasury portal.'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Discrepancy Findings (if any) */}
      {hasAnomalies && (
        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.anomalyFindingsTitle}</span>
            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {aiAudit.anomalies.length}
            </span>
          </h4>

          <div className="space-y-2.5">
            {aiAudit.anomalies.map((anom) => (
              <div
                key={anom.id}
                className={`p-3 rounded border text-xs ${
                  anom.severity === 'CRITICAL'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="font-bold">
                    {lang === 'te' ? anom.titleTe : anom.title}
                  </span>
                  {anom.statuteRef && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-700 self-start sm:self-auto">
                      {anom.statuteRef}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {lang === 'te' ? anom.descriptionTe : anom.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Statutory Scale of Norms Compensation Table (G.O. Ms 17) */}
      <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
          <Calculator className="w-3.5 h-3.5 text-slate-700" />
          <span>{t.statutoryCalcTitle}</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-2.5">{t.cropCategory}</th>
                <th className="p-2.5">{t.normRatePerAcre}</th>
                <th className="p-2.5">{t.eligibleAcres}</th>
                <th className="p-2.5">{t.assessedLoss}</th>
                <th className="p-2.5 text-right">{t.calculatedRelief}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 text-xs">
              <tr>
                <td className="p-2.5 font-medium">{claim.crop}</td>
                <td className="p-2.5 font-mono">₹{aiAudit.compensation.ratePerAcre.toLocaleString('en-IN')}</td>
                <td className="p-2.5 font-mono">{aiAudit.compensation.eligibleAcres} {t.acres} (Max 5.0 ac)</td>
                <td className="p-2.5 font-mono">{aiAudit.compensation.assessedLossPercentage}%</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900 text-sm">
                  ₹{aiAudit.compensation.finalRecommendedAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Statutory Assessment & Recommended Action */}
      <div className={`p-4 rounded-lg border text-xs ${
        aiAudit.recommendation === 'APPROVE'
          ? 'bg-emerald-50/70 border-emerald-300'
          : aiAudit.recommendation === 'RETURN'
          ? 'bg-amber-50/70 border-amber-300'
          : 'bg-rose-50/70 border-rose-300'
      }`}>
        <div className="flex items-center space-x-2 mb-1.5">
          <Scale className="w-4 h-4 text-slate-800" />
          <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
            {t.aiRecommendationTitle}
          </h4>
        </div>
        <p className="text-slate-800 leading-relaxed font-medium pl-6">
          {lang === 'te' ? aiAudit.recommendationReasonTe : aiAudit.recommendationReasonEn}
        </p>
      </div>

      {/* 6. Official Docket Inquiry & Regulation Search Console */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-bold text-xs">{t.askAiTitle}</span>
          </div>
          <span className="text-slate-400 text-[10px] font-mono">
            TELANGANA DISASTER MGMT MANUAL
          </span>
        </div>

        {/* Inquiry Record Stream */}
        <div className="p-3.5 space-y-2.5 bg-slate-50/60 text-xs max-h-56 overflow-y-auto no-scrollbar">
          {inquiryHistory.map((rec) => (
            <div key={rec.id} className="p-3 rounded bg-white border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-slate-400" />
                  {rec.query}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{rec.timestamp}</span>
              </div>
              <p className="text-slate-800 text-[11px] leading-relaxed pt-1 border-t border-slate-100">
                {rec.response}
              </p>
            </div>
          ))}

          {isSearching && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs p-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse"></span>
              <span>{lang === 'te' ? 'నిబంధనల రికార్డులను శోధిస్తోంది...' : 'Retrieving statutory ledger records...'}</span>
            </div>
          )}
        </div>

        {/* Quick Inquiry Buttons */}
        <div className="px-3.5 py-2 bg-slate-100/70 border-t border-slate-200 flex flex-wrap gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            {lang === 'te' ? 'త్వరిత విచారణలు:' : 'Quick Inquiries:'}
          </span>
          {quickQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleRunInquiry(q)}
              className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300 transition-colors text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Inquiry Input Bar */}
        <div className="p-2.5 border-t border-slate-200 bg-white flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunInquiry(inputQuery);
            }}
            placeholder={t.askAiPlaceholder}
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
          <button
            onClick={() => handleRunInquiry(inputQuery)}
            disabled={!inputQuery.trim() || isSearching}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.askAiBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
