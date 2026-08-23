# 🛰️ PurvaSaarthi (पूर्वा सारथी)
### *North East Region (NER) Logistics Resilience & Cascade Intelligence Platform*

[![React 19](https://img.shields.io/badge/React-19.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-GIS-199900.svg?logo=leaflet)](https://leafletjs.com/)

---

## 📖 Overview

**PurvaSaarthi** is an AI-powered operational decision-intelligence platform engineered specifically for the complex terrain and extreme weather challenges of India's **North Eastern Region (NER)**. 

During monsoon seasons, landslides and flooding frequently sever critical highway lifelines (such as NH-06, NH-27, and NH-102), cutting off essential supply chains to isolated hill districts across Assam, Meghalaya, Arunachal Pradesh, Manipur, Nagaland, Mizoram, Tripura, and Sikkim.

PurvaSaarthi provides:
- **Real-time GIS road & bridge status tracking** with live environmental telemetry.
- **Predictive AI risk scoring** factoring in rainfall, slope gradients, and historical choke points.
- **Cascading Disruption Simulation** to foresee how a single highway or bridge failure triggers district-wide stockouts.
- **Autonomous Commodity Rerouting & Priority Dispatch** for LPG, grain, petroleum, and medical supplies.
- **Integrated Mobile PWAs** for field consignees, district authorities, and truck drivers operating in low-connectivity zones.

---

## 🌟 Key Capabilities & Modules

### 1. 🎛️ Regional Operations Command Center
- **Full-Width Interactive GIS Canvas**: Live status of national highways, critical bridges, and active freight convoys.
- **Collapsible Operations & Metrics Telemetry**: Overlay panel with instant access to corridor risk indicators, weather forecasts, landslide probabilities, and single-point-of-failure alerts.
- **Interactive Map Legend & Layer Controls**: Color-coded corridor statuses (*Open*, *Degraded*, *High Risk*, *Blocked*, *Unknown*).

### 2. 🗺️ Live GIS Map & Fleet Tracking HUD
- **Real-Time Convoy Tracking**: Live GPS coordinates, driver profiles, route risk indicators, and cargo details.
- **Multi-Layer GIS Filtering**: Toggle layers for highways, river bridges, district borders, active GPS fleet, incident zones, and live Doppler weather.
- **Vehicle Focus HUD**: Click any vehicle marker or corridor to focus the map and review telemetry in real-time.

### 3. 🛣️ Road Intelligence & Predictive Risk
- **AI Risk Scoring Model**: Calculates risk percentages based on 24h precipitation, terrain slope angle, landslide susceptibility, and historical blockage records.
- **Automated Reroute Proposals**: Evaluates alternative routes with delta distance, time, and safety scores before dispatch.

### 4. 📦 Supply at Risk & Commodity Inventory
- **Critical Commodity Monitoring**: Real-time tracking of Rice & Wheat (PDS), LPG cylinders, Diesel/Petrol, and Essential Medicines.
- **Buffer Stock Health & Days-to-Exhaustion**: Predictive depletion curves for all 8 NER states.
- **Proactive Supply Injections**: Trigger re-supply convoys before local inventory drops below emergency thresholds.

### 5. 🏛️ District Intelligence
- **Isolation Vulnerability Index**: Identifies which districts depend on single points of transit.
- **Infrastructure Audits**: Tracks the integrity and load limits of key river bridges and mountain passes.

### 6. 🚨 Alert Center & Incident Management
- **Severity-Tiered Alert Triage**: *CRITICAL*, *HIGH*, *WARNING*, and *INFO* alerts with audio-visual cues.
- **One-Click Mitigations**: Directly open reroute modals, notify district magistrates, or reroute drivers from alert cards.

### 7. ⚡ Cascading Failure Simulator
- **Interactive Disruption Simulation**: Select any corridor or river crossing and simulate sudden closures.
- **Multi-Step Ripple Analysis**: Watch downstream effects cascade across connected corridors, stranded trucks, and isolated district populations.

### 8. 🧠 AI Explainability & Data Trust (XAI)
- **Feature Attribution Inspector**: Clear SHAP-style breakdown of risk factors (e.g. *Precipitation 38%*, *Terrain Gradient 27%*, *Buffer Days 20%*, *Road Quality 15%*).
- **Audit Trails**: Transparent reasoning for emergency logistics managers and government stakeholders.

---

## 📱 Mobile PWA Portals (Field Operations)

PurvaSaarthi includes responsive Progressive Web App (PWA) portals built for on-the-ground stakeholders:

| Portal | Audience | Key Features |
|---|---|---|
| **Consignee / User PWA** | District supply officers, hospitals, ration dealers | Live order tracking, new emergency requisition placement, regional road status, multi-language support (English, Hindi, Assamese, Bengali). |
| **Driver Navigation PWA** | Fleet drivers in the NER corridor | Offline-ready turn-by-turn navigation, real-time detour acceptance, low-bandwidth SOS broadcast, incident reporting. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, Vite
- **UI & Styling**: Tailwind CSS, Lucide Icons, Glassmorphism design system
- **Mapping & Spatial Visualization**: Leaflet, OpenStreetMap Tile Layers
- **Global State & Offline Cache**: Zustand with localStorage synchronization
- **Internationalization**: Multi-language support (EN, HI, AS, BN)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) (version 9+ recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/AlgoMinds1/PurvaSaarthi.git
cd PurvaSaarthi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Available Scripts

```bash
# Start Vite development server with Hot Module Replacement (HMR)
npm run dev

# Type-check with TypeScript and build for production
npm run build

# Preview the production build locally
npm run preview

# Fast linter verification
npm run lint
```

---

## 📂 Project Structure

```
PurvaSaarthi/
├── public/                  # Static assets and brand SVG logos
├── src/
│   ├── assets/              # Icons and imagery
│   ├── components/
│   │   ├── layout/          # Sidebar (collapsible), Topbar
│   │   ├── mobile/          # Mobile frame simulator wrapper
│   │   └── ui/              # AI Explainability Drawer, Cascade Simulator, Reroute Modals
│   ├── data/                # NER GIS roads, districts, vehicles, and alerts mock datasets
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Main command module views
│   │   ├── CommandCenter.tsx        # Operations overview & interactive mini-GIS
│   │   ├── LiveMap.tsx              # Full-screen multi-layer GIS tracking
│   │   ├── RoadIntelligence.tsx     # Corridor risk scores and rerouting
│   │   ├── SupplyAtRisk.tsx         # Commodity buffer stock & inventory
│   │   ├── DistrictIntelligence.tsx # Vulnerability index per district
│   │   ├── AlertCenter.tsx          # Severity-tiered notifications
│   │   ├── VehicleTracking.tsx      # GPS fleet telemetry dashboard
│   │   ├── LandingPage.tsx          # Public marketing & feature overview
│   │   ├── LoginPage.tsx            # Multi-role authentication (Admin, Driver, User)
│   │   └── mobile/                  # Consignee & Driver PWA views
│   ├── store/               # Zustand application stores
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # App routing, layout shell & role switcher
│   └── index.css            # Design tokens, custom animations & glassmorphism styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛡️ License

PurvaSaarthi is developed under the MIT License.
