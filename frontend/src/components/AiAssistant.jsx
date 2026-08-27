import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, ShieldQuestion, X } from 'lucide-react';
import { askAssistant } from '../services/api';

const prompts = [
  'What should I fix first?',
  'Explain the current risk score',
  'How should I validate this patch?'
];

export default function AiAssistant({ scan, selectedModel }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I can help triage findings, explain risks, and plan remediation.' }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const response = await askAssistant({
        question,
        selectedModel,
        scan: scan ? {
          scanId: scan.scanId,
          repository: scan.repository,
          securityScore: scan.securityScore,
          severityCounts: scan.severityCounts,
          findings: scan.findings
        } : null
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.data?.message || 'Assistant is unavailable right now. Please try again when the backend connection is active.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-lg border border-white/10 bg-[#101622] shadow-2xl overflow-hidden">
          <div className="scan-rail h-1.5" />
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-teal-400/10 border border-teal-300/20 flex items-center justify-center text-teal-300">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">AI Assistant</h2>
                <p className="text-[10px] text-slate-500 font-mono">{selectedModel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-100 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="h-72 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg px-3 py-2 text-xs leading-relaxed border ${
                  message.role === 'user'
                    ? 'ml-8 bg-sky-400/10 border-sky-300/20 text-sky-100'
                    : 'mr-8 bg-white/5 border-white/10 text-slate-200'
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="mr-8 rounded-lg px-3 py-2 text-xs border border-white/10 bg-white/5 text-slate-400 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking through the scan...
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:border-teal-300/40"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about this audit..."
                className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-slate-100 outline-none focus:border-teal-300/70"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send assistant message"
                className="h-10 w-10 rounded-lg sentinel-button flex items-center justify-center disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="h-12 w-12 rounded-lg sentinel-button flex items-center justify-center shadow-xl hover:brightness-110"
        aria-label="Open AI assistant"
      >
        <ShieldQuestion className="h-5 w-5" />
      </button>
    </div>
  );
}
