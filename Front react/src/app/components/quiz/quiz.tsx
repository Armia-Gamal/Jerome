import { useState } from "react";
import { BookOpen, CheckCircle, Clock, X } from "lucide-react";
import { useProphet, useProphets } from "../../../hooks/useProphets";
import { useQuestions } from "../../../hooks/useQuestions";
import "./quiz.css";

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

export default function QuizPage({ onPage, prophetId }: { onPage: (p: Page) => void; prophetId: number | null }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const { prophets, loading: loadingProphets } = useProphets(!prophetId);
  const activeProphetId = prophetId ?? prophets[0]?.id;
  const { questions, loading, error } = useQuestions(activeProphetId);
  const { prophet } = useProphet(activeProphetId);
  const quizQuestions = questions.map(question => ({
    q: question.questionText,
    options: question.choices.map(choice => choice.choiceText),
    correct: Math.max(0, question.choices.findIndex(choice => choice.isCorrect)),
    verse: "",
  }));

  if (loading || loadingProphets) {
    return <div className="quiz-page p-6 flex items-start justify-center min-h-full text-muted-foreground text-sm">جاري تحميل الأسئلة...</div>;
  }

  if (error || !activeProphetId) {
    return <div className="quiz-page p-6 flex items-start justify-center min-h-full text-muted-foreground text-sm">تعذر تحميل أسئلة الاختبار.</div>;
  }

  if (quizQuestions.length === 0) {
    return <div className="quiz-page p-6 flex items-start justify-center min-h-full text-muted-foreground text-sm">لا توجد أسئلة لهذا الاختبار حالياً.</div>;
  }

  const q = quizQuestions[current];
  const total = quizQuestions.length;
  const isLast = current === total - 1;

  const handleSelect = (i: number) => {
    if (confirmed) return;
    setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
      setTimeLeft(30);
    }
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 70;
    return (
      <div className="quiz-page p-6 flex items-center justify-center min-h-full">
        <div className="max-w-md w-full text-center">
          <div className="text-8xl mb-6">{passed ? "📚" : "📖"}</div>
          <h1 className="text-3xl font-black mb-2">{passed ? "نتيجة جيدة" : "استمر في التعلم!"}</h1>
          <p className="text-muted-foreground mb-8">{passed ? "لقد اجتزت الاختبار بنجاح." : "لم تجتز الاختبار هذه المرة، لكن يمكنك إعادة المحاولة!"}</p>

          <div className="bg-card rounded-3xl p-8 border border-border shadow-xl mb-6">
            <div className="text-6xl font-black mb-2" style={{ color: passed ? "#2E7D32" : "#D4AF37" }}>{pct}٪</div>
            <div className="text-muted-foreground mb-6">نتيجتك النهائية</div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-xs text-muted-foreground">إجابة صحيحة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{total - score}</div>
                <div className="text-xs text-muted-foreground">إجابة خاطئة</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setCurrent(0); setSelected(null); setConfirmed(false); setScore(0); setFinished(false); setTimeLeft(30); }} className="flex-1 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
              إعادة الاختبار
            </button>
            <button onClick={() => onPage("stories")} className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-all" style={{ background: "#2E7D32" }}>
              قصص أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page p-6 flex items-start justify-center min-h-full">
      <div className="max-w-xl w-full space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => onPage("story")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} /> إنهاء الاختبار
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: timeLeft <= 10 ? "#FEE2E2" : "#E8F5E9", color: timeLeft <= 10 ? "#DC2626" : "#2E7D32" }}>
              <Clock size={14} />
              {timeLeft}ث
            </div>
            <span className="text-sm text-muted-foreground font-medium">{current + 1} / {total}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{prophet?.name ? `قصة النبي ${prophet.name}` : "قصة الأنبياء"}</span>
            <span>السؤال {current + 1} من {total}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <BookOpen size={13} className="text-primary" />
            {q.verse}
          </div>
          <h2 className="text-xl font-bold leading-relaxed mb-6">{q.q}</h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = "border border-border bg-muted/50 hover:border-primary hover:bg-primary/5";
              if (confirmed) {
                if (i === q.correct) style = "border-2 border-green-500 bg-green-50";
                else if (i === selected && i !== q.correct) style = "border-2 border-red-400 bg-red-50";
                else style = "border border-border bg-muted/30 opacity-60";
              } else if (selected === i) {
                style = "border-2 border-primary bg-primary/5";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-right p-4 rounded-xl font-medium text-sm transition-all flex items-center gap-3 ${style}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      confirmed && i === q.correct ? "bg-green-500 border-green-500 text-white"
                        : confirmed && i === selected && i !== q.correct ? "bg-red-400 border-red-400 text-white"
                        : selected === i ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {confirmed && i === q.correct ? <CheckCircle size={14} /> : String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>

          {confirmed && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${selected === q.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {selected === q.correct ? <CheckCircle size={16} /> : <X size={16} />}
              {selected === q.correct ? "إجابة صحيحة!" : `خطأ! الإجابة الصحيحة: ${q.options[q.correct]}`}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="flex-1 py-3.5 rounded-xl font-bold text-white disabled:opacity-40 transition-all hover:opacity-90 shadow-lg shadow-primary/25"
              style={{ background: "#2E7D32" }}
            >
              تأكيد الإجابة
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: isLast ? "#D4AF37" : "#2E7D32", color: isLast ? "#1F2937" : "white" }}
            >
              {isLast ? "🎯 عرض النتيجة" : "السؤال التالي →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
