import { useState } from "react";
import { BookOpen, Play, Search } from "lucide-react";
import { useProphets } from "../../../hooks/useProphets";
import { applyImageFallback } from "../../../utils/media";
import "./stories.css";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

export default function StoriesPage({ onPage, onSelectProphet }: { onPage: (p: Page) => void; onSelectProphet: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const { prophets, loading, error } = useProphets();

  const filtered = [...prophets]
    .sort((a, b) => a.id - b.id)
    .filter(p => {
      const matchSearch = p.name.includes(search) || p.bibleReference.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });

  return (
    <div className="stories-page p-6 space-y-6">
      <div>
        <h1 className="stories-title text-2xl font-black">قصص الأنبياء</h1>
        <p className="stories-subtitle mt-1">اختر نبيّاً وابدأ رحلتك التعليمية</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder="ابحث عن نبي..."
            className="stories-search w-full pr-10 pl-4 py-2.5 rounded-xl focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="stories-grid grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading && <div className="text-muted-foreground text-sm">جاري تحميل القصص...</div>}
        {!loading && error && <div className="text-muted-foreground text-sm">{error}</div>}
        {!loading && !error && filtered.length === 0 && <div className="text-muted-foreground text-sm">لا توجد قصص متاحة حالياً.</div>}
        {!loading && filtered.map(p => (
          <div
            key={p.id}
            className="story-card rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            onClick={() => {
              onSelectProphet(p.id);
              onPage("story");
            }}
          >
            <div className="relative h-44 overflow-hidden">
              <img src={p.imagePath} alt={p.name} onError={applyImageFallback} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <div className="absolute bottom-3 right-3 left-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white font-bold text-lg">{p.name}</span>
                </div>
                {p.bibleReference.trim() && (
                  <div className="flex items-center gap-1.5 text-[#ead8ad] text-xs font-semibold">
                    <BookOpen size={13} />
                    <span>{p.bibleReference}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              {p.bibleReference.trim() && (
                <div className="story-reference flex items-center gap-1.5 mb-3 text-xs font-semibold">
                  <BookOpen size={13} />
                  <span>الشاهد: {p.bibleReference}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  className="story-start flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                >
                  <Play size={12} />
                  ابدأ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
