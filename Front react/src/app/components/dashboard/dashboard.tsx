import { BookOpen, Clock, HelpCircle, Play, Video } from "lucide-react";
import { useProphets } from "../../../hooks/useProphets";
import { applyImageFallback, getFileUrl } from "../../../utils/media";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

export default function Dashboard({ onPage, onSelectProphet }: { onPage: (p: Page) => void; onSelectProphet: (id: number) => void }) {
  const { prophets, loading } = useProphets();
  const recentStories = prophets.slice(0, 3);

  return (
    <div className="dashboard-page p-6 space-y-6">
      <div className="dashboard-welcome relative rounded-2xl overflow-hidden text-white p-8">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#D4AF37", filter: "blur(50px)" }} />
        <div className="relative z-10">
          <p className="text-green-200 text-sm mb-1">يوم الجمعة، ٤ يوليو ٢٠٢٥</p>
          <h1 className="text-3xl font-black mb-2">أهلاً بعودتك، أنطونيوس 👋</h1>
          <p className="text-green-100">اختر قصة جديدة أو أكمل مشاهدة فيديو من مكتبة الأنبياء.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "قصص متاحة", value: String(prophets.length), icon: BookOpen, color: "#2E7D32", bg: "#E8F5E9" },
          { label: "اختبارات", value: "١٢", icon: HelpCircle, color: "#D4AF37", bg: "#FFF8E1" },
          { label: "فيديوهات", value: "٨", icon: Video, color: "#1B5E20", bg: "#E8F5E9" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl p-5 border border-border hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <Play size={16} className="text-muted-foreground" />
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">متابعة التعلم</h2>
          <button onClick={() => onPage("stories")} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            عرض الكل
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {loading && <div className="text-muted-foreground text-sm">جاري تحميل القصص...</div>}
          {!loading && recentStories.length === 0 && <div className="text-muted-foreground text-sm">لا توجد قصص متاحة حالياً.</div>}
          {!loading && recentStories.map(p => (
            <div key={p.id} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all group cursor-pointer" onClick={() => { onSelectProphet(p.id); onPage("story"); }}>
              <div className="relative h-36 overflow-hidden">
                <img src={getFileUrl(p.imagePath)} alt={p.name} onError={applyImageFallback} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <Clock size={11} /> {p.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{p.name}</h3>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.bibleReference}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
