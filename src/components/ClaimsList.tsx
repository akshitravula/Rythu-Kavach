'use client';

import React from 'react';
import { FarmerClaim, Language, ClaimStatus } from '@/types/claim';
import { translations } from '@/data/translations';
import { 
  Search, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  RotateCcw, 
  XCircle, 
  MapPin, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface ClaimsListProps {
  claims: FarmerClaim[];
  selectedClaimId: string;
  onSelectClaim: (id: string) => void;
  lang: Language;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  villageFilter: string;
  onVillageFilterChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

export const ClaimsList: React.FC<ClaimsListProps> = ({
  claims,
  selectedClaimId,
  onSelectClaim,
  lang,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  villageFilter,
  onVillageFilterChange,
  sortBy,
  onSortByChange
}) => {
  const t = translations[lang];
  const uniqueVillages = Array.from(new Set(claims.map(c => c.cadastral.village)));

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmerNameTe.includes(searchTerm) ||
      c.cadastral.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cadastral.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (villageFilter && c.cadastral.village !== villageFilter) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return c.status === 'PENDING_REVIEW' || c.status === 'FIELD_INSPECTION_REQUIRED';
    if (statusFilter === 'URGENT') return c.daysRemainingSla <= 5 && c.status === 'PENDING_REVIEW';
    if (statusFilter === 'ANOMALIES') return c.aiAudit.anomalies.length > 0;
    if (statusFilter === 'APPROVED') return c.status === 'APPROVED_SANCTIONED';
    if (statusFilter === 'RETURNED') return c.status === 'RETURNED_TO_FARMER';
    if (statusFilter === 'REJECTED') return c.status === 'REJECTED';

    return true;
  });

  filteredClaims.sort((a, b) => {
    if (sortBy === 'SLA') return a.daysRemainingSla - b.daysRemainingSla;
    if (sortBy === 'AMOUNT') return b.aiAudit.compensation.finalRecommendedAmount - a.aiAudit.compensation.finalRecommendedAmount;
    if (sortBy === 'RISK') return b.aiAudit.anomalies.length - a.aiAudit.anomalies.length;
    return 0;
  });

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'APPROVED_SANCTIONED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            {lang === 'te' ? 'మంజూరైంది' : 'Sanctioned'}
          </span>
        );
      case 'RETURNED_TO_FARMER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            {lang === 'te' ? 'సవరణకు తిప్పబడింది' : 'Returned'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            {lang === 'te' ? 'తిరస్కరించబడింది' : 'Rejected'}
          </span>
        );
      case 'FIELD_INSPECTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-700" />
            {lang === 'te' ? 'క్షేత్ర తనిఖీ' : 'Inspection'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            {lang === 'te' ? 'సమీక్షలో ఉంది' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col h-[calc(100vh-13.5rem)] min-h-[620px] overflow-hidden">
      {/* Search and Filters Header (Shrink-0, Fixed at Top) */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 space-y-2.5 bg-slate-50/60 shrink-0">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 shadow-2xs"
          />
        </div>

        {/* Filter Badges Carousel (Wrapped cleanly without scrollbars) */}
        <div className="flex flex-wrap gap-1.5 py-0.5 text-xs">
          <button
            onClick={() => onStatusFilterChange('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-[#0f2444] text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterAll} ({claims.length})
          </button>
          <button
            onClick={() => onStatusFilterChange('PENDING')}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-blue-800 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterPending}
          </button>
          <button
            onClick={() => onStatusFilterChange('URGENT')}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'URGENT'
                ? 'bg-amber-800 text-white font-semibold shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            {t.filterUrgent}
          </button>
          <button
            onClick={() => onStatusFilterChange('ANOMALIES')}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'ANOMALIES'
                ? 'bg-rose-800 text-white font-semibold shadow-xs'
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            {t.filterAnomalies}
          </button>
          <button
            onClick={() => onStatusFilterChange('APPROVED')}
            className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.filterApproved}
          </button>
        </div>

        {/* Village and Sort Controls: 2-Column Equal Grid */}
        <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
          <div>
            <select
              value={villageFilter}
              onChange={(e) => onVillageFilterChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer text-xs truncate"
            >
              <option value="">{t.filterVillage}</option>
              {uniqueVillages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer text-xs truncate"
            >
              <option value="SLA">{t.sortSla}</option>
              <option value="AMOUNT">{t.sortAmount}</option>
              <option value="RISK">{t.sortRisk}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Claim Cards Scrollable Area with Hidden Scrollbar (no-scrollbar) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">
            {lang === 'te' ? 'ఎటువంటి దరఖాస్తులు లేవు' : 'No claims found'}
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const isSelected = claim.id === selectedClaimId;
            const hasAnomalies = claim.aiAudit.anomalies.length > 0;
            const isUrgent = claim.daysRemainingSla <= 5 && claim.status === 'PENDING_REVIEW';

            return (
              <div
                key={claim.id}
                onClick={() => onSelectClaim(claim.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Top Card Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {claim.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {claim.applicationDate}
                    </span>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>

                {/* Farmer Name & Survey Details */}
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {lang === 'te' ? claim.farmerNameTe : claim.farmerName}
                    </h4>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`} />
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {t.surveyNo}: <strong className="text-slate-800">{claim.cadastral.surveyNumber}</strong>, {claim.cadastral.village}
                    </span>
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs py-1.5 px-2.5 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      {claim.crop.split(' ')[0]}
                    </span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                      {claim.cadastral.claimedExtentAcres} {t.acres}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      {t.lossReported}
                    </span>
                    <span className={`font-bold text-xs mt-0.5 block ${claim.claimedLossPercentage >= 70 ? 'text-rose-700' : 'text-amber-800'}`}>
                      {claim.claimedLossPercentage}%
                    </span>
                  </div>
                </div>

                {/* Anomaly Notification */}
                {hasAnomalies ? (
                  <div className="flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                    <span className="font-medium truncate text-xs">
                      {lang === 'te' ? claim.aiAudit.anomalies[0].titleTe : claim.aiAudit.anomalies[0].title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-medium text-xs">{t.verifiedBadge}</span>
                  </div>
                )}

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                  <div>
                    {isUrgent && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {claim.daysRemainingSla} {t.daysLeft} (SLA)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 mr-1.5">{t.recommendedRelief}:</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      ₹{claim.aiAudit.compensation.finalRecommendedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
