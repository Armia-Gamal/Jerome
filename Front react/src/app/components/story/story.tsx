import { Bookmark, BookOpen, ChevronLeft, ChevronRight, Clock, HelpCircle, MessageCircle, Play, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useProphet, useProphets } from "../../../hooks/useProphets";
import { applyImageFallback } from "../../../utils/media";
import "./story.css";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

export default function StoryPage({ onPage, prophetId }: { onPage: (p: Page) => void; prophetId: number | null }) {
  const { prophets, loading: loadingProphets } = useProphets(!prophetId);
  const fallbackId = prophetId ?? prophets[0]?.id;
  const { prophet, loading, error } = useProphet(fallbackId);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [prophet?.id]);

  if (loadingProphets || loading) {
    return <div className="story-page p-6 space-y-6 text-muted-foreground text-sm">جاري تحميل القصة...</div>;
  }

  if (error || !prophet) {
    return <div className="story-page p-6 space-y-6 text-muted-foreground text-sm">تعذر تحميل القصة.</div>;
  }

  return (
    <div className="story-page p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => onPage("stories")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={16} />
          قصص الأنبياء
        </button>
        <ChevronLeft size={14} className="text-muted-foreground" />
        <span className="text-sm font-semibold">{prophet.name}</span>
      </div>

      <div className="space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-xl">
            {prophet.videoPath && !videoFailed ? (
              <video src={prophet.videoPath} controls onError={() => setVideoFailed(true)} className="w-full h-full object-cover" />
            ) : (
              <img src={prophet.imagePath} alt={prophet.name} onError={applyImageFallback} className="w-full h-full object-cover opacity-70" />
            )}
            {!prophet.videoPath && !videoFailed && <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Play size={32} className="text-green-700 mr-2" />
              </button>
            </div>}
            {videoFailed && <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold bg-black/50">تعذر تحميل الفيديو</div>}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center justify-between">
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-black">{prophet.name}</h1>
                <p className="text-muted-foreground text-sm mt-1">قصة {prophet.name}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"><Bookmark size={18} /></button>
                <button className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"><MessageCircle size={18} /></button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-7">
              {prophet.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
              </div>
            </div>
          </div>

          <button
            onClick={() => onPage("quiz")}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2E7D32, #1B5E20)" }}
          >
            <HelpCircle size={22} />
            ابدأ اختبار هذه القصة
          </button>
      </div>
    </div>
  );
}
