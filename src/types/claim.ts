export type Language = 'te' | 'en' | 'hi';

export type ClaimStatus = 
  | 'PENDING_REVIEW'
  | 'FIELD_INSPECTION_REQUIRED'
  | 'APPROVED_SANCTIONED'
  | 'RETURNED_TO_FARMER'
  | 'REJECTED';

export type PriorityLevel = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export type CropType = 
  | 'Cotton (పత్తి)' 
  | 'Paddy (వరి)' 
  | 'Chilli (మిరప)' 
  | 'Maize (మొక్కజొన్న)' 
  | 'Red Gram (కందులు)'
  | 'Soybean (సోయాబీన్)';

export type CropCategory = 'RAINFED' | 'IRRIGATED' | 'HORTICULTURE';

export type DisasterType = 
  | 'Hailstorm (వడగండ్ల వాన)' 
  | 'Inundation / Floods (వరద ముంపు)' 
  | 'Severe Drought (తీవ్ర కరువు)' 
  | 'Unseasonal Rains (అకాల వర్షాలు)' 
  | 'Gale Winds / Lodging (ఈదురు గాలులు)';

export type FarmerCategory = 'MARGINAL' | 'SMALL' | 'MEDIUM' | 'TENANT';

export interface DocumentVerification {
  id: string;
  name: string;
  nameTe: string;
  type: 'PASSBOOK' | 'E_PANTA' | 'GEOTAG_PHOTO' | 'BANK_PASSBOOK' | 'TENANT_CCRC';
  status: 'VERIFIED' | 'MISMATCH' | 'MISSING' | 'SUSPICIOUS';
  details: string;
  detailsTe: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}

export interface AnomalyFinding {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'EXTENT_MISMATCH' | 'GPS_MISMATCH' | 'PHOTO_FRAUD' | 'WEATHER_MISMATCH' | 'THRESHOLD_FAIL' | 'BANK_FAIL';
  title: string;
  titleTe: string;
  description: string;
  descriptionTe: string;
  statuteRef?: string;
}

export interface CadastralInfo {
  surveyNumber: string;
  subDivision: string;
  village: string;
  mandal: string;
  district: string;
  totalExtentAcres: number;
  claimedExtentAcres: number;
  dharaniPattadarName: string;
  pattadarPassbookNo: string;
  landCoordinates: {
    lat: number;
    lng: number;
    bounds: [number, number][]; // Polygon coordinates
  };
  geotagPhotoCoords: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    distanceFromPlotMeters: number;
    timestamp: string;
    bearingDegrees: number;
  };
}

export interface WeatherTelemetry {
  stationId: string;
  stationName: string;
  stationDistanceKm: number;
  incidentDate: string;
  recordedRainfallMm: number;
  normalRainfallMm: number;
  rainfallDeviationPct: number;
  hailAlertTriggered: boolean;
  maxWindSpeedKmph: number;
}

export interface CompensationCalculation {
  cropCategory: CropCategory;
  ratePerAcre: number;
  eligibleAcres: number;
  assessedLossPercentage: number;
  qualifiesThreshold: boolean; // Must be >= 33%
  calculatedAmount: number;
  statutoryMaxCap: number;
  finalRecommendedAmount: number;
  normReference: string; // e.g., "SDRF Norms G.O. Ms No. 17 / 2026"
}

export interface AiAudit {
  confidenceScore: number; // 0-100
  summaryEn: string;
  summaryTe: string;
  recommendation: 'APPROVE' | 'INSPECT' | 'RETURN' | 'REJECT';
  recommendationReasonEn: string;
  recommendationReasonTe: string;
  anomalies: AnomalyFinding[];
  compensation: CompensationCalculation;
}

export interface OfficerDecision {
  action: 'APPROVE' | 'RETURN' | 'REJECT';
  decidedBy: string;
  officerRole: string;
  timestamp: string;
  approvedAmount?: number;
  remarks: string;
  returnReasons?: string[];
  rejectionCode?: string;
  sanctionOrderNumber?: string;
  digitalSignatureHash?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  actionTe: string;
  notes?: string;
}

export interface FarmerClaim {
  id: string; // e.g. "RK-2026-0142"
  applicationDate: string;
  slaDeadline: string; // 15-day statutory limit
  daysRemainingSla: number;
  priority: PriorityLevel;
  status: ClaimStatus;
  
  // Farmer Bio
  farmerName: string;
  farmerNameTe: string;
  fatherOrHusbandName: string;
  fatherOrHusbandNameTe: string;
  aadhaarMasked: string;
  mobile: string;
  farmerCategory: FarmerCategory;
  isTenant: boolean;
  tenantAgreementNo?: string;

  // Bank Info
  bankName: string;
  accountNoMasked: string;
  ifscCode: string;
  isAadhaarSeeded: boolean;

  // Agricultural details
  crop: CropType;
  sownDate: string;
  disasterType: DisasterType;
  incidentDate: string;
  claimedLossPercentage: number;
  
  // Geographic & Cadastral
  cadastral: CadastralInfo;
  weather: WeatherTelemetry;
  documents: DocumentVerification[];
  damagePhotoUrl: string;

  // AI Analysis
  aiAudit: AiAudit;

  // Officer Resolution
  officerDecision?: OfficerDecision;
  auditTrail: AuditLogEntry[];
}
