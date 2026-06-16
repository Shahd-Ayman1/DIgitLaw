import { createFileRoute } from "@tanstack/react-router";
import SiteLayout from "@/components/site-layout";
import { Mail, MapPin, MessageSquare, Send, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "اتصل بنا — بيّنة" },
      { name: "description", content: "تواصل مع فريق بيّنة لأي استفسار أو اقتراح." },
      { property: "og:title", content: "اتصل بنا — بيّنة" },
      { property: "og:description", content: "تواصل مع فريق بيّنة لأي استفسار أو اقتراح." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">اتصل بنا</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-navy-foreground sm:text-6xl text-balance">
            <span className="text-gold-gradient">تواصل معنا</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-foreground/80">
            عندك سؤال أو اقتراح؟ فريق بيّنة سعيد بسماعك. ابعتلنا رسالة وهنرد عليك في أقرب وقت.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-soft text-navy">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">البريد الإلكتروني</h3>
              <a href="mailto:hello@bayena.legal" className="mt-1 block text-sm text-muted-foreground hover:text-gold">
                hello@bayena.legal
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-soft text-navy">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">الدعم الفني</h3>
              <p className="mt-1 text-sm text-muted-foreground">support@bayena.legal</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-soft text-navy">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">المكتب</h3>
              <p className="mt-1 text-sm text-muted-foreground">القاهرة، جمهورية مصر العربية</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-gold">
                  <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">ابعتلنا رسالة</h2>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">الاسم</label>
                  <input
                    required
                    type="text"
                    placeholder="اسمك الكامل"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
                  <input
                    required
                    type="email"
                    placeholder="example@email.com"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-foreground">الموضوع</label>
                <input
                  required
                  type="text"
                  placeholder="موضوع الرسالة"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium text-foreground">رسالتك</label>
                <textarea
                  required
                  rows={6}
                  placeholder="اكتب رسالتك هنا..."
                  className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  هنرد عليك خلال 24 ساعة
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-elegant hover:-translate-y-px"
                >
                  <Send className="h-4 w-4" />
                  ارسل الرسالة
                </button>
              </div>

              {submitted && (
                <div className="mt-5 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground animate-fade-in">
                  ✓ شكراً لك! تم استلام رسالتك وهنرد عليك قريباً.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
