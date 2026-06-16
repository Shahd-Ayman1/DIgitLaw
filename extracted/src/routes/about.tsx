import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout from "@/components/site-layout";
import { ShieldCheck, BookOpen, Users, Target, ArrowLeft, Sparkles } from "lucide-react";
import bayyinahLogo from "@/assets/bayyinah-logo.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن بيّنة — رؤيتنا ومهمتنا" },
      { name: "description", content: "تعرّف على بيّنة: المنصة الذكية اللي بتخلي القانون المصري متاح ومفهوم للجميع." },
      { property: "og:title", content: "عن بيّنة — رؤيتنا ومهمتنا" },
      { property: "og:description", content: "تعرّف على بيّنة: المنصة الذكية اللي بتخلي القانون المصري متاح ومفهوم للجميع." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Target, title: "الدقة", desc: "كل إجابة مبنية على نص قانوني موثّق، مع ذكر المصدر بشكل واضح." },
  { icon: BookOpen, title: "البساطة", desc: "نشرح القانون بلغة بسيطة، بعيداً عن المصطلحات المعقدة." },
  { icon: Users, title: "الشمولية", desc: "بيّنة لكل المصريين، مهما كان مستواهم التعليمي أو خلفيتهم." },
  { icon: ShieldCheck, title: "الموثوقية", desc: "نلتزم بأعلى معايير الشفافية وحماية بيانات المستخدمين." },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <Sparkles className="h-3 w-3" />
            عن بيّنة
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold text-navy-foreground sm:text-6xl text-balance">
            نؤمن إن القانون
            <br />
            <span className="text-gold-gradient">حق لكل مواطن</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-foreground/80">
            بيّنة وُلِد من فكرة بسيطة: لازم كل مصري يقدر يعرف حقوقه وواجباته القانونية بدون ما يضطر يدفع آلاف الجنيهات أو ينتظر مواعيد طويلة.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">مهمتنا</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl text-balance">
              نخلي القانون المصري مفهوم للجميع
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              في كل يوم، ملايين المصريين بيواجهوا مواقف قانونية: عقد إيجار، مشكلة في الشغل، نزاع عائلي، أو تساؤل عن حقوقهم. بيّنة موجود علشان يجاوب على أسئلتهم بدقة ووضوح.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              نستخدم أحدث تقنيات الذكاء الاصطناعي مع قاعدة بيانات شاملة من النصوص القانونية المصرية، علشان نقدم استشارات قانونية موثوقة ومتاحة للجميع، 24 ساعة في اليوم.
            </p>
            <Link
              to="/chat"
              className="mt-8 group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-elegant"
            >
              جرب بيّنة مجاناً
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-hero-gradient p-1 shadow-elegant">
                <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-navy">
                  <img
                    src={bayyinahLogo.url}
                    alt="بيّنة Bayyinah"
                    className="h-32 w-auto object-contain opacity-90"
                  />
                </div>
              </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-border bg-card p-6 shadow-elegant lg:block">
              <p className="font-display text-4xl font-bold text-gold">+10K</p>
              <p className="text-sm text-muted-foreground">مستخدم نشط</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-parchment">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">قيمنا</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
              المبادئ اللي بنشتغل بيها
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                  <v.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
