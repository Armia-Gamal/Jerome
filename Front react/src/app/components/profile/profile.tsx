import { Edit2 } from "lucide-react";
import "./profile.css";

export default function ProfilePage() {
  return (
    <div className="profile-page p-6 space-y-6">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32, #D4AF37)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-card flex items-center justify-center text-3xl font-black text-white shadow-lg" style={{ background: "#2E7D32" }}>أ</div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
              <Edit2 size={15} />
              تعديل الملف
            </button>
          </div>
          <h1 className="text-2xl font-black">أنطونيوس سمير</h1>
          <p className="text-muted-foreground text-sm mt-1">antonious@example.com</p>
          <p className="text-sm mt-3 max-w-lg leading-relaxed text-muted-foreground">
            طالب متحمس لتعلم الكتاب المقدس. أحب قصص الأنبياء وأسعى لفهم تعاليم الإيمان بعمق.
          </p>
          <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-border">
            {[
              { label: "القصص المتاحة", value: "٨", icon: "📖" },
              { label: "الاختبارات", value: "١٢", icon: "؟" },
              { label: "الفيديوهات", value: "٤٨", icon: "▶" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-xl">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
