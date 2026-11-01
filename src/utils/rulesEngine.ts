import { FarmerClaim, AnomalyFinding, CompensationCalculation, CropCategory } from '@/types/claim';

export const SDRF_RATES: Record<CropCategory, { rate: number; labelEn: string; labelTe: string }> = {
  RAINFED: {
    rate: 8500,
    labelEn: 'Rainfed Crops (Cotton, Maize, Pulses) - ₹8,500/acre',
    labelTe: 'వర్షాధార పంటలు (పత్తి, మొక్కజొన్న, కందులు) - ₹8,500/ఎకరాకు'
  },
  IRRIGATED: {
    rate: 10000,
    labelEn: 'Assured Irrigated (Paddy) - ₹10,000/acre',
    labelTe: 'నీటిపారుదల పంటలు (వరి) - ₹10,000/ఎకరాకు'
  },
  HORTICULTURE: {
    rate: 17000,
    labelEn: 'Commercial / Horticulture (Chilli, Spices) - ₹17,000/acre',
    labelTe: 'వాణిజ్య / ఉద్యాన పంటలు (మిరప) - ₹17,000/ఎకరాకు'
  }
};

export function getCropCategory(cropStr: string): CropCategory {
  if (cropStr.includes('Chilli') || cropStr.includes('మిరప')) return 'HORTICULTURE';
  if (cropStr.includes('Paddy') || cropStr.includes('వరి')) return 'IRRIGATED';
  return 'RAINFED';
}

export function computeSdrfCompensation(
  cropStr: string,
  claimedExtentAcres: number,
  totalHoldingAcres: number,
  assessedLossPct: number
): CompensationCalculation {
  const category = getCropCategory(cropStr);
  const ratePerAcre = SDRF_RATES[category].rate;
  
  // Eligible extent cannot exceed total holding or statutory cap of 5.0 acres
  const eligibleAcres = Math.min(claimedExtentAcres, totalHoldingAcres, 5.0);
  const qualifiesThreshold = assessedLossPct >= 33;

  let calculatedAmount = 0;
  if (qualifiesThreshold) {
    calculatedAmount = Math.round(eligibleAcres * ratePerAcre * (assessedLossPct >= 70 ? 1.0 : (assessedLossPct / 100)));
  }

  const statutoryMaxCap = Math.round(5.0 * ratePerAcre);
  const finalRecommendedAmount = Math.min(calculatedAmount, statutoryMaxCap);

  return {
    cropCategory: category,
    ratePerAcre,
    eligibleAcres,
    assessedLossPercentage: assessedLossPct,
    qualifiesThreshold,
    calculatedAmount,
    statutoryMaxCap,
    finalRecommendedAmount,
    normReference: 'SDRF G.O. Ms No. 17 (Disaster Mgmt Dept, 2026)'
  };
}

export function auditClaimAnomalies(claim: Partial<FarmerClaim>): AnomalyFinding[] {
  const anomalies: AnomalyFinding[] = [];

  // 1. Extent Inflation Check
  if (claim.cadastral && claim.cadastral.claimedExtentAcres > claim.cadastral.totalExtentAcres) {
    const diff = (claim.cadastral.claimedExtentAcres - claim.cadastral.totalExtentAcres).toFixed(2);
    anomalies.push({
      id: 'ANOM-EXT-01',
      severity: 'CRITICAL',
      category: 'EXTENT_MISMATCH',
      title: 'Claimed Extent Exceeds Dharani Land Record',
      titleTe: 'ధరణి రికార్డు కంటే ఎక్కువ విస్తీర్ణానికి పరిహారం కోరబడింది',
      description: `Claimed ${claim.cadastral.claimedExtentAcres} acres, but Dharani passbook verifies only ${claim.cadastral.totalExtentAcres} acres (${diff} acres excess).`,
      descriptionTe: `రైతు ${claim.cadastral.claimedExtentAcres} ఎకరాలకు దరఖాస్తు చేయగా, ధరణి పాస్‌బుక్‌లో కేవలం ${claim.cadastral.totalExtentAcres} ఎకరాలే నమోదై ఉంది (${diff} ఎకరాల వ్యత్యాసం).`,
      statuteRef: 'ROR Act Sec 4 & SDRF Rule 6(b)'
    });
  }

  // 2. Geotag distance check
  if (claim.cadastral && claim.cadastral.geotagPhotoCoords.distanceFromPlotMeters > 100) {
    const dist = claim.cadastral.geotagPhotoCoords.distanceFromPlotMeters;
    anomalies.push({
      id: 'ANOM-GPS-02',
      severity: dist > 300 ? 'CRITICAL' : 'WARNING',
      category: 'GPS_MISMATCH',
      title: 'Geotagged Damage Photo Taken Outside Survey Plot',
      titleTe: 'జియోట్యాగ్ ఫోటో సర్వే పటం సరిహద్దుకు దూరంగా ఉంది',
      description: `Camera GPS fix was recorded ${dist} meters away from Survey No. ${claim.cadastral.surveyNumber} boundary.`,
      descriptionTe: `కెమెరా GPS రీడింగ్ సర్వే నం ${claim.cadastral.surveyNumber} సరిహద్దు నుండి ${dist} మీటర్ల వెలుపల నమోదైంది.`,
      statuteRef: 'Govt Geotagging Circular 14/C'
    });
  }

  // 3. Minimum damage threshold check (< 33%)
  if (claim.claimedLossPercentage && claim.claimedLossPercentage < 33) {
    anomalies.push({
      id: 'ANOM-THR-03',
      severity: 'CRITICAL',
      category: 'THRESHOLD_FAIL',
      title: 'Crop Loss Below Statutory 33% Threshold',
      titleTe: 'పంట నష్టం చట్టబద్ధమైన 33% కనీస పరిమితి కంటే తక్కువ',
      description: `Reported crop loss is ${claim.claimedLossPercentage}%. SDRF rules mandate a minimum 33% damage for disaster compensation.`,
      descriptionTe: `నమోదైన పంట నష్టం ${claim.claimedLossPercentage}% మాత్రమే. SDRF నిబంధనల ప్రకారం కనీసం 33% నష్టం ఉంటేనే పరిహారానికి అర్హులు.`,
      statuteRef: 'SDRF Norms Section 2.1'
    });
  }

  // 4. Weather Station Anomaly Check
  if (claim.weather && claim.weather.recordedRainfallMm < 15 && !claim.weather.hailAlertTriggered && (claim.disasterType?.includes('Hail') || claim.disasterType?.includes('Flood'))) {
    anomalies.push({
      id: 'ANOM-WTH-04',
      severity: 'CRITICAL',
      category: 'WEATHER_MISMATCH',
      title: 'AWS Telemetry Contradicts Claimed Disaster',
      titleTe: 'వాతావరణ కేంద్రం (AWS) రికార్డులో విపత్తు ఆధారాలు లేవు',
      description: `Claim alleges destructive event on ${claim.incidentDate}, but nearest Mandal AWS (${claim.weather.stationName}) recorded only ${claim.weather.recordedRainfallMm} mm and zero hail alert.`,
      descriptionTe: `క్లెయిమ్‌లో తీవ్ర విపత్తు జరిగినట్లు పేర్కొనగా, సమీప AWS కేంద్రంలో కేవలం ${claim.weather.recordedRainfallMm} మి.మీ వర్షం మాత్రమే నమోదైంది; వడగండ్ల నివేదిక లేదు.`,
      statuteRef: 'IMD-TGRDW Empirical Trigger Rules'
    });
  }

  // 5. Tenant CCRC agreement check
  if (claim.isTenant && claim.documents) {
    const ccrcDoc = claim.documents.find(d => d.type === 'TENANT_CCRC');
    if (!ccrcDoc || ccrcDoc.status === 'MISSING') {
      anomalies.push({
        id: 'ANOM-TEN-05',
        severity: 'WARNING',
        category: 'BANK_FAIL',
        title: 'Missing Crop Cultivator Rights Certificate (CCRC)',
        titleTe: 'కౌలు రైతు ఒప్పంద పత్రం (CCRC) సమర్పించలేదు',
        description: 'Applicant is a tenant farmer, but the signed CCRC agreement or land owner consent letter is missing.',
        descriptionTe: 'దరఖాస్తుదారు కౌలు రైతుగా పేర్కొన్నారు, కానీ పట్టాదారు ఆమోదించిన CCRC ఒప్పంద పత్రం జతచేయలేదు.',
        statuteRef: 'Telangana Licensed Cultivators Act 2011'
      });
    }
  }

  // 6. Bank NPCI Aadhaar seeding check
  if (claim.isAadhaarSeeded === false) {
    anomalies.push({
      id: 'ANOM-BNK-06',
      severity: 'WARNING',
      category: 'BANK_FAIL',
      title: 'Bank Account Not Seeded with Aadhaar NPCI',
      titleTe: 'బ్యాంక్ ఖాతాకు ఆధార్ NPCI సీడింగ్ కాలేదు',
      description: 'DBT transfer will fail automatically at Treasury portal because Aadhaar is not linked to this IFSC/Account.',
      descriptionTe: 'ఈ ఖాతాకు ఆధార్ లింక్ కాకపోవడం వల్ల ట్రెజరీ DBT ద్వారా పరిహారం జమ కావడం విఫలమవుతుంది.',
      statuteRef: 'DBT Mission Circular 2024'
    });
  }

  return anomalies;
}
