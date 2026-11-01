# రైతు కవచ్ (Rythu Kavach)
### Agricultural Disaster Crop Loss Relief & Compensation Scrutiny Portal
**Government of Telangana • Agriculture & Revenue (Disaster Management) Department**

[![Live Demo](https://img.shields.io/badge/Live_Demo-rythukavach.netlify.app-emerald?style=for-the-badge&logo=netlify)](https://rythukavach.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-akshitravula%2FRythu--Kavach-black?style=for-the-badge&logo=github)](https://github.com/akshitravula/Rythu-Kavach)
[![Interactive Guide](https://img.shields.io/badge/In--App_Guide-Game--Style_Walkthrough-purple?style=for-the-badge)](https://rythukavach.netlify.app)

---

> ### 🏛️ Kenpath Engineering Challenge — Quick Reviewer Access
> - **🌐 Live URL**: [https://rythukavach.netlify.app](https://rythukavach.netlify.app)
> - **🔑 Quick Demo Login**: Single-click pre-filled buttons on the login screen, or use:
>   - **Officer Email**: `mro.maheshwaram@telangana.gov.in` (Tahsildar / MRO)
>   - **Password**: `Officer@2026`
> - **🎮 In-App Interactive Game Walkthrough**: The application features a built-in step-by-step mission guide that walks reviewers through every verification check, cadastral anomaly, and legal sanction order with 1-click jumps.

---

## 🎯 Kenpath Evaluation Criteria Overview

| Evaluation Criterion | Implementation in Rythu Kavach | Where to Review |
|---|---|---|
| **1. The Problem Chosen** | Acute agricultural disaster compensation backlog in the Deccan plateau (SDRF / Telangana G.O. Ms 17) where 15-day SLAs stretch to 8–14 months due to fragmented record checks. | [Section 1 & Context](#-the-problem-we-chose) |
| **2. Usefulness to an Officer** | Replaces 4 disjoint legacy systems with an automated 5-Point Multi-Registry Verification Matrix (Dharani, GIS parcel, AWS rainfall, 33% cutoff, NPCI DBT), fraud detection, and 1-click legal proceedings. | [Officer Workflow](#-what-rythu-kavach-does) & `src/components/AiAssistantTab.tsx` |
| **3. Local Language Design** | 100% authentic administrative Telugu (*పట్టాదారు పాస్‌బుక్, సర్వే నంబర్, ఈ-పంట, వడగండ్ల వాన, శాసనబద్ధమైన పరిశీలన, మంజూరు ప్రొసీడింగ్స్*), state secretariat color scheme, zero AI gimmicks. | [Language Details](#5--native-local-language-experience-తెలుగు) & `src/utils/translations.ts` |
| **4. Technical Decisions** | Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, zero-dependency SVG Cadastral parcel visualizer, deterministic client-side SDRF rules engine. | [Technical Decisions](#️-main-technical-decisions) & `src/utils/sdrfRules.ts` |
| **5. Code Quality & Clarity** | Fully typed domain contracts, clean component hierarchy, testable state machine, 8 realistic edge cases, conventional git commit history. | `src/types/claim.ts`, [Test Scenarios](#-test-scenarios--pre-loaded-claims) |

---

## 🌾 The Problem We Chose

When unseasonal hailstorms, torrential cloudbursts, or severe droughts destroy crops across the Deccan plateau (Telangana and Andhra Pradesh), lakhs of smallholder farmers file disaster relief claims under the **State Disaster Response Fund (SDRF)** and the **Chief Minister's Special Agricultural Relief Package** (e.g. ₹10,000 per acre).

### The Bottleneck in Government Today
Today, an officer — the **Mandal Agriculture Officer (MAO)** and **Mandal Revenue Officer (MRO / Tahsildar)** — must manually verify every claim across four disconnected, slow legacy platforms:
1. **Land Ownership**: Flipping through Dharani / Webland 1-B registers and Pattadar Passbooks.
2. **Crop Authenticity**: Cross-checking the state's **e-Panta** (e-Crop booking) portal to verify if the farmer actually sowed the declared crop in that season.
3. **Disaster Telemetry**: Reviewing paper Automatic Weather Station (AWS) logs and Doppler radar reports to confirm if rain/hail actually occurred in that mandal on the declared incident date.
4. **Geotagged Damage Photos**: Examining low-resolution photo uploads where camera GPS stamps are often taken outside the field, or the same photo is recycled across multiple relatives' claims.

Because officers are overwhelmed by thousands of physical dossiers, **disaster relief takes 8 to 14 months to reach farmers**. Desperate farmers fall into debt traps with private moneylenders before government compensation ever arrives.

---

## 👥 Who It Affects

1. **Marginal & Smallholder Farmers (< 2.5 to 5 acres)**: Families whose entire annual livelihood depends on timely relief to replant or service agricultural loans.
2. **Tenant Cultivators (కౌలు రైతులు)**: Vulnerable cultivators operating under informal agreements who risk losing relief to absentee landowners without Crop Cultivator Rights Certificates (CCRC).
3. **Mandal Agriculture & Revenue Officers (MAOs / Tahsildars)**: Field administrators who face intense public pressure, strict 15-day statutory Citizen's Charter SLAs, and severe criminal vigilance scrutiny if fraudulent claims slip through.

---

## 🚀 What Rythu Kavach Does

**Rythu Kavach** is an automated officer workbench designed from the ground up in the local language (**తెలుగు - Telugu**, with instant English and Hindi toggles) that transforms how government officers triage, inspect, and sanction agricultural disaster relief.

### Key Capabilities

#### 1. 📊 Smart Overview & SLA-Driven Prioritization
- **Triage Dashboard**: Sorts pending applications by statutory 15-day SLA urgency, risk severity, and farmer vulnerability (prioritizing marginal farmers with >70% crop destruction).
- **Executive KPIs**: Real-time count of pending claims, imminent SLA breaches, flagged discrepancies, and total relief sanctioned today ready for Treasury Direct Benefit Transfer (DBT).

#### 2. 🔍 Multi-Source Automated Cross-Verification Matrix
- **Cadastral GIS Verification**: Plotted visual survey parcel polygon overlaid with camera GPS fix. Flags when damage photos are captured outside plot perimeter (e.g., *680 meters out-of-bounds*).
- **AWS Weather Triangulation**: Cross-references claimed incident dates with the nearest Mandal Automatic Weather Station (AWS) to corroborate rainfall intensity and Doppler radar hail alerts.
- **Photo Recycling Detection**: Flags when the same damaged crop photograph is submitted across multiple separate claims.
- **Land Extent Inflation Audit**: Cross-checks claimed damaged acreage against the registered Dharani Pattadar holding (e.g., flags claims requesting 4.80 acres when the passbook authorizes only 2.10 acres).
- **DBT Banking Readiness Check**: Pre-validates Aadhaar-NPCI mapper status to ensure payments will not bounce at the Treasury level.

#### 3. ⚖️ SDRF Scale of Norms Compensation Calculator
- Automatically applies official disaster relief scales under **G.O. Ms No. 17**:
  - **Rainfed Crops (Cotton, Maize, Pulses)**: ₹8,500 / acre
  - **Assured Irrigated Crops (Paddy)**: ₹10,000 / acre
  - **Commercial / Horticulture Crops (Chilli, Spices)**: ₹17,000 / acre
- Automatically enforces the **statutory 33% minimum damage threshold** and the **5.00-acre ceiling**.

#### 4. ✍️ Officer Decision Center (Officer Always Makes the Final Call)
The system provides cross-verification intelligence, but the officer always makes the final legal ruling:
- **Approve & Sanction (పరిహారం మంజూరు చేయండి)**: Reviews computed relief, allows discretionary adjustment, signs digitally, and produces an official, printable **Sanction Proceeding (మంజూరు ప్రొసీడింగ్స్)** with state emblem, reference number, and cryptographic hash.
- **Return for Rectification (సవరణకు తిప్పి పంపండి)**: Selects required missing items (e.g. CCRC agreement, geotag recapture, Aadhaar bank seeding) and auto-drafts a polite Telugu SMS notice to the farmer.
- **Reject (దరఖాస్తు తిరస్కరించండి)**: Selects statutory rejection codes (e.g. loss < 33%, fraudulent photo, unverified parcel).

#### 5. 🗣️ Native Local Language Experience (తెలుగు)
- Complete authentic administrative vocabulary: *పట్టాదారు పాస్‌బుక్, సర్వే నంబర్, ఈ-పంట, వడగండ్ల వాన, నష్ట తీవ్రత, మంజూరు ప్రొసీడింగ్స్, ట్రెజరీ DBT చెల్లింపు*.
- Seamless single-click switching between **తెలుగు (Telugu)**, **English**, and **हिन्दी (Hindi)**.

#### 6. 📜 Official Docket Inquiry & Regulation Search
- Officers can search official policy rules, verify prior claims on survey numbers, or check CCRC guidelines with cited answers based on the claim's records.

---

## 🛠️ Main Technical Decisions

| Decision | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 | Server/Client split rendering, Turbopack compilation, rapid hydration, zero layout shift. |
| **Language & Typing** | TypeScript 5 (Strict Mode) | Full type safety across legal documents, cadastral geometry, weather telemetry, and audit finding structures. |
| **Styling** | Tailwind CSS v4 | High-density administrative UI, clean typography for Telugu/Indic scripts, and responsive layout across desktops, tablets, and field devices. |
| **Geospatial Visualization** | Interactive SVG Cadastral Layer | Lightweight, zero-external-dependency vector parcel visualizer capable of plotting survey boundaries and geotag distance calculations offline. |
| **Rules Engine** | Deterministic SDRF Logic Engine | Strictly compliant with official Government Orders (G.O. Ms 17) ensuring zero hallucination in financial calculations. |
| **State & Persistence** | Client Storage & State Machine | Instant simulation capability with `localStorage` backup allowing reviewers to test without backend setup friction. |

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18.0 or higher, tested on v22.18)
- npm (v9.0 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/akshitravula/Rythu-Kavach.git
cd Rythu-Kavach
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
Navigate to:
```
http://localhost:3000
```

The application will launch directly in **Telugu (తెలుగు)** with 8 pre-loaded realistic test claims representing various governance edge cases.

---

## 🧪 Test Scenarios & Pre-Loaded Claims

The app includes 8 realistic synthetic claims demonstrating edge cases:

1. **`RK-2026-0101` (Mutyala Ramulu)**: Clean marginal farmer case (2.50 acres cotton, 80% hail loss, 100% verified docs, AWS 78.5mm verified). **AI: Recommend Sanction (₹21,250)**.
2. **`RK-2026-0102` (Kongara Venkatesh)**: Critical Extent Inflation Anomaly (claimed 4.80 acres, but Dharani passbook verifies only 2.10 acres). **AI: Flagged Extent Discrepancy**.
3. **`RK-2026-0103` (Bollam Laxmamma)**: Geotag Mismatch Anomaly (damage photo taken 680 meters outside plot perimeter). **AI: Flagged GPS Out-of-Bounds**.
4. **`RK-2026-0104` (Pogula Srinivas)**: Photo Recycling Fraud (identical image hash submitted in another claim in same village). **AI: Flagged Duplicate Photo / Fraud**.
5. **`RK-2026-0105` (Gundla Anjaneyulu)**: Below Statutory Threshold (assessed loss 20% < statutory 33% minimum cut-off). **AI: Recommend Rejection under SDRF Sec 2.1**.
6. **`RK-2026-0106` (Siripuram Mallesh)**: Tenant Cultivator without CCRC agreement attached. **AI: Recommend Return for CCRC submission**.
7. **`RK-2026-0107` (Chinthala Ravi Kumar)**: High-Value Horticulture claim (3.0 acres chilli, ₹51,000 relief eligible). **AI: Recommend Sanction with MAO/MRO joint sign-off**.
8. **`RK-2026-0108` (Thota Swapna)**: Bank NPCI Seeding Inactive (payment would bounce at Treasury). **AI: Recommend Return for NPCI Aadhaar bank linking**.

---

## 🔐 Login & Role Switching

A quick **Officer Role Switcher** is built into the top navigation bar to test different departmental perspectives:
- **మండల వ్యవసాయ అధికారి (MAO)**: Mandal Agriculture Officer (Crop & e-Panta verification)
- **తహసీల్దార్ / MRO**: Mandal Revenue Officer (Land records & final financial sanction)
- **జిల్లా కలెక్టర్**: District Collector (Overall mandal monitoring)

Demo credentials if required by hosting platform:
- **Officer ID**: `tahsildar.maheshwaram@telangana.gov.in`
- **Password**: `Officer@2026`

---

## 📜 Compliance & Legal References
- **SDRF Guidelines**: Government Order (G.O.) Ms No. 17, Revenue & Disaster Management Dept.
- **Telangana Rights in Land & Pattadar Passbooks Act (ROR Act)**: Section 4.
- **Telangana Licensed Cultivators Act (CCRC Rules)**: Form-1 Tenancy Directives.
- **Direct Benefit Transfer (DBT) Mission**: Aadhaar NPCI Seeding Mandate.

---

Built with pride for government officers and farmers.
