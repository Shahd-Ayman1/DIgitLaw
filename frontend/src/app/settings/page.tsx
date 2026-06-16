"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Server, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useChatHistory } from "@/lib/use-chat-history";
import { Button } from "@/components/ui/button";
import { fetchHealth } from "@/lib/api";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { clearHistory, history } = useChatHistory();
  const [health, setHealth] = useState<any>(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealthError(true));
  }, []);

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto pb-24 space-y-6">
      <header>
        <h1 className="text-xl font-extrabold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          الإعدادات
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>المظهر</CardTitle>
          <CardDescription>التبديل بين الوضع النهاري والليلي</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>سجل المحادثات</CardTitle>
          <CardDescription>عدد المحادثات المحفوظة: {history.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={clearHistory} disabled={history.length === 0}>
            مسح كل السجل
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            حالة الخدمة
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {healthError ? (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" /> تعذر الاتصال بالخادم
            </div>
          ) : health ? (
            <>
              <div className="flex items-center gap-2">
                {health.status === "ok" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-500" />
                )}
                الحالة: {health.status}
              </div>
              <div>البيئة: {health.environment}</div>
              <div>مدة التشغيل: {Math.round(health.uptime_seconds)} ثانية</div>
              {health.dependencies && (
                <div>Qdrant: {health.dependencies.qdrant}</div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">جاري التحميل...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
