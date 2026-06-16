import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowRight, ArrowLeft } from "lucide-react";
import bayyinahLogo from "@/assets/bayyinah-logo.png.asset.json";

const NAV = [
  { to: "/", label: "الرئيسية" },
  { to: "/practice-areas", label: "المجالات القانونية" },
  { to: "/about", label: "عن بيّنة" },
  { to: "/contact", label: "اتصل بنا" },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const goBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };
  const goForward = () => {
    if (typeof window !== "undefined") window.history.forward();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand + history controls */}
        <div className="flex items-center gap-3">
          {/* In RTL: "back" = right arrow visually, "forward" = left arrow */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-md border border-border bg-card/60 p-0.5">
            <button
              onClick={goBack}
              aria-label="رجوع"
              title="الصفحة السابقة"
              className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={goForward}
              aria-label="تقدم"
              title="الصفحة التالية"
              className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 group" aria-label="بيّنة - الرئيسية">
            <img
              src={bayyinahLogo.url}
              alt="بيّنة Bayyinah"
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gold-gradient" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-elegant hover:-translate-y-px"
          >
            ابدأ استشارة
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
          aria-label="القائمة"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            <div className="flex items-center gap-1 pb-2">
              <button
                onClick={goBack}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
              >
                <ArrowRight className="h-3.5 w-3.5" /> رجوع
              </button>
              <button
                onClick={goForward}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
              >
                تقدم <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.to
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/chat"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground mt-2"
            >
              ابدأ استشارة
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
