import React, { useState, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { executeRagQuery } from '../../lib/nerRagEngine';
import type { RagChatMessage } from '../../types';

export const FloatingRagAssistant: React.FC = () => {
  const {
    floatingCopilotOpen,
    toggleFloatingCopilot,
    closeFloatingCopilot,
    copilotMessages,
    addCopilotMessage,
    clearCopilotMessages,
    ragConfig,
    setView
  } = useAppStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  const quickPrompts = [
    'Why is NH-27 corridor currently at high risk?',
    'What is the live status of vehicle TRK-204?',
    'Which safe laybys are available between Guwahati and Shillong?',
    'Explain the Siliguri Corridor logistics bottleneck',
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
      console.error('RAG query error:', err);
      addCopilotMessage({
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred while querying the NER logistics knowledge base. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedInRag: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openFullCopilot = () => {
    closeFloatingCopilot();
    setView('copilot');
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!floatingCopilotOpen && (
        <button
          onClick={toggleFloatingCopilot}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white font-semibold text-xs shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 group"
          title="Open NER Logistics AI Copilot"
        >
          <div className="relative">
            <Sparkles size={17} className="animate-spin-slow text-amber-200" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>
          <span className="tracking-wide">AI Logistics Copilot</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            RAG
          </span>
        </button>
      )}

      {/* Floating Assistant Drawer / Modal */}
      {floatingCopilotOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-5rem)] bg-white dark:bg-[#0b1322] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-[#111c33] to-slate-900 border-b border-white/10 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-xs">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold leading-tight">NER Logistics AI Copilot</h3>
                  <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    Grounded RAG
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">Strict Knowledge Base & Telemetry</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearCopilotMessages}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Reset Chat History"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={openFullCopilot}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Open Dedicated Full Page"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={closeFloatingCopilot}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
            {copilotMessages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  ref={!isAssistant ? lastUserMessageRef : undefined}
                  className={clsx(
                    'flex gap-2.5 scroll-mt-3',
                    isAssistant ? 'items-start' : 'items-start flex-row-reverse'
                  )}
                >
                  <div
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      isAssistant
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-600 text-white'
                    )}
                  >
                    {isAssistant ? <Bot size={13} /> : <User size={13} />}
                  </div>

                  <div className={clsx('max-w-[85%] space-y-1.5')}>
                    <div
                      className={clsx(
                        'p-3 rounded-2xl leading-relaxed whitespace-pre-wrap',
                        isAssistant
                          ? msg.isOutOfDomain
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-500/20'
                            : 'bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-white/[0.05]'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xs rounded-tr-xs'
                      )}
                    >
                      {msg.text}
                    </div>

                    {/* Citations section if present */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <ShieldCheck size={11} className="text-emerald-500" />
                            {msg.citations.length} Grounded Source Chunks
                          </span>
                        </div>

                        <div className="space-y-1 mt-1">
                          {msg.citations.map((c) => (
                            <div
                              key={c.id}
                              className="rounded-lg border border-slate-200/70 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] p-2 text-[11px]"
                            >
                              <div
                                className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                                onClick={() =>
                                  setExpandedCitationId(
                                    expandedCitationId === c.id ? null : c.id
                                  )
                                }
                              >
                                <span className="truncate pr-2">{c.title}</span>
                                <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <span>{Math.round(c.similarityScore * 100)}% match</span>
                                  {expandedCitationId === c.id ? (
                                    <ChevronUp size={12} />
                                  ) : (
                                    <ChevronDown size={12} />
                                  )}
                                </div>
                              </div>

                              {expandedCitationId === c.id && (
                                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                                  <p className="italic">{c.snippet}</p>
                                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                                    <span>Section: {c.section}</span>
                                    <span>Source: {c.sourceDocument}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[9px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && <span>{msg.modelUsed}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-2 px-3 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                <Sparkles size={14} className="animate-spin text-orange-500" />
                <span>Retrieving & synthesizing grounded NER logistics facts...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.04] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isProcessing}
                className="shrink-0 text-[10px] font-medium bg-white dark:bg-white/[0.06] hover:bg-orange-50 dark:hover:bg-white/[0.1] hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-300 transition-colors cursor-pointer truncate max-w-[200px]"
                title={prompt}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-[#090f1c] border-t border-slate-200 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about NER roads, bridges, trucks, medicines..."
                disabled={isProcessing}
                className="flex-1 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isProcessing}
                className={clsx(
                  'p-2.5 rounded-xl transition-all duration-200 cursor-pointer text-white shadow-xs shrink-0',
                  inputQuery.trim() && !isProcessing
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 active:scale-95'
                    : 'bg-slate-300 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                )}
                title="Send Query"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-500" />
                Grounding Guardrails Active (Zero External Hallucination)
              </span>
              <button
                onClick={openFullCopilot}
                className="text-orange-500 hover:underline flex items-center gap-0.5"
              >
                <span>Full Page</span>
                <ExternalLink size={9} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
