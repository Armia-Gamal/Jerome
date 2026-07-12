import { useState } from "react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/logo.jpg";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "sonner";
import "./auth.css";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

export default function AuthPage({ mode, onPage }: { mode: "login" | "register"; onPage: (p: Page) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login, register, loading } = useAuth();
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error("من فضلك أكمل البيانات المطلوبة");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ fullName, email, password });
      }
      onPage("stories");
    } catch {
      // Toast is handled by useAuth.
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }} className="auth-page min-h-screen flex">
      <div className="auth-visual hidden lg:flex flex-1 relative overflow-hidden">
        <div className="auth-logo-frame">
          <img src={logo} alt="فريق القديس جيروم" />
        </div>
        <div className="auth-quote">
          <h2>فريق القديس جيروم</h2>
          <p>
            "كلمتك سراج لرجلي ونور لسبيلي" — مزمور ١١٩:١٠٥
          </p>
        </div>
      </div>

      <div className="auth-form-side flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="auth-mobile-brand lg:hidden flex items-center gap-3 mb-8">
            <img src={logo} alt="فريق القديس جيروم" />
            <span>فريق القديس جيروم</span>
          </div>

          <h1 className="auth-heading text-3xl font-black mb-2">{isLogin ? "مرحباً بعودتك!" : "انضم إلى فريق القديس جيروم"}</h1>
          <p className="text-muted-foreground mb-8">{isLogin ? "سجّل الدخول لمتابعة رحلتك التعليمية" : "ابدأ رحلتك مع قصص الأنبياء اليوم"}</p>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2">الاسم الكامل</label>
                <input value={fullName} onChange={event => setFullName(event.target.value)} type="text" placeholder="أدخل اسمك الكامل" className="auth-input w-full px-4 py-3 rounded-xl" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
              <input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="example@email.com" className="auth-input w-full px-4 py-3 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <input value={password} onChange={event => setPassword(event.target.value)} type={showPass ? "text" : "password"} placeholder="أدخل كلمة المرور" className="auth-input w-full px-4 py-3 pl-12 rounded-xl" />
                <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2">تأكيد كلمة المرور</label>
                <input value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} type="password" placeholder="أعد إدخال كلمة المرور" className="auth-input w-full px-4 py-3 rounded-xl" />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  تذكرني
                </label>
                <a href="#" className="text-sm font-semibold text-primary hover:underline">نسيت كلمة المرور؟</a>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="auth-submit w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
            >
              {loading ? "جاري المعالجة..." : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
            </button>

          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
            <button onClick={() => onPage(isLogin ? "register" : "login")} className="font-bold text-primary hover:underline">
              {isLogin ? "أنشئ حساباً مجانياً" : "سجّل الدخول"}
            </button>
          </p>
          <button onClick={() => onPage("landing")} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
            <ChevronRight size={14} />
            العودة
          </button>
        </div>
      </div>
    </div>
  );
}
