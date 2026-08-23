PS 26002 — NER Logistics Resilience & Cascade Intelligence Platform
Final Technical Requirements Document
Free / open-source stack, with implementation detail per component
Honesty framing to use in your pitch (say this explicitly to judges): "The MVP is fully buildable and demoable using free and open-source technologies. Some services (Supabase, Open-Meteo, GraphHopper hosted, Bhashini) are free for prototyping/non-commercial use with quotas, and have a clear self-hosted or paid path for production." Never claim "everything is free forever" — a judge who checks pricing pages will catch it, and the honest version is actually a stronger engineering answer.

PART 1 — ARCHITECTURE OVERVIEW


PART 2 — FULL STACK TABLE
Layer
Technology
License/Cost model
Required?
Web frontend
React + Vite + Tailwind CSS
Open source
Yes
Map rendering
Leaflet (MapLibre GL JS as upgrade path)
Open source
Yes
Base map data
OpenStreetMap via Geofabrik extracts
Open (ODbL, attribution required)
Yes
India hazard/admin data
Bhuvan (ISRO/NRSC), GSI, data.gov.in
Free registration, official govt data
Yes
Database
PostgreSQL + PostGIS, hosted on Supabase
Free tier (quota-limited), self-hostable
Yes
Graph/cascade engine
pgRouting (Postgres extension)
Open source
Yes
Routing engine
OSRM (self-hosted)
Open source
Yes
Routing (upgrade path)
GraphHopper or OpenRouteService
Free non-commercial tier / self-host
Optional
Weather
Open-Meteo
Free non-commercial (10k calls/day)
Yes
Terrain/elevation
SRTM DEM + GDAL/Rasterio/GeoPandas (preprocessed)
Open source
Yes
AI/ML
Python + scikit-learn + pandas
Open source
Yes
Mobile app
React Native + Expo
Open source
Yes
Offline sync
RxDB
Open source (free tier fully usable)
Yes
Realtime updates
Supabase Realtime
Free tier
Yes
Push notifications
Firebase Cloud Messaging
Free
Yes
Multilingual
Bhashini ULCA API + hard-coded verified templates
Free for prototyping, paid for production
Yes
File/photo storage
Supabase Storage + client-side compression
Free tier (1GB)
Yes
Auth & security
Supabase Auth + Row Level Security (RLS)
Free tier
Yes
Deployment
Vercel / Netlify / Cloudflare Pages (frontend), Supabase (backend)
Free tiers
Yes
Source control
GitHub
Free
Yes


PART 3 — LAYER-BY-LAYER IMPLEMENTATION DETAIL
3.1 Map rendering — Leaflet (primary) / MapLibre GL (upgrade)
Why: Leaflet gets a working district/road/bridge/vehicle map running fastest (42KB, zero deps, huge plugin ecosystem). MapLibre GL is the better long-term choice if your team already knows WebGL styling and wants vector-tile polish, using free unlimited tiles from OpenFreeMap (no key, no signup).
Implementation:

Step
npm install leaflet react-leaflet
Base tile layer: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png (must show © OpenStreetMap contributors attribution — this is a license requirement, not optional).
Layer your own GeoJSON on top: districts (polygons), roads (LineString, colored by status: green=open/yellow=degraded/red=blocked/orange=high-risk), bridges (markers), vehicles (animated markers via periodic position updates from Supabase Realtime).
If upgrading to MapLibre: npm install maplibre-gl react-map-gl, point style at an OpenFreeMap style URL (e.g. https://tiles.openfreemap.org/styles/liberty).


3.2 Base map & India-specific data — OSM + Bhuvan/GSI
OpenStreetMap (roads, bridges, settlements, waterways):

Implementation Details
Download NER-region extract from Geofabrik (download.geofabrik.de → Asia → India). Free, updated regularly.
Import into PostGIS using osm2pgsql or ogr2ogr — this gives you a queryable roads, bridges, waterways table directly in your database, ready for pgRouting.
License requirement: OSM is ODbL-licensed — display "© OpenStreetMap contributors" on any map view.

Bhuvan (ISRO/NRSC) — district boundaries, land cover, landslide/flood hazard layers:

Implementation Steps
Register at bhuvan.nrsc.gov.in (free).
Access via Bhuvan's WMS/WFS endpoints (bhuvan-app1.nrsc.gov.in/api/) for programmatic layer access, or download static shapefiles/KML from the Open Data Archive for a one-time ingest into your DB (simpler and more reliable for a hackathon than live WMS calls).
GSI (Geological Survey of India) landslide susceptibility zones — download and ingest once as a static hazard-zone table (hazard_zones in your schema), joined spatially to road segments via ST_Intersects.

Positioning for judges (per your own PRD's own guidance): frame this as "our platform is a decision-intelligence layer that consumes and complements Bhuvan/GSI/PM GatiShakti/ULIP data — not a replacement for them."

3.3 Database — PostgreSQL + PostGIS on Supabase
Why Supabase: managed Postgres + PostGIS + Auth + Storage + Realtime + Edge Functions in one free project. Free tier: 500MB database, 1GB file storage, 50,000 MAU, 5GB egress, 2M realtime messages/month, 500k Edge Function invocations. Note: free projects pause after ~1 week of inactivity — restart it before your demo.
Setup:
Create project at supabase.com (free, no card required for free tier).
Enable PostGIS: CREATE EXTENSION postgis;
Enable pgRouting: CREATE EXTENSION pgrouting;
Minimum schema (core entities from your PRD, section 32):

Entity
Columns / Details
districts
id, name, geom POLYGON, population, connectivity_score, isolation_risk
roads
id, name, geom LINESTRING, district_ids[], status, risk_score, terrain_slope, last_verified_at, source, confidence
bridges
id, name, geom POINT, road_id, load_capacity, status, criticality_score
vehicles
id, plate_no, current_location POINT, route_id, status, last_ping_at
shipments
id, vehicle_id, commodity_id, origin_id, destination_district_id, eta, status, priority
commodities
id, name, category) -- medicine, food, agri, construction
incidents
id, road_id, type, reported_by, geom POINT, photo_url, timestamp, confidence, status
weather_observations
id, district_id, rainfall_mm, forecast_json, fetched_at
hazard_zones
id, type[landslide/flood], geom POLYGON, susceptibility_score, source
risk_scores
id, road_id, score, factors_json, computed_at
alerts
id, severity, type, district_id, message, language, sent_at
supply_inventory
id, district_id, commodity_id, stock_days_remaining, updated_at
field_reports
id, incident_id, reporter_id, gps_accuracy, sync_status
users
id, role) -- admin/district_authority/field_officer/logistics_operator/viewer


Every status-bearing row must carry: source, timestamp, confidence, freshness — this is your PRD's "data trust layer" (section 14/38) and should be enforced at the schema level (NOT NULL constraints), not just in application logic.

3.4 Graph / cascade intelligence engine — pgRouting
Why not Neo4j: pgRouting gives you real graph algorithms (Dijkstra, A*, connectivity/component analysis, driving-distance) as a Postgres extension — no second database, no sync layer, one schema. This is the right call for hackathon time constraints; only reach for Neo4j if a teammate is already fluent in Cypher.
Implementation pattern for "if Bridge X fails, which districts become unreachable":

Graph Engine Implementation
Model your road network as a pgRouting-compatible graph: every road segment needs source and target node IDs (pgRouting's pgr_createTopology() function auto-generates these from your LineString geometries).
To simulate a failure, temporarily set that edge's cost to infinity (or exclude it from the query):
SELECT * FROM pgr_connectedComponents('SELECT id, source, target, cost FROM roads WHERE id != <failed_bridge_road_id> AND status != ''BLOCKED''');
For "which is the alternative route" once a road fails:
SELECT * FROM pgr_dijkstra('SELECT id, source, target, cost FROM roads WHERE status != ''BLOCKED''', <start_node>, <end_node>, directed := false);


This returns connected components — any district whose nodes fall into a different component than the main network is now isolated. This single query IS your Single-Point-of-Failure Detection and District Isolation Risk feature.

District Isolation Risk score = a weighted formula combining: pgr_connectedComponents output (binary: isolated or not) + number of alternative routes (pgr_ksp — k-shortest-paths — count of viable paths under N) + weather risk on remaining routes + historical disruption frequency on the district's critical corridors. Compute this on a schedule (e.g. every 5 minutes via a Supabase Edge Function/cron) and store in districts.isolation_risk.


Supply-at-Risk = a join across shipments → vehicles → roads.risk_score → supply_inventory.stock_days_remaining. When predicted_delay_hours / 24 > stock_days_remaining, raise a CRITICAL alert. No ML needed — this is pure relational logic.


Last Safe Action Window = given a rainfall forecast trend (rising precipitation) and a road's historical closure threshold (e.g. "closes at >80mm cumulative rainfall based on historical incidents"), interpolate the forecast curve to the point where the threshold is crossed → that timestamp minus a safety buffer is your "dispatch before X" recommendation. This can be a simple linear interpolation in Python — doesn't require ML.



3.5 Routing engine — OSRM (primary)
Why OSRM over GraphHopper as the default: since your own risk-weighting logic lives in your database (via pgRouting/your risk_scores table), you don't need the routing engine itself to understand risk — you just need fast base routing (A→B, ETA, geometry), which you then re-score yourself. OSRM is the fastest and simplest to self-host for this pattern.
Implementation:
Download NER OSM extract (.osm.pbf from Geofabrik).
Preprocess: osrm-extract -p car.lua ner.osm.pbf → osrm-partition → osrm-customize (Docker image osrm/osrm-backend makes this a few commands).
Run: osrm-routed --algorithm mld ner.osrm
Query: GET /route/v1/driving/{lon1},{lat1};{lon2},{lat2}?alternatives=true&geometries=geojson
Your risk-weighting layer sits on top: for each returned route, sum the risk_score of every road segment it passes through (spatial join via PostGIS ST_Intersects between route geometry and your roads table), then re-rank OSRM's alternatives by this composite score instead of by raw distance/time. This directly implements your PRD's "accessibility ≠ distance" principle (section 03).
Backup/fallback: OpenRouteService's free hosted API (openrouteservice.org, University of Heidelberg) — zero setup, good demo-day fallback if OSRM self-hosting eats too much time, has free isochrones and heavy-vehicle profiles built in. Rate-limited but fine for a demo.

3.6 Weather intelligence — Open-Meteo
Why: genuinely free, no API key, no signup, 10,000 calls/day / 5,000/hour / 600/minute for non-commercial use, 30+ blended weather models, includes a dedicated Flood API. This is a hard rate limit, not a soft one — cache responses per district rather than calling per-request.
Implementation:
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}
    &hourly=precipitation,rain,weathercode
    &daily=precipitation_sum
    &forecast_days=7

Fetch per-district (not per-road) on a schedule (e.g. every 30 min via a cron job), store in weather_observations.
Do not just display this. Feed it into your risk formula: rainfall_forecast × terrain_slope × historical_landslide_count × road_condition → disruption_probability. This chain (PRD section 10) is what makes it "AI-relevant" rather than a weather widget.
IMD (India Meteorological Department) is the "official" source but requires IP whitelisting via a formal request — not realistically obtainable before a hackathon deadline. Mention IMD as your production-integration target in your architecture slide; don't try to wire it up live.

3.7 Terrain risk — SRTM DEM, preprocessed (not live API calls)
Why preprocess instead of live elevation API: computing slope/gradient once per road segment and storing it is faster and more reliable during a live demo than depending on an external elevation API for every risk calculation.
Implementation:
Download SRTM 30m DEM tiles covering NER (from USGS EarthExplorer or OpenTopography, free).
Use rasterio + numpy (or QGIS's slope tool) to compute a slope raster once: gdaldem slope input_dem.tif slope_output.tif
For each road segment in your roads table, sample the slope raster along its geometry (rasterio.sample or rasterstats.zonal_stats) and store an average/max slope value as terrain_slope — a one-time batch job, not a runtime dependency.
Combine with GSI/Bhuvan landslide-susceptibility zone overlap (ST_Intersects between road geometry and hazard_zones polygons) to get a final terrain_risk_score per road, stored statically and only recomputed if the road geometry changes.

3.8 AI / ML disruption prediction — hybrid rule-based → scikit-learn
Start with an explainable weighted formula (no training data needed, defensible under judge questioning):

risk_score = w1×rainfall_forecast_norm
           + w2×terrain_slope_norm
           + w3×historical_disruption_count_norm
           + w4×landslide_susceptibility_norm
           + w5×recent_field_report_severity
           + w6×road_condition_score
(normalize each 0–1, weights sum to 1, output 0–100)


0–20   LOW · 21–40 MODERATE · 41–60 ELEVATED · 61–80 HIGH · 81–100 CRITICAL

Layer a trained model on top once you have data (synthetic or scraped historical incident records):
scikit-learn RandomForestClassifier or GradientBoostingClassifier on tabular features (rainfall, slope, historical count, road type, season) → outputs a disruption probability (0–100%) instead of a hand-weighted score.
Random Forest is the right pick for a hackathon: handles nonlinear relationships, doesn't need huge datasets, and feature importances are interpretable enough to answer "why did the model say HIGH risk."
Do not overclaim accuracy. If your training data is synthetic, say so explicitly: "the prototype uses a hybrid risk engine — an explainable weighted baseline plus an ML-ready architecture — and historical incident data can progressively replace synthetic training data as real deployment data accumulates." This is the technically honest and defensible framing.
Explainability output (implements PRD section 24/41 as a literal UI feature, not just a backend concept):

{
  "risk": "HIGH",
  "probability": 0.87,
  "contributing_factors": ["87mm rainfall forecast", "high slope (32°)", "3 historical landslides", "field report 8 min ago"],
  "confidence": 0.89,
  "data_freshness_minutes": 8
}



3.9 GPS vehicle tracking — simulated (MVP) → Traccar (production path)
MVP: React Native app pings /vehicle/{id}/location with device GPS coordinates on an interval → Supabase table vehicles updated → Supabase Realtime broadcasts the change → map marker moves live. For the demo, simulate multiple vehicles moving along OSRM-generated routes with a simple interpolation script if you don't have physical devices on real trucks.
Production path (mention, don't build): Traccar (open-source GPS server, 200+ device protocol support) as the ingestion layer once real fleet hardware is involved — and note that Indian commercial vehicles are already legally required to carry AIS-140 GPS devices, so this isn't hypothetical infrastructure, it already exists on the ground.
Critical implementation detail (edge case 8 in your PRD): if no location ping arrives for >N minutes, display "Vehicle telemetry unavailable" — NEVER "Vehicle stopped". This is a one-line UI distinction with outsized credibility value with judges.

3.10 Offline-first field app — React Native + Expo + RxDB
Why RxDB: ships 15+ ready-made sync adapters (including a custom-REST adapter you can point at Supabase) and built-in conflict resolution — this directly solves your PRD's edge cases 4, 6, 16, 17 (duplicate reports, conflicting reports, sync conflicts) without you hand-rolling that logic.
Implementation flow:

Flow Step
Field officer opens app (no signal)
→ fills incident form (type, description, photo, GPS)
→ RxDB writes locally (SQLite-backed on RN), state = PENDING
→ photo compressed client-side (browser-image-compression / RN equivalent) BEFORE storage
→ officer moves back into signal range
→ RxDB replication engine syncs queued documents to Supabase via REST adapter
→ server-side conflict check: does this incident already exist (same road, ±200m, ±30min window)?
→ if duplicate: merge, keep both as corroborating reports, raise confidence
→ if conflicting (Officer A says BLOCKED, Officer B says OPEN): keep BOTH, flag `status: UNCERTAIN`, surface for human verification, weight by reporter role/timestamp/photo evidence
→ sync_status updates: PENDING → SYNCING → SYNCED / CONFLICT / FAILED


Local storage schema mirrors the server schema (incidents, photos, GPS, timestamp, reporter, sync_state) — RxDB's replication protocol handles the queue automatically once you define pull/push functions against Supabase's REST API.

3.11 Alerts & multilingual — Bhashini (live) + hard-coded verified templates (critical alerts)
Bhashini setup:
Register at bhashini.gov.in/ulca/user/register (free).
Generate API key + User ID from "My Profile."
Call the Pipeline Search/Config/Compute flow: search for a translation pipeline for your source→target language pair, get a Pipeline ID, then send text through the Compute endpoint. (Documented at bhashini.gitbook.io/bhashini-apis.)
Free for prototyping; production/commercial use requires contacting the Bhashini team for a paid plan — state this explicitly in your pitch rather than claiming indefinite free access.
Critical alerts — do NOT machine-translate live. For your 4–5 highest-severity alert types (ROAD BLOCKED, DISTRICT ISOLATED, MEDICINE DELIVERY AT RISK, NO SAFE ROUTE AVAILABLE, BRIDGE FAILURE), pre-translate and hard-code verified strings for each of your demo languages (Hindi, Assamese, Bengali, English + 1–2 more). This directly satisfies edge case 19 (translation errors on critical terms are dangerous) and is also just faster/more reliable for a live demo than depending on a live API call.
Alert severity hierarchy (PRD section 25):

Severity Level
Notification Method
LEVEL 1 INFO
dashboard only, no push
LEVEL 2 WARNING
dashboard + in-app badge
LEVEL 3 HIGH
push notification (FCM)
LEVEL 4 CRITICAL
push + SMS fallback (optional stretch goal)
LEVEL 5 EMERGENCY
push + SMS + dashboard takeover banner


Push implementation: Firebase Cloud Messaging (free, unlimited) for mobile push — this does NOT require using Firebase for anything else in your stack; FCM can sit alongside a Supabase backend cleanly. Supabase Realtime handles live web-dashboard updates via websocket table subscriptions (supabase.channel('alerts').on('postgres_changes', ...)).

3.12 Security & auth
Supabase Auth for login (email/password or magic link), free tier covers 50k MAU.
Row Level Security (RLS) policies in Postgres — enforce that a Field Officer can only write incidents, a District Authority can only read their district's data, etc. This is genuinely more robust than application-layer permission checks because it's enforced at the database level even if your API code has a bug.
Roles: Admin, District Authority, Field Officer, Logistics Operator, Emergency Coordinator, Viewer.
Audit logging: a simple audit_logs table (actor_id, action, table, row_id, timestamp) triggered on writes to sensitive tables — cheap to add, strong "we thought about this" signal for judges given GPS/incident data sensitivity.

PART 4 — FULL REQUIREMENT → TECHNOLOGY MAPPING
PRD Requirement
Implemented via
Real-time road/bridge/district monitoring
roads/bridges/districts tables + Supabase Realtime + Leaflet
GIS accessibility map
Leaflet/MapLibre + OSM + Bhuvan overlays
Terrain-aware risk
SRTM slope preprocessing + GSI/Bhuvan hazard zones
Weather-aware risk
Open-Meteo → risk formula
Disruption prediction (AI/ML)
Weighted formula → scikit-learn Random Forest
Alternative route generation
OSRM + risk re-weighting via PostGIS spatial join
ETA/delay estimation
OSRM duration + delay = f(risk_score)
GPS vehicle tracking
Simulated/RN app → Supabase; Traccar noted as production path
Essential commodity tracking
shipments/commodities/supply_inventory tables
Commodity-aware priority routing
shipments.priority field weights route re-scoring
Automated alerts + severity hierarchy
Alert engine (Postgres trigger/Edge Function) → FCM/Realtime
Geo-tagged field reporting + photos
React Native + RxDB + Supabase Storage
Duplicate/conflicting report handling
RxDB sync + server-side proximity/time matching logic
Centralized dashboard
React + Leaflet + Supabase Realtime
Multilingual notifications
Bhashini (general) + hard-coded templates (critical)
Offline-first operation
RxDB local-first + replication queue
Government-data compatibility
Bhuvan/GSI/OSM ingestion, explicit "complements not replaces" framing
Cloud infra, security, scalability
Supabase (Postgres/Auth/Storage/Realtime) + RLS
District Isolation Risk (USP)
pgr_connectedComponents + weighted formula
Single-Point-of-Failure detection (USP)
pgr_connectedComponents on edge removal
Supply-at-Risk (USP)
Relational join: shipment delay vs. stock-days-remaining
Last Safe Action Window (USP)
Linear interpolation of rainfall forecast vs. historical closure threshold
Cascade simulation (USP)
Chained pgRouting queries (road fails → traffic shift → congestion → district isolation)
AI explainability
Structured JSON output (factors, confidence, freshness) surfaced as UI feature
Data trust layer
source/timestamp/confidence/freshness columns, enforced NOT NULL
Emergency Mode toggle
Flips route-weighting formula + alert thresholds live


PART 5 — WHAT TO EXPLICITLY NOT BUILD FOR THE HACKATHON
Per your own PRD's section 42 and general hackathon-scoping sense:

Component / Feature (DO NOT BUILD)
❌ Kafka/Redis event streaming — mention only as a "production roadmap" line, never implement for MVP.
❌ Neo4j — pgRouting on Postgres covers the graph use case without a second database.
❌ Real IoT/hardware GPS integration — simulate; cite Traccar/AIS-140 as the production path.
❌ Live IMD API — cite as production integration target; IP whitelisting process is too slow for a hackathon timeline.
❌ Cloudinary or any third paid-adjacent vendor — client-side compression + Supabase Storage covers it.
❌ Fully live machine-translated critical alerts — pre-verified templates only, for safety and demo reliability.


PART 6 — OPTIONAL DIFFERENTIATOR FEATURES (not required by PS, cheap to add, strengthen the demo)

Differentiator Feature
District isolation-risk sparkline — 24h trend of the isolation_risk score, computed from your existing scheduled writes, makes "we predict before it happens" visually obvious in 5 seconds.
Commodity stock-day countdown — literal countdown timer per district per critical commodity, computed from stock_days_remaining — turns an abstract score into something instantly understandable.
"Explain this alert" button — surfaces the contributing_factors/confidence JSON from section 3.8 directly in the UI.
Normal Mode / Emergency Mode toggle — visually flips route-weighting and alert thresholds live, demonstrating PRD edge case 18 without needing a real disaster.
Read-only public "citizen view" — district accessibility color-coding without operational detail, extending the public-service-delivery framing.


This document reflects free/open-source tooling and free service tiers as of August 2026. Verify current pricing/quota pages before your final submission, since free-tier terms (especially Supabase, Open-Meteo, GraphHopper, Bhashini) can change.

