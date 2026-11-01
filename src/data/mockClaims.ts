import { FarmerClaim } from '@/types/claim';
import { computeSdrfCompensation, auditClaimAnomalies } from '@/utils/rulesEngine';

export const INITIAL_CLAIMS: FarmerClaim[] = [
  {
    id: 'RK-2026-0101',
    applicationDate: '2026-10-24',
    slaDeadline: '2026-11-08',
    daysRemainingSla: 8,
    priority: 'HIGH',
    status: 'PENDING_REVIEW',
    
    farmerName: 'Mutyala Ramulu',
    farmerNameTe: 'ముత్యాల రాములు',
    fatherOrHusbandName: 'M. Lingaiah',
    fatherOrHusbandNameTe: 'ఎం. లింగయ్య',
    aadhaarMasked: 'XXXX-XXXX-8921',
    mobile: '98480 23145',
    farmerCategory: 'MARGINAL',
    isTenant: false,

    bankName: 'State Bank of India (Maheshwaram)',
    accountNoMasked: 'XXXXXX4928',
    ifscCode: 'SBIN0020145',
    isAadhaarSeeded: true,

    crop: 'Cotton (పత్తి)',
    sownDate: '2026-06-28',
    disasterType: 'Hailstorm (వడగండ్ల వాన)',
    incidentDate: '2026-10-18',
    claimedLossPercentage: 80,

    cadastral: {
      surveyNumber: '142/A/2',
      subDivision: 'A/2',
      village: 'Ravirala (రావిరాల)',
      mandal: 'Maheshwaram (మహేశ్వరం)',
      district: 'Ranga Reddy (రంగారెడ్డి)',
      totalExtentAcres: 2.50,
      claimedExtentAcres: 2.50,
      dharaniPattadarName: 'Mutyala Ramulu s/o Lingaiah',
      pattadarPassbookNo: 'T08240051283',
      landCoordinates: {
        lat: 17.1845,
        lng: 78.5292,
        bounds: [
          [17.1840, 78.5285],
          [17.1852, 78.5288],
          [17.1849, 78.5302],
          [17.1838, 78.5298]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.1844,
        lng: 78.5294,
        accuracyMeters: 4.2,
        distanceFromPlotMeters: 12,
        timestamp: '2026-10-19T09:35:12+05:30',
        bearingDegrees: 184
      }
    },

    weather: {
      stationId: 'AWS-MHW-04',
      stationName: 'Maheshwaram Mandal AWS Station',
      stationDistanceKm: 4.8,
      incidentDate: '2026-10-18',
      recordedRainfallMm: 78.5,
      normalRainfallMm: 8.0,
      rainfallDeviationPct: 881,
      hailAlertTriggered: true,
      maxWindSpeedKmph: 56
    },

    documents: [
      {
        id: 'DOC-101-1',
        name: 'Dharani E-Passbook (1-B Namuna)',
        nameTe: 'ధరణి ఈ-పాస్‌బుక్ (1-బి నమూనా)',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: 'Khata No. 418, Sy No. 142/A/2, Extent: 2.50 Acres. Active ownership.',
        detailsTe: 'ఖాతా నం. 418, సర్వే నం. 142/A/2, విస్తీర్ణం: 2.50 ఎకరాలు. సక్రమ యాజమాన్యం.'
      },
      {
        id: 'DOC-101-2',
        name: 'e-Panta Crop Booking Record',
        nameTe: 'ఈ-పంట నమోదు ధ్రువీకరణ',
        type: 'E_PANTA',
        status: 'VERIFIED',
        details: 'Kharif 2026 Cotton sown on 28-Jun-2026 verified by VRO/AEO.',
        detailsTe: 'ఖరీఫ్ 2026 పత్తి సాగు నమోదు AEO ద్వారా ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-101-3',
        name: 'Geotagged Field Damage Photo',
        nameTe: 'జియోట్యాగ్ పంట నష్ట ఛాయాచిత్రం',
        type: 'GEOTAG_PHOTO',
        status: 'VERIFIED',
        details: 'Active GPS stamp matching plot perimeter with severe boll damage.',
        detailsTe: 'పత్తి కాయలు రాలిపోయి తీవ్ర నష్టం స్పష్టంగా కనిపిస్తోంది.'
      },
      {
        id: 'DOC-101-4',
        name: 'Aadhaar Seeded Bank Passbook',
        nameTe: 'ఆధార్ లింక్ అయిన బ్యాంకు ఖాతా',
        type: 'BANK_PASSBOOK',
        status: 'VERIFIED',
        details: 'SBI Maheshwaram active account with NPCI mapper mapped.',
        detailsTe: 'DBT చెల్లింపునకు సిద్ధంగా ఉన్న సక్రియ ఖాతా.'
      }
    ],

    damagePhotoUrl: '/images/crops/cotton_damage.jpg',

    aiAudit: {
      confidenceScore: 98,
      summaryEn: 'Mutyala Ramulu is a marginal farmer holding 2.50 acres of rainfed cotton in Ravirala village. Severe hailstorm on Oct 18 caused 80% boll dropping and vegetative lodging. Land ownership matches Dharani records perfectly. e-Panta crop entry is verified. Mandal AWS station telemetry confirms severe 78.5mm downpour with active hail alert. No anomalies detected.',
      summaryTe: 'ముత్యాల రాములు రావిరాల గ్రామంలోని 2.50 ఎకరాల్లో వర్షాధార పత్తి సాగు చేస్తున్న సన్నకారు రైతు. అక్టోబర్ 18న కురిసిన తీవ్ర వడగండ్ల వాన వల్ల పత్తి కాయలు రాలిపోయి 80% నష్టం వాటిల్లింది. ధరణి రికార్డులు, ఈ-పంట నమోదులు పూర్తిగా సరిపోలాయి. AWS వాతావరణ కేంద్రం 78.5 మి.మీ వర్షపాతం మరియు వడగండ్ల హెచ్చరికను ధ్రువీకరించింది. ఎటువంటి వ్యత్యాసాలు లేవు.',
      recommendation: 'APPROVE',
      recommendationReasonEn: 'Full documentation matches SDRF guidelines. Crop loss (80%) exceeds statutory 33% threshold. Weather radar and AWS data corroborate localized disaster.',
      recommendationReasonTe: 'అన్ని పత్రాలు మరియు సాక్ష్యాలు SDRF నిబంధనలకు అనుగుణంగా ఉన్నాయి. పంట నష్టం (80%) కనీస 33% పరిమితి కంటే ఎక్కువ. వాతావరణ ఆధారాలు మరియు e-పంట సరిపోలాయి.',
      anomalies: [],
      compensation: computeSdrfCompensation('Cotton (పత్తి)', 2.50, 2.50, 80)
    },

    auditTrail: [
      {
        id: 'AUD-01',
        timestamp: '2026-10-24T11:20:00+05:30',
        actor: 'Citizen Service Center (MeeSeva Ravirala)',
        role: 'Data Entry Operator',
        action: 'Application Submitted Online',
        actionTe: 'మీసేవ ద్వారా దరఖాస్తు దాఖలు చేయబడింది'
      },
      {
        id: 'AUD-02',
        timestamp: '2026-10-24T11:22:15+05:30',
        actor: 'Rythu Kavach AI Engine',
        role: 'Automated Audit Agent',
        action: 'Telemetry cross-check completed. Confidence Score: 98%',
        actionTe: 'AI ఉపగ్రహ మరియు వాతావరణ ధ్రువీకరణ పూర్తయింది. స్కోరు: 98%'
      }
    ]
  },

  {
    id: 'RK-2026-0102',
    applicationDate: '2026-10-22',
    slaDeadline: '2026-11-06',
    daysRemainingSla: 6,
    priority: 'URGENT',
    status: 'PENDING_REVIEW',

    farmerName: 'Kongara Venkatesh',
    farmerNameTe: 'కొంగర వెంకటేష్',
    fatherOrHusbandName: 'K. Narsimha',
    fatherOrHusbandNameTe: 'కె. నరసింహ',
    aadhaarMasked: 'XXXX-XXXX-3419',
    mobile: '94401 88472',
    farmerCategory: 'SMALL',
    isTenant: false,

    bankName: 'Canara Bank (Chityal)',
    accountNoMasked: 'XXXXXX9821',
    ifscCode: 'CNRB0001842',
    isAadhaarSeeded: true,

    crop: 'Paddy (వరి)',
    sownDate: '2026-07-15',
    disasterType: 'Inundation / Floods (వరద ముంపు)',
    incidentDate: '2026-10-15',
    claimedLossPercentage: 75,

    cadastral: {
      surveyNumber: '284/1',
      subDivision: '1',
      village: 'Vattimarthy (వట్టిమర్తి)',
      mandal: 'Chityal (చిట్యాల)',
      district: 'Nalgonda (నల్గొండ)',
      totalExtentAcres: 2.10, // Passbook has only 2.10!
      claimedExtentAcres: 4.80, // Inflation!
      dharaniPattadarName: 'Kongara Venkatesh',
      pattadarPassbookNo: 'T26180099412',
      landCoordinates: {
        lat: 17.2412,
        lng: 79.1235,
        bounds: [
          [17.2405, 79.1228],
          [17.2418, 79.1230],
          [17.2415, 79.1242],
          [17.2402, 79.1239]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.2410,
        lng: 79.1234,
        accuracyMeters: 5.1,
        distanceFromPlotMeters: 22,
        timestamp: '2026-10-16T14:10:00+05:30',
        bearingDegrees: 210
      }
    },

    weather: {
      stationId: 'AWS-CHTL-02',
      stationName: 'Chityal Mandal AWS',
      stationDistanceKm: 6.2,
      incidentDate: '2026-10-15',
      recordedRainfallMm: 112.0,
      normalRainfallMm: 14.0,
      rainfallDeviationPct: 700,
      hailAlertTriggered: false,
      maxWindSpeedKmph: 42
    },

    documents: [
      {
        id: 'DOC-102-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'MISMATCH',
        details: 'Registered holding is strictly 2.10 acres. Claimed 4.80 acres reflects a 2.70 acre inflation.',
        detailsTe: 'ఖాతాలో నమోదిత విస్తీర్ణం 2.10 ఎకరాలు మాత్రమే. క్లెయిమ్‌లో 4.80 ఎకరాలు నమోదు చేశారు.'
      },
      {
        id: 'DOC-102-2',
        name: 'e-Panta Record',
        nameTe: 'ఈ-పంట నమోదు',
        type: 'E_PANTA',
        status: 'VERIFIED',
        details: 'Paddy crop registered on Sy 284/1 for 2.10 acres.',
        detailsTe: 'ఈ-పంటలో 2.10 ఎకరాలు వరి నమోదు చేయబడింది.'
      },
      {
        id: 'DOC-102-3',
        name: 'Flooded Field Photo',
        nameTe: 'ముంపునకు గురైన పంట ఫోటో',
        type: 'GEOTAG_PHOTO',
        status: 'VERIFIED',
        details: 'Paddy completely submerged under flood runoff.',
        detailsTe: 'వరి పొలం నీట మునిగి ఉంది.'
      }
    ],

    damagePhotoUrl: '/images/crops/paddy_flood.jpg',

    aiAudit: {
      confidenceScore: 64,
      summaryEn: 'CRITICAL EXTENT INFLATION: Farmer Kongara Venkatesh claims disaster relief for 4.80 acres of submerged paddy in Vattimarthy village. However, official Dharani RoR-1B and e-Panta records show his total ownership in Sy 284/1 is only 2.10 acres. An excess of 2.70 acres has been claimed without explanation or joint-pattadar consent.',
      summaryTe: 'తీవ్ర విస్తీర్ణ వ్యత్యాసం: కొంగర వెంకటేష్ వట్టిమర్తి గ్రామంలోని సర్వే నం. 284/1 లో 4.80 ఎకరాల వరి పంట మునిగిపోయినట్లు క్లెయిమ్ చేశారు. కానీ అధికారిక ధరణి మరియు ఈ-పంట రికార్డుల ప్రకారం అతని పేరిట 2.10 ఎకరాలు మాత్రమే ఉంది. ఏకంగా 2.70 ఎకరాలు అధికంగా క్లెయిమ్ చేశారు.',
      recommendation: 'INSPECT',
      recommendationReasonEn: 'Do not approve 4.80 acres. Either restrict sanction to verified 2.10 acres (₹21,000) or issue a show-cause return notice for extent inflation clarification.',
      recommendationReasonTe: '4.80 ఎకరాలకు ఆమోదించవద్దు. ధరణి రికార్డులో ధ్రువీకరించబడిన 2.10 ఎకరాలకే (₹21,000) పరిమితం చేయండి లేదా వివరణ కోరుతూ తిప్పి పంపండి.',
      anomalies: [
        {
          id: 'ANOM-102-A',
          severity: 'CRITICAL',
          category: 'EXTENT_MISMATCH',
          title: 'Claimed Extent Exceeds Dharani Land Record by 2.70 Acres',
          titleTe: 'ధరణి రికార్డు కంటే 2.70 ఎకరాలు అధికంగా క్లెయిమ్ చేశారు',
          description: 'Claim requested 4.80 acres; Dharani registered limit is 2.10 acres. Unverified excess claimed.',
          descriptionTe: 'రైతు 4.80 ఎకరాలకు దరఖాస్తు చేయగా, ధరణి పాస్‌బుక్‌లో కేవలం 2.10 ఎకరాలే నమోదై ఉంది.',
          statuteRef: 'ROR Act Sec 4 & SDRF Rule 6(b)'
        }
      ],
      compensation: computeSdrfCompensation('Paddy (వరి)', 2.10, 2.10, 75)
    },

    auditTrail: [
      {
        id: 'AUD-03',
        timestamp: '2026-10-22T15:45:00+05:30',
        actor: 'Citizen Portal (Online)',
        role: 'Citizen',
        action: 'Application Submitted Online',
        actionTe: 'ఆన్‌లైన్ ద్వారా దరఖాస్తు దాఖలు'
      },
      {
        id: 'AUD-04',
        timestamp: '2026-10-22T15:46:22+05:30',
        actor: 'Rythu Kavach AI Audit',
        role: 'Automated Audit Agent',
        action: 'CRITICAL ANOMALY: Extent Inflation Flagged (4.80 claimed vs 2.10 Dharani)',
        actionTe: 'హెచ్చరిక: ధరణి విస్తీర్ణం కంటే 2.70 ఎకరాలు అధికంగా క్లెయిమ్ చేసినట్లు AI గుర్తించింది'
      }
    ]
  },

  {
    id: 'RK-2026-0103',
    applicationDate: '2026-10-20',
    slaDeadline: '2026-11-04',
    daysRemainingSla: 4,
    priority: 'URGENT',
    status: 'PENDING_REVIEW',

    farmerName: 'Bollam Laxmamma',
    farmerNameTe: 'బొల్లం లక్ష్మమ్మ',
    fatherOrHusbandName: 'B. Satyanarayana',
    fatherOrHusbandNameTe: 'బి. సత్యనారాయణ',
    aadhaarMasked: 'XXXX-XXXX-7104',
    mobile: '97011 44520',
    farmerCategory: 'MARGINAL',
    isTenant: false,

    bankName: 'Union Bank of India (Shamshabad)',
    accountNoMasked: 'XXXXXX5512',
    ifscCode: 'UBIN0532101',
    isAadhaarSeeded: true,

    crop: 'Maize (మొక్కజొన్న)',
    sownDate: '2026-07-02',
    disasterType: 'Gale Winds / Lodging (ఈదురు గాలులు)',
    incidentDate: '2026-10-14',
    claimedLossPercentage: 85,

    cadastral: {
      surveyNumber: '88/B',
      subDivision: 'B',
      village: 'Kothwalguda (కొత్వాల్‌గూడ)',
      mandal: 'Shamshabad (శంషాబాద్)',
      district: 'Ranga Reddy (రంగారెడ్డి)',
      totalExtentAcres: 1.75,
      claimedExtentAcres: 1.75,
      dharaniPattadarName: 'Bollam Laxmamma w/o Satyanarayana',
      pattadarPassbookNo: 'T08120033104',
      landCoordinates: {
        lat: 17.2715,
        lng: 78.3610,
        bounds: [
          [17.2710, 78.3605],
          [17.2722, 78.3608],
          [17.2720, 78.3618],
          [17.2708, 78.3615]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.2778, // Far away!
        lng: 78.3654,
        accuracyMeters: 6.8,
        distanceFromPlotMeters: 680, // 680 meters away!
        timestamp: '2026-10-16T11:05:00+05:30',
        bearingDegrees: 45
      }
    },

    weather: {
      stationId: 'AWS-SHMB-01',
      stationName: 'Shamshabad AWS Station',
      stationDistanceKm: 3.5,
      incidentDate: '2026-10-14',
      recordedRainfallMm: 45.2,
      normalRainfallMm: 6.0,
      rainfallDeviationPct: 653,
      hailAlertTriggered: false,
      maxWindSpeedKmph: 68 // Strong wind gusts confirmed
    },

    documents: [
      {
        id: 'DOC-103-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: 'Sy 88/B, 1.75 Acres, genuine title.',
        detailsTe: 'సర్వే నం. 88/B, 1.75 ఎకరాలు, యాజమాన్యం ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-103-2',
        name: 'Geotagged Damage Photo',
        nameTe: 'జియోట్యాగ్ ఫోటో',
        type: 'GEOTAG_PHOTO',
        status: 'SUSPICIOUS',
        details: 'Photo coordinates are 680 meters north-east of Sy 88/B, near commercial ventures.',
        detailsTe: 'ఫోటో సర్వే నంబర్ సరిహద్దుకు 680 మీటర్ల దూరంలో ఇతర వెంచర్ సమీపంలో తీయబడింది.'
      }
    ],

    damagePhotoUrl: '/images/crops/maize_lodging.jpg',

    aiAudit: {
      confidenceScore: 58,
      summaryEn: 'GPS GEOTAG MISMATCH: Farmer Bollam Laxmamma reported 85% maize crop destruction due to 68 km/h gale winds on Sy 88/B. While the wind incident is verified by Shamshabad AWS, the uploaded field photograph was captured 680 meters away from the actual agricultural parcel. This suggests either a photo of another farmer\'s field was uploaded by the CSC operator, or the wrong survey number was selected.',
      summaryTe: 'జియోట్యాగ్ ఉపగ్రహ వ్యత్యాసం: బొల్లం లక్ష్మమ్మ సర్వే నం. 88/B లోని మొక్కజొన్న ఈదురుగాలుల వల్ల 85% నేలమట్టమైనట్లు పేర్కొన్నారు. శంషాబాద్ AWS లో గాలుల తీవ్రత ధ్రువీకరించబడినప్పటికీ, అప్‌లోడ్ చేసిన ఫోటో పొలం సరిహద్దుకు 680 మీటర్ల దూరంలో తీయబడింది. మీసేవ ఆపరేటర్ పొరపాటున వేరే పొలం ఫోటో జతచేసినట్లు అనుమానం ఉంది.',
      recommendation: 'INSPECT',
      recommendationReasonEn: 'Recommend immediate mandal AEO physical field spot verification or return application to capture an authentic geotagged photo inside Sy 88/B.',
      recommendationReasonTe: 'AEO క్షేత్రస్థాయి పరిశీలన చేయాలని లేదా సరైన జియోట్యాగ్ ఫోటోతో మళ్ళీ దరఖాస్తు సమర్పించాలని సూచించడమైనది.',
      anomalies: [
        {
          id: 'ANOM-103-A',
          severity: 'CRITICAL',
          category: 'GPS_MISMATCH',
          title: 'Geotag Coordinates 680m Outside Cadastral Parcel',
          titleTe: 'ఫోటో జియోట్యాగ్ పొలం సరిహద్దు కంటే 680 మీటర్ల వెలుపల ఉంది',
          description: 'GPS telemetry indicates photo taken on adjacent non-farm land.',
          descriptionTe: 'ఉపగ్రహ పరిశీలనలో ఫోటో వేరే ప్రదేశంలో తీసినట్లు స్పష్టమైంది.',
          statuteRef: 'Disaster Relief Geotag Protocol 2025'
        }
      ],
      compensation: computeSdrfCompensation('Maize (మొక్కజొన్న)', 1.75, 1.75, 85)
    },

    auditTrail: [
      {
        id: 'AUD-05',
        timestamp: '2026-10-20T10:15:00+05:30',
        actor: 'MeeSeva Center Shamshabad',
        role: 'Operator',
        action: 'Application Uploaded',
        actionTe: 'దరఖాస్తు సమర్పించబడింది'
      },
      {
        id: 'AUD-06',
        timestamp: '2026-10-20T10:17:40+05:30',
        actor: 'Rythu Kavach Spatial Audit',
        role: 'GIS AI Agent',
        action: 'Boundary Out-of-Bounds Flagged: 680m discrepancy',
        actionTe: 'జియోట్యాగ్ వ్యత్యాసం గుర్తించబడింది'
      }
    ]
  },

  {
    id: 'RK-2026-0104',
    applicationDate: '2026-10-26',
    slaDeadline: '2026-11-10',
    daysRemainingSla: 10,
    priority: 'HIGH',
    status: 'PENDING_REVIEW',

    farmerName: 'Pogula Srinivas',
    farmerNameTe: 'పోగుల శ్రీనివాస్',
    fatherOrHusbandName: 'P. Rajamouli',
    fatherOrHusbandNameTe: 'పి. రాజమౌళి',
    aadhaarMasked: 'XXXX-XXXX-9014',
    mobile: '98491 55219',
    farmerCategory: 'SMALL',
    isTenant: false,

    bankName: 'Telangana Grameena Bank (Huzurabad)',
    accountNoMasked: 'XXXXXX1094',
    ifscCode: 'TGB0000421',
    isAadhaarSeeded: true,

    crop: 'Cotton (పత్తి)',
    sownDate: '2026-06-25',
    disasterType: 'Inundation / Floods (వరద ముంపు)',
    incidentDate: '2026-10-18',
    claimedLossPercentage: 90,

    cadastral: {
      surveyNumber: '412/3',
      subDivision: '3',
      village: 'Bornapally (బోర్నపల్లి)',
      mandal: 'Huzurabad (హుజూరాబాద్)',
      district: 'Karimnagar (కరీంనగర్)',
      totalExtentAcres: 3.00,
      claimedExtentAcres: 3.00,
      dharaniPattadarName: 'Pogula Srinivas s/o Rajamouli',
      pattadarPassbookNo: 'T19140028194',
      landCoordinates: {
        lat: 18.2140,
        lng: 79.3850,
        bounds: [
          [18.2132, 79.3842],
          [18.2148, 79.3845],
          [18.2145, 79.3858],
          [18.2130, 79.3855]
        ]
      },
      geotagPhotoCoords: {
        lat: 18.2141,
        lng: 79.3852,
        accuracyMeters: 4.0,
        distanceFromPlotMeters: 8,
        timestamp: '2026-10-19T08:14:00+05:30',
        bearingDegrees: 120
      }
    },

    weather: {
      stationId: 'AWS-HZB-01',
      stationName: 'Huzurabad AWS Station',
      stationDistanceKm: 5.1,
      incidentDate: '2026-10-18',
      recordedRainfallMm: 64.0,
      normalRainfallMm: 10.0,
      rainfallDeviationPct: 540,
      hailAlertTriggered: false,
      maxWindSpeedKmph: 40
    },

    documents: [
      {
        id: 'DOC-104-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: 'Sy 412/3, 3.00 Acres holding verified.',
        detailsTe: 'సర్వే నం. 412/3, 3.00 ఎకరాలు ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-104-2',
        name: 'Damage Photo',
        nameTe: 'పంట నష్ట చిత్రం',
        type: 'GEOTAG_PHOTO',
        status: 'SUSPICIOUS',
        details: 'AI Perceptual Image Hash matches 99.4% with claim RK-2026-0089 submitted in same village by relative P. Thirupathi.',
        detailsTe: 'ఇదే గ్రామంలో దాఖలైన క్లెయిమ్ నం RK-2026-0089 లోని ఫోటోనే ఇక్కడ కూడా వాడినట్లు AI గుర్తించింది.'
      }
    ],

    damagePhotoUrl: '/images/crops/cotton_damage.jpg',

    aiAudit: {
      confidenceScore: 42,
      summaryEn: 'SUSPECTED PHOTO RECYCLING FRAUD: While land records for Sy 412/3 are legitimate, the uploaded damage photo perceptual hash (pHash) matches identical image data from claim RK-2026-0089 submitted two days earlier for a different survey number. Same damaged crop photo was reused across two separate household claims.',
      summaryTe: 'అనుమానాస్పద ఫోటో రీసైక్లింగ్ మోసం: సర్వే నం. 412/3 రికార్డులు సరిగ్గానే ఉన్నప్పటికీ, అప్‌లోడ్ చేసిన నష్ట ఛాయాచిత్రం రెండు రోజుల క్రితం దాఖలైన RK-2026-0089 క్లెయిమ్‌లోని ఫోటోతో 99.4% సరిపోలింది. ఒకే ఫోటోను ఇద్దరు బంధువుల వేర్వేరు సర్వే నంబర్లకు రీసైకిల్ చేసినట్లు AI గుర్తించింది.',
      recommendation: 'REJECT',
      recommendationReasonEn: 'Recommend immediate rejection or disciplinary inquiry under Section 182 IPC / SDRF anti-fraud circular for fraudulent submission of recycled field imagery.',
      recommendationReasonTe: 'ఒకే ఫోటోను వేర్వేరు క్లెయిమ్‌లకు ఉపయోగించినందున తక్షణ విచారణ లేదా తిరస్కరణకు సిఫార్సు చేయడమైనది.',
      anomalies: [
        {
          id: 'ANOM-104-A',
          severity: 'CRITICAL',
          category: 'PHOTO_FRAUD',
          title: 'Duplicate Photo Hash Detected Across Claims',
          titleTe: 'ఇతర క్లెయిమ్‌లోని ఫోటోనే మళ్లీ వాడినట్లు గుర్తింపు',
          description: 'Identical damaged cotton photo found in existing claim RK-2026-0089.',
          descriptionTe: 'బోర్నపల్లి గ్రామానికి చెందిన పాత క్లెయిమ్ #0089 ఫోటోనే ఇక్కడ రీసైకిల్ చేశారు.',
          statuteRef: 'Telangana Anti-Fraud Disaster Circular 2026'
        }
      ],
      compensation: computeSdrfCompensation('Cotton (పత్తి)', 3.00, 3.00, 90)
    },

    auditTrail: [
      {
        id: 'AUD-07',
        timestamp: '2026-10-26T16:10:00+05:30',
        actor: 'Citizen Portal',
        role: 'Citizen',
        action: 'Application Submitted',
        actionTe: 'దరఖాస్తు దాఖలు'
      },
      {
        id: 'AUD-08',
        timestamp: '2026-10-26T16:11:05+05:30',
        actor: 'Rythu Kavach Visual Hash Engine',
        role: 'Computer Vision AI',
        action: 'CRITICAL ALERT: Visual duplicate hash matched with RK-2026-0089',
        actionTe: 'ఫోటో డూప్లికేట్ మోసం గుర్తించబడింది'
      }
    ]
  },

  {
    id: 'RK-2026-0105',
    applicationDate: '2026-10-27',
    slaDeadline: '2026-11-11',
    daysRemainingSla: 11,
    priority: 'NORMAL',
    status: 'PENDING_REVIEW',

    farmerName: 'Gundla Anjaneyulu',
    farmerNameTe: 'గుండ్ల అంజనేయులు',
    fatherOrHusbandName: 'G. Balaswamy',
    fatherOrHusbandNameTe: 'జి. బాలస్వామి',
    aadhaarMasked: 'XXXX-XXXX-1984',
    mobile: '99890 12044',
    farmerCategory: 'SMALL',
    isTenant: false,

    bankName: 'HDFC Bank (Shadnagar)',
    accountNoMasked: 'XXXXXX8912',
    ifscCode: 'HDFC0001928',
    isAadhaarSeeded: true,

    crop: 'Red Gram (కందులు)',
    sownDate: '2026-07-08',
    disasterType: 'Unseasonal Rains (అకాల వర్షాలు)',
    incidentDate: '2026-10-19',
    claimedLossPercentage: 20, // Below 33% threshold!

    cadastral: {
      surveyNumber: '51/2',
      subDivision: '2',
      village: 'Solipur (సోలిపూర్)',
      mandal: 'Shadnagar (షాద్‌నగర్)',
      district: 'Ranga Reddy (రంగారెడ్డి)',
      totalExtentAcres: 2.00,
      claimedExtentAcres: 2.00,
      dharaniPattadarName: 'Gundla Anjaneyulu',
      pattadarPassbookNo: 'T08150041289',
      landCoordinates: {
        lat: 17.0650,
        lng: 78.2045,
        bounds: [
          [17.0642, 78.2038],
          [17.0658, 78.2040],
          [17.0655, 78.2052],
          [17.0640, 78.2050]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.0648,
        lng: 78.2046,
        accuracyMeters: 4.5,
        distanceFromPlotMeters: 10,
        timestamp: '2026-10-20T10:00:00+05:30',
        bearingDegrees: 180
      }
    },

    weather: {
      stationId: 'AWS-SHD-02',
      stationName: 'Shadnagar AWS',
      stationDistanceKm: 4.0,
      incidentDate: '2026-10-19',
      recordedRainfallMm: 22.0,
      normalRainfallMm: 12.0,
      rainfallDeviationPct: 83,
      hailAlertTriggered: false,
      maxWindSpeedKmph: 28
    },

    documents: [
      {
        id: 'DOC-105-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: '2.00 Acres red gram land confirmed.',
        detailsTe: '2.00 ఎకరాల కంది సాగు భూమి ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-105-2',
        name: 'Damage Photo',
        nameTe: 'పంట చిత్రం',
        type: 'GEOTAG_PHOTO',
        status: 'VERIFIED',
        details: 'Minor vegetative water-logging; pod formation intact.',
        detailsTe: 'స్వల్ప నీటి నిల్వ మాత్రమే ఉంది; కాయలు రాలలేదు.'
      }
    ],

    damagePhotoUrl: '/images/crops/maize_lodging.jpg',

    aiAudit: {
      confidenceScore: 92,
      summaryEn: 'BELOW 33% STATUTORY THRESHOLD: Gundla Anjaneyulu reports minor waterlogging on 2.00 acres of red gram in Solipur. The assessed damage is 20%. Under Section 2.1 of SDRF guidelines, agricultural disaster compensation is legally admissible ONLY when crop loss exceeds 33%. The crop is recoverable and does not qualify for government ex-gratia.',
      summaryTe: '33% చట్టబద్ధమైన పరిమితి కంటే తక్కువ: గుండ్ల అంజనేయులు సోలిపూర్ గ్రామంలోని 2.00 ఎకరాల కంది పంటలో స్వల్ప నీటి నిల్వ వల్ల 20% నష్టం జరిగినట్లు పేర్కొన్నారు. SDRF నిబంధనల ప్రకారం 33% కంటే ఎక్కువ పంట నష్టం ఉంటేనే ప్రభుత్వం పరిహారం చెల్లిస్తుంది. ఈ పంట కోలుకునే అవకాశం ఉన్నందున పరిహారానికి అనర్హులు.',
      recommendation: 'REJECT',
      recommendationReasonEn: 'Formal rejection required under SDRF Section 2.1 (Damage below 33% threshold). Advise farmer to utilize regular crop insurance / PMFBY for minor yield reduction.',
      recommendationReasonTe: 'SDRF నిబంధనల ప్రకారం నష్టం 33% కంటే తక్కువ ఉన్నందున దరఖాస్తును తిరస్కరించాలని సిఫార్సు చేయడమైనది.',
      anomalies: [
        {
          id: 'ANOM-105-A',
          severity: 'CRITICAL',
          category: 'THRESHOLD_FAIL',
          title: 'Assessed Loss 20% is Below Statutory 33% Cut-off',
          titleTe: 'నష్టం 20% మాత్రమే ఉన్నందున పరిహారానికి అనర్హం',
          description: 'SDRF rules legally bar relief payouts below 33% damage.',
          descriptionTe: '33% కంటే తక్కువ నష్టానికి ప్రభుత్వ నిబంధనల ప్రకారం నిధులు చెల్లించరాదు.',
          statuteRef: 'SDRF G.O. Ms 17 Section 2.1'
        }
      ],
      compensation: computeSdrfCompensation('Red Gram (కందులు)', 2.00, 2.00, 20)
    },

    auditTrail: [
      {
        id: 'AUD-09',
        timestamp: '2026-10-27T09:30:00+05:30',
        actor: 'Solipur CSC Center',
        role: 'Operator',
        action: 'Application Uploaded',
        actionTe: 'దరఖాస్తు నమోదు'
      },
      {
        id: 'AUD-10',
        timestamp: '2026-10-27T09:31:12+05:30',
        actor: 'Rythu Kavach Rules Engine',
        role: 'Statutory Compliance Bot',
        action: 'Threshold Check: Failed (< 33% Loss)',
        actionTe: 'నిబంధనల తనిఖీ: 33% కంటే తక్కువ ఉన్నందున అనర్హం'
      }
    ]
  },

  {
    id: 'RK-2026-0106',
    applicationDate: '2026-10-25',
    slaDeadline: '2026-11-09',
    daysRemainingSla: 9,
    priority: 'HIGH',
    status: 'PENDING_REVIEW',

    farmerName: 'Siripuram Mallesh',
    farmerNameTe: 'సిరిపురం మల్లేష్',
    fatherOrHusbandName: 'S. Chandraiah',
    fatherOrHusbandNameTe: 'ఎస్. చంద్రయ్య',
    aadhaarMasked: 'XXXX-XXXX-4560',
    mobile: '94412 78391',
    farmerCategory: 'TENANT',
    isTenant: true,
    tenantAgreementNo: 'CCRC-PENDING',

    bankName: 'Andhra Bank / Union Bank (Suryapet)',
    accountNoMasked: 'XXXXXX3490',
    ifscCode: 'UBIN0805122',
    isAadhaarSeeded: true,

    crop: 'Cotton (పత్తి)',
    sownDate: '2026-07-01',
    disasterType: 'Hailstorm (వడగండ్ల వాన)',
    incidentDate: '2026-10-18',
    claimedLossPercentage: 75,

    cadastral: {
      surveyNumber: '215/A',
      subDivision: 'A',
      village: 'Kudakuda (కుడకుడ)',
      mandal: 'Suryapet (సూర్యాపేట)',
      district: 'Suryapet (సూర్యాపేట)',
      totalExtentAcres: 3.50,
      claimedExtentAcres: 3.50,
      dharaniPattadarName: 'Vangala Someshwar Rao (Land Owner)',
      pattadarPassbookNo: 'T28140019283',
      landCoordinates: {
        lat: 17.1420,
        lng: 79.6210,
        bounds: [
          [17.1412, 79.6202],
          [17.1428, 79.6205],
          [17.1425, 79.6218],
          [17.1410, 79.6215]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.1421,
        lng: 79.6212,
        accuracyMeters: 3.9,
        distanceFromPlotMeters: 6,
        timestamp: '2026-10-19T11:20:00+05:30',
        bearingDegrees: 155
      }
    },

    weather: {
      stationId: 'AWS-SYPT-01',
      stationName: 'Suryapet AWS Station',
      stationDistanceKm: 2.8,
      incidentDate: '2026-10-18',
      recordedRainfallMm: 68.0,
      normalRainfallMm: 8.0,
      rainfallDeviationPct: 750,
      hailAlertTriggered: true,
      maxWindSpeedKmph: 52
    },

    documents: [
      {
        id: 'DOC-106-1',
        name: 'Land Owner Dharani Passbook',
        nameTe: 'భూ యజమాని ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: 'Registered under Vangala Someshwar Rao.',
        detailsTe: 'భూ యజమాని వంగాల సోమేశ్వరరావు పేరిట ఉంది.'
      },
      {
        id: 'DOC-106-2',
        name: 'Tenant Agreement (CCRC)',
        nameTe: 'కౌలు రైతు ఒప్పంద పత్రం (CCRC)',
        type: 'TENANT_CCRC',
        status: 'MISSING',
        details: 'Signed Crop Cultivator Rights Certificate (CCRC) with land owner consent is MISSING.',
        detailsTe: 'భూ యజమాని సంతకం చేసిన CCRC కౌలు పత్రం దరఖాస్తులో జతచేయబడలేదు.'
      },
      {
        id: 'DOC-106-3',
        name: 'Damage Photograph',
        nameTe: 'పంట నష్ట చిత్రం',
        type: 'GEOTAG_PHOTO',
        status: 'VERIFIED',
        details: 'Verified cotton field damage.',
        detailsTe: 'పత్తి పంట నష్టం నిర్ధారించబడింది.'
      }
    ],

    damagePhotoUrl: '/images/crops/cotton_damage.jpg',

    aiAudit: {
      confidenceScore: 71,
      summaryEn: 'MISSING TENANT CCRC AGREEMENT: Siripuram Mallesh is claiming disaster relief as a tenant cultivator on 3.50 acres owned by Vangala Someshwar Rao in Kudakuda. The crop damage (75%) and weather hail telemetry are genuine. However, the mandatory Crop Cultivator Rights Certificate (CCRC) or landowner declaration is missing, creating a risk that the land owner might raise a duplicate claim or dispute the DBT payment.',
      summaryTe: 'కౌలు ఒప్పంద పత్రం లోపించింది: సిరిపురం మల్లేష్ వంగాల సోమేశ్వరరావుకు చెందిన 3.50 ఎకరాల్లో కౌలు రైతుగా పరిహారం కోరుతున్నారు. వడగండ్ల వాన వల్ల పత్తి పంటకు 75% నష్టం నిజమే అయినప్పటికీ, చట్టబద్ధమైన CCRC కౌలు పత్రం జతచేయలేదు. దీనివల్ల భవిష్యత్తులో భూ యజమానితో వివాదం తలెత్తే అవకాశం ఉంది.',
      recommendation: 'RETURN',
      recommendationReasonEn: 'Return application to the farmer with directive to upload Form-1 CCRC agreement countersigned by the Gram Panchayat VRO or Village Agriculture Assistant.',
      recommendationReasonTe: 'గ్రామ పంచాయతీ VRO లేదా వ్యవసాయ అధికారి ధ్రువీకరించిన CCRC కౌలు పత్రం సమర్పించాలని రైతుకు తిప్పి పంపాలి.',
      anomalies: [
        {
          id: 'ANOM-106-A',
          severity: 'WARNING',
          category: 'BANK_FAIL',
          title: 'Mandatory CCRC Tenancy Agreement Missing',
          titleTe: 'చట్టబద్ధమైన కౌలు ధ్రువీకరణ పత్రం (CCRC) లేదు',
          description: 'Tenant farmer requires signed owner consent under Telangana Land Act.',
          descriptionTe: 'కౌలు రైతులకు ప్రభుత్వం నిర్దేశించిన CCRC పత్రం సమర్పించలేదు.',
          statuteRef: 'Licensed Cultivators Act 2011'
        }
      ],
      compensation: computeSdrfCompensation('Cotton (పత్తి)', 3.50, 3.50, 75)
    },

    auditTrail: [
      {
        id: 'AUD-11',
        timestamp: '2026-10-25T14:00:00+05:30',
        actor: 'MeeSeva Suryapet Town',
        role: 'Operator',
        action: 'Application Uploaded',
        actionTe: 'దరఖాస్తు దాఖలు'
      },
      {
        id: 'AUD-12',
        timestamp: '2026-10-25T14:01:45+05:30',
        actor: 'Rythu Kavach Document Scanner',
        role: 'Document AI Agent',
        action: 'Deficiency Found: CCRC document absent in tenancy claim',
        actionTe: 'లోపం: కౌలు పత్రం జతచేయబడలేదు'
      }
    ]
  },

  {
    id: 'RK-2026-0107',
    applicationDate: '2026-10-23',
    slaDeadline: '2026-11-07',
    daysRemainingSla: 7,
    priority: 'HIGH',
    status: 'PENDING_REVIEW',

    farmerName: 'Chinthala Ravi Kumar',
    farmerNameTe: 'చింతల రవి కుమార్',
    fatherOrHusbandName: 'Ch. Venkatadri',
    fatherOrHusbandNameTe: 'సిహెచ్. వెంకటాద్రి',
    aadhaarMasked: 'XXXX-XXXX-6612',
    mobile: '98485 99312',
    farmerCategory: 'SMALL',
    isTenant: false,

    bankName: 'State Bank of India (Madhira)',
    accountNoMasked: 'XXXXXX6641',
    ifscCode: 'SBIN0020199',
    isAadhaarSeeded: true,

    crop: 'Chilli (మిరప)',
    sownDate: '2026-08-05',
    disasterType: 'Hailstorm (వడగండ్ల వాన)',
    incidentDate: '2026-10-17',
    claimedLossPercentage: 90,

    cadastral: {
      surveyNumber: '310/2/A',
      subDivision: '2/A',
      village: 'Dendukuru (దెందుకూరు)',
      mandal: 'Madhira (మధిర)',
      district: 'Khammam (ఖమ్మం)',
      totalExtentAcres: 3.00,
      claimedExtentAcres: 3.00,
      dharaniPattadarName: 'Chinthala Ravi Kumar s/o Venkatadri',
      pattadarPassbookNo: 'T22190044812',
      landCoordinates: {
        lat: 16.9240,
        lng: 80.3620,
        bounds: [
          [16.9232, 80.3612],
          [16.9248, 80.3615],
          [16.9245, 80.3628],
          [16.9230, 80.3625]
        ]
      },
      geotagPhotoCoords: {
        lat: 16.9241,
        lng: 80.3622,
        accuracyMeters: 3.5,
        distanceFromPlotMeters: 5,
        timestamp: '2026-10-18T09:15:00+05:30',
        bearingDegrees: 190
      }
    },

    weather: {
      stationId: 'AWS-MDHR-01',
      stationName: 'Madhira AWS Station',
      stationDistanceKm: 4.1,
      incidentDate: '2026-10-17',
      recordedRainfallMm: 92.5,
      normalRainfallMm: 11.0,
      rainfallDeviationPct: 740,
      hailAlertTriggered: true,
      maxWindSpeedKmph: 62
    },

    documents: [
      {
        id: 'DOC-107-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: 'Sy 310/2/A, 3.00 Acres holding fully verified.',
        detailsTe: 'సర్వే నం. 310/2/A, 3.00 ఎకరాల విస్తీర్ణం ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-107-2',
        name: 'e-Panta Chilli Booking',
        nameTe: 'ఈ-పంట మిరప సాగు నమోదు',
        type: 'E_PANTA',
        status: 'VERIFIED',
        details: 'Kharif 2026 Commercial Teja Chilli crop registered.',
        detailsTe: 'తేజ రకం మిరప పంట సాగు AEO ధ్రువీకరణతో ఉంది.'
      },
      {
        id: 'DOC-107-3',
        name: 'Damage Photo',
        nameTe: 'పంట నష్ట చిత్రం',
        type: 'GEOTAG_PHOTO',
        status: 'VERIFIED',
        details: 'Severe shredding of chilli leaves and rotting of young fruit pods.',
        detailsTe: 'వడగండ్ల ధాటికి మిరప తోట సర్వనాశనం అయ్యింది.'
      }
    ],

    damagePhotoUrl: '/images/crops/chilli_hail.jpg',

    aiAudit: {
      confidenceScore: 96,
      summaryEn: 'HIGH VALUE HORTICULTURE CLAIM: Chinthala Ravi Kumar suffered catastrophic 90% loss to 3.00 acres of high-investment commercial chilli in Dendukuru due to severe hailstorm and 92.5mm deluge. Horticulture crops qualify for highest SDRF norm rate of ₹17,000/acre. Calculated total eligible compensation is ₹51,000. All documents, coordinates, and weather triggers are thoroughly authenticated.',
      summaryTe: 'అధిక విలువగల ఉద్యానవన పంట క్లెయిమ్: చింతల రవి కుమార్ దెందుకూరు గ్రామంలోని 3.00 ఎకరాల వాణిజ్య మిరప తోట అక్టోబర్ 17 నాటి తీవ్ర వడగండ్ల ధాటికి 90% నాశనమైంది. ఉద్యాన పంటలకు గరిష్ట SDRF నిబంధన ప్రకారం ఎకరాకు ₹17,000 రేటు వర్తిస్తుంది. మొత్తం అర్హత పరిహారం ₹51,000. అన్ని పత్రాలు, ఉపగ్రహ పాయింట్లు నూటికి నూరు శాతం సరిపోయాయి.',
      recommendation: 'APPROVE',
      recommendationReasonEn: 'Recommend immediate sanction of ₹51,000 under SDRF Horticulture Scale of Norms. Because this exceeds ₹50,000 threshold, joint sign-off by MAO and MRO is recommended.',
      recommendationReasonTe: 'ఉద్యాన పంటల SDRF నిబంధనల ప్రకారం ₹51,000 పరిహారం తక్షణమే మంజూరు చేయాలని సిఫార్సు చేయడమైనది.',
      anomalies: [],
      compensation: computeSdrfCompensation('Chilli (మిరప)', 3.00, 3.00, 90)
    },

    auditTrail: [
      {
        id: 'AUD-13',
        timestamp: '2026-10-23T11:00:00+05:30',
        actor: 'Madhira MeeSeva Center',
        role: 'Operator',
        action: 'Application Uploaded',
        actionTe: 'దరఖాస్తు దాఖలు'
      },
      {
        id: 'AUD-14',
        timestamp: '2026-10-23T11:02:18+05:30',
        actor: 'Rythu Kavach Horticulture Engine',
        role: 'Audit Engine',
        action: 'High-Value Claim Verified (Horticulture Norm Rate ₹17,000 applied)',
        actionTe: 'ఉద్యాన పంట రేటు ₹17,000 ప్రకారం ధ్రువీకరించబడింది'
      }
    ]
  },

  {
    id: 'RK-2026-0108',
    applicationDate: '2026-10-21',
    slaDeadline: '2026-11-05',
    daysRemainingSla: 5,
    priority: 'HIGH',
    status: 'PENDING_REVIEW',

    farmerName: 'Thota Swapna',
    farmerNameTe: 'తోట స్వప్న',
    fatherOrHusbandName: 'T. Srinivas Reddy',
    fatherOrHusbandNameTe: 'టి. శ్రీనివాస్ రెడ్డి',
    aadhaarMasked: 'XXXX-XXXX-9912',
    mobile: '98492 11984',
    farmerCategory: 'MARGINAL',
    isTenant: false,

    bankName: 'Canara Bank (Gajwel)',
    accountNoMasked: 'XXXXXX8124',
    ifscCode: 'CNRB0002104',
    isAadhaarSeeded: false, // Inactive NPCI!

    crop: 'Paddy (వరి)',
    sownDate: '2026-07-20',
    disasterType: 'Inundation / Floods (వరద ముంపు)',
    incidentDate: '2026-10-15',
    claimedLossPercentage: 75,

    cadastral: {
      surveyNumber: '177/2',
      subDivision: '2',
      village: 'Wargal (వర్గల్)',
      mandal: 'Gajwel (గజ్వేల్)',
      district: 'Siddipet (సిద్దిపేట)',
      totalExtentAcres: 1.50,
      claimedExtentAcres: 1.50,
      dharaniPattadarName: 'Thota Swapna w/o Srinivas Reddy',
      pattadarPassbookNo: 'T32150089124',
      landCoordinates: {
        lat: 17.7610,
        lng: 78.5840,
        bounds: [
          [17.7602, 78.5832],
          [17.7618, 78.5835],
          [17.7615, 78.5848],
          [17.7600, 78.5845]
        ]
      },
      geotagPhotoCoords: {
        lat: 17.7611,
        lng: 78.5842,
        accuracyMeters: 4.1,
        distanceFromPlotMeters: 14,
        timestamp: '2026-10-16T15:00:00+05:30',
        bearingDegrees: 170
      }
    },

    weather: {
      stationId: 'AWS-GJW-02',
      stationName: 'Gajwel AWS Station',
      stationDistanceKm: 3.2,
      incidentDate: '2026-10-15',
      recordedRainfallMm: 88.0,
      normalRainfallMm: 12.0,
      rainfallDeviationPct: 633,
      hailAlertTriggered: false,
      maxWindSpeedKmph: 46
    },

    documents: [
      {
        id: 'DOC-108-1',
        name: 'Dharani Passbook',
        nameTe: 'ధరణి పాస్‌బుక్',
        type: 'PASSBOOK',
        status: 'VERIFIED',
        details: '1.50 Acres Paddy land ownership verified.',
        detailsTe: '1.50 ఎకరాల వరి సాగు భూమి ధ్రువీకరించబడింది.'
      },
      {
        id: 'DOC-108-2',
        name: 'Bank Passbook & NPCI Status',
        nameTe: 'బ్యాంకు ఖాతా & NPCI సీడింగ్',
        type: 'BANK_PASSBOOK',
        status: 'MISMATCH',
        details: 'Aadhaar is NOT mapped in NPCI DBT gateway for Canara Bank account. Payment would bounce.',
        detailsTe: 'కెనరా బ్యాంక్ ఖాతాకు ఆధార్ NPCI సీడింగ్ కాలేదు. ట్రెజరీ DBT చెల్లింపు విఫలమవుతుంది.'
      }
    ],

    damagePhotoUrl: '/images/crops/paddy_flood.jpg',

    aiAudit: {
      confidenceScore: 78,
      summaryEn: 'BANK NPCI SEEDING INACTIVE: Thota Swapna has a valid flood claim on 1.50 acres of paddy (75% loss, eligible relief ₹15,000). The land tenure and disaster damage are genuine. However, the Aadhaar-NPCI DBT mapper query returned INACTIVE. If sanctioned directly, the Treasury e-Kuber transfer will fail.',
      summaryTe: 'బ్యాంకు ఖాతాకు ఆధార్ సీడింగ్ కాలేదు: తోట స్వప్న 1.50 ఎకరాల వరి పంట వరద నష్టం (75% నష్టం, అర్హత పరిహారం ₹15,000) నిజమే అయినప్పటికీ, బ్యాంకు ఖాతాకు ఆధార్ NPCI లింక్ కాలేదు. దీనివల్ల ట్రెజరీ ఈ-కుబేర్ ద్వారా నగదు బదిలీ తిరస్కరణకు గురవుతుంది.',
      recommendation: 'RETURN',
      recommendationReasonEn: 'Return to farmer with directive to visit Canara Bank branch and link Aadhaar with NPCI DBT mandate, or provide an alternate active Post Office / SBI account.',
      recommendationReasonTe: 'కెనరా బ్యాంక్ బ్రాంచ్‌కు వెళ్లి ఆధార్ NPCI సీడింగ్ చేయించుకోవాలని లేదా పోస్టల్ పేమెంట్స్ బ్యాంక్ ఖాతాను సమర్పించాలని దరఖాస్తును తిప్పి పంపాలి.',
      anomalies: [
        {
          id: 'ANOM-108-A',
          severity: 'WARNING',
          category: 'BANK_FAIL',
          title: 'Aadhaar NPCI DBT Mapper Status: INACTIVE',
          titleTe: 'బ్యాంకు ఖాతాకు ఆధార్ NPCI సీడింగ్ యాక్టివ్‌గా లేదు',
          description: 'Payment will bounce at Treasury level without Aadhaar seeding.',
          descriptionTe: 'ట్రెజరీ ఈ-కుబేర్ ద్వారా నగదు జమ కావడానికి ఆధార్ సీడింగ్ తప్పనిసరి.',
          statuteRef: 'DBT Directives 2024'
        }
      ],
      compensation: computeSdrfCompensation('Paddy (వరి)', 1.50, 1.50, 75)
    },

    auditTrail: [
      {
        id: 'AUD-15',
        timestamp: '2026-10-21T16:30:00+05:30',
        actor: 'Wargal MeeSeva',
        role: 'Operator',
        action: 'Application Uploaded',
        actionTe: 'దరఖాస్తు దాఖలు'
      },
      {
        id: 'AUD-16',
        timestamp: '2026-10-21T16:31:40+05:30',
        actor: 'Rythu Kavach Banking AI',
        role: 'NPCI Integration Agent',
        action: 'NPCI Status Inactive: Aadhaar mapping missing',
        actionTe: 'బ్యాంకు ఆధార్ సీడింగ్ లోపం గుర్తించబడింది'
      }
    ]
  }
];
