import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  Search,
  BookOpen,
  Truck,
  Package,
  Copy,
  Check,
  Sliders,
  X,
  Key,
  Flame,
  Info,
  ShieldAlert,
  Building2
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store/useAppStore';
import { executeRagQuery } from '../lib/nerRagEngine';
import { nerKnowledgeBase } from '../data/nerLogisticsKnowledge';
import { safeLaybys } from '../data/mockData';
import type { RagChatMessage, RagCategory, RagSourceCitation } from '../types';

export default function RagCopilotPage() {
  const {
    copilotMessages,
    addCopilotMessage,
    clearCopilotMessages,
    ragConfig,
    setRagConfig
  } = useAppStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<RagSourceCitation | null>(null);
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState('');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<RagCategory | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge'>('chat');

  // Temporary local state for Settings Modal
  const [tempApiKey, setTempApiKey] = useState(ragConfig.apiKey || '');
  const [tempProvider, setTempProvider] = useState(ragConfig.provider);
  const [tempModel, setTempModel] = useState(ragConfig.modelName || 'gemini-1.5-flash');
  const [tempStrict, setTempStrict] = useState(ragConfig.strictGrounding);

  const suggestedPromptCategories = [
    {
      category: '🛣️ Corridors & Chokepoints',
      prompts: [
        'Why is NH-27 corridor currently at 91% disruption risk?',
        'Explain why the Siliguri Corridor is a strategic logistics bottleneck',
        'What is the recommended alternative bypass route for NH-27?',
        'How does Sela Tunnel impact winter logistics to Tawang?',
      ],
    },
    {
      category: '🚚 Live Fleet & Shipments',
      prompts: [
        'What is the live status and location of vehicle TRK-204?',
        'Why is shipment SHIP-104 marked as critical supply at risk?',
        'Why is vehicle TRK-219 showing Telemetry Unavailable?',
        'What safe laybys are available between Guwahati and Shillong?',
      ],
    },
    {
      category: '🌉 Bridges & Districts',
      prompts: [
        'What is the status of Bridge B-17 over Umtru River?',
        'How does Bogibeel Bridge improve upper Assam logistics?',
        'Explain the district isolation risk score for District X',
        'What role does MMLP Jogighopa play in NER freight transport?',
      ],
    },
    {
      category: '🌧️ SOPs & Commodity Resilience',
      prompts: [
        'What is the Standard Operating Procedure for monsoon landslides?',
        'What are the storage guidelines for Priority 1 critical medicines?',
        'Explain the 90-day monsoon food grain buffer stock mandate',
        'What are the safety protocols for petroleum and fuel tanker convoys?',
      ],
    },
  ];

  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isProcessing) return;

    const userMessageId = `user-${Date.now()}`;
    const userMessage: RagChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedInRag: true,
    };

    addCopilotMessage(userMessage);
    setInputQuery('');
    setIsProcessing(true);

    // Smoothly bring the user's question into view so they see the question and the start of the coming response
    setTimeout(() => {
      lastUserMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    try {
      const response = await executeRagQuery(textToSend, ragConfig);
      const assistantMessage: RagChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        groundedInRag: response.groundedInRag,
        isOutOfDomain: response.isOutOfDomain,
        modelUsed: response.modelUsed,
        processingTimeMs: response.processingTimeMs,
      };
      addCopilotMessage(assistantMessage);
    } catch (err) {
      console.error('RAG execution failed:', err);
      addCopilotMessage({
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: '❌ Error connecting to RAG knowledge synthesis engine. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedInRag: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveSettings = () => {
    setRagConfig({
      provider: tempProvider,
      apiKey: tempApiKey,
      modelName: tempModel,
      strictGrounding: tempStrict,
    });
    setSettingsOpen(false);
  };

  // Filtered knowledge chunks for explorer panel
  const filteredKnowledge = nerKnowledgeBase.filter((chunk) => {
    const matchesCategory =
      selectedKnowledgeCategory === 'ALL' || chunk.category === selectedKnowledgeCategory;
    const matchesSearch =
      !knowledgeSearchTerm ||
      chunk.title.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()) ||
      chunk.content.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()) ||
      chunk.keywords.some((k) => k.toLowerCase().includes(knowledgeSearchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-slate-100">
      {/* ── MAIN CHAT AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full border-r border-slate-200 dark:border-white/[0.06] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white dark:bg-[#090f1c] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  PurvaSaarthi AI Logistics Copilot
                </h1>
                <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1">
                  <ShieldCheck size={11} /> Grounded RAG
                </span>
                <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {ragConfig.provider === 'local-rag' ? 'Local Neural Synthesizer' : ragConfig.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Strict domain grounding over 8 NER States, Corridors, Bridges, Telemetry & Disaster SOPs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCopilotMessages}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.09] rounded-xl border border-slate-200/80 dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.09] rounded-xl border border-slate-200/80 dark:border-white/[0.08] transition-colors cursor-pointer"
              title="Configure RAG Engine & Model Keys"
            >
              <Sliders size={13} />
              <span>RAG Settings</span>
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome / Suggested Prompts Card if few messages */}
          {copilotMessages.length <= 1 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-pink-500/5 border border-orange-200/60 dark:border-orange-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Recommended NER Logistics Inquiries
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select any prompt to test grounded RAG retrieval
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPromptCategories.map((group, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] space-y-2"
                  >
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                      {group.category}
                    </span>
                    <div className="space-y-1.5">
                      {group.prompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          disabled={isProcessing}
                          className="w-full text-left text-xs text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-white/[0.04] p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <span className="line-clamp-1">{prompt}</span>
                          <Send size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 text-orange-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {copilotMessages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                ref={!isAssistant ? lastUserMessageRef : undefined}
                className={clsx(
                  'flex gap-4 group scroll-mt-6',
                  isAssistant ? 'items-start' : 'items-start flex-row-reverse'
                )}
              >
                {/* Avatar */}
                <div
                  className={clsx(
                    'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-1',
                    isAssistant
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                      : 'bg-blue-600 text-white'
                  )}
                >
                  {isAssistant ? <Bot size={17} /> : <User size={17} />}
                </div>

                {/* Content Bubble */}
                <div className={clsx('max-w-[85%] space-y-2')}>
                  <div
                    className={clsx(
                      'p-4 rounded-2xl leading-relaxed text-sm shadow-xs whitespace-pre-wrap',
                      isAssistant
                        ? msg.isOutOfDomain
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-white dark:bg-[#0e1626] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/[0.07]'
                        : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-tr-xs shadow-md shadow-orange-500/10'
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Grounded Citations Drawer / Cards */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck size={14} />
                          <span>Grounded Source Citations ({msg.citations.length} Chunks Verified)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Click any chunk to inspect source snippet
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {msg.citations.map((citation) => (
                          <div
                            key={citation.id}
                            onClick={() => setActiveCitation(activeCitation?.id === citation.id ? null : citation)}
                            className={clsx(
                              'p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200',
                              activeCitation?.id === citation.id
                                ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/40 shadow-xs'
                                : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-orange-200 dark:hover:border-white/20'
                            )}
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                              <span className="truncate pr-2 font-bold">{citation.title}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono shrink-0 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                {Math.round(citation.similarityScore * 100)}% match
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                              <span>{citation.section}</span>
                              <span className="truncate max-w-[140px]">{citation.sourceDocument}</span>
                            </div>

                            {activeCitation?.id === citation.id && (
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                                <p className="italic bg-slate-50 dark:bg-white/[0.03] p-2 rounded-lg border border-slate-100 dark:border-white/5">
                                  "{citation.snippet}"
                                </p>
                                <div className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                                  Relevance Trigger: {citation.relevanceReason}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Meta & Action Buttons */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px]">{msg.modelUsed}</span>
                        </>
                      )}
                      {msg.processingTimeMs !== undefined && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-emerald-500">
                            {msg.processingTimeMs}ms latency
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check size={13} className="text-emerald-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center animate-spin">
                <Sparkles size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1626] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Searching NER logistics vector index & synthesizing grounded facts...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-[#090f1c] border-t border-slate-200 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about NER highways, landslides, live fleet TRK-204, critical medicine supplies..."
                disabled={isProcessing}
                className="w-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all pr-10"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono hidden sm:inline">
                Press ↵
              </span>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isProcessing}
              className={clsx(
                'px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer',
                inputQuery.trim() && !isProcessing
                  ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:opacity-95 active:scale-95 shadow-orange-500/20'
                  : 'bg-slate-300 dark:bg-white/10 text-slate-400 cursor-not-allowed shadow-none'
              )}
            >
              <span>Query RAG</span>
              <Send size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={12} /> Strict Grounding Guardrails Enforced
              </span>
              <span>•</span>
              <span>All 8 NER States Indexed</span>
            </div>
            <span className="font-mono text-[10px]">PurvaSaarthi Knowledge Base v2.4</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR: LIVE TELEMETRY & KNOWLEDGE CORPUS EXPLORER ─────────── */}
      <div className="hidden lg:flex w-96 flex-col bg-white dark:bg-[#090f1c] border-l border-slate-200 dark:border-white/[0.06] overflow-hidden shrink-0">
        {/* Sidebar Nav Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/[0.06] shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={clsx(
              'flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'chat'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            )}
          >
            <Truck size={14} />
            <span>Live NER Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={clsx(
              'flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5',
              activeTab === 'knowledge'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            )}
          >
            <BookOpen size={14} />
            <span>Corpus Chunks ({nerKnowledgeBase.length})</span>
          </button>
        </div>

        {/* Tab Content 1: Live Telemetry Snapshot */}
        {activeTab === 'chat' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* High-Risk Road Segment Card */}
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                  <ShieldAlert size={14} />
                  <span>High-Risk Corridor (SPOF)</span>
                </div>
                <span className="bg-red-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                  91% Risk
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">
                NH-27 (Guwahati - Silchar)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Heavy rainfall forecast (87mm) & Bridge B-17 approach submersion. Reroute via NH-106 Shillong Bypass active.
              </p>
              <button
                onClick={() => handleSend('Tell me all details and reasons for NH-27 high risk')}
                className="text-[10px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ask Copilot about NH-27</span>
                <Send size={9} />
              </button>
            </div>

            {/* Critical Shipment Card */}
            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <Package size={14} />
                  <span>Critical Supply at Risk</span>
                </div>
                <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                  Priority 100
                </span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Shipment #SHIP-104 (Medicines)
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>Vehicle: <strong>TRK-204</strong> (Rahul Sharma)</div>
                <div>Destination: District X Central Civil Hospital</div>
                <div>Remaining Hospital Stock: <strong>1.7 Days</strong></div>
              </div>
              <button
                onClick={() => handleSend('What is the current route and status of shipment SHIP-104 and vehicle TRK-204?')}
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Track SHIP-104 with Copilot</span>
                <Send size={9} />
              </button>
            </div>

            {/* Safe Laybys Snapshot */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] space-y-2.5">
              <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-blue-500" />
                  <span>Safe Laybys (SToP Protocol)</span>
                </div>
                <span className="text-[10px] text-slate-400">Guwahati — Shillong</span>
              </div>

              <div className="space-y-1.5">
                {safeLaybys.map((layby) => (
                  <div
                    key={layby.id}
                    onClick={() => handleSend(`Tell me about ${layby.name} amenities and location`)}
                    className="p-2 rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] hover:border-orange-300 dark:hover:border-orange-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span className="truncate">{layby.name}</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">{layby.distanceKm} km</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Capacity: {layby.capacityTrucks} trucks • {layby.amenities.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Shadow Zone Alert */}
            <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Info size={12} />
                <span>Deep Valley Telemetry SOP</span>
              </div>
              <p>
                Vehicle TRK-219 is currently traversing a known shadow zone on NH-715. Dead-reckoning protocol active until signal restoration.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 2: Knowledge Corpus Browser */}
        {activeTab === 'knowledge' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={knowledgeSearchTerm}
                onChange={(e) => setKnowledgeSearchTerm(e.target.value)}
                placeholder="Search knowledge corpus..."
                className="w-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 pl-8"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {(['ALL', 'CORRIDOR', 'BRIDGE', 'DISTRICT', 'COMMODITY', 'DISASTER_SOP', 'SAFE_LAYBY'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedKnowledgeCategory(cat)}
                    className={clsx(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer',
                      selectedKnowledgeCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* List of Knowledge Chunks */}
            <div className="space-y-2">
              {filteredKnowledge.map((chunk) => (
                <div
                  key={chunk.id}
                  onClick={() => handleSend(`Explain the logistics significance of ${chunk.title}`)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] hover:border-orange-300 dark:hover:border-orange-500/40 hover:bg-orange-50/20 transition-all cursor-pointer space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate pr-2">
                      {chunk.title}
                    </span>
                    <span className="text-[9px] bg-slate-200 dark:bg-white/10 px-1.5 py-0.2 rounded font-mono shrink-0">
                      {chunk.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {chunk.content}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                    <span>{chunk.section}</span>
                    <span className="text-orange-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Ask AI Copilot →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SETTINGS MODAL ─────────────────────────────────────────────────── */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#0b1322] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  RAG Copilot Configuration
                </h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Model & Synthesizer Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempProvider('local-rag')}
                    className={clsx(
                      'p-2.5 rounded-xl border text-left cursor-pointer transition-colors',
                      tempProvider === 'local-rag'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    <div>Local Grounded RAG</div>
                    <div className="text-[10px] opacity-75 font-normal">Zero setup • Instant</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempProvider('gemini')}
                    className={clsx(
                      'p-2.5 rounded-xl border text-left cursor-pointer transition-colors',
                      tempProvider === 'gemini'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                    )}
                  >
                    <div>Google Gemini RAG</div>
                    <div className="text-[10px] opacity-75 font-normal">API Key Required</div>
                  </button>
                </div>
              </div>

              {/* API Key Input (if Gemini is selected) */}
              {tempProvider === 'gemini' && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Key size={13} className="text-orange-500" />
                    <span>Gemini API Key</span>
                  </label>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (AIza...)"
                    className="w-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">
                    Your key is stored locally in memory/session. It will only be used to process grounded RAG prompts.
                  </p>
                </div>
              )}

              {/* Guardrails Mode */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Strict Domain Guardrail
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Reject non-NER questions (zero external hallucination)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempStrict}
                  onChange={(e) => setTempStrict(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
