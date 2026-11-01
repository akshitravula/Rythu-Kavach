'use client';

import React from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle, IndianRupee } from 'lucide-react';

interface StatsOverviewProps {
  claims: FarmerClaim[];
  lang: Language;
  onFilterUrgent: () => void;
  onFilterAnomalies: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  claims,
  lang,
  onFilterUrgent,
  onFilterAnomalies
}) => {
  const t = translations[lang];

  const pendingClaims = claims.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'FIELD_INSPECTION_REQUIRED');
  const urgentSlaClaims = claims.filter(c => c.daysRemainingSla <= 5 && c.status === 'PENDING_REVIEW');
  const anomalyClaims = claims.filter(c => c.aiAudit.anomalies.length > 0 && c.status === 'PENDING_REVIEW');
  
  const sanctionedClaims = claims.filter(c => c.status === 'APPROVED_SANCTIONED');
  const sanctionedTotalAmount = sanctionedClaims.reduce(
    (acc, curr) => acc + (curr.officerDecision?.approvedAmount || curr.aiAudit.compensation.finalRecommendedAmount),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* 1. Pending Claims */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {t.kpiPendingTitle}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {pendingClaims.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {claims.length} {lang === 'te' ? 'మొత్తం దరఖాస్తులు' : 'total applications'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Urgent Attention (SLA < 5 days) */}
      <div 
        onClick={onFilterUrgent}
        className="bg-white rounded-lg p-3.5 border border-amber-300/80 hover:border-amber-500 transition-colors cursor-pointer shadow-2xs"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wide">
                {t.kpiUrgentTitle}
              </p>
            </div>
            <h3 className="text-2xl font-bold text-amber-950 mt-1">
              {urgentSlaClaims.length}
            </h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              {t.kpiUrgentSub}
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Flagged Anomalies */}
      <div 
        onClick={onFilterAnomalies}
        className="bg-white rounded-lg p-3.5 border border-rose-300/80 hover:border-rose-500 transition-colors cursor-pointer shadow-2xs"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              <p className="text-[11px] font-semibold text-rose-900 uppercase tracking-wide">
                {t.kpiFlaggedTitle}
              </p>
            </div>
            <h3 className="text-2xl font-bold text-rose-950 mt-1">
              {anomalyClaims.length}
            </h3>
            <p className="text-[11px] text-rose-700 font-medium mt-0.5">
              {t.kpiFlaggedSub}
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. Relief Sanctioned Today */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {t.kpiApprovedToday}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ₹{sanctionedTotalAmount.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {sanctionedClaims.length} {lang === 'te' ? 'రైతులకు ఆమోదించబడింది' : 'sanctioned for DBT'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
