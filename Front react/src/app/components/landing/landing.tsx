import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LogIn,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import logo from "../../../assets/logo.jpg";
import "./landing.css";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

const features = [
  { icon: Video, title: "فيديوهات منظمة", desc: "رحلات قصيرة وواضحة داخل قصص العهد القديم، من البداية حتى الفكرة الروحية." },
  { icon: HelpCircle, title: "اختبارات بعد كل قصة", desc: "أسئلة بسيطة تساعد الطالب يراجع ويفهم بدل الحفظ السريع." },
  { icon: ShieldCheck, title: "محتوى مسيحي موثوق", desc: "لغة عربية هادئة ومراجع كتابية مناسبة للأطفال والخدمة." },
];

const stats = [
  { value: "6+", label: "قصة جاهزة" },
  { value: "50+", label: "سؤال تفاعلي" },
  { value: "مجاني", label: "للبداية" },
];

const faqs = [
  { q: "هل المنصة مناسبة للموبايل؟", a: "نعم، التصميم يعمل على الموبايل والتابلت والكمبيوتر بنفس الوضوح." },
  { q: "هل أقدر أبدأ من غير حساب؟", a: "يمكنك تصفح صفحة الهبوط، ثم التسجيل لحفظ التقدم والدخول للمحتوى." },
  { q: "ما نوع المحتوى؟", a: "قصص العهد القديم بفيديوهات وأسئلة مراجعة مبسطة لخدمة مدارس الأحد والتعليم الفردي." },
];

export default function LandingPage({ onPage }: { onPage: (p: Page) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }} className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <button onClick={() => onPage("landing")} className="landing-brand" aria-label="العودة للرئيسية">
            <span>فريق القديس جيروم</span>
          </button>

          <div className="landing-links">
            <a href="#features">المميزات</a>
            <a href="#journey">الرحلة</a>
            <a href="#faq">الأسئلة</a>
          </div>

          <div className="landing-actions">
            <button onClick={() => onPage("login")} className="landing-login">
              <LogIn size={16} />
              دخول
            </button>
            <button onClick={() => onPage("register")} className="landing-primary">
              ابدأ الآن
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-badge">
              <Sparkles size={16} />
              قصص العهد القديم بطريقة تفاعلية
            </div>
            <h1>رحلة إيمانية ممتعة في قصص العهد القديم</h1>
            <p>
              منصة عربية مسيحية تجمع بين الفيديو، الأسئلة، والتدرج الهادئ لتساعد الأطفال والخدام
              على فهم قصص الأنبياء والمعنى الروحي وراءها.
            </p>

            <div className="landing-hero-buttons">
              <button onClick={() => onPage("register")} className="landing-cta">
                ابدأ مجاناً
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="landing-checks">
              {["مناسب للخدمة", "لغة عربية واضحة", "اختبارات قصيرة"].map(item => (
                <span key={item}>
                  <CheckCircle size={16} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="landing-logo-stage" aria-hidden="true">
            <img src={logo} alt="" />
          </div>
        </section>

        <section className="landing-stats" aria-label="إحصائيات المنصة">
          {stats.map(stat => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section id="features" className="landing-section">
          <div className="landing-section-heading">
            <span>
              <BookOpen size={16} />
              مميزات المنصة
            </span>
            <h2>كل حاجة معمولة عشان التعليم يبقى بسيط ومفيد</h2>
          </div>

          <div className="landing-feature-grid">
            {features.map(feature => (
              <article key={feature.title} className="landing-feature">
                <div>
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" className="landing-journey">
          <div className="landing-section-heading">
            <span>رحلة الطالب</span>
            <h2>من القصة إلى الفهم في ثلاث خطوات</h2>
          </div>
          <div className="landing-steps">
            {["اختار القصة", "شاهد الفيديو", "راجع بالاختبار"].map((step, index) => (
              <div key={step}>
                <b>{index + 1}</b>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="landing-faq">
          <div className="landing-section-heading">
            <span>أسئلة شائعة</span>
            <h2>إجابات سريعة قبل البداية</h2>
          </div>

          <div className="landing-faq-list">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="landing-faq-item">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.q}
                  {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === index && <p>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
