import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout from "@/components/site-layout";
import { Home, Heart, Briefcase, ArrowLeft, BookOpen, Hash } from "lucide-react";

export const Route = createFileRoute("/practice-areas")({
  head: () => ({
    meta: [
      { title: "المجالات القانونية — بيّنة" },
      { name: "description", content: "أهم 3 مجالات قانونية بيغطيها بيّنة من القانون المصري مع نصوص ومواد حقيقية." },
      { property: "og:title", content: "المجالات القانونية — بيّنة" },
      { property: "og:description", content: "أهم 3 مجالات قانونية بيغطيها بيّنة من القانون المصري مع نصوص ومواد حقيقية." },
    ],
  }),
  component: PracticeAreasPage,
});

type Article = {
  number: string;
  title: string;
  text: string;
};

type Area = {
  icon: typeof Home;
  title: string;
  law: string;
  desc: string;
  articles: Article[];
};

const AREAS: Area[] = [
  {
    icon: Home,
    title: "قانون الإيجارات",
    law: "القانون المدني المصري رقم 131 لسنة 1948 + القانون رقم 4 لسنة 1996",
    desc: "ينظّم العلاقة بين المؤجّر والمستأجر، مدة العقد، الأجرة، التزامات الطرفين، وحالات الإخلاء.",
    articles: [
      {
        number: "563",
        title: "تعريف عقد الإيجار",
        text: "الإيجار عقد يلتزم المؤجِّر بمقتضاه أن يمكِّن المستأجِر من الانتفاع بشيء معين مدة معينة لقاء أجر معلوم.",
      },
      {
        number: "568",
        title: "التزام المؤجر بالتسليم",
        text: "يلتزم المؤجر بأن يسلِّم المستأجر العين المؤجَّرة وملحقاتها بحالة تصلح معها لاستعمالها في الغرض المتفق عليه أو لما أُعِدّت له.",
      },
      {
        number: "590",
        title: "التزام المستأجر بسداد الأجرة",
        text: "يلتزم المستأجر بالوفاء بالأجرة في المواعيد المتفق عليها، وإذا لم يوجد اتفاق أو عرف، وجب الوفاء بها في نهاية كل سنة من سنوات الإيجار.",
      },
    ],
  },
  {
    icon: Heart,
    title: "الأحوال الشخصية",
    law: "قانون الأحوال الشخصية رقم 25 لسنة 1929 المعدّل بالقانون 100 لسنة 1985",
    desc: "ينظّم الزواج والطلاق والنفقة والحضانة وحقوق الزوجة والأبناء.",
    articles: [
      {
        number: "1",
        title: "طلاق السكران والمكره",
        text: "لا يقع طلاق السكران والمكره، كما لا يقع طلاق من يفقد إدراكه أو شعوره بأي سبب من الأسباب.",
      },
      {
        number: "18 مكرر ثالثاً",
        title: "حضانة الصغير",
        text: "ينتهي حق حضانة النساء ببلوغ الصغير سن الخامسة عشرة، ويُخيَّر بعد ذلك بين البقاء في يد الحاضنة دون أجر حضانة حتى يبلغ سن الرشد إذا كانت أنثى أو يتزوج إذا كان ذكراً، وبين الانتقال إلى من له الحق في ضمه.",
      },
      {
        number: "16",
        title: "نفقة الزوجة على الزوج",
        text: "تجب نفقة الزوجة على زوجها من تاريخ العقد الصحيح إذا سلَّمت نفسها إليه ولو حُكْماً، وتشمل النفقة الغذاء والكسوة والمسكن ومصاريف العلاج وغير ذلك مما يقضي به الشرع.",
      },
    ],
  },
  {
    icon: Briefcase,
    title: "قانون العمل",
    law: "قانون العمل المصري رقم 12 لسنة 2003",
    desc: "ينظّم عقود العمل، الأجور، ساعات العمل، الإجازات، الفصل التعسفي، ومكافأة نهاية الخدمة.",
    articles: [
      {
        number: "32",
        title: "إثبات عقد العمل",
        text: "يجب أن يكون عقد العمل مكتوباً باللغة العربية من ثلاث نسخ، تُحفَظ لدى صاحب العمل والعامل، وتُودَع نسخة بمكتب التأمينات الاجتماعية المختص. وإذا لم يوجد عقد مكتوب جاز للعامل وحده إثبات حقوقه بكافة طرق الإثبات.",
      },
      {
        number: "69",
        title: "حالات إنهاء الخدمة بدون مكافأة",
        text: "لا يجوز فصل العامل إلا إذا ارتكب خطأً جسيماً، وحدّد القانون حالات الخطأ الجسيم على سبيل الحصر، ومنها انتحال شخصية أو تقديم مستندات مزوّرة، أو إفشاء أسرار العمل، أو ارتكاب فعل ماس بالشرف أو الأمانة أو الآداب العامة.",
      },
      {
        number: "110",
        title: "الحد الأدنى للإجازة السنوية",
        text: "يستحق العامل إجازة سنوية مدتها 21 يوماً بأجر كامل عن السنة الواحدة، وتزاد إلى 30 يوماً متى أمضى في الخدمة عشر سنوات متصلة عند صاحب عمل أو أكثر، أو بلغ سن الخمسين.",
      },
    ],
  },
];

function PracticeAreasPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">المجالات القانونية</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-navy-foreground sm:text-6xl text-balance">
              أهم 3 مجالات <span className="text-gold-gradient">في القانون المصري</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy-foreground/80">
              اختار المجال اللي يهمك، شوف القانون المنظِّم له، وأبرز المواد القانونية المُستنَد إليها — كلها بنصوصها الرسمية.
            </p>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 lg:px-8">
          {AREAS.map((a) => (
            <article
              key={a.title}
              className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-gold">
                  <a.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-3xl font-bold text-foreground">{a.title}</h2>
                  <p className="mt-1 text-sm font-medium text-gold">{a.law}</p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{a.desc}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-gold" />
                  مواد قانونية مختارة
                </h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {a.articles.map((ar) => (
                    <div
                      key={ar.number}
                      className="group rounded-2xl border border-citation-border bg-citation/40 p-5 transition-all hover:-translate-y-1 hover:shadow-elegant hover:bg-citation"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-navy px-2 py-0.5 text-xs font-semibold text-gold">
                          <Hash className="h-3 w-3" />
                          المادة {ar.number}
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-base font-bold text-citation-foreground">
                        {ar.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-citation-foreground/85">
                        {ar.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    to="/chat"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gold transition-colors"
                  >
                    اسأل بيّنة في {a.title}
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* CTA */}
          <div className="rounded-3xl bg-hero-gradient p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-bold text-navy-foreground sm:text-4xl text-balance">
              عندك سؤال في مجال تاني؟
            </h2>
            <p className="mt-3 text-navy-foreground/75">
              بيّنة بتقدر تساعدك في أي سؤال قانوني، مش بس المجالات الموجودة هنا.
            </p>
            <Link
              to="/chat"
              className="mt-8 group inline-flex items-center gap-2 rounded-md bg-gold-gradient px-7 py-3.5 text-base font-semibold text-navy shadow-gold transition-all hover:-translate-y-0.5"
            >
              ابدأ استشارتك
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
