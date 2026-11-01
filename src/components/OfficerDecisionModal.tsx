'use client';

import React, { useState } from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { 
  X, 
  CheckCircle, 
  RotateCcw, 
  XCircle, 
  ShieldAlert, 
  MessageSquare, 
  ShieldCheck,
  Send
} from 'lucide-react';

interface OfficerDecisionModalProps {
  claim: FarmerClaim;
  actionType: 'APPROVE' | 'RETURN' | 'REJECT';
  officerRole: string;
  lang: Language;
  onClose: () => void;
  onConfirmDecision: (decisionData: {
    action: 'APPROVE' | 'RETURN' | 'REJECT';
    approvedAmount?: number;
    remarks: string;
    returnReasons?: string[];
    rejectionCode?: string;
  }) => void;
}

export const OfficerDecisionModal: React.FC<OfficerDecisionModalProps> = ({
  claim,
  actionType,
  officerRole,
  lang,
  onClose,
  onConfirmDecision
}) => {
  const t = translations[lang];
  const recommendedAmount = claim.aiAudit.compensation.finalRecommendedAmount;

  // Form State
  const [approvedAmount, setApprovedAmount] = useState<number>(recommendedAmount);
  const [remarks, setRemarks] = useState('');
  
  // Return Checklist
  const defaultReturnOptions = lang === 'te' ? [
    'ఆధార్ NPCI బ్యాంక్ సీడింగ్ చేయించి ధ్రువీకరణ జతచేయండి',
    'భూ యజమాని సంతకం చేసిన CCRC కౌలు ఒప్పంద పత్రం సమర్పించండి',
    'సర్వే నంబర్ సరిహద్దు లోపల తీసిన స్పష్టమైన జియోట్యాగ్ ఫోటో అప్‌లోడ్ చేయండి',
    'AEO ధ్రువీకరించిన ఈ-పంట రసీదు జతపరచండి'
  ] : [
    'Seed Bank Account with Aadhaar NPCI DBT mapper and resubmit',
    'Upload signed CCRC Tenancy Agreement countersigned by VRO',
    'Recapture geotagged damage photo strictly inside survey plot boundary',
    'Upload AEO-certified e-Panta crop booking receipt'
  ];

  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>([]);

  // Rejection Codes
  const defaultRejectionCodes = [
    { code: 'REJ-01', label: lang === 'te' ? 'పంట నష్టం 33% కనీస చట్టబద్ధ పరిమితి కంటే తక్కువ (SDRF నిబంధన 2.1)' : 'Loss below statutory 33% minimum threshold (SDRF Rule 2.1)' },
    { code: 'REJ-02', label: lang === 'te' ? 'ధరణి రికార్డులలో ఈ సర్వే నంబర్ పై విస్తీర్ణం ధ్రువీకరించబడలేదు' : 'Survey plot / Land extent not verified in Dharani registry' },
    { code: 'REJ-03', label: lang === 'te' ? 'డూప్లికేట్ / రీసైకిల్ చేసిన ఫోటోతో మోసపూరిత క్లెయిమ్' : 'Duplicate photo hash / recycled imagery submission fraud' },
    { code: 'REJ-04', label: lang === 'te' ? 'ఈ-పంట రికార్డులో వేరే పంట లేదా బంజరు భూమిగా నమోదు' : 'e-Panta records contradict claimed crop / uncultivated fallow' }
  ];

  const [selectedRejectionCode, setSelectedRejectionCode] = useState<string>(defaultRejectionCodes[0].code);

  const toggleReturnReason = (reason: string) => {
    if (selectedReturnReasons.includes(reason)) {
      setSelectedReturnReasons(selectedReturnReasons.filter(r => r !== reason));
    } else {
      setSelectedReturnReasons([...selectedReturnReasons, reason]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onConfirmDecision({
      action: actionType,
      approvedAmount: actionType === 'APPROVE' ? approvedAmount : undefined,
      remarks,
      returnReasons: actionType === 'RETURN' ? selectedReturnReasons : undefined,
      rejectionCode: actionType === 'REJECT' ? selectedRejectionCode : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden">
        {/* Header with Institutional Identity */}
        <div className={`p-3.5 text-white flex items-center justify-between ${
          actionType === 'APPROVE'
            ? 'bg-emerald-800'
            : actionType === 'RETURN'
            ? 'bg-amber-800'
            : 'bg-rose-800'
        }`}>
          <div className="flex items-center space-x-2">
            {actionType === 'APPROVE' && <CheckCircle className="w-4 h-4" />}
            {actionType === 'RETURN' && <RotateCcw className="w-4 h-4" />}
            {actionType === 'REJECT' && <XCircle className="w-4 h-4" />}
            <span className="font-bold text-xs uppercase tracking-wide">
              {actionType === 'APPROVE'
                ? t.btnApprove
                : actionType === 'RETURN'
                ? t.btnReturn
                : t.btnReject}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/20 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Claim Summary Banner */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">{claim.id}</span>
              <h4 className="text-xs font-bold text-slate-900">
                {lang === 'te' ? claim.farmerNameTe : claim.farmerName}
              </h4>
              <p className="text-[11px] text-slate-600">
                {claim.crop} • Sy {claim.cadastral.surveyNumber}, {claim.cadastral.village}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{t.recommendedRelief}</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                ₹{recommendedAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action-Specific Inputs */}
          {actionType === 'APPROVE' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.approvedAmountInput}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(Number(e.target.value))}
                    min={0}
                    max={100000}
                    required
                    className="w-full pl-7 pr-3 py-1.5 text-xs font-bold font-mono bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {lang === 'te' ? 'SDRF నిర్దేశిత రేటు ప్రకారం లెక్కించబడింది.' : 'Calculated automatically according to SDRF G.O. Ms 17.'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600">
                  {t.digitalSignInfo}. {lang === 'te' ? 'ఆమోదం తర్వాత అధికారిక మంజూరు ప్రొసీడింగ్స్ జారీ అవుతుంది.' : 'Formal sanction order with QR code will be generated.'}
                </p>
              </div>
            </div>
          )}

          {actionType === 'RETURN' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.returnReasonsLabel}
              </label>
              <div className="space-y-1.5">
                {defaultReturnOptions.map((reason, idx) => (
                  <label
                    key={idx}
                    className="flex items-start space-x-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedReturnReasons.includes(reason)}
                      onChange={() => toggleReturnReason(reason)}
                      className="mt-0.5 rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-slate-800 leading-tight">{reason}</span>
                  </label>
                ))}
              </div>

              {/* SMS Notification Preview */}
              <div className="p-2.5 bg-amber-50/70 rounded border border-amber-200 text-amber-950">
                <div className="flex items-center space-x-1.5 font-bold mb-1 text-[11px]">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                  <span>{t.sendSmsNotice}</span>
                </div>
                <p className="text-[10px] text-amber-900 font-mono bg-white p-2 rounded border border-amber-200">
                  {lang === 'te'
                    ? `రైతు కవచ్: మీ పంట నష్ట క్లెయిమ్ #${claim.id} లో కొన్ని పత్రాల సవరణ అవసరం. దయచేసి సమీప మీసేవ కేంద్రాన్ని సంప్రదించండి - తహసీల్దార్ కార్యాలయం.`
                    : `Rythu Kavach: Claim #${claim.id} returned for document rectification. Please visit nearest MeeSeva or update online - Tahsildar Office.`}
                </p>
              </div>
            </div>
          )}

          {actionType === 'REJECT' && (
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700">
                {t.rejectionReasonLabel}
              </label>
              <div className="space-y-1.5">
                {defaultRejectionCodes.map((item) => (
                  <label
                    key={item.code}
                    className="flex items-start space-x-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <input
                      type="radio"
                      name="rejectionCode"
                      value={item.code}
                      checked={selectedRejectionCode === item.code}
                      onChange={(e) => setSelectedRejectionCode(e.target.value)}
                      className="mt-0.5 text-rose-700 focus:ring-rose-500"
                    />
                    <span className="text-[11px] text-slate-800 leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="p-2.5 bg-rose-50/70 rounded border border-rose-200 text-rose-950 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-600">
                  {lang === 'te'
                    ? 'చట్టబద్ధమైన కారణం మరియు ప్రభుత్వ ఉత్తర్వు (G.O.) నిబంధనల ఆధారంగా మాత్రమే తిరస్కరణ నమోదు చేయాలి.'
                    : 'Statutory grounds are recorded in the permanent audit trail for appellate review.'}
                </p>
              </div>
            </div>
          )}

          {/* Remarks Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.officerRemarks}
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                lang === 'te'
                  ? 'అధికారిక ఆదేశాలు లేదా పరిశీలనలు నమోదు చేయండి...'
                  : 'Enter official directives or reasoning...'
              }
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:bg-white focus:outline-none text-slate-800"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-medium text-xs"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-white font-bold text-xs shadow-xs transition-all ${
                actionType === 'APPROVE'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : actionType === 'RETURN'
                  ? 'bg-amber-800 hover:bg-amber-900'
                  : 'bg-rose-800 hover:bg-rose-900'
              }`}
            >
              <Send className="w-3 h-3" />
              <span>{t.confirmAction}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
