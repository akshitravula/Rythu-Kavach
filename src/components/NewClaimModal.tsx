'use client';

import React, { useState } from 'react';
import { FarmerClaim, Language, CropType, DisasterType, FarmerCategory } from '@/types/claim';
import { computeSdrfCompensation, auditClaimAnomalies } from '@/utils/rulesEngine';
import { X, Plus, FileCheck2 } from 'lucide-react';

interface NewClaimModalProps {
  lang: Language;
  onClose: () => void;
  onAddClaim: (newClaim: FarmerClaim) => void;
}

export const NewClaimModal: React.FC<NewClaimModalProps> = ({
  lang,
  onClose,
  onAddClaim
}) => {
  const [farmerName, setFarmerName] = useState('Challa Venkateshwarlu');
  const [farmerNameTe, setFarmerNameTe] = useState('చల్లా వెంకటేశ్వర్లు');
  const [fatherName, setFatherName] = useState('Ch. Krishnaiah');
  const [village, setVillage] = useState('Peddashapur (పెద్దషాపూర్)');
  const [mandal, setMandal] = useState('Shamshabad (శంషాబాద్)');
  const [surveyNumber, setSurveyNumber] = useState('204/B');
  const [totalExtent, setTotalExtent] = useState<number>(3.0);
  const [claimedExtent, setClaimedExtent] = useState<number>(3.0);
  const [crop, setCrop] = useState<CropType>('Cotton (పత్తి)');
  const [disasterType, setDisasterType] = useState<DisasterType>('Hailstorm (వడగండ్ల వాన)');
  const [claimedLoss, setClaimedLoss] = useState<number>(85);
  const [farmerCategory, setFarmerCategory] = useState<FarmerCategory>('SMALL');
  const [simulateAnomaly, setSimulateAnomaly] = useState<'NONE' | 'EXTENT' | 'GPS'>('NONE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomId = `RK-2026-0${Math.floor(110 + Math.random() * 880)}`;
    const actualClaimedExtent = simulateAnomaly === 'EXTENT' ? totalExtent + 2.5 : claimedExtent;
    const gpsDistance = simulateAnomaly === 'GPS' ? 520 : 15;

    const compensation = computeSdrfCompensation(
      crop,
      actualClaimedExtent,
      totalExtent,
      claimedLoss
    );

    const partialClaim: Partial<FarmerClaim> = {
      id: randomId,
      farmerName,
      farmerNameTe,
      fatherOrHusbandName: fatherName,
      fatherOrHusbandNameTe: fatherName,
      crop,
      claimedLossPercentage: claimedLoss,
      incidentDate: '2026-10-25',
      cadastral: {
        surveyNumber,
        subDivision: '1',
        village,
        mandal,
        district: 'Ranga Reddy',
        totalExtentAcres: totalExtent,
        claimedExtentAcres: actualClaimedExtent,
        dharaniPattadarName: `${farmerName} s/o ${fatherName}`,
        pattadarPassbookNo: `T08${Math.floor(100000000 + Math.random() * 900000000)}`,
        landCoordinates: {
          lat: 17.2215,
          lng: 78.4120,
          bounds: [
            [17.2208, 78.4112],
            [17.2225, 78.4115],
            [17.2222, 78.4128],
            [17.2205, 78.4125]
          ]
        },
        geotagPhotoCoords: {
          lat: simulateAnomaly === 'GPS' ? 17.2280 : 17.2216,
          lng: simulateAnomaly === 'GPS' ? 78.4190 : 78.4122,
          accuracyMeters: 4.0,
          distanceFromPlotMeters: gpsDistance,
          timestamp: new Date().toISOString(),
          bearingDegrees: 160
        }
      },
      weather: {
        stationId: 'AWS-SHMB-01',
        stationName: 'Shamshabad AWS Telemetry',
        stationDistanceKm: 4.2,
        incidentDate: '2026-10-25',
        recordedRainfallMm: 72.5,
        normalRainfallMm: 10.0,
        rainfallDeviationPct: 625,
        hailAlertTriggered: disasterType.includes('Hail'),
        maxWindSpeedKmph: 54
      },
      documents: [
        {
          id: 'D-SIM-1',
          name: 'Dharani Passbook Record',
          nameTe: 'ధరణి పాస్‌బుక్ రికార్డు',
          type: 'PASSBOOK',
          status: simulateAnomaly === 'EXTENT' ? 'MISMATCH' : 'VERIFIED',
          details: simulateAnomaly === 'EXTENT' ? 'Claimed extent exceeds Dharani holding.' : 'Verified ownership.',
          detailsTe: simulateAnomaly === 'EXTENT' ? 'విస్తీర్ణంలో వ్యత్యాసం ఉంది.' : 'సక్రమ యాజమాన్యం.'
        },
        {
          id: 'D-SIM-2',
          name: 'Geotagged Damage Photo',
          nameTe: 'జియోట్యాగ్ ఫోటో',
          type: 'GEOTAG_PHOTO',
          status: simulateAnomaly === 'GPS' ? 'SUSPICIOUS' : 'VERIFIED',
          details: simulateAnomaly === 'GPS' ? 'Camera fix outside survey boundary.' : 'Inside plot perimeter.',
          detailsTe: simulateAnomaly === 'GPS' ? 'పొలం సరిహద్దు వెలుపల తీయబడింది.' : 'పొలం లోపల తీయబడింది.'
        }
      ],
      isAadhaarSeeded: true
    };

    const anomalies = auditClaimAnomalies(partialClaim);

    const fullClaim: FarmerClaim = {
      id: randomId,
      applicationDate: new Date().toISOString().split('T')[0],
      slaDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      daysRemainingSla: 14,
      priority: anomalies.length > 0 ? 'URGENT' : 'HIGH',
      status: 'PENDING_REVIEW',
      
      farmerName,
      farmerNameTe,
      fatherOrHusbandName: fatherName,
      fatherOrHusbandNameTe: fatherName,
      aadhaarMasked: 'XXXX-XXXX-6721',
      mobile: '98490 88219',
      farmerCategory,
      isTenant: false,

      bankName: 'State Bank of India',
      accountNoMasked: 'XXXXXX9012',
      ifscCode: 'SBIN0020188',
      isAadhaarSeeded: true,

      crop,
      sownDate: '2026-07-04',
      disasterType,
      incidentDate: '2026-10-25',
      claimedLossPercentage: claimedLoss,

      cadastral: partialClaim.cadastral!,
      weather: partialClaim.weather!,
      documents: partialClaim.documents!,
      damagePhotoUrl: '/images/crops/cotton_damage.jpg',

      aiAudit: {
        confidenceScore: anomalies.length === 0 ? 95 : 62,
        summaryEn: `Automated Simulation Claim for ${farmerName} on Survey No. ${surveyNumber}, ${village}. ${anomalies.length > 0 ? `Detected ${anomalies.length} anomaly flag(s).` : 'All telemetry authenticated successfully.'}`,
        summaryTe: `${village} లోని సర్వే నం. ${surveyNumber} పై రైతు ${farmerNameTe} దాఖలు చేసిన సిమ్యులేషన్ క్లెయిమ్. ${anomalies.length > 0 ? `${anomalies.length} వ్యత్యాసాలను గుర్తించింది.` : 'అన్ని ఆధారాలు సక్రమంగా ఉన్నాయి.'}`,
        recommendation: anomalies.length > 0 ? 'INSPECT' : 'APPROVE',
        recommendationReasonEn: anomalies.length > 0 ? 'Field verification recommended due to detected anomalies.' : 'Documentation and satellite telemetry match SDRF standards.',
        recommendationReasonTe: anomalies.length > 0 ? 'గుర్తించిన వ్యత్యాసాల దృష్ట్యా క్షేత్రస్థాయి పరిశీలన అవసరం.' : 'పత్రాలు మరియు ఉపగ్రహ ఆధారాలు ప్రభుత్వ నిబంధనలకు అనుగుణంగా ఉన్నాయి.',
        anomalies,
        compensation
      },

      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'Interactive Simulation Bot',
          role: 'Demo Engine',
          action: 'New Claim Ingested into Officer Queue',
          actionTe: 'కొత్త సిమ్యులేషన్ క్లెయిమ్ విజయవంతంగా దాఖలైంది'
        }
      ]
    };

    onAddClaim(fullClaim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-3.5 bg-[#0f2444] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-blue-300" />
            <span className="font-bold text-xs uppercase tracking-wide">
              {lang === 'te' ? 'క్రొత్త పంట నష్టపరిహార దరఖాస్తు నమోదు' : 'Register New Crop Loss Relief Application'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Farmer Name (English)</label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">రైతు పేరు (తెలుగు)</label>
              <input
                type="text"
                value={farmerNameTe}
                onChange={(e) => setFarmerNameTe(e.target.value)}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Village & Mandal</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Survey Number</label>
              <input
                type="text"
                value={surveyNumber}
                onChange={(e) => setSurveyNumber(e.target.value)}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Total Holding (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={totalExtent}
                onChange={(e) => setTotalExtent(Number(e.target.value))}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Crop Sown</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value as CropType)}
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
              >
                <option value="Cotton (పత్తి)">Cotton (పత్తి)</option>
                <option value="Paddy (వరి)">Paddy (వరి)</option>
                <option value="Chilli (మిరప)">Chilli (మిరప)</option>
                <option value="Maize (మొక్కజొన్న)">Maize (మొక్కజొన్న)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-0.5 text-[11px]">Loss %</label>
              <input
                type="number"
                value={claimedLoss}
                onChange={(e) => setClaimedLoss(Number(e.target.value))}
                min={10}
                max={100}
                required
                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold text-xs"
              />
            </div>
          </div>

          {/* Test Scenario Injector */}
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800">
            <span className="font-bold flex items-center gap-1.5 mb-1.5 text-[11px]">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'te' ? 'పరిశీలన పరీక్ష నమూనా (Verification Preset):' : 'Verification Test Preset:'}</span>
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="anomaly"
                  checked={simulateAnomaly === 'NONE'}
                  onChange={() => setSimulateAnomaly('NONE')}
                  className="text-blue-800"
                />
                <span>{lang === 'te' ? 'సక్రమ దరఖాస్తు (Clean)' : 'Standard Verification'}</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="anomaly"
                  checked={simulateAnomaly === 'EXTENT'}
                  onChange={() => setSimulateAnomaly('EXTENT')}
                  className="text-blue-800"
                />
                <span>{lang === 'te' ? 'విస్తీర్ణ వ్యత్యాసం' : 'Extent Discrepancy'}</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="anomaly"
                  checked={simulateAnomaly === 'GPS'}
                  onChange={() => setSimulateAnomaly('GPS')}
                  className="text-blue-800"
                />
                <span>{lang === 'te' ? 'GPS సరిహద్దు లోపం' : 'GPS Boundary Mismatch'}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-medium text-xs"
            >
              {lang === 'te' ? 'రద్దు' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'దరఖాస్తు నమోదు చేయండి' : 'Register Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
