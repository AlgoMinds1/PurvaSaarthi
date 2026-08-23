export type SupportedLanguage = 'en' | 'hi';

export interface AppTranslations {
  // Brand & General
  appName: string;
  create: string;
  pass: string;
  today: string;
  live: string;
  exit: string;
  overview: string;
  
  // Navigation Tabs - User
  tabLiveTrack: string;
  tabMyOrders: string;
  tabHazards: string;
  tabSos: string;

  // Navigation Tabs - Driver
  tabNav: string;
  tabReroute: string;
  tabCheckpoints: string;
  tabLaybys: string;

  // User Order Card
  eta: string;
  corridor: string;
  priority: string;
  stockRemaining: string;
  detourActive: string;
  monitored: string;
  callDriver: string;
  shareLinkCopied: string;
  cargoItems: string;
  coldChain: string;
  batch: string;
  trackingMilestones: string;
  activeStep: string;
  liveHighwayCorridor: string;
  shrink: string;
  expand: string;

  // User Order Modal
  newOrder: string;
  createRequisition: string;
  requisitionDesc: string;
  itemCategory: string;
  selectItem: string;
  destinationFacility: string;
  priorityLevel: string;
  consigneeName: string;
  consigneePhone: string;
  submitOrder: string;
  submitting: string;
  cancel: string;
  searchPlaceholder: string;
  yourRequisitions: string;
  manageConsignments: string;

  // Driver HUD & Telemetry
  inDistance: string;
  speedLimit: string;
  hudRerouted: string;
  hudOriginal: string;
  destination: string;
  speed: string;
  elevation: string;
  gradient: string;
  routeRisk: string;
  meters: string;
  slope: string;
  riskLow: string;
  riskCritical: string;
  activeTrip: string;
  online5G: string;
  offlineQueue: string;
  syncNow: string;
  telemetryStored: string;

  // Driver Actions & Manifest
  activeCargoManifest: string;
  criticalLifeSaving: string;
  coldChainSecure: string;
  handoverDeliveryBtn: string;
  deliveryVerified: string;
  stockUpdatedMsg: string;

  // Hazard Alert & Detour
  criticalRouteAlert: string;
  landslideDisruption: string;
  hazardAlertMsg: string;
  currentRoadRisk: string;
  detourRoadBenefit: string;
  acceptDetourBtn: string;
  laterBtn: string;
  reviewDetourBtn: string;

  // Checkpoints & Laybys
  checkpointsTitle: string;
  checkpointsSub: string;
  laybysTitle: string;
  laybysSub: string;
  distanceAhead: string;
  truckCapacity: string;
  safeDetourSegment: string;
  aiRerouteTitle: string;
  aiRerouteSub: string;
  acceptRouteB: string;
  routeAWarning: string;
  routeBAdvantage: string;
  
  // Hazards & SOS Desk
  corridorRoadHazards: string;
  hazardsSubtitle: string;
  emergencyLifeline: string;
  sosSubtitle: string;
  sosAlertTitle: string;
  sosAlertDesc: string;
  callSeocBtn: string;
  directHelplines: string;
  logisticsControl: string;
  healthServices: string;
  highwayHelpline: string;
}

export const translations: Record<SupportedLanguage, AppTranslations> = {
  en: {
    appName: 'PurvaSaarthi',
    create: 'Create',
    pass: 'Pass',
    today: 'Today',
    live: 'LIVE',
    exit: 'Exit',
    overview: 'Overview',

    tabLiveTrack: 'Live Track',
    tabMyOrders: 'My Orders',
    tabHazards: 'Hazards',
    tabSos: 'SOS Desk',

    tabNav: 'Navigation',
    tabReroute: 'AI Reroute',
    tabCheckpoints: 'Checkpoints',
    tabLaybys: 'Safe Shelters',

    eta: 'ETA',
    corridor: 'CORRIDOR',
    priority: 'PRIORITY',
    stockRemaining: 'Stock',
    detourActive: 'Detour Active',
    monitored: 'Monitored',
    callDriver: 'Call Driver',
    shareLinkCopied: 'Live tracking link copied!',
    cargoItems: 'Cargo Items',
    coldChain: 'Cold Chain',
    batch: 'Batch',
    trackingMilestones: 'Tracking Milestones',
    activeStep: 'Active Step',
    liveHighwayCorridor: 'Live Highway Corridor',
    shrink: 'Shrink',
    expand: 'Expand',

    newOrder: 'New Order',
    createRequisition: 'Create Emergency Supply Requisition',
    requisitionDesc: 'Direct dispatch to regional emergency logistics pipeline',
    itemCategory: 'Item Category / Priority Sector',
    selectItem: 'Select Pre-configured Requisition Item',
    destinationFacility: 'Delivery Facility / Hospital',
    priorityLevel: 'Priority Level (Disaster Resilience Engine)',
    consigneeName: 'Consignee Officer Name',
    consigneePhone: 'Consignee Contact Phone',
    submitOrder: 'Submit Requisition & Track Live',
    submitting: 'Dispatching...',
    cancel: 'Cancel',
    searchPlaceholder: 'Search by ID, Commodity, or Hospital...',
    yourRequisitions: 'Your Requisitions & Orders',
    manageConsignments: 'Track and manage destination consignments',

    inDistance: 'IN',
    speedLimit: 'SPEED LIMIT',
    hudRerouted: 'Follow NH-106 East Bypass towards Ri-Bhoi Corridor',
    hudOriginal: 'Turn Left onto NH-106 Bypass (Safe Landslide Detour)',
    destination: 'Destination',
    speed: 'SPEED',
    elevation: 'ELEVATION',
    gradient: 'GRADIENT',
    routeRisk: 'ROUTE RISK',
    meters: 'meters',
    slope: 'slope',
    riskLow: 'Low',
    riskCritical: 'Critical',
    activeTrip: 'Active Trip',
    online5G: 'ONLINE 5G',
    offlineQueue: 'OFFLINE QUEUE',
    syncNow: 'Sync Now',
    telemetryStored: 'telemetry action(s) stored locally',

    activeCargoManifest: 'Active Cargo Manifest',
    criticalLifeSaving: 'CRITICAL LIFE-SAVING',
    coldChainSecure: '3.4°C SECURE',
    handoverDeliveryBtn: 'Mark Arrived & Handover Delivery at Hospital',
    deliveryVerified: 'Delivery Handover Verified at Hospital',
    stockUpdatedMsg: 'District stock updated from 1.7 to 3.8 days. Alert resolved.',

    criticalRouteAlert: 'CRITICAL ROUTE ALERT',
    landslideDisruption: 'HIGH LANDSLIDE DISRUPTION (91%)',
    hazardAlertMsg: 'Heavy rainfall (87mm) + slope destabilization detected on NH-27 near Umtru Gorge. PurvaSaarthi recommends an immediate detour via NH-106 East Bypass.',
    currentRoadRisk: 'CURRENT NH-27',
    detourRoadBenefit: 'AI DETOUR (NH-106)',
    acceptDetourBtn: 'ACCEPT ROUTE B DETOUR',
    laterBtn: 'Later',
    reviewDetourBtn: 'Review AI Reroute Recommendation',

    checkpointsTitle: 'Trip Checkpoints & Geofences',
    checkpointsSub: 'Real-time driver transit progression log',
    laybysTitle: 'Safe Laybys & Emergency Shelters',
    laybysSub: 'Designated disaster-time freight staging locations on this route',
    distanceAhead: 'Distance',
    truckCapacity: 'Capacity',
    safeDetourSegment: 'AI Verified Safe Detour Segment',
    aiRerouteTitle: 'AI Dynamic Reroute Comparison',
    aiRerouteSub: 'Real-time pgRouting single point of failure calculation',
    acceptRouteB: 'Accept and Switch Navigation to Route B',
    routeAWarning: 'Active mudslide & flash flood risk at Umtru Gorge',
    routeBAdvantage: 'Avoids vulnerable bridge approach and low-lying gorge',

    corridorRoadHazards: 'Corridor Road Hazards',
    hazardsSubtitle: 'Real-time hill terrain resilience intelligence',
    emergencyLifeline: 'Emergency Logistics Lifeline',
    sosSubtitle: '24x7 North East Disaster Desk & Support',
    sosAlertTitle: 'Critical Stock-Out / Highway Isolation SOS',
    sosAlertDesc: 'If ICU stock is below 12 hours or arterial roads are severed, trigger SEOC fast-track helicopter / green-corridor requisition.',
    callSeocBtn: 'Call State Emergency Operations (1070)',
    directHelplines: 'Direct Helplines',
    logisticsControl: 'NER Logistics Control',
    healthServices: 'Health Services (DHS)',
    highwayHelpline: 'Highway Helpline',
  },

  hi: {
    appName: 'पूर्वसारथी',
    create: 'नया ऑर्डर',
    pass: 'ई-पास',
    today: 'आज',
    live: 'लाइव',
    exit: 'लॉगआउट',
    overview: 'मुख्य दृश्य',

    tabLiveTrack: 'लाइव ट्रैकिंग',
    tabMyOrders: 'मेरे ऑर्डर',
    tabHazards: 'सड़क खतरे',
    tabSos: 'आपातकालीन सहायता',

    tabNav: 'नेविगेशन',
    tabReroute: 'AI डायवर्जन',
    tabCheckpoints: 'चेकपॉइंट',
    tabLaybys: 'सुरक्षित आश्रय',

    eta: 'अनुमानित समय',
    corridor: 'कॉरिडोर',
    priority: 'प्राथमिकता',
    stockRemaining: 'स्टॉक',
    detourActive: 'डायवर्जन सक्रिय',
    monitored: 'निगरानी चालू',
    callDriver: 'ड्राइवर को कॉल करें',
    shareLinkCopied: 'लाइव ट्रैकिंग लिंक कॉपी हो गया!',
    cargoItems: 'कार्गो सामग्री',
    coldChain: 'कोल्ड चेन',
    batch: 'बैच',
    trackingMilestones: 'यात्रा के पड़ाव',
    activeStep: 'वर्तमान चरण',
    liveHighwayCorridor: 'लाइव हाईवे कॉरिडोर',
    shrink: 'छोटा करें',
    expand: 'बड़ा करें',

    newOrder: 'नया ऑर्डर',
    createRequisition: 'आपातकालीन आपूर्ति मांग पत्र बनाएं',
    requisitionDesc: 'क्षेत्रीय आपातकालीन लॉजिस्टिक्स पाइपलाइन को सीधा प्रेषण',
    itemCategory: 'सामग्री श्रेणी / प्राथमिकता क्षेत्र',
    selectItem: 'पूर्व-कॉन्फ़िगर की गई आवश्यक सामग्री चुनें',
    destinationFacility: 'डिलीवरी गंतव्य / अस्पताल',
    priorityLevel: 'प्राथमिकता स्तर (आपदा प्रबंधन इंजन)',
    consigneeName: 'प्राप्तकर्ता अधिकारी का नाम',
    consigneePhone: 'प्राप्तकर्ता संपर्क फोन',
    submitOrder: 'मांग पत्र भेजें और लाइव ट्रैक करें',
    submitting: 'भेज रहे हैं...',
    cancel: 'रद्द करें',
    searchPlaceholder: 'आईडी, सामग्री या अस्पताल से खोजें...',
    yourRequisitions: 'आपके मांग पत्र और ऑर्डर',
    manageConsignments: 'गंतव्य शिपमेंट को ट्रैक और प्रबंधित करें',

    inDistance: 'आगे',
    speedLimit: 'गति सीमा',
    hudRerouted: 'री-भोई कॉरिडोर की ओर NH-106 ईस्ट बाईपास पर चलें',
    hudOriginal: 'NH-106 बाईपास (सुरक्षित भूस्खलन डायवर्जन) पर बाएं मुड़ें',
    destination: 'गंतव्य',
    speed: 'गति',
    elevation: 'ऊंचाई',
    gradient: 'ढलान',
    routeRisk: 'मार्ग जोखिम',
    meters: 'मीटर',
    slope: 'ढलान',
    riskLow: 'कम जोखिम',
    riskCritical: 'गंभीर',
    activeTrip: 'सक्रिय यात्रा',
    online5G: 'ऑनलाइन 5G',
    offlineQueue: 'ऑफ़लाइन कतार',
    syncNow: 'अभी सिंक करें',
    telemetryStored: 'टेलीमेट्री डेटा डिवाइस में सुरक्षित है',

    activeCargoManifest: 'सक्रिय कार्गो विवरण',
    criticalLifeSaving: 'अति आवश्यक जीवन रक्षक',
    coldChainSecure: '3.4°C सुरक्षित',
    handoverDeliveryBtn: 'अस्पताल आगमन दर्ज करें और डिलीवरी सौंपें',
    deliveryVerified: 'अस्पताल में डिलीवरी सत्यापन पूरा हुआ',
    stockUpdatedMsg: 'जिला स्टॉक 1.7 से बढ़कर 3.8 दिन हो गया। अलर्ट हल हुआ।',

    criticalRouteAlert: 'अति-महत्वपूर्ण मार्ग चेतावनी',
    landslideDisruption: 'भारी भूस्खलन खतरा (91%)',
    hazardAlertMsg: 'उमतुरु गॉर्ज के पास NH-27 पर भारी बारिश (87 मिमी) और भूस्खलन का पता चला है। पूर्वसारथी तुरंत NH-106 ईस्ट बाईपास से जाने की सलाह देता है।',
    currentRoadRisk: 'वर्तमान NH-27',
    detourRoadBenefit: 'AI डायवर्जन (NH-106)',
    acceptDetourBtn: 'रूट B डायवर्जन स्वीकार करें',
    laterBtn: 'बाद में',
    reviewDetourBtn: 'AI डायवर्जन सुझाव देखें',

    checkpointsTitle: 'यात्रा चेकपॉइंट और जियोफेंस',
    checkpointsSub: 'रीयल-टाइम ड्राइवर ट्रांजिट प्रोग्रेशन लॉग',
    laybysTitle: 'सुरक्षित आश्रय और विश्राम स्थल',
    laybysSub: 'इस मार्ग पर आपदा समय के लिए निर्धारित ट्रक पार्किंग स्थल',
    distanceAhead: 'दूरी',
    truckCapacity: 'क्षमता',
    safeDetourSegment: 'AI सत्यापित सुरक्षित डायवर्जन खंड',
    aiRerouteTitle: 'AI गतिशील मार्ग तुलना',
    aiRerouteSub: 'रीयल-टाइम एकल बिंदु विफलता (SPOF) गणना',
    acceptRouteB: 'रूट B को स्वीकार करें और नेविगेशन शुरू करें',
    routeAWarning: 'उमतुरु गॉर्ज पर सक्रिय कीचड़ और बाढ़ का खतरा',
    routeBAdvantage: 'संवेदनशील पुल और नदी घाटी के जलभराव से बचाव',

    corridorRoadHazards: 'हाईवे सड़क खतरे व स्थितियां',
    hazardsSubtitle: 'रीयल-टाइम पहाड़ी इलाके की सुरक्षा जानकारी',
    emergencyLifeline: 'आपातकालीन लॉजिस्टिक्स लाइफलाइन',
    sosSubtitle: '24x7 पूर्वोत्तर आपदा नियंत्रण डेस्क',
    sosAlertTitle: 'क्रिटिकल स्टॉक-आउट / हाईवे अवरोध SOS',
    sosAlertDesc: 'यदि आईसीयू स्टॉक 12 घंटे से कम है या मुख्य सड़कें अवरुद्ध हैं, तो राज्य आपातकालीन डेस्क तुरंत हेलीकॉप्टर/ग्रीन-कॉरिडोर की व्यवस्था करेगा।',
    callSeocBtn: 'राज्य आपातकालीन संचालन केंद्र को कॉल करें (1070)',
    directHelplines: 'सीधी हेल्पलाइन सेवाएं',
    logisticsControl: 'पूर्वोत्तर लॉजिस्टिक्स नियंत्रण',
    healthServices: 'स्वास्थ्य सेवा निदेशालय (DHS)',
    highwayHelpline: 'राष्ट्रीय राजमार्ग हेल्पलाइन',
  },
};
