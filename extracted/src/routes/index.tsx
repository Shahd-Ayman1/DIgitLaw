import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, BookOpen, Zap, Users, FileText, Gavel, Home, Briefcase, Heart, Building2, Quote, MessageSquare, Scale, BadgeCheck, Clock } from "lucide-react";
import SiteLayout from "@/components/site-layout";
import bayyinahLogo from "@/assets/bayyinah-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بيّنة — مساعدك القانوني المصري" },
      { name: "description", content: "اطرح أي سؤال قانوني أو ارفع عقدك واحصل على إجابة فورية مدعومة بنصوص القانون المصري." },
      { property: "og:title", content: "بيّنة — مساعدك القانوني المصري" },
      { property: "og:description", content: "اطرح أي سؤال قانوني أو ارفع عقدك واحصل على إجابة فورية مدعومة بنصوص القانون المصري." },
      { property: "og:image", content: bayyinahLogo.url },
      { name: "twitter:image", content: bayyinahLogo.url },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "إجابات موثوقة",
    desc: "كل إجابة مبنية على نصوص قانونية أصلية من القانون المصري، مع ذكر اسم القانون ورقم المادة.",
  },
  {
    icon: Zap,
    title: "استجابة فورية",
    desc: "احصل على إجابة لسؤالك القانوني في ثوانٍ، بدون انتظار مواعيد أو رسوم استشارة.",
  },
  {
    icon: BookOpen,
    title: "بلغة بسيطة",
    desc: "نشرح القانون باللهجة المصرية الواضحة، بعيداً عن المصطلحات المعقدة.",
  },
  {
    icon: FileText,
    title: "ارفع عقدك",
    desc: "ارفع عقد أو مستند قانوني وبيّنة تراجعه وتوضحلك البنود والمخاطر.",
  },
];

const AREAS = [
  { icon: Home, title: "قانون الإيجارات", desc: "حقوق المالك والمستأجر، عقود الإيجار، والإخلاء." },
  { icon: Heart, title: "الأحوال الشخصية", desc: "الزواج، الطلاق، الحضانة، والميراث." },
  { icon: Briefcase, title: "قانون العمل", desc: "عقود العمل، الفصل التعسفي، والتأمينات الاجتماعية." },
  { icon: Building2, title: "القانون التجاري", desc: "تأسيس الشركات، العقود التجارية، والنزاعات." },
  { icon: Gavel, title: "القانون الجنائي", desc: "الجرائم، العقوبات، وإجراءات التقاضي." },
  { icon: FileText, title: "العقود والمعاملات", desc: "صياغة ومراجعة العقود وفقاً للقانون." },
];

const STATS = [
  { value: "+10K", label: "سؤال قانوني تمت الإجابة عليه", icon: MessageSquare },
  { value: "+200", label: "قانون ونص تشريعي مغطى", icon: Scale },
  { value: "98%", label: "دقة الاقتباسات القانونية", icon: BadgeCheck },
  { value: "24/7", label: "متاح طوال الوقت", icon: Clock },
];

const TESTIMONIALS = [
  {
    name: "أحمد محمود",
    role: "صاحب محل تجاري",
    text: "ساعدتني بيّنة أفهم حقوقي في عقد الإيجار في دقائق. ما كنتش لاقي حد يشرحلي ببساطة كده.",
  },
  {
    name: "سارة عبدالله",
    role: "طالبة حقوق",
    text: "بستخدمها يومياً للبحث في النصوص القانونية. الاقتباسات دقيقة والشرح مفهوم جداً.",
  },
  {
    name: "محمد علي",
    role: "موظف",
    text: "لما كان عندي مشكلة في الشغل، بيّنة شرحتلي حقوقي وفقاً لقانون العمل خطوة بخطوة.",
  },
];

function LandingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-gradient" />
        {/* Decorative golden orbs */}
        <div className="pointer-events-none absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
              <img src={bayyinahLogo.url} alt="بيّنة" className="h-3.5 w-auto object-contain" />
              بيّنة · القانون المصري بين يديك
            </div>

            <h1 className="animate-slide-up mt-6 font-display text-5xl font-bold leading-[1.05] text-navy-foreground sm:text-6xl lg:text-7xl text-balance">
              <span className="block">القانون المصري</span>
              <span className="relative mt-2 inline-block">
                <span className="text-gold-gradient">في متناول يديك</span>
                <span className="pointer-events-none absolute inset-x-0 -bottom-2 h-2 bg-gold-gradient opacity-40 blur-md" />
                <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-[3px] bg-gold-gradient" />
              </span>
              <span className="mt-3 block font-display text-xl font-medium text-navy-foreground/70 sm:text-2xl">
                واضح · موثّق · بلسانك
              </span>
            </h1>

            <p className="animate-slide-up mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/80 sm:text-lg">
              بيّنة هي مساعدك القانوني المصري. اسأل أي سؤال أو ارفع عقدك، واحصل على إجابة مدعومة بالنصوص القانونية الرسمية مع ذكر القانون ورقم المادة — في ثواني.
            </p>

            {/* Trust chips */}
            <div className="animate-slide-up mt-5 flex flex-wrap items-center gap-2">
              {["نصوص قانونية رسمية", "لهجة مصرية مفهومة", "اقتباسات بالمواد", "مراجعة عقود"].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-1 text-xs text-navy-foreground/80 backdrop-blur"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {chip}
                </span>
              ))}
            </div>

            <div className="animate-slide-up mt-7 flex flex-wrap items-center gap-4">
              <Link
                to="/chat"
                className="group inline-flex items-center gap-2 rounded-md bg-gold-gradient px-7 py-3.5 text-base font-semibold text-navy shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                ابدأ استشارتك المجانية
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/practice-areas"
                className="inline-flex items-center gap-2 rounded-md border border-navy-foreground/20 bg-navy-foreground/5 px-7 py-3.5 text-base font-medium text-navy-foreground backdrop-blur hover:bg-navy-foreground/10 transition-colors"
              >
                استكشف المجالات
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-slide-up mt-20 border-t border-navy-foreground/10 pt-10">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/50">
              بيّنة في أرقام
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 rounded-xl bg-navy-foreground/[0.03] py-4 text-center">
                  <s.icon className="h-5 w-5 text-gold/80" strokeWidth={1.5} />
                  <p className="font-display text-3xl font-bold text-gold sm:text-4xl">{s.value}</p>
                  <p className="text-xs text-navy-foreground/70 leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">لماذا بيّنة</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl text-balance">
              مساعد قانوني تثق به
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              نجمع بين دقة النصوص القانونية وسهولة اللغة اليومية.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">مجالاتنا</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
                نغطي أهم فروع القانون المصري
              </h2>
            </div>
            <Link
              to="/practice-areas"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-gold transition-colors"
            >
              عرض كل المجالات
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <div key={a.title} className="group relative bg-card p-8 transition-colors hover:bg-parchment">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-soft text-navy">
                  <a.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">آراء المستخدمين</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
              يساعد المصريين كل يوم
            </h2>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <Quote className="h-7 w-7 text-gold" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                  {t.text}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-display font-bold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <img
            src={bayyinahLogo.url}
            alt="بيّنة Bayyinah"
            className="mx-auto h-16 w-auto object-contain opacity-90"
          />
          <h2 className="mt-6 font-display text-4xl font-bold text-navy-foreground sm:text-5xl text-balance">
            عندك سؤال قانوني؟ <br />
            <span className="text-gold-gradient">بيّنة جاهزة تساعدك.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-navy-foreground/75">
            ابدأ محادثتك الآن — مجاناً، بدون تسجيل، وبدون انتظار.
          </p>
          <div className="mt-10">
            <Link
              to="/chat"
              className="group inline-flex items-center gap-2 rounded-md bg-gold-gradient px-8 py-4 text-base font-semibold text-navy shadow-gold transition-all hover:-translate-y-0.5"
            >
              ابدأ استشارتك الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
