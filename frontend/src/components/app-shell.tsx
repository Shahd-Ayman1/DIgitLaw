"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, FileSearch, History, Settings, Moon, Sun, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const NAV_ITEMS = [
  { href: "/chat", label: "المساعد القانوني", icon: MessageSquare },
  { href: "/contract-analysis", label: "تحليل العقود", icon: FileSearch },
  { href: "/history", label: "سجل المحادثات", icon: History },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-l border-border bg-card shrink-0">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
          <SealMark />
          <div>
            <p className="font-extrabold text-lg leading-tight">ديجيتلو</p>
            <p className="text-xs text-muted-foreground tracking-wide">DigitLaw</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2">
          <SealMark small />
          <span className="font-extrabold">ديجيتلو</span>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen pt-14 md:pt-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SealMark({ small }: { small?: boolean }) {
  const size = small ? "h-8 w-8" : "h-10 w-10";
  return (
    <div
      className={cn(
        size,
        "rounded-full border-2 border-primary/70 bg-accent flex items-center justify-center shrink-0"
      )}
    >
      <Scale className="h-1/2 w-1/2 text-primary" strokeWidth={2.25} />
    </div>
  );
}
