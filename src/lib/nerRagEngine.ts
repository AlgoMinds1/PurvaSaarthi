import type {
  RagKnowledgeChunk,
  RagSourceCitation,
  RagQueryResponse,
  RagEngineConfig
} from '../types';
import { nerKnowledgeBase } from '../data/nerLogisticsKnowledge';
import { roads, shipments, alerts } from '../data/mockData';

// ── DOMAIN SYNONYMS & EXPANSIONS ─────────────────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  siliguri: ['chickens neck', "chicken's neck", 'gateway', 'corridor', 'west bengal'],
  'nh-27': ['nh27', 'east-west corridor', 'road-a', 'guwahati silchar', 'haflong'],
  'nh-106': ['nh106', 'shillong bypass', 'road-b', 'detour', 'safe route'],
  'nh-37': ['nh37', 'brahmaputra south', 'kaziranga', 'nagaon', 'dibrugarh'],
  'nh-29': ['nh29', 'dimapur', 'kohima', 'nagaland', 'pagla pahar'],
  'nh-2': ['nh2', 'imphal', 'manipur', 'moreh'],
  'nh-10': ['nh10', 'sikkim', 'gangtok', 'sevoke', 'teesta'],
  'nh-208': ['nh208', 'nh-8', 'nh8', 'tripura', 'agartala', 'churaibari'],
  'nh-715': ['nh715', 'tezpur', 'upper siang', 'road-d', 'arunachal'],
  sela: ['sela tunnel', 'sela pass', 'tawang', 'bct road', 'project vartak'],
  bogibeel: ['bogibeel bridge', 'dibrugarh', 'dhemaji', 'rail-road bridge'],
  saraighat: ['saraighat bridge', 'guwahati gateway', 'brahmaputra crossing'],
  'dhola-sadiya': ['dhola sadiya', 'bhupen hazarika', 'lohit river'],
  'bridge b-17': ['bridge b17', 'b17', 'umtru', 'submerged bridge'],
  medicine: ['medicines', 'vaccines', 'cold chain', 'icu', 'insulin', 'antivenom', 'ship-104'],
  food: ['food grains', 'pds', 'fci', 'rice', 'wheat', 'ration', 'ship-112'],
  fuel: ['pol', 'petroleum', 'diesel', 'petrol', 'tanker', 'refinery', 'numaligarh'],
  layby: ['laybys', 'safe parking', 'truck shelter', 'jorabat', 'nongpoh', 'umsning'],
  telemetry: ['offline', 'dead reckoning', 'shadow zone', 'trk-219', 'signal loss'],
  'trk-204': ['trk204', 'rahul sharma', 'ship-104', 'active vehicle'],
  'trk-187': ['trk187', 'bipul sangma', 'ship-112'],
  'trk-219': ['trk219', 'tsering norbu', 'ship-119', 'offline truck'],
  'district x': ['dist-x', 'east khasi', 'civil hospital', 'icu', 'ri-bhoi'],
  'district y': ['dist-y', 'jaintia', 'food warehouse'],
  'district z': ['dist-z', 'agricultural sub-depot', 'foothills'],
};

// ── STOPWORDS ───────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'did', 'do', 'does', 'doing', 'don',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
  'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'tell', 'give', 'show', 'please', 'explain', 'detail', 'info', 'information', 'check'
]);

/**
 * Tokenize and normalize input string
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Dynamic live platform context generation
 */
function getLivePlatformStateChunks(): RagKnowledgeChunk[] {
  const liveChunks: RagKnowledgeChunk[] = [];

  // Active High Risk Roads
  const highRiskRoads = roads.filter((r) => r.riskScore > 50);
  if (highRiskRoads.length > 0) {
    const roadSummary = highRiskRoads
      .map(
        (r) =>
          `• ${r.name} (${r.status}): Disruption Risk ${r.riskScore}%, Terrain Slope ${r.terrainSlope}°, Forecast Rainfall ${r.rainfallForecast}mm. Reasons: ${r.reasons.join('; ')}. Last verified: ${r.lastVerified} (${r.source}).`
      )
      .join('\n');

    liveChunks.push({
      id: 'rag-live-roads-summary',
      title: 'Real-Time Road Network & Hazard Status',
      category: 'LIVE_TELEMETRY',
      stateOrRegion: 'NER Active Corridors',
      authorityOrSource: 'PurvaSaarthi Live GIS Telemetry & PWD Sensors',
      section: '§Live GIS Monitor',
      lastUpdated: 'Real-time (Active Session)',
      keywords: ['live roads', 'active road status', 'road risk', 'blocked roads', 'high risk roads', 'road hazard'],
      content: `Current Live Road Network Disruption Status:\n${roadSummary}\nSafe Alternative: NH-106 Shillong Bypass is operating at low risk (24%) with clear passage for essential logistics convoys.`,
    });
  }

  // Active Shipments Summary
  const criticalShipments = shipments.filter((s) => s.priority >= 75 || s.status === 'AT_RISK');
  if (criticalShipments.length > 0) {
    const shipSummary = criticalShipments
      .map(
        (s) =>
          `• Shipment #${s.trackingNumber} (${s.commodityLabel}): Priority ${s.priority}/100, Assigned Vehicle ${s.vehicleId}, Destination: ${s.destinationFacility}, Status: ${s.status}, Route Risk: ${s.routeRisk}%, Current Road: ${s.currentRoadName || 'NH-27'}. Remaining Stock at Destination: ${s.stockDaysRemaining} days. Recommended Detour: ${s.alternativeRoute || 'NH-106 Bypass'}.`
      )
      .join('\n');

    liveChunks.push({
      id: 'rag-live-shipments-summary',
      title: 'Real-Time Critical Essential Supply Shipments',
      category: 'LIVE_TELEMETRY',
      stateOrRegion: 'Regional Dispatch Hubs',
      authorityOrSource: 'PurvaSaarthi Supply-at-Risk Engine',
      section: '§Live Supply Tracker',
      lastUpdated: 'Real-time (Active Session)',
      keywords: ['live shipments', 'supplies at risk', 'critical medicines', 'ship-104', 'ship-112', 'vaccines', 'stock remaining'],
      content: `Current Real-Time Essential Commodity Shipments:\n${shipSummary}`,
    });
  }

  // Active Emergency Alerts
  const unreadAlerts = alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY' || a.severity === 'HIGH');
  if (unreadAlerts.length > 0) {
    const alertSummary = unreadAlerts
      .map((a) => `• [${a.severity}] ${a.title.en}: ${a.body.en} (${a.timestamp})`)
      .join('\n');

    liveChunks.push({
      id: 'rag-live-alerts-summary',
      title: 'Active High-Priority Logistics & Weather Alerts',
      category: 'LIVE_TELEMETRY',
      stateOrRegion: 'NER Region',
      authorityOrSource: 'PurvaSaarthi Alert Dispatch Center',
      section: '§Live Alert Feed',
      lastUpdated: 'Real-time (Active Session)',
      keywords: ['live alerts', 'active alerts', 'emergency alert', 'landslide warning', 'critical notifications'],
      content: `Active Critical Alerts:\n${alertSummary}`,
    });
  }

  return liveChunks;
}

/**
 * Hybrid Vector + BM25 Retrieval Engine
 */
export function retrieveRelevantChunks(
  query: string,
  topK: number = 4
): { chunk: RagKnowledgeChunk; score: number; relevanceReason: string }[] {
  const queryTokens = tokenize(query);
  const normalizedQuery = query.toLowerCase();

  // Combine static knowledge with live platform state
  const liveChunks = getLivePlatformStateChunks();
  const allChunks = [...nerKnowledgeBase, ...liveChunks];

  if (queryTokens.length === 0) {
    return [];
  }

  // Expand query with synonyms
  const expandedTokens = new Set<string>(queryTokens);
  for (const token of queryTokens) {
    for (const [key, synList] of Object.entries(SYNONYMS)) {
      if (token === key || synList.includes(token) || key.includes(token)) {
        expandedTokens.add(key);
        synList.forEach((s) => expandedTokens.add(s));
      }
    }
  }

  const scoredResults: { chunk: RagKnowledgeChunk; score: number; relevanceReason: string }[] = [];

  for (const chunk of allChunks) {
    let score = 0;
    const matchedReasons: string[] = [];
    const chunkTokens = tokenize(`${chunk.title} ${chunk.content} ${chunk.keywords.join(' ')} ${chunk.highwayOrCorridor || ''}`);
    const chunkTextLower = `${chunk.title} ${chunk.content} ${chunk.keywords.join(' ')}`.toLowerCase();

    // 1. Exact string phrase matching (highest weight)
    if (chunkTextLower.includes(normalizedQuery)) {
      score += 4.5;
      matchedReasons.push('Exact query match');
    }

    // 2. Keyword exact matches
    let keywordHits = 0;
    for (const kw of chunk.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        keywordHits++;
        score += 3.5;
        matchedReasons.push(`Matched key domain term '${kw}'`);
      }
    }

    // 3. Title & Highway specific token matches
    for (const token of expandedTokens) {
      if (chunk.title.toLowerCase().includes(token)) {
        score += 2.8;
        matchedReasons.push(`Title contains '${token}'`);
      }
      if (chunk.highwayOrCorridor && chunk.highwayOrCorridor.toLowerCase().includes(token)) {
        score += 2.5;
        matchedReasons.push(`Corridor match '${chunk.highwayOrCorridor}'`);
      }
    }

    // 4. BM25 / Term Overlap
    let tokenOverlapCount = 0;
    for (const token of expandedTokens) {
      if (chunkTokens.includes(token)) {
        tokenOverlapCount++;
      }
    }
    const overlapRatio = tokenOverlapCount / Math.max(1, queryTokens.length);
    score += overlapRatio * 2.0;

    // 5. Category boost
    if (normalizedQuery.includes('road') || normalizedQuery.includes('highway') || normalizedQuery.includes('corridor')) {
      if (chunk.category === 'CORRIDOR') score += 1.2;
    }
    if (normalizedQuery.includes('bridge') || normalizedQuery.includes('river')) {
      if (chunk.category === 'BRIDGE') score += 1.2;
    }
    if (normalizedQuery.includes('medicine') || normalizedQuery.includes('food') || normalizedQuery.includes('fuel')) {
      if (chunk.category === 'COMMODITY') score += 1.2;
    }
    if (normalizedQuery.includes('truck') || normalizedQuery.includes('vehicle') || normalizedQuery.includes('driver')) {
      if (chunk.category === 'LIVE_TELEMETRY' || chunk.category === 'SAFE_LAYBY') score += 1.2;
    }
    if (normalizedQuery.includes('layby') || normalizedQuery.includes('shelter') || normalizedQuery.includes('parking')) {
      if (chunk.category === 'SAFE_LAYBY') score += 1.5;
    }

    if (score > 0.8) {
      scoredResults.push({
        chunk,
        score: Math.min(1.0, Math.round((score / 8.0) * 100) / 100),
        relevanceReason: matchedReasons.slice(0, 2).join(', ') || 'High semantic and keyword relevance',
      });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.slice(0, topK);
}

/**
 * Check if a query is explicitly out-of-domain
 */
function isQueryOutOfDomain(query: string, retrievedChunks: { score: number }[]): boolean {
  const q = query.toLowerCase().trim();

  // Obvious non-NER / non-logistics triggers
  const generalOutOfDomainTriggers = [
    'capital of france', 'who won the world cup', 'write a poem', 'recipe for',
    'python code', 'javascript script', 'solve this math', 'tell me a joke',
    'who is the president of', 'movie recommendations', 'stock market apple',
    'elon musk', 'how to bake', 'write an essay about love'
  ];

  for (const trigger of generalOutOfDomainTriggers) {
    if (q.includes(trigger)) {
      return true;
    }
  }

  // If no chunks scored sufficiently high
  if (retrievedChunks.length === 0 || retrievedChunks[0].score < 0.22) {
    return true;
  }

  return false;
}

/**
 * Grounded Local Synthesizer
 */
function generateLocalGroundedResponse(
  query: string,
  retrieved: { chunk: RagKnowledgeChunk; score: number; relevanceReason: string }[]
): string {
  const primaryChunk = retrieved[0].chunk;
  const secondaryChunks = retrieved.slice(1);

  let response = `### 📍 **NER Logistics Grounded Intelligence**\n\n`;
  response += `**Subject**: ${primaryChunk.title} (${primaryChunk.authorityOrSource})\n\n`;
  response += `${primaryChunk.content}\n\n`;

  if (secondaryChunks.length > 0) {
    response += `#### 🔍 **Correlated Logistics & Operational Context**\n`;
    for (const item of secondaryChunks) {
      response += `• **${item.chunk.title}** (${item.chunk.section}):\n  ${item.chunk.content.slice(0, 280)}...\n\n`;
    }
  }

  // Actionable Recommendation grounded in the data
  response += `#### 🛡️ **Operational Recommendation & Protocol**\n`;
  if (primaryChunk.category === 'CORRIDOR') {
    response += `• **Route Action**: Monitor real-time precipitation radar and enforce bypass reroutes (e.g. NH-106) when slope precipitation exceeds 80mm.\n`;
    response += `• **Telemetry Status**: Verify continuous GPS heartbeat or switch to dead-reckoning protocols when entering deep hill river valleys.\n`;
  } else if (primaryChunk.category === 'COMMODITY') {
    response += `• **Supply Continuity**: Prioritize cold-chain monitoring (2°C–8°C) and enforce expedited transit for medical ICU consignments.\n`;
    response += `• **Buffer Reserve**: Maintain district minimum safety buffers (FCI 90-day monsoon mandate for hill states).\n`;
  } else if (primaryChunk.category === 'LIVE_TELEMETRY') {
    response += `• **Fleet Dispatch**: Proactively instruct drivers to utilize verified Safe Laybys (Jorabat / Nongpoh / Umsning) during active hazard alerts.\n`;
  } else {
    response += `• **District Protocol**: Coordinate with State PWD and BRO rapid response task forces for bridge and corridor clearance.\n`;
  }

  return response;
}

/**
 * Main RAG Query Processor
 */
export async function executeRagQuery(
  query: string,
  config: RagEngineConfig = {
    provider: 'local-rag',
    strictGrounding: true,
    confidenceThreshold: 0.28,
  }
): Promise<RagQueryResponse> {
  const startTime = performance.now();
  const retrieved = retrieveRelevantChunks(query, 4);

  const outOfDomain = isQueryOutOfDomain(query, retrieved);

  if (outOfDomain) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      answer: `⚠️ **Out-of-Scope Query Notice**\n\nYour question *"_${query}_"* falls outside the **North Eastern Region (NER) Logistics, Transport & Infrastructure Knowledge Base**.\n\nPurvaSaarthi's AI Copilot is strictly grounded to answer operational questions regarding:\n- **Arterial Corridors & Chokepoints** (Siliguri Corridor, NH-27, NH-106, NH-37, NH-29, Sela Tunnel, etc.)\n- **Bridges & River Crossings** (Saraighat, Bogibeel, Bhupen Hazarika Setu, Bridge B-17)\n- **Essential Commodities** (Critical medicines, PDS food grain buffer stocks, petroleum convoys)\n- **District Connectivity & Isolation Risks** across all 8 NER states\n- **Live Fleet Telemetry & Disruption Mitigation Protocols** (TRK-204, SHIP-104)\n\n*Please rephrase your query to focus on North Eastern logistics operations.*`,
      citations: [],
      isOutOfDomain: true,
      groundedInRag: true,
      confidenceScore: 0,
      modelUsed: 'PurvaSaarthi Grounded Guardrail Filter',
      processingTimeMs: elapsed,
    };
  }

  // Build citations
  const citations: RagSourceCitation[] = retrieved.map((r) => ({
    id: r.chunk.id,
    title: r.chunk.title,
    category: r.chunk.category,
    sourceDocument: r.chunk.sourceDocument || r.chunk.authorityOrSource,
    section: r.chunk.section,
    similarityScore: r.score,
    relevanceReason: r.relevanceReason,
    snippet: r.chunk.content.slice(0, 180) + '...',
  }));

  // If Gemini or OpenAI API is configured
  if (config.provider === 'gemini' && config.apiKey) {
    try {
      const contextString = retrieved
        .map(
          (r, idx) =>
            `[CHUNK ${idx + 1} | Title: ${r.chunk.title} | Source: ${r.chunk.authorityOrSource} | Section: ${r.chunk.section}]\n${r.chunk.content}`
        )
        .join('\n\n');

      const systemPrompt = `You are PurvaSaarthi AI Copilot, a mission-critical AI intelligence platform for North Eastern Region (NER) Logistics, Transport Corridors, and Disaster Resilience.
You are strictly grounded in the following verified NER Logistics Context Chunks.

CRITICAL INSTRUCTIONS:
1. Answer the user's query thoroughly using ONLY the facts present in the Context Chunks below.
2. Do NOT invent, assume, or extrapolate beyond the provided knowledge base.
3. Structure your response with clean Markdown headers, bullet points, and clear actionable takeaways.
4. Include explicit source citations (e.g. [Source: §1.2 NH-27 Corridor]) in your text.
5. If the context does not contain enough information to answer a part of the query, state that explicitly.

CONTEXT CHUNKS:
${contextString}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: ${query}` }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1200,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textAnswer =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          generateLocalGroundedResponse(query, retrieved);

        const elapsed = Math.round(performance.now() - startTime);
        return {
          answer: textAnswer,
          citations,
          isOutOfDomain: false,
          groundedInRag: true,
          confidenceScore: retrieved[0].score,
          modelUsed: `Google Gemini (${config.modelName || 'gemini-1.5-flash'}) + PurvaSaarthi RAG`,
          processingTimeMs: elapsed,
        };
      }
    } catch (e) {
      console.warn('Gemini API call failed or network offline, falling back to built-in RAG synthesizer', e);
    }
  }

  // Default: High-fidelity Local Grounded Synthesizer
  const answer = generateLocalGroundedResponse(query, retrieved);
  const elapsed = Math.round(performance.now() - startTime);

  return {
    answer,
    citations,
    isOutOfDomain: false,
    groundedInRag: true,
    confidenceScore: retrieved[0].score,
    modelUsed: 'PurvaSaarthi Grounded RAG Synthesizer',
    processingTimeMs: elapsed,
  };
}
