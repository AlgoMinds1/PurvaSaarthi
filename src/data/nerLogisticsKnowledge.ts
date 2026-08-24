import type { RagKnowledgeChunk } from '../types';

/**
 * PURVASAARTHI — NORTH EASTERN REGION (NER) LOGISTICS KNOWLEDGE BASE
 * Authenticated domain knowledge covering corridors, bridges, terrain, weather vulnerabilities,
 * commodity resilience, safe laybys, and disaster SOPs across all 8 North Eastern states.
 */

export const nerKnowledgeBase: RagKnowledgeChunk[] = [
  // ── STRATEGIC CORRIDORS & HIGHWAYS ──────────────────────────────────────────
  {
    id: 'rag-corridor-siliguri',
    title: "Siliguri Corridor ('Chicken's Neck') Logistics Bottleneck",
    category: 'CORRIDOR',
    stateOrRegion: 'West Bengal / Assam Border Gateway',
    highwayOrCorridor: 'NH-27 / Siliguri Arterial',
    authorityOrSource: 'Ministry of Road Transport & Highways (MoRTH) / PurvaSaarthi Regional Study',
    section: '§1.1 Strategic Arteries',
    lastUpdated: '2026-08-20',
    keywords: ['siliguri', "chicken's neck", 'chickens neck', 'chokepoint', 'bottleneck', 'gateway', 'rail corridor', 'mainland connectivity'],
    content: `The Siliguri Corridor (popularly called the 'Chicken's Neck') is a narrow strip of land approximately 20 to 22 kilometers wide (and barely 17 km at its narrowest point in West Bengal) that connects mainland India to all 8 North Eastern States (Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Sikkim). Over 95% of overland freight, surface commodities, fuel tankers, and essential PDS rations enter the NER through this single strategic conduit via NH-27 and the Northeast Frontier Railway (NFR) main line. Any disruption in this corridor (due to severe monsoonal flooding in the Teesta/Mahananda basins or seismic landslides) creates an immediate cascading logistics failure across all 8 northeastern states within 24 to 48 hours. Strategic resilience measures include the Jogighopa Multimodal Logistics Park (MMLP), alternative transit protocols via Bangladesh waterways (Ashuganj and Chittagong ports), and high-capacity staging yards at New Jalpaiguri and Bongaigaon.`,
  },
  {
    id: 'rag-corridor-nh27',
    title: 'NH-27 (East-West Lifeline Corridor — Guwahati to Silchar)',
    category: 'CORRIDOR',
    stateOrRegion: 'Assam & Meghalaya border',
    highwayOrCorridor: 'NH-27',
    authorityOrSource: 'NHAI / Assam PWD Highway Division',
    section: '§1.2 Arterial Corridors',
    lastUpdated: '2026-08-24',
    keywords: ['nh-27', 'nh27', 'guwahati', 'silchar', 'jorabat', 'umtru', 'landslide', 'barak valley', 'east-west corridor'],
    content: `National Highway 27 (NH-27) is the primary east-west lifeline corridor connecting lower Assam (Guwahati) through Ri-Bhoi, Dima Hasao, and into the Barak Valley (Silchar), servicing southern Assam, Tripura, and Mizoram. The corridor features steep terrain slopes (up to 32° in the hill sections between Km 38 and Km 74) and passes through the Umtru River catchment zone. During heavy monsoon spells (>80mm/6hr precipitation), this corridor suffers high landslide susceptibility, slope failure, and mudslides. In PurvaSaarthi's operational matrix, NH-27 is classified as a Single Point of Failure (SPOF) when severe waterlogging or bridge approach submersion occurs. The designated primary alternative bypass is NH-106 via the Shillong Eastern Bypass.`,
  },
  {
    id: 'rag-corridor-nh106',
    title: 'NH-106 (Shillong Eastern Bypass Alternative Route)',
    category: 'CORRIDOR',
    stateOrRegion: 'Meghalaya / Assam border',
    highwayOrCorridor: 'NH-106',
    authorityOrSource: 'Meghalaya PWD & NHIDCL',
    section: '§1.3 Bypass Routing',
    lastUpdated: '2026-08-24',
    keywords: ['nh-106', 'nh106', 'shillong bypass', 'reroute', 'alternative route', 'detour', 'safe route', 'ri-bhoi'],
    content: `National Highway 106 (NH-106) functions as the official AI-recommended alternative detour and bypass corridor for heavy commercial vehicles and essential supply convoys when NH-27 experiences landslides or flooding. NH-106 features engineered gentler slopes (average terrain gradient of 14°), modern reinforced culverts, lower bridge dependency, and historically zero major landslide blockages. While traversing NH-106 adds approximately 24 kilometers to the transit distance and 35 to 45 minutes of driving time, it reduces route disruption probability from over 90% down to under 25%, ensuring safe and uninterrupted delivery of temperature-controlled medicines and food supplies.`,
  },
  {
    id: 'rag-corridor-nh37',
    title: 'NH-37 (Brahmaputra South Bank Arterial & Kaziranga Corridor)',
    category: 'CORRIDOR',
    stateOrRegion: 'Assam (Kamrup, Nagaon, Golaghat, Dibrugarh)',
    highwayOrCorridor: 'NH-37 / Old NH-715',
    authorityOrSource: 'Assam State Disaster Management Authority (ASDMA)',
    section: '§1.4 Riverine Corridors',
    lastUpdated: '2026-08-21',
    keywords: ['nh-37', 'nh37', 'brahmaputra', 'kaziranga', 'animal corridor', 'floods', 'nagaon', 'dibrugarh', 'upper assam'],
    content: `NH-37 traverses the southern bank of the Brahmaputra River, linking Guwahati to Upper Assam hubs (Nagaon, Jorhat, Dibrugarh, Tinsukia). The corridor traverses the ecologically sensitive Kaziranga National Park eco-zone, where automated speed-limiting and sensor-monitored animal corridors are enforced during floods. During severe monsoon inundations, sections between Jakhalabandha and Bokakhat are prone to river overflow. Heavy freight is routed through the North Bank corridor (NH-15 via Kolia Bhomora Setu) when animal corridor speed restrictions (40 km/h) create severe logistical bottlenecks.`,
  },
  {
    id: 'rag-corridor-nh29',
    title: 'NH-29 & NH-2 (Dimapur - Kohima - Imphal Lifeline)',
    category: 'CORRIDOR',
    stateOrRegion: 'Nagaland & Manipur',
    highwayOrCorridor: 'NH-29 / NH-2',
    authorityOrSource: 'NHIDCL & Border Roads Organisation (Project Sewak)',
    section: '§1.5 Hill Lifelines',
    lastUpdated: '2026-08-18',
    keywords: ['nh-29', 'nh29', 'nh-2', 'nh2', 'dimapur', 'kohima', 'imphal', 'nagaland', 'manipur', 'pagla pahar', 'landslide'],
    content: `NH-29 connects the railhead and logistics depot of Dimapur (Nagaland) to Kohima and continues as NH-2 into the Imphal Valley (Manipur). It serves as the single overland arterial lifeline for supplying medicines, fuel, LPG, and food grains to Manipur and southern Nagaland. The section near Pagla Pahar and the Zubza gorge is world-renowned for chronic geological instability, rockfalls, and shear-plane landslides during the monsoon. When NH-29 is severed, Manipur relies on the secondary, longer Jiribam-Imphal corridor (NH-37 Imphal-Silchar road), which features multiple single-lane bailey bridges and requires armed logistics convoy escorts during emergency shortages.`,
  },
  {
    id: 'rag-corridor-nh10',
    title: 'NH-10 (Sevoke to Gangtok Lifeline — Teesta River Corridor)',
    category: 'CORRIDOR',
    stateOrRegion: 'West Bengal & Sikkim',
    highwayOrCorridor: 'NH-10',
    authorityOrSource: 'Border Roads Organisation (Project Swastik) / Sikkim Disaster Management',
    section: '§1.6 Mountain Corridors',
    lastUpdated: '2026-08-22',
    keywords: ['nh-10', 'nh10', 'sikkim', 'gangtok', 'sevoke', 'teesta', 'rangpo', 'landslides', 'cloudburst'],
    content: `National Highway 10 (NH-10) is the sole major arterial highway linking Sikkim (via Rangpo and Singtam to Gangtok) with the rest of India at Siliguri/Sevoke. The road runs along the fragile gorge of the Teesta River. It is extremely vulnerable to monsoon washouts, flash floods, Glacial Lake Outburst Floods (GLOFs), and recurring landslides at 29th Mile, Birik Dara, and Likhu Veer. When NH-10 is closed, alternative detour routes include the circuitous Lava-Algarah-Reshi-Rhenock route or the Melli-Nayabazar-Jorethang route in South/West Sikkim, adding 4 to 6 hours of transit time and imposing vehicle weight limits (<18 tonnes).`,
  },
  {
    id: 'rag-corridor-sela',
    title: 'Sela Tunnel & Balipara-Charduar-Tawang (BCT) Corridor',
    category: 'CORRIDOR',
    stateOrRegion: 'Arunachal Pradesh',
    highwayOrCorridor: 'NH-13 / BCT Road',
    authorityOrSource: 'Border Roads Organisation (Project Vartak)',
    section: '§1.7 High Altitude Corridors',
    lastUpdated: '2026-08-19',
    keywords: ['sela tunnel', 'sela pass', 'tawang', 'arunachal', 'bct road', 'vartak', 'high altitude', 'winter freeze', 'border logistics'],
    content: `The Balipara-Charduar-Tawang (BCT) road and Orang-Kalaktang-Shergaon-Rupa-Tenga (OKSRT) road connect the Assam plains (Tezpur) to the high-altitude frontier districts of West Kameng and Tawang in western Arunachal Pradesh. The landmark Sela Tunnel (at an elevation of 13,000 ft, cutting through Sela Pass) provides all-weather logistics accessibility, eliminating past winter closures caused by heavy snow and ice. However, heavy rains in the sub-tropical foothill zone (Bhalukpong to Bomdila) frequently trigger mudslides. The PurvaSaarthi system coordinates convoy dispatches from Misamari and Tezpur staging depots based on 24-hour meteorological radar alerts.`,
  },
  {
    id: 'rag-corridor-nh208',
    title: 'NH-208 & NH-8 (Tripura Lifeline Corridor via Churaibari)',
    category: 'CORRIDOR',
    stateOrRegion: 'Tripura & Southern Assam',
    highwayOrCorridor: 'NH-8 / NH-208',
    authorityOrSource: 'Tripura PWD & NHIDCL',
    section: '§1.8 Border Lifelines',
    lastUpdated: '2026-08-17',
    keywords: ['tripura', 'agartala', 'churaibari', 'nh-8', 'nh-208', 'nh8', 'nh208', 'fuel shortage', 'barak valley'],
    content: `Tripura relies heavily on NH-8 (formerly NH-44), which enters the state at the Churaibari border checkpost from Assam's Karimganj/Cachar districts. Because this corridor passes through the low-lying and landslide-prone Dima Hasao and Jatinga valleys, disruptions in southern Assam immediately bottleneck fuel and LPG supplies into Agartala. In 2016 and 2022, severe road degradation at Churaibari led to strict fuel rationing in Agartala. The government maintains a multimodal backup via the Maitri Setu bridge over the Feni River (Sabroom) connecting to Bangladesh's Chittagong sea port (just 75 km away), providing a vital resilience fallback.`,
  },
  {
    id: 'rag-corridor-lumding-badarpur',
    title: 'Lumding-Badarpur Hill Section Multimodal Corridor',
    category: 'CORRIDOR',
    stateOrRegion: 'Assam (Dima Hasao & Cachar)',
    highwayOrCorridor: 'NH-27 / NFR Hill Railway',
    authorityOrSource: 'Northeast Frontier Railway (NFR) & Assam PWD',
    section: '§1.9 Multimodal Hill Corridors',
    lastUpdated: '2026-08-23',
    keywords: ['lumding', 'badarpur', 'dima hasao', 'haflong', 'jatinga', 'railway', 'hill section', 'mudslides', 'barak valley'],
    content: `The Lumding-Badarpur section through the Barail mountain range is the primary rail-and-road gateway connecting the Brahmaputra Valley to the entire southern NER (Barak Valley, Tripura, Mizoram, and parts of Manipur). The region is geologically young with shale rocks that lose shear strength when saturated, resulting in massive mud avalanches (such as the New Haflong disaster). When rail lines or roads in Dima Hasao are severed, all surface logistics to southern NER states are crippled. PurvaSaarthi maintains a dedicated cascade disruption model specifically for the Haflong-Jatinga-Harangajao bottleneck.`,
  },

  // ── STRATEGIC BRIDGES & RIVER CROSSINGS ─────────────────────────────────────
  {
    id: 'rag-bridge-saraighat',
    title: 'Saraighat Bridges (Old Rail-Road & New 3-Lane Bridge)',
    category: 'BRIDGE',
    stateOrRegion: 'Assam (Guwahati Gateway)',
    highwayOrCorridor: 'NH-27 / Brahmaputra Crossing',
    authorityOrSource: 'Northeast Frontier Railway & Assam PWD',
    section: '§2.1 River Crossings',
    lastUpdated: '2026-08-24',
    keywords: ['saraighat', 'brahmaputra bridge', 'guwahati', 'north guwahati', 'river crossing', 'chokepoint'],
    content: `The Saraighat Bridges over the Brahmaputra River at Guwahati represent the single most important logistics gateway connecting North Guwahati (and the northern bank highways NH-15/NH-27) to the commercial capital of Assam and the transshipment hubs of southern/eastern NER. The old dual-level rail-road bridge (commissioned in 1962) and the new 3-lane road bridge handle over 65,000 freight and passenger vehicles daily. Heavy vehicle freight load restrictions are dynamically managed during high-discharge flood stages of the Brahmaputra River.`,
  },
  {
    id: 'rag-bridge-bogibeel',
    title: 'Bogibeel Rail-Cum-Road Bridge',
    category: 'BRIDGE',
    stateOrRegion: 'Assam (Dibrugarh — Dhemaji)',
    highwayOrCorridor: 'NH-15 / Brahmaputra Crossing',
    authorityOrSource: 'Ministry of Railways / NHAI',
    section: '§2.2 River Crossings',
    lastUpdated: '2026-08-20',
    keywords: ['bogibeel', 'dibrugarh', 'dhemaji', 'brahmaputra', 'upper assam', 'arunachal', 'heavy transport'],
    content: `At 4.94 kilometers, Bogibeel Bridge is India's longest rail-cum-road bridge, spanning the Brahmaputra River between Dibrugarh on the south bank and Dhemaji on the north bank. It is constructed with fully welded steel trusses designed to withstand seismic forces up to magnitude 8.0 on the Richter scale. The bridge slashed logistics transit time between Dibrugarh and eastern Arunachal Pradesh (Pasighat, Along, Roing) from a 14-hour river ferry journey to a 3-hour direct road trip, enabling rapid dispatch of essential supplies and medical goods to northern frontier districts.`,
  },
  {
    id: 'rag-bridge-bhupen-hazarika',
    title: 'Bhupen Hazarika Setu (Dhola-Sadiya Bridge)',
    category: 'BRIDGE',
    stateOrRegion: 'Assam — Arunachal Pradesh Border',
    highwayOrCorridor: 'NH-115 / Lohit River Crossing',
    authorityOrSource: 'Ministry of Road Transport & Highways / NHIDCL',
    section: '§2.3 Strategic Bridges',
    lastUpdated: '2026-08-20',
    keywords: ['dhola-sadiya', 'dhola sadiya', 'bhupen hazarika', 'lohit river', 'sadiya', 'tinsukia', 'eastern arunachal'],
    content: `Spanning 9.15 kilometers over the Lohit River (a major tributary of the Brahmaputra), the Bhupen Hazarika Setu connects Dhola in Tinsukia district of Assam to Sadiya, continuing directly into Roing, Tezu, and Anini in eastern Arunachal Pradesh. It can support 60-tonne military main battle tanks and heavy articulated multi-axle freight carriers. The bridge eliminated round-the-clock water ferry dependence, ensuring uninterrupted supply of medicines, construction steel, and food supplies to remote frontier settlements across the Dibang and Lohit river valleys.`,
  },
  {
    id: 'rag-bridge-b17',
    title: 'Bridge B-17 (Umtru River Crossway — NH-27 Km 48)',
    category: 'BRIDGE',
    stateOrRegion: 'Assam / Meghalaya border (District X approach)',
    highwayOrCorridor: 'NH-27 Corridor',
    authorityOrSource: 'State PWD / PurvaSaarthi Live Telemetry',
    section: '§2.4 Critical Chokepoint Bridges',
    lastUpdated: '2026-08-24',
    keywords: ['bridge b-17', 'bridge b17', 'umtru', 'submerged', 'waterlogging', 'spof', 'district x', 'high risk bridge'],
    content: `Bridge B-17 is a two-lane pre-stressed concrete bridge crossing the Umtru River on NH-27. In the PurvaSaarthi operational dashboard, Bridge B-17 is designated as a Critical Single Point of Failure (SPOF) with high flood vulnerability. When rainfall exceeds 100mm/24hr in the Khasi Hills catchment, the Umtru approach ramp suffers backwater submergence of 1.0 to 1.4 meters. When Bridge B-17 is compromised, heavy freight traffic on NH-27 is blocked, isolating District X and District Y unless immediately rerouted to the NH-106 Shillong Bypass.`,
  },
  {
    id: 'rag-bridge-naranarayan',
    title: 'Naranarayan Setu (Jogighopa Brahmaputra Crossing)',
    category: 'BRIDGE',
    stateOrRegion: 'Assam (Bongaigaon — Goalpara)',
    highwayOrCorridor: 'NH-17 / Brahmaputra Crossing',
    authorityOrSource: 'NHAI / Northeast Frontier Railway',
    section: '§2.5 Strategic Bridges',
    lastUpdated: '2026-08-15',
    keywords: ['naranarayan setu', 'jogighopa', 'goalpara', 'bongaigaon', 'mmlp', 'brahmaputra bridge', 'western assam'],
    content: `Naranarayan Setu is a 2.28-kilometer double-decker rail-cum-road bridge over the Brahmaputra River connecting Pancharatna (Goalpara) and Jogighopa (Bongaigaon). It connects lower Assam and Meghalaya (Garo Hills via Tura) directly to the Jogighopa Multimodal Logistics Park (MMLP). It provides a crucial western diversion route when the Guwahati/Saraighat crossing experiences heavy gridlock or emergency maintenance closures.`,
  },

  // ── DISTRICT PROFILES & ISOLATION RISKS ──────────────────────────────────────
  {
    id: 'rag-district-x',
    title: 'District X (Ri-Bhoi / East Khasi Mountainous Interface)',
    category: 'DISTRICT',
    stateOrRegion: 'Meghalaya / Assam border',
    authorityOrSource: 'District Disaster Management Authority (DDMA)',
    section: '§3.1 District Resilience Profiles',
    lastUpdated: '2026-08-24',
    keywords: ['district x', 'isolation risk', 'civil hospital', 'ri-bhoi', 'east khasi', 'vaccines', 'medical supplies'],
    content: `District X is a high-altitude border district with a population of ~320,000 residents. It has a baseline connectivity score of 42% and an active Isolation Risk of 89% during monsoons due to heavy dependence on the vulnerable NH-27 corridor. District X's Central Civil Hospital and ICU network depend entirely on daily consignments dispatched from Guwahati Central Depot (such as Shipment #SHIP-104 carrying critical medicines). The district has only 1.7 days of essential medical stock remaining during acute corridor disruptions. PurvaSaarthi's AI engine automatically issues mandatory reroute orders to NH-106 when District X's isolation risk exceeds 70%.`,
  },
  {
    id: 'rag-district-y',
    title: 'District Y (Jaintia / Ri-Bhoi Buffer District)',
    category: 'DISTRICT',
    stateOrRegion: 'Meghalaya',
    authorityOrSource: 'District Food & Civil Supplies Department',
    section: '§3.2 District Resilience Profiles',
    lastUpdated: '2026-08-24',
    keywords: ['district y', 'food grains', 'warehouse', 'pds', 'buffer stock', 'jaintia', 'supply days'],
    content: `District Y is an agrarian and mining hill district with a population of 210,000. It has an active connectivity rating of 68% and an isolation risk of 45%. Its primary food grain warehouse holds 4.2 days of PDS rations. Transport access is primarily supported by NH-106 and SH-2. During severe weather, District Y functions as an intermediate transit and transshipment buffer zone where stranded convoys can safely stage at local laybys.`,
  },
  {
    id: 'rag-district-z',
    title: 'District Z (Upper Assam / Arunachal Foothills Interface)',
    category: 'DISTRICT',
    stateOrRegion: 'Assam / Arunachal Border',
    authorityOrSource: 'State Agriculture Logistics Board',
    section: '§3.3 District Resilience Profiles',
    lastUpdated: '2026-08-24',
    keywords: ['district z', 'agricultural produce', 'telemetry unavailable', 'foothills', 'fertilizer', 'perishables'],
    content: `District Z is an agricultural foothill district with a population of 185,000 connected via the NH-715 corridor. It has a connectivity rating of 58% and an isolation risk of 62%. District Z is heavily vulnerable to telemetry shadow zones in deep river valleys, requiring drivers and field officials to use offline GPS caching and PWA sync queues. Essential supplies to District Z include fertilizers, high-yield seeds, and outbound shipments of organic ginger and tea.`,
  },
  {
    id: 'rag-district-mmlp',
    title: 'Jogighopa Multimodal Logistics Park (MMLP) — NER Gateway',
    category: 'DISTRICT',
    stateOrRegion: 'Assam (Bongaigaon)',
    authorityOrSource: 'National Highways Logistics Management Limited (NHLML)',
    section: '§3.4 Logistics Hubs',
    lastUpdated: '2026-08-20',
    keywords: ['mmlp', 'jogighopa', 'logistics park', 'multimodal', 'brahmaputra inland waterways', 'freight hub', 'warehousing'],
    content: `India's first international Multimodal Logistics Park (MMLP) at Jogighopa, Assam, spans 317 acres along the Brahmaputra River. It integrates 4 modes of transport: Road (NH-17), Rail (Jogighopa station), Inland Waterways (National Waterway-2 on the Brahmaputra), and Air (via Guwahati LGBI Airport). The MMLP provides state-of-the-art cold storages, automated container freight stations (CFS), fuel depots, and mechanical repair bays, serving as the central resilience buffer for staging essential goods prior to dispatch across the 8 NER states.`,
  },

  // ── ESSENTIAL COMMODITIES & RESILIENCE STANDARDS ────────────────────────────
  {
    id: 'rag-commodity-medicines',
    title: 'Priority 1: Critical Medicines & Vaccine Cold Chains',
    category: 'COMMODITY',
    stateOrRegion: 'All 8 NER States',
    authorityOrSource: 'National Health Mission (NHM) / WHO Cold Chain Guidelines',
    section: '§4.1 Commodity Prioritization',
    lastUpdated: '2026-08-24',
    keywords: ['medicine', 'vaccines', 'cold chain', 'icu supplies', 'insulin', 'antivenom', 'oxygen', 'priority 100', 'ship-104'],
    content: `In the PurvaSaarthi logistics architecture, Critical Medicines and Temperature-Sensitive Biologicals are designated with the highest urgency score (Priority 100). This includes childhood vaccines, insulin, anti-rabies and snake antivenom, blood products, dialysis fluids, and medical ICU oxygen. Cold chain supplies must maintain strict 2°C to 8°C temperatures (monitored by active IoT dataloggers). Under PurvaSaarthi protocols, any predicted delay exceeding 3 hours on a medical shipment triggers an automatic priority rerouting alert to the Command Center and the assigned driver PWA, overriding normal cost/distance optimization to preserve life-saving stock buffers.`,
  },
  {
    id: 'rag-commodity-food',
    title: 'Priority 2: PDS Food Grains & Monsoon Buffer Mandate',
    category: 'COMMODITY',
    stateOrRegion: 'All 8 NER States',
    authorityOrSource: 'Food Corporation of India (FCI) / Ministry of Consumer Affairs',
    section: '§4.2 Commodity Prioritization',
    lastUpdated: '2026-08-22',
    keywords: ['food', 'pds', 'rice', 'wheat', 'fci', 'food grains', 'buffer stock', 'monsoon mandate', '90 days'],
    content: `Food Corporation of India (FCI) operates a mandatory 90-day monsoon buffer stock mandate for all hill districts across Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Meghalaya. Prior to the onset of the southwest monsoon in May, high-capacity grain rakes transport rice and wheat from Punjab/Haryana through the Siliguri corridor to base depots in Changsari, Dimapur, Jiribam, and Dharmanagar. PurvaSaarthi tracks district-level grain inventories in 'Days of Supply Remaining'. When a district drops below 5.0 days of grain reserves, automated replenishment dispatches are flagged as Critical Priority.`,
  },
  {
    id: 'rag-commodity-pol',
    title: 'Priority 3: Petroleum, Oil & Lubricants (POL) Tanker Convoys',
    category: 'COMMODITY',
    stateOrRegion: 'NER Regional Refineries (Assam to Hill States)',
    authorityOrSource: 'Indian Oil Corporation Ltd (IOCL) / Numaligarh Refinery (NRL)',
    section: '§4.3 Commodity Prioritization',
    lastUpdated: '2026-08-21',
    keywords: ['fuel', 'petroleum', 'pol', 'diesel', 'petrol', 'lpg', 'tankers', 'numaligarh', 'digboi', 'bongaigaon', 'convoy'],
    content: `The North Eastern Region is self-sufficient in oil refining with 4 refineries: Digboi (Asia's oldest), Guwahati, Bongaigaon, and Numaligarh Refinery Limited (NRL). However, transporting finished Motor Spirit (Petrol), High-Speed Diesel (HSD), and LPG bullets to landlocked hill states (Manipur, Mizoram, Tripura, Nagaland, Arunachal) requires traversing hazardous mountain corridors. Tanker convoys operate under strict SOPs: no night driving on mountain passes, mandatory anti-skid tire chains during mudslides, mandatory safe layby halts, and GPS speed monitoring (<40 km/h).`,
  },
  {
    id: 'rag-commodity-construction',
    title: 'Priority 4: Strategic Construction & BRO Infrastructure Steel/Cement',
    category: 'COMMODITY',
    stateOrRegion: 'Arunachal, Sikkim, Nagaland Borders',
    authorityOrSource: 'Border Roads Organisation (BRO)',
    section: '§4.4 Commodity Prioritization',
    lastUpdated: '2026-08-19',
    keywords: ['construction', 'bro', 'cement', 'steel', 'bridges', 'tunnels', 'infrastructure', 'bailey bridge', 'heavy freight'],
    content: `Border infrastructure construction materials (high-grade cement, structural TMT steel, pre-fabricated modular steel Bailey bridge panels, and heavy earthmoving spares) are transported by heavy multi-axle freight trailers (28 to 40 tonnes). Due to weight restrictions on historic bridges and narrow mountain hairpins, these consignments require bridge load-capacity pre-clearance via the PurvaSaarthi GIS layer before dispatch.`,
  },

  // ── SAFE LAYBYS & TRANSIT STAGING INFRASTRUCTURE ─────────────────────────────
  {
    id: 'rag-layby-jorabat',
    title: 'Jorabat Safe Freight Terminal & Heavy Vehicle Layby',
    category: 'SAFE_LAYBY',
    stateOrRegion: 'Assam — Meghalaya Border (Km 8.4 from Guwahati)',
    authorityOrSource: 'Assam Transport Department & NHAI',
    section: '§5.1 Safe Laybys & Staging',
    lastUpdated: '2026-08-24',
    keywords: ['jorabat', 'layby', 'truck terminal', 'staging area', 'heavy vehicle recovery', 'parking', 'dormitory', 'nh-27'],
    content: `Located at Km 8.4 on the junction of NH-27 and the Guwahati-Shillong corridor [GPS: 26.08, 91.79], the Jorabat Safe Freight Terminal accommodates up to 45 heavy multi-axle trucks. Facilities include 24/7 armed security, heavy hydraulic breakdown recovery cranes, driver dormitories, fresh water, canteen, and high-speed satellite telemetry uplink. During severe weather or mudslides on NH-27, PurvaSaarthi automatically notifies approaching drivers to halt at Jorabat rather than getting stranded in hazardous mountain gorges.`,
  },
  {
    id: 'rag-layby-nongpoh',
    title: 'Nongpoh Emergency Truck Shelter & Rescue Post',
    category: 'SAFE_LAYBY',
    stateOrRegion: 'Meghalaya (Ri-Bhoi District — Km 22.1)',
    authorityOrSource: 'Meghalaya State Disaster Management Authority & BRO',
    section: '§5.2 Safe Laybys & Staging',
    lastUpdated: '2026-08-24',
    keywords: ['nongpoh', 'emergency shelter', 'ri-bhoi', 'fuel depot', 'landslide rescue', 'satellite link', 'layby-2'],
    content: `Situated at Km 22.1 on the mid-hill section of the Shillong corridor [GPS: 25.90, 91.88], the Nongpoh Emergency Truck Shelter has a staging capacity for 30 heavy vehicles. Amenities include an emergency fuel reserve, dedicated landslide quick-response rescue post, satellite phone communications link (for telecom outage resilience), and first-aid medical station.`,
  },
  {
    id: 'rag-layby-umsning',
    title: 'Umsning Highland Staging Area & Cold Storage Backup',
    category: 'SAFE_LAYBY',
    stateOrRegion: 'Meghalaya (Highland Plateau — Km 38.6)',
    authorityOrSource: 'Meghalaya Agricultural Marketing Board',
    section: '§5.3 Safe Laybys & Staging',
    lastUpdated: '2026-08-24',
    keywords: ['umsning', 'staging area', 'cold storage', 'emergency power', 'workshop', 'medical aid', 'layby-3'],
    content: `Located at Km 38.6 at the northern approach to the Shillong Bypass [GPS: 25.75, 91.95], the Umsning Highland Staging Area accommodates 20 trucks. It features emergency solar/diesel backup cold storage plug-in points for temperature-controlled pharmaceutical reefers, a 24-hour commercial tire and mechanical workshop, and emergency doctor-on-call facilities.`,
  },

  // ── DISASTER SOPS & RESILIENCE PROTOCOLS ─────────────────────────────────────
  {
    id: 'rag-sop-landslide',
    title: 'SOP 4.1: Monsoonal Landslide Risk & Road Inundation Mitigation',
    category: 'DISASTER_SOP',
    stateOrRegion: 'All 8 NER States',
    authorityOrSource: 'National Disaster Management Authority (NDMA) & BRO Protocols',
    section: '§6.1 Disaster Response SOPs',
    lastUpdated: '2026-08-24',
    keywords: ['landslide sop', 'mudslide protocol', 'heavy rain alert', '80mm threshold', 'bro pushpak', 'vartak', 'rerouting protocol'],
    content: `Operational Standard Operating Procedure (SOP) for heavy monsoonal landslides and slope failures:
1. Precipitation Trigger: Forecasted rainfall >50mm in 6 hours generates an AMBER corridor advisory; rainfall >80mm in 6 hours on slopes >25° generates an immediate RED Disruption Alert (>85% disruption probability).
2. Autonomous Rerouting: Any vehicle transporting Priority ≥ 80 commodities (Medicines/ICU Supplies) within 30 km of the hazard zone is issued an automated turn-by-turn reroute instruction to the designated secondary arterial (e.g. NH-106 Bypass).
3. Safe Staging: If no alternate road exists, the driver is instructed to pull into the nearest Safe Layby (e.g., Jorabat or Nongpoh) and avoid parking under sheer rock overhangs.
4. Clearance SLA: BRO Task Forces (Project Pushpak / Vartak / Brahmank) are alerted with coordinates for heavy excavator deployment, targeting road clearance within 4 to 8 hours of incident verification.`,
  },
  {
    id: 'rag-sop-telemetry',
    title: 'SOP 4.2: Deep Hill Valley Telemetry Dropout & Dead-Reckoning Protocol',
    category: 'DISASTER_SOP',
    stateOrRegion: 'All 8 NER States',
    authorityOrSource: 'PurvaSaarthi Telemetry & GIS Standards',
    section: '§6.2 Telemetry Protocols',
    lastUpdated: '2026-08-24',
    keywords: ['telemetry dropout', 'shadow zone', 'dead reckoning', 'offline mode', 'gps loss', 'trk-219', 'pwa sync'],
    content: `Deep mountain river gorges and dense evergreen forests across the NER experience frequent cellular blackouts and GPS shadow zones (e.g., Upper Siang, Anjaw, Dima Hasao, Tuensang).
PurvaSaarthi Ground Truth Rule: The system NEVER assumes a vehicle has stopped or arrived simply because telemetry ceases.
1. Status Classification: When GPS telemetry is lost for >10 minutes, the vehicle status shifts to 'TELEMETRY_UNAVAILABLE' (with timestamp of last confirmed ping and freshness indicator).
2. Dead-Reckoning Estimation: The engine computes a confidence-bounded virtual position along the active road vector based on last recorded speed and slope gradient.
3. Offline Driver App Cache: The Driver PWA continues navigating using offline vector map tiles and stores geo-tagged milestone events in a local IndexedDB queue, auto-syncing upon signal recovery.`,
  },
  {
    id: 'rag-sop-multimodal-ferry',
    title: 'SOP 4.3: Brahmaputra River Ro-Ro Ferry Multimodal Alternative',
    category: 'DISASTER_SOP',
    stateOrRegion: 'Assam (National Waterway 2)',
    authorityOrSource: 'Inland Waterways Authority of India (IWAI)',
    section: '§6.3 Multimodal Waterways',
    lastUpdated: '2026-08-16',
    keywords: ['inland waterways', 'national waterway 2', 'ro-ro ferry', 'brahmaputra river', 'dhubri', 'guwahati', 'mawsmai'],
    content: `When major overland bridges (such as Saraighat or Naranarayan Setu) suffer structural alerts, or when highway corridors along the Brahmaputra are submerged, the Inland Waterways Authority of India (IWAI) activates scheduled Roll-on/Roll-off (Ro-Ro) ferry services on National Waterway 2 (NW-2). Key Ro-Ro terminals operate between Dhubri & Hatsingimari, Guwahati & North Guwahati, and Neamati Ghat & Majuli. Ro-Ro vessels can carry 12 to 20 loaded 16-tonne freight trucks per crossing, bypassing flooded roads with high reliability.`,
  },

  // ── LIVE PLATFORM TELEMETRY & ACTIVE FLEET CONTEXT ──────────────────────────
  {
    id: 'rag-live-fleet-trk204',
    title: 'Live Telemetry: Vehicle TRK-204 (Shipment #SHIP-104 — Critical Medicines)',
    category: 'LIVE_TELEMETRY',
    stateOrRegion: 'Assam — Meghalaya Border (Approaching Km 42)',
    highwayOrCorridor: 'NH-27 Lifeline Corridor (Active Reroute: NH-106 Bypass)',
    authorityOrSource: 'PurvaSaarthi Live Fleet Telemetry Engine',
    section: '§7.1 Live Telemetry',
    lastUpdated: '2026-08-24 (Live)',
    keywords: ['trk-204', 'trk204', 'ship-104', 'ship104', 'rahul sharma', 'critical medicines', 'civil hospital', 'detour', 'nh-106'],
    content: `Active Fleet Record for Vehicle TRK-204:
- Plate Number: AS 01 CX 4892
- Driver: Rahul Sharma (Phone: +91 98452 11094)
- Assigned Cargo: Shipment #SHIP-104 — Critical Medicines & ICU Supplies (Priority: 100/100, Consignee: Dr. Anamika Das, CMO District X Civil Hospital)
- Origin: Guwahati Central Medical Warehouse Hub #4
- Destination: District X Central Civil Hospital
- Current Location: [25.96, 91.88] on NH-27 Lifeline Corridor (Km 42)
- Current Road Disruption Risk: 91% (Active Landslide Hazard & Approach Waterlogging on Bridge B-17)
- Recommended Detour: NH-106 Shillong Bypass (Reduces risk from 91% down to 24%, adjusts ETA to 6:15 PM)
- Speed / Elevation: 44 km/h / 680m elevation / 16° slope gradient
- Telemetry Freshness: Live GPS ping received within last 60 seconds.`,
  },
  {
    id: 'rag-live-fleet-trk187',
    title: 'Live Telemetry: Vehicle TRK-187 (Shipment #SHIP-112 — PDS Food Grains)',
    category: 'LIVE_TELEMETRY',
    stateOrRegion: 'Meghalaya (Ri-Bhoi Arterial)',
    highwayOrCorridor: 'NH-106 Shillong Bypass',
    authorityOrSource: 'PurvaSaarthi Live Fleet Telemetry Engine',
    section: '§7.2 Live Telemetry',
    lastUpdated: '2026-08-24 (Live)',
    keywords: ['trk-187', 'trk187', 'ship-112', 'ship112', 'bipul sangma', 'food grains', 'pds', 'district y warehouse'],
    content: `Active Fleet Record for Vehicle TRK-187:
- Plate Number: ML 05 D 3318
- Driver: Bipul Sangma (Phone: +91 94361 77201)
- Assigned Cargo: Shipment #SHIP-112 — Fortified Rice & Wheat Food Grains (Priority: 75/100)
- Destination: District Y Food Grain Warehouse
- Current Location: [26.01, 92.11] on NH-106 (Route B)
- Route Risk: 24% (Low Risk, Open Corridor)
- Status: ON_TIME (ETA: 5:40 PM, Progress: 82%)
- Current Speed: 52 km/h / Elevation: 420m / Slope: 8°.`,
  },
  {
    id: 'rag-live-fleet-trk219',
    title: 'Live Telemetry: Vehicle TRK-219 (Shipment #SHIP-119 — Agricultural Fertilisers)',
    category: 'LIVE_TELEMETRY',
    stateOrRegion: 'Upper Assam Foothills (NH-715)',
    highwayOrCorridor: 'NH-715 Corridor',
    authorityOrSource: 'PurvaSaarthi Live Fleet Telemetry Engine',
    section: '§7.3 Live Telemetry',
    lastUpdated: '2026-08-24 (Live)',
    keywords: ['trk-219', 'trk219', 'ship-119', 'ship119', 'tsering norbu', 'telemetry unavailable', 'shadow zone', 'district z'],
    content: `Active Fleet Record for Vehicle TRK-219:
- Plate Number: AR 02 B 9012
- Driver: Tsering Norbu (Phone: +91 97740 55198)
- Assigned Cargo: Shipment #SHIP-119 — Agricultural Supplies & Organic Fertilizers (Priority: 50/100)
- Destination: District Z Agricultural Sub-depot
- Last Known Location: [26.80, 93.10] on NH-715 Corridor
- Telemetry Status: TELEMETRY_UNAVAILABLE (Last ping received 14 minutes ago — vehicle traversing deep gorge shadow zone)
- PurvaSaarthi Status: Offline Dead-Reckoning mode engaged; ETA calculation paused pending next tower handshake.`,
  },

  // ── REGIONAL OVERVIEW & GEOGRAPHY ───────────────────────────────────────────
  {
    id: 'rag-overview-ner-geography',
    title: 'NER Geographical & Logistics Matrix Overview',
    category: 'REGIONAL_OVERVIEW',
    stateOrRegion: 'North Eastern Region (All 8 States)',
    authorityOrSource: 'North Eastern Council (NEC) & Ministry of DoNER',
    section: '§8.1 Regional Overview',
    lastUpdated: '2026-08-20',
    keywords: ['ner overview', 'seven sisters', 'sikkim', 'doner', 'nec', 'geography', 'monsoon', 'seismic zone v', 'logistics challenge'],
    content: `The North Eastern Region (NER) of India spans 262,179 square kilometers across 8 states: Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura. Over 70% of the terrain is mountainous or high plateau with dense riverine networks dominated by the Brahmaputra and Barak river basins. The entire region is located in Seismic Zones V and IV (highest earthquake vulnerability in India) and experiences the highest monsoonal precipitation in the world (Mawsynram/Cherrapunji in Meghalaya averaging >11,000 mm annually). 
Logistics resilience across the NER is constrained by 4 primary vulnerabilities:
1. The 22-km Siliguri Corridor bottleneck linking the region to the rest of India.
2. Single Point of Failure (SPOF) hill corridors vulnerable to monsoon mudslides.
3. Wide seasonal river discharge fluctuations causing bridge approach washouts.
4. Deep valley cellular blackouts requiring offline-first telemetry and dead-reckoning protocols.`,
  }
];
