import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Loader2, User, ShieldAlert, ChevronDown, ChevronUp, BookOpen, FileText, Hash, Paperclip, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import bayyinahLogo from "@/assets/bayyinah-logo.png.asset.json";

const LogoMark = ({ className }: { className?: string }) => (
  <img src={bayyinahLogo.url} alt="بيّنة" className={className} />
);

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTED_QUESTIONS = [
  "حقوق المستأجر في القانون المصري",
  "الطلاق في القانون المصري",
  "عقود العمل والتأمينات الاجتماعية",
  "الشراء بدون عقد",
  "إجراءات التقاضي في مصر",
];

const ACCEPTED_TYPES = ".pdf,.txt,.doc,.docx,image/*,application/pdf,text/plain";

async function fileToContext(file: File): Promise<string> {
  const isText = file.type.startsWith("text/") || /\.(txt|md|csv)$/i.test(file.name);
  if (isText) {
    const text = await file.text();
    const truncated = text.slice(0, 15000);
    return `\n\n[محتوى العقد المرفق — ${file.name}]\n${truncated}${text.length > 15000 ? "\n...[تم اقتطاع النص لطوله]" : ""}`;
  }
  // Non-text (PDF/image/docx): we can't parse client-side, attach filename + note
  const sizeKb = Math.round(file.size / 1024);
  return `\n\n[تم إرفاق عقد بصيغة ${file.type || "ملف"} — اسم الملف: ${file.name} — الحجم: ${sizeKb} كيلوبايت]\nالرجاء طلب من المستخدم نسخ نص العقد المهم إذا تعذرت قراءة الملف.`;
}

interface ParsedMessage {
  simpleAnswer: string;
  legalExplanation: string;
  citations: Citation[];
}

interface Citation {
  lawName: string;
  articleNumber: string;
  text: string;
}

function getMessageText(msg: UIMessage): string {
  return msg.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function parseLegalMessage(content: string): ParsedMessage {
  const simpleMatch = content.match(/##\s*الإجابة\s*المبسطة\s*\n?([\s\S]*?)(?=##|$)/);
  const explanationMatch = content.match(/##\s*الشرح\s*القانوني\s*\n?([\s\S]*?)(?=##|المصادر|📜|📌|$)/);
  const sourcesMatch = content.match(/##\s*المصادر\s*القانونية\s*\n?([\s\S]*?)$/);

  const simpleAnswer = simpleMatch?.[1]?.trim() || content.split("##")[0]?.trim() || "";
  const legalExplanation = explanationMatch?.[1]?.trim() || "";

  const citations: Citation[] = [];
  const sourcesText = sourcesMatch?.[1] || content;

  const citationRegex = /📜\s*القانون[:\s]*([^\n]*)\n?\s*📌\s*المادة[:\s]*([^\n]*)\n?\s*🧾\s*النص[:\s]*([^\n]*)/g;
  let match;
  while ((match = citationRegex.exec(sourcesText)) !== null) {
    citations.push({
      lawName: match[1].trim(),
      articleNumber: match[2].trim(),
      text: match[3].trim(),
    });
  }

  if (citations.length === 0) {
    const altRegex = /قانون[:\s]*([^\n،,]*)[\n،,]?\s*المادة[:\s]*([^\n،,]*)[\n،,]?\s*([^\n]*)/g;
    while ((match = altRegex.exec(sourcesText)) !== null) {
      citations.push({
        lawName: match[1].trim(),
        articleNumber: match[2].trim(),
        text: match[3].trim(),
      });
    }
  }

  return { simpleAnswer, legalExplanation, citations };
}


export default function LegalChat() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;
      const trimmed = input.trim();
      if (!trimmed && !attachedFile) return;

      let finalText = trimmed || "ممكن تراجع العقد ده وتوضحلي بنوده الأساسية والمخاطر؟";
      if (attachedFile) {
        const ctx = await fileToContext(attachedFile);
        finalText = `${finalText}${ctx}`;
      }
      sendMessage({ text: finalText });
      setInput("");
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [input, isLoading, sendMessage, attachedFile]
  );

  const handleFilePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("الملف كبير جداً. الحد الأقصى 10 ميجابايت.");
      return;
    }
    setAttachedFile(file);
  }, []);


  const toggleExplanation = useCallback((id: string) => {
    setExpandedExplanations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCitation = useCallback((id: string) => {
    setExpandedCitations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Subheader */}
      <div className="border-b border-border bg-card/50 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background p-1 ring-1 ring-border">
              <LogoMark className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-foreground">استشارة بيّنة</p>
              <p className="text-[11px] text-muted-foreground">إجابات مدعومة بالنصوص القانونية المصرية</p>
            </div>
          </div>
        </div>
      </div>


      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Empty State */}
          {messages.length === 0 && !isLoading && (
            <div className="animate-slide-up space-y-8 pt-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-background p-3 shadow-elegant ring-1 ring-border">
                <LogoMark className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  أهلاً بيك في بيّنة
                </h2>

                <p className="mt-2 text-muted-foreground">
                  اطرح أي سؤال قانوني وسأساعدك في فهم حقوقك وواجباتك.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      sendMessage({ text: q });
                    }}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            const parsed = !isUser ? parseLegalMessage(msg.parts.map(p => p.type === "text" ? p.text : "").join("")) : null;

            return (
              <div
                key={msg.id}
                className={`animate-fade-in flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-1 ${
                    isUser
                      ? "bg-user-bubble text-user-bubble-foreground"
                      : "bg-background ring-1 ring-border"
                  }`}

                >
                  {isUser ? <User className="h-4 w-4" /> : <LogoMark className="h-5 w-5 object-contain" />}
                </div>

                {/* Message Content */}
                <div className={`max-w-[85%] space-y-3 ${isUser ? "items-end" : "items-start"}`}>
                  {isUser ? (
                    <div className="rounded-2xl rounded-tr-sm bg-user-bubble px-4 py-3 text-user-bubble-foreground">
                      <p className="text-sm leading-relaxed">{getMessageText(msg)}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* AI Label */}
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          استشارة قانونية مدعومة بالنصوص
                        </span>
                      </div>

                      {/* Simple Answer */}
                      {parsed?.simpleAnswer && (
                        <div className="rounded-2xl rounded-tl-sm border border-border bg-card p-4 shadow-sm">
                          <div className="prose prose-sm max-w-none text-foreground">
                            <ReactMarkdown>{parsed.simpleAnswer}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Legal Explanation (Expandable) */}
                      {parsed?.legalExplanation && (
                        <div className="rounded-xl border border-border bg-muted/50 overflow-hidden">
                          <button
                            onClick={() => toggleExplanation(msg.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-muted transition-colors"
                          >
                            <span className="text-sm font-medium text-foreground">الشرح القانوني التفصيلي</span>
                            {expandedExplanations.has(msg.id) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          {expandedExplanations.has(msg.id) && (
                            <div className="border-t border-border px-4 py-3 animate-fade-in">
                              <div className="prose prose-sm max-w-none text-foreground">
                                <ReactMarkdown>{parsed.legalExplanation}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Citations */}
                      {parsed && parsed.citations.length > 0 && (
                        <div className="space-y-2">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <BookOpen className="h-3.5 w-3.5" />
                            المصادر القانونية
                          </p>
                          {parsed.citations.map((citation, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-citation-border bg-citation p-3 transition-all hover:shadow-sm"
                            >
                              <button
                                onClick={() => toggleCitation(`${msg.id}-${idx}`)}
                                className="flex w-full items-center justify-between text-right"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-citation-foreground" />
                                  <span className="text-sm font-medium text-citation-foreground">
                                    {citation.lawName}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-md bg-citation-foreground/10 px-1.5 py-0.5 text-xs text-citation-foreground">
                                    <Hash className="h-3 w-3" />
                                    المادة {citation.articleNumber}
                                  </span>
                                </div>
                                {expandedCitations.has(`${msg.id}-${idx}`) ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                              {expandedCitations.has(`${msg.id}-${idx}`) && (
                                <div className="mt-2 border-t border-citation-border pt-2 text-sm text-citation-foreground animate-fade-in">
                                  <p className="leading-relaxed">{citation.text}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border p-1">
                <LogoMark className="h-5 w-5 object-contain" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  بيحضرلك الإجابة...
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-destructive/20 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">
                  حصل مشكلة في الاتصال. جرب تاني.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl flex-col gap-2"
        >
          {/* Attached file chip */}
          {attachedFile && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-gold/30 bg-gold-soft/40 px-3 py-2 animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-navy shrink-0" />
                <span className="truncate text-sm font-medium text-navy">{attachedFile.name}</span>
                <span className="text-[11px] text-navy/70 shrink-0">
                  ({Math.round(attachedFile.size / 1024)} ك.ب)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-navy/70 hover:bg-navy/10"
                aria-label="إزالة المرفق"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFilePick}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="إرفاق عقد (PDF / صورة / نص)"
              aria-label="إرفاق عقد"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={attachedFile ? "اكتب سؤالك عن العقد (اختياري) واضغط إرسال..." : "اكتب سؤالك القانوني هنا... مثال: هل يحق للمالك طرد المستأجر؟"}
              rows={1}
              className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>


          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 text-center">
            <ShieldAlert className="h-3 w-3 text-muted-foreground" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              هذا النظام يقدم معلومات قانونية للتوضيح فقط وليس استشارة قانونية رسمية.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
