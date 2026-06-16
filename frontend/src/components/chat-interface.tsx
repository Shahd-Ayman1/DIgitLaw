"use client";

import { useRef, useState } from "react";
import { Send, AlertTriangle, Scale, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CitationCard } from "@/components/citation-card";
import { Badge } from "@/components/ui/badge";
import { streamChatMessage } from "@/lib/api";
import { useChatHistory } from "@/lib/use-chat-history";
import { DOMAIN_LABELS_AR } from "@/lib/domain-labels";
import type { Citation, LegalDomain } from "@/types/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  domain?: LegalDomain;
  isFallback?: boolean;
  isStreaming?: boolean;
}

const SUGGESTIONS = [
  "هل يجوز فصل العامل بدون سبب؟",
  "لو طردوني من الشقة أعمل إيه؟",
  "إمتى تسقط الحضانة؟",
  "هل يحق للمؤجر فسخ العقد؟",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const { addEntry } = useChatHistory();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setInput("");
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: question };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "", isStreaming: true }]);
    setLoading(true);
    scrollToBottom();

    let fullAnswer = "";

    await streamChatMessage(
      question,
      conversationId,
      (token) => {
        fullAnswer += token;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullAnswer } : m))
        );
        scrollToBottom();
      },
      (data) => {
        setConversationId(data.conversation_id);
        const finalAnswer = data.final_answer ?? fullAnswer;
        const citations: Citation[] = data.citations ?? [];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: finalAnswer, citations, isFallback: data.is_fallback, isStreaming: false }
              : m
          )
        );
        addEntry({
          id: assistantId,
          question,
          answer: finalAnswer,
          domain: "unknown",
          citations,
          is_fallback: !!data.is_fallback,
          timestamp: Date.now(),
        });
        setLoading(false);
        scrollToBottom();
      },
      (errorMsg) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorMsg, isFallback: true, isStreaming: false } : m
          )
        );
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-extrabold">المساعد القانوني</h1>
        <p className="text-sm text-muted-foreground">اسأل عن أي موضوع قانوني واحصل على إجابة موثقة بالقانون المصري</p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-6 py-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold mb-2">اسأل سؤالك القانوني</h2>
            <p className="text-sm text-muted-foreground mb-6">
              يعتمد ديجيتلو على نصوص القوانين المصرية الرسمية للإجابة على أسئلتك مع ذكر المصادر.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-right rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  m.isFallback && m.role === "assistant" && "border border-amber-400/60"
                )}
              >
                {m.isFallback && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    إجابة احتياطية
                  </div>
                )}
                {m.content || (m.isStreaming && <Loader2 className="h-4 w-4 animate-spin" />)}
                {m.isStreaming && m.content && <span className="inline-block w-1.5 h-4 bg-current animate-pulse mr-1 align-middle" />}

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground">المصادر القانونية:</p>
                    {m.citations.map((c, i) => (
                      <CitationCard key={c.chunk_id + i} citation={c} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="اكتب سؤالك القانوني هنا..."
            className="flex-1"
            rows={1}
          />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} size="icon">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          الإجابات لا تُعد استشارة قانونية رسمية. للحالات الفردية يُرجى التواصل مع محامٍ مرخص.
        </p>
      </div>
    </div>
  );
}
