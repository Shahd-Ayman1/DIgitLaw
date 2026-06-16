import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import bayyinahLogo from "@/assets/bayyinah-logo.png.asset.json";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="inline-flex items-center justify-center rounded-2xl bg-background px-5 py-4 shadow-gold">
              <img
                src={bayyinahLogo.url}
                alt="بيّنة Bayyinah - للمحاماة والاستشارات القانونية"
                className="h-24 w-auto object-contain"
              />
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-foreground/70">
              منصة مصرية بتساعدك تفهم القوانين والإجراءات بطريقة بسيطة ومدعومة بالنصوص القانونية الأصلية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">روابط</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="text-navy-foreground/70 hover:text-gold transition-colors">الرئيسية</Link></li>
              <li><Link to="/practice-areas" className="text-navy-foreground/70 hover:text-gold transition-colors">المجالات القانونية</Link></li>
              <li><Link to="/about" className="text-navy-foreground/70 hover:text-gold transition-colors">عن بيّنة</Link></li>
              <li><Link to="/chat" className="text-navy-foreground/70 hover:text-gold transition-colors">ابدأ استشارة</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">تواصل</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2 text-navy-foreground/70">
                <Mail className="h-4 w-4 text-gold" />
                hello@bayena.legal
              </li>
              <li className="flex items-center gap-2 text-navy-foreground/70">
                <MapPin className="h-4 w-4 text-gold" />
                القاهرة، مصر
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-foreground/60">
            © {new Date().getFullYear()} بيّنة. كل الحقوق محفوظة.
          </p>
          <p className="text-xs text-navy-foreground/60">
            معلومات قانونية للتوضيح فقط، ليست استشارة قانونية رسمية.
          </p>
        </div>
      </div>
    </footer>
  );
}
