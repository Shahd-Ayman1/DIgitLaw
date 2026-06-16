"use client";

import { useChatHistory } from "@/lib/use-chat-history";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CitationCard } from "@/components/citation-card";
import { History, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { history, clearHistory } = useChatHistory();

  return (
    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            سجل المحادثات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">آخر الأسئلة والإجابات المحفوظة على هذا الجهاز.</p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4" />
            مسح السجل
          </Button>
        )}
      </header>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            لا يوجد سجل محادثات حتى الآن. ابدأ محادثة جديدة من صفحة "المساعد القانوني".
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <Card key={entry.id} className={cn(entry.is_fallback && "border-amber-400/50")}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1">السؤال</p>
                  <p className="text-sm font-semibold">{entry.question}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                    الإجابة
                    {entry.is_fallback && (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> احتياطية
                      </span>
                    )}
                  </p>
                  <p className="text-sm leading-relaxed">{entry.answer}</p>
                </div>
                {entry.citations.length > 0 && (
                  <div className="space-y-2">
                    {entry.citations.map((c, i) => (
                      <CitationCard key={c.chunk_id + i} citation={c} index={i} />
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleString("ar-EG")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
