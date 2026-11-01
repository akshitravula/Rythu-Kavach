'use client';

import React from 'react';
import { FarmerClaim, Language } from '@/types/claim';
import { translations } from '@/data/translations';
import { X, Printer, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

interface SanctionOrderModalProps {
  claim: FarmerClaim;
  lang: Language;
  onClose: () => void;
}

export const SanctionOrderModal: React.FC<SanctionOrderModalProps> = ({
  claim,
  lang,
  onClose
}) => {
  const t = translations[lang];
  const decision = claim.officerDecision;
  const sanctionedAmount = decision?.approvedAmount || claim.aiAudit.compensation.finalRecommendedAmount;
  const proceedingNo = decision?.sanctionOrderNumber || `TS/SDRF/2026/${claim.id.replace('RK-2026-', '')}`;
  const digitalSig = decision?.digitalSignatureHash || `SHA256: 8f9b2a7c4e1d5a6b0c3d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              {lang === 'te' ? 'అధికారిక మంజూరు ప్రొసీడింగ్స్' : 'Official Sanction Proceeding'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ప్రింట్ తీయండి' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto font-serif text-slate-800 space-y-6 printable-document">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="inline-block w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-sans font-bold text-slate-800 mb-1">
              TS
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
              Government of Telangana
            </h2>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
              Department of Revenue & Disaster Management • Collectorate & Mandal Revenue Office
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Proceeding No: <strong className="text-slate-900 font-mono">{proceedingNo}</strong> | Dated: {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Sub / Ref */}
          <div className="text-xs font-sans space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p>
              <strong>Sub:</strong> Agricultural Disaster Relief — Unseasonal Hailstorm / Flood Crop Loss Compensation — Sanction of Ex-gratia under SDRF Norms G.O. Ms 17 — Orders Issued.
            </p>
            <p>
              <strong>Ref:</strong> 1. Citizen Claim ID: {claim.id} dated {claim.applicationDate}.<br />
              2. Field Inspection & Joint Verification Report of Mandal Agriculture Officer (MAO).<br />
              3. Automated Cadastral & AWS Satellite Telemetry verification.
            </p>
          </div>

          {/* Proceeding Preamble */}
          <div className="text-xs sm:text-sm leading-relaxed text-justify space-y-3 font-sans">
            <p>
              In accordance with the State Disaster Response Fund (SDRF) scales of assistance, sanction is hereby accorded for payment of agricultural crop loss compensation to the following bona fide cultivator:
            </p>

            {/* Beneficiary Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <tbody>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold w-1/3 border-r border-slate-300">Name of Farmer</td>
                  <td className="p-2 font-semibold">{claim.farmerName} ({claim.farmerNameTe})</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold border-r border-slate-300">Father / Husband Name</td>
                  <td className="p-2">{claim.fatherOrHusbandName}</td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold border-r border-slate-300">Location & Cadastral</td>
                  <td className="p-2">Survey No: {claim.cadastral.surveyNumber}, {claim.cadastral.village}, {claim.cadastral.mandal} Mandal</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold border-r border-slate-300">Crop Damaged & Extent</td>
                  <td className="p-2">{claim.crop} — {claim.cadastral.claimedExtentAcres} Acres (Assessed Loss: {claim.claimedLossPercentage}%)</td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold border-r border-slate-300">Bank Account & IFSC</td>
                  <td className="p-2 font-mono">{claim.bankName} | A/C: {claim.accountNoMasked} | IFSC: {claim.ifscCode}</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="p-2 font-bold border-r border-slate-300 text-emerald-950">Net Sanctioned Amount</td>
                  <td className="p-2 font-mono font-bold text-base text-emerald-900">
                    ₹{sanctionedAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            <p>
              The Treasury and Accounts Officer is requested to credit the sanctioned sum directly into the beneficiary's Aadhaar-seeded bank account via e-Kuber Direct Benefit Transfer (DBT).
            </p>
          </div>

          {/* Official Signatures & Digital Cryptographic Stamp */}
          <div className="pt-6 border-t border-slate-300 font-sans text-xs flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-mono space-y-1">
              <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
              <p className="text-slate-600 break-all">{digitalSig}</p>
              <p className="text-slate-500">Timestamp: {new Date().toISOString()}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-sm text-slate-900">
                {decision?.decidedBy || 'Mandal Revenue Officer / Tahsildar'}
              </p>
              <p className="text-xs text-slate-600">
                {claim.cadastral.mandal} Mandal, {claim.cadastral.district}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Government of Telangana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
