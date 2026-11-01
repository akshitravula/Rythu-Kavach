'use client';

import React, { useState } from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { CadastralViewer } from '@/components/CadastralViewer';
import { WeatherViewer } from '@/components/WeatherViewer';
import { AiAssistantTab } from '@/components/AiAssistantTab';
import { 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Compass, 
  CloudRain, 
  CheckCircle, 
  RotateCcw, 
  XCircle, 
  Printer, 
  Calendar,
  AlertCircle,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck2
} from 'lucide-react';

interface ClaimDetailProps {
  claim: FarmerClaim;
  lang: Language;
  officerRole: string;
  onOpenDecisionModal: (type: 'APPROVE' | 'RETURN' | 'REJECT') => void;
  onOpenSanctionOrder: () => void;
  activeTab?: 'SUMMARY' | 'CADASTRAL' | 'WEATHER' | 'DOCS' | 'AI_AUDIT';
  onTabChange?: (tab: 'SUMMARY' | 'CADASTRAL' | 'WEATHER' | 'DOCS' | 'AI_AUDIT') => void;
}

export const ClaimDetail: React.FC<ClaimDetailProps> = ({
  claim,
  lang,
  officerRole,
  onOpenDecisionModal,
  onOpenSanctionOrder,
  activeTab: propActiveTab,
  onTabChange
}) => {
  const t = translations[lang];
  const [internalTab, setInternalTab] = useState<'SUMMARY' | 'CADASTRAL' | 'WEATHER' | 'DOCS' | 'AI_AUDIT'>('AI_AUDIT');
  const activeTab = propActiveTab ?? internalTab;

  const setActiveTab = (tab: 'SUMMARY' | 'CADASTRAL' | 'WEATHER' | 'DOCS' | 'AI_AUDIT') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const isApproved = claim.status === 'APPROVED_SANCTIONED';

  const getDocStatusBadge = (status: 'VERIFIED' | 'MISMATCH' | 'MISSING' | 'SUSPICIOUS') => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            {lang === 'te' ? 'ధ్రువీకరించబడింది' : 'Verified'}
          </span>
        );
      case 'MISMATCH':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            {lang === 'te' ? 'వ్యత్యాసం' : 'Mismatch'}
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            {lang === 'te' ? 'సమర్పించలేదు' : 'Missing'}
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-900 bg-rose-100 px-2.5 py-1 rounded border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-800" />
            {lang === 'te' ? 'అనుమానాస్పదం' : 'Suspicious'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col h-[calc(100vh-13.5rem)] min-h-[620px] overflow-hidden">
      {/* 1. Top Identity Header (Spacious & Authoritative) */}
      <div className="p-4 sm:p-5 bg-[#0f2444] text-white border-b border-[#1b3966] shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-xs">
              <span className="font-mono font-bold bg-white/10 text-slate-100 px-2.5 py-0.5 rounded border border-white/20 text-xs">
                {claim.id}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 flex items-center gap-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {claim.applicationDate}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300 font-semibold flex items-center gap-1 text-xs">
                <Clock className="w-3.5 h-3.5" />
                {claim.daysRemainingSla} {t.daysLeft} (SLA)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {lang === 'te' ? claim.farmerNameTe : claim.farmerName}
              <span className="text-sm font-normal text-slate-300 ml-2.5">
                ({claim.farmerName})
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-300 shrink-0" />
              <span>
                {t.surveyNo}: <strong>{claim.cadastral.surveyNumber}</strong>, {claim.cadastral.village}, {claim.cadastral.mandal} Mandal, {claim.cadastral.district}
              </span>
            </p>
          </div>

          {/* Right Header: Sanction Button & Relief Amount */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {isApproved && (
              <button
                onClick={onOpenSanctionOrder}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t.generateOrderBtn}</span>
              </button>
            )}

            <div className="text-left sm:text-right bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold tracking-wider">
                {t.recommendedRelief}
              </span>
              <span className="text-2xl font-bold text-amber-300 font-mono">
                ₹{claim.aiAudit.compensation.finalRecommendedAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs Bar */}
      <div className="flex items-center bg-slate-50/70 border-b border-slate-200 px-4 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('AI_AUDIT')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap text-xs ${
            activeTab === 'AI_AUDIT'
              ? 'border-blue-700 text-blue-900 font-bold bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-700" />
          <span>{t.tabAiAudit}</span>
          {claim.aiAudit.anomalies.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono">
              {claim.aiAudit.anomalies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('CADASTRAL')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap text-xs ${
            activeTab === 'CADASTRAL'
              ? 'border-blue-700 text-blue-900 font-bold bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-slate-600" />
          <span>{t.tabCadastral}</span>
        </button>

        <button
          onClick={() => setActiveTab('WEATHER')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap text-xs ${
            activeTab === 'WEATHER'
              ? 'border-blue-700 text-blue-900 font-bold bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CloudRain className="w-4 h-4 text-slate-600" />
          <span>{t.tabWeather}</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap text-xs ${
            activeTab === 'DOCS'
              ? 'border-blue-700 text-blue-900 font-bold bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>{t.tabDocuments}</span>
          <span className="text-[10px] text-slate-400">({claim.documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap text-xs ${
            activeTab === 'SUMMARY'
              ? 'border-blue-700 text-blue-900 font-bold bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-slate-600" />
          <span>{t.tabSummary}</span>
        </button>
      </div>

      {/* 3. Tab Content (Clean, Internal Scroll, Hidden Scrollbar) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
        {/* Tab: AI Audit & Co-pilot */}
        {activeTab === 'AI_AUDIT' && (
          <AiAssistantTab claim={claim} lang={lang} />
        )}

        {/* Tab: Cadastral Map & Geotag */}
        {activeTab === 'CADASTRAL' && (
          <CadastralViewer
            cadastral={claim.cadastral}
            damagePhotoUrl={claim.damagePhotoUrl}
            lang={lang}
          />
        )}

        {/* Tab: Weather & AWS Telemetry */}
        {activeTab === 'WEATHER' && (
          <WeatherViewer
            weather={claim.weather}
            disasterType={claim.disasterType}
            incidentDate={claim.incidentDate}
            lang={lang}
          />
        )}

        {/* Tab: Verified Documents */}
        {activeTab === 'DOCS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t.tabDocuments} ({claim.documents.length})
              </h3>
              <span className="text-xs text-slate-500">
                {lang === 'te' ? 'ఈ-పంట & ధరణి రికార్డుల ధ్రువీకరణ' : 'e-Panta & Dharani Land Records Telemetry'}
              </span>
            </div>

            <div className="space-y-3">
              {claim.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2 rounded bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {lang === 'te' ? doc.nameTe : doc.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {lang === 'te' ? doc.detailsTe : doc.details}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">{getDocStatusBadge(doc.status)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Farmer Profile & Land Tenure Dossier */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-5 text-xs">
            {/* Bio Grid */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <User className="w-4 h-4 text-slate-700" />
                <span>{t.farmerInfoTitle}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-500 block text-xs">{t.farmerName}</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {lang === 'te' ? claim.farmerNameTe : claim.farmerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.fatherName}</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                    {lang === 'te' ? claim.fatherOrHusbandNameTe : claim.fatherOrHusbandName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.aadhaarNo}</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">{claim.aadhaarMasked}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.mobileNo}</span>
                  <span className="font-mono text-slate-800 text-xs mt-0.5 block">{claim.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.farmerCategory}</span>
                  <span className="font-semibold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-1 text-xs">
                    {claim.farmerCategory === 'MARGINAL' ? t.categoryMarginal : claim.farmerCategory === 'SMALL' ? t.categorySmall : t.categoryTenant}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.passbookNo}</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{claim.cadastral.pattadarPassbookNo}</span>
                </div>
              </div>
            </div>

            {/* Bank Card */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>{t.bankDetails}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block text-xs">{t.bankName}</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{claim.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.accNo}</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">{claim.accountNoMasked}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.ifsc}</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">{claim.ifscCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">{t.npciStatus}</span>
                  <span className={`inline-block mt-1 font-bold text-xs ${
                    claim.isAadhaarSeeded ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {claim.isAadhaarSeeded ? t.npciActive : t.npciFailed}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <History className="w-4 h-4 text-slate-700" />
                <span>{lang === 'te' ? 'ఆడిట్ లాగ్ & హిస్టరీ' : 'Audit Trail & Official History'}</span>
              </h4>
              <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-1">
                {claim.auditTrail.map((log) => (
                  <div key={log.id} className="relative pb-2">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-700 border-2 border-white"></span>
                    <div className="text-xs">
                      <span className="font-bold text-slate-900">{log.actor}</span>
                      <span className="text-slate-400 text-xs ml-2 font-mono">({log.timestamp})</span>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        {lang === 'te' ? log.actionTe : log.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Officer Decision Center Footer (Pinned to Bottom, Zero Empty Space) */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-slate-700">
          <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-slate-800 shrink-0" />
            <span>{t.officerDecisionTitle}</span>
          </span>
        </div>

        {/* Action Buttons: Clean, Single-Line, Authoritative */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
          <button
            onClick={() => onOpenDecisionModal('REJECT')}
            className="h-10 px-4 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-slate-300 hover:border-rose-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="whitespace-nowrap">{t.btnReject}</span>
          </button>

          <button
            onClick={() => onOpenDecisionModal('RETURN')}
            className="h-10 px-4 rounded-lg bg-white hover:bg-amber-50 text-amber-900 border border-slate-300 hover:border-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="whitespace-nowrap">{t.btnReturn}</span>
          </button>

          <button
            onClick={() => onOpenDecisionModal('APPROVE')}
            className="h-10 px-5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.btnApprove}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
