import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { BookOpen, Image, LogOut, PlusCircle, Save, Trash2, Upload, Video } from "lucide-react";
import logo from "../../../assets/logo.jpg";
import { toast } from "sonner";
import { useProphets } from "../../../hooks/useProphets";
import * as prophetService from "../../../services/prophetService";
import * as questionService from "../../../services/questionService";
import { clearAuthStorage } from "../../../utils/storage";
import { applyImageFallback } from "../../../utils/media";
import type { Question } from "../../../types/api";
import "./admin.css";

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const durationInMinutes = Math.max(1, Math.round(video.duration / 60));
      resolve(durationInMinutes);
    };
    video.onerror = () => {
      const error = video.error;
      window.URL.revokeObjectURL(video.src);
      reject(`Error loading video metadata: ${error?.message} (code: ${error?.code})`);
    };
    video.src = URL.createObjectURL(file);
  });
};

type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "stories" | "story" | "quiz" | "quiz-result" | "profile"
  | "admin";

type AdminQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  order: number;
};

type AdminProphet = {
  id: number;
  name: string;
  description: string;
  bibleReference: string;
  duration: string;
  imagePath: string;
  imageName: string;
  imageFile?: File | null;
  videoPath: string;
  videoName: string;
  videoFile?: File | null;
  questions: AdminQuestion[];
  isNew?: boolean;
};

export default function AdminDashboard({ onPage }: { onPage: (p: Page) => void }) {
  const { prophets, loading, refresh } = useProphets();
  const [rows, setRows] = useState<AdminProphet[]>([]);
  const [selectedId, setSelectedId] = useState(0);
  const [saving, setSaving] = useState(false);
  const selected = rows.find(row => row.id === selectedId) ?? rows[0];

  useEffect(() => {
    const nextRows = [...prophets]
      .sort((a, b) => a.id - b.id)
      .map(prophet => ({
        id: prophet.id,
        name: prophet.name,
        description: prophet.description,
        bibleReference: prophet.bibleReference,
        duration: prophet.duration,
        imagePath: prophet.imagePath,
        imageName: prophet.imagePath ? "الصورة الحالية" : "",
        videoPath: prophet.videoPath,
        videoName: prophet.videoPath ? "الفيديو الحالي" : "",
        questions: [],
      }));
    setRows(nextRows);
    setSelectedId(current => current || nextRows[0]?.id || 0);
  }, [prophets]);

  useEffect(() => {
    if (!selectedId || selected?.isNew) return;

    questionService.getQuestions(selectedId)
      .then((questions: Question[]) => {
        setRows(prev => prev.map(row => row.id === selectedId ? {
          ...row,
          questions: questions.map((question: Question) => ({
            id: question.id,
            question: question.questionText,
            options: [
              question.choices[0]?.choiceText ?? "",
              question.choices[1]?.choiceText ?? "",
              question.choices[2]?.choiceText ?? "",
              question.choices[3]?.choiceText ?? "",
            ],
            answerIndex: Math.max(0, question.choices.findIndex((choice: { isCorrect: boolean }) => choice.isCorrect)),
            order: question.order,
          })),
        } : row));
      })
      .catch(() => toast.error("تعذر تحميل أسئلة النبي المحدد"));
  }, [selectedId, selected?.isNew]);

  const addProphet = () => {
    const nextId = Date.now();
    const nextProphet: AdminProphet = {
      id: nextId,
      name: "نبي جديد",
      description: "",
      bibleReference: "",
      duration: "1", // Default duration in minutes for a new prophet
      imagePath: "",
      imageName: "",
      imageFile: null,
      videoPath: "",
      videoName: "",
      videoFile: null,
      isNew: true,
      questions: [
        {
          id: -Date.now(),
          question: "",
          options: ["", "", "", ""],
          answerIndex: 0,
          order: 1,
        },
      ],
    };

    setRows(prev => [nextProphet, ...prev]);
    setSelectedId(nextId);
  };

  const updateSelected = (next: Partial<AdminProphet>) => {
    if (!selected) return;
    setRows(prev => prev.map(row => row.id === selected.id ? { ...row, ...next } : row));
  };

  const updateQuestion = (questionId: number, next: Partial<AdminQuestion>) => {
    if (!selected) return;
    updateSelected({
      questions: selected.questions.map(question =>
        question.id === questionId ? { ...question, ...next } : question,
      ),
    });
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    if (!selected) return;
    updateSelected({
      questions: selected.questions.map(question => {
        if (question.id !== questionId) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    });
  };

  const addQuestion = () => {
    if (!selected) return;
    updateSelected({
      questions: [
        ...selected.questions,
        {
          id: Date.now(),
          question: "",
          options: ["", "", "", ""],
          answerIndex: 0,
          order: selected.questions.length + 1,
        },
      ],
    });
  };

  const deleteQuestion = async (questionId: number) => {
    if (!selected) return;
    if (!confirm("هل تريد حذف هذا السؤال؟")) return;
    if (questionId > 0) {
      try {
        await questionService.deleteQuestion(questionId);
        toast.success("تم حذف السؤال");
      } catch {
        toast.error("تعذر حذف السؤال");
        return;
      }
    }
    updateSelected({
      questions: selected.questions.filter(question => question.id !== questionId),
    });
  };

  const uploadSelectedImage = (file?: File) => {
    if (!file) return;
    updateSelected({ imagePath: URL.createObjectURL(file), imageName: file.name, imageFile: file });
  };

  const uploadSelectedVideo = async (file?: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    updateSelected({ videoPath: objectUrl, videoName: file.name, videoFile: file });
    try {
      const duration = await getVideoDuration(file);
      updateSelected({ duration: duration.toString() });
    } catch (error) {
      console.error("Failed to get video duration:", error);
      toast.error("تعذر حساب مدة الفيديو");
      // On error, we keep the previous duration value instead of resetting it.
    }
  };

  const getBackendErrorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
      const responseData = error.response?.data;
      if (typeof responseData === "string" && responseData.trim()) return responseData;
      if (typeof responseData?.message === "string" && responseData.message.trim()) return responseData.message;
      if (typeof responseData?.Message === "string" && responseData.Message.trim()) return responseData.Message;
      if (typeof responseData?.title === "string" && responseData.title.trim()) return responseData.title;
      if (typeof responseData?.Title === "string" && responseData.Title.trim()) return responseData.Title;

      const errors = responseData?.errors ?? responseData?.Errors;
      if (errors && typeof errors === "object") {
        const firstMessage = Object.values(errors).flat().find(message => typeof message === "string" && message.trim());
        if (typeof firstMessage === "string") return firstMessage;
      }
    }

    return "تعذر حفظ البيانات";
  };

  const saveSelected = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const payload = {
        name: selected.name,
        description: selected.description,
        bibleReference: selected.bibleReference,
        duration: selected.duration || "1", // Fallback to 1 minute if duration is not set
        image: selected.imageFile ?? null,
        video: selected.videoFile ?? null,
      };
      const savedProphet = selected.isNew
        ? await prophetService.createProphet(payload)
        : await prophetService.updateProphet(selected.id, payload);

      const questionsToSave = selected.questions.filter(question =>
        question.question.trim().length > 0 && question.options.every(option => option.trim().length > 0),
      );

      for (const [index, question] of questionsToSave.entries()) {
        const correctAnswerIndex = Math.min(Math.max(question.answerIndex, 0), 3);
        const questionPayload = {
          prophetId: savedProphet.id,
          questionText: question.question,
          order: index + 1,
          choices: [0, 1, 2, 3].map(choiceIndex => ({
            choiceText: question.options[choiceIndex] ?? "",
            isCorrect: choiceIndex === correctAnswerIndex,
          })),
        };

        if (selected.isNew) {
          await questionService.createQuestion(questionPayload);
        } else if (question.id > 0) {
          await questionService.updateQuestion(question.id, questionPayload);
        } else {
          await questionService.createQuestion(questionPayload);
        }
      }

      toast.success("تم حفظ النبي والأسئلة بنجاح");
      await refresh();
      setSelectedId(savedProphet.id);
    } catch (error) {
      toast.error(getBackendErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedProphet = async () => {
    if (!selected) return;
    if (!confirm("هل تريد حذف هذا النبي؟")) return;

    if (selected.isNew) {
      setRows(prev => prev.filter(row => row.id !== selected.id));
      setSelectedId(rows.find(row => row.id !== selected.id)?.id ?? 0);
      return;
    }

    try {
      await prophetService.deleteProphet(selected.id);
      toast.success("تم حذف النبي");
      await refresh();
    } catch {
      toast.error("تعذر حذف النبي");
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    onPage("login");
  };

  if (loading && rows.length === 0) {
    return <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }} className="admin-shell min-h-screen bg-background p-6 text-muted-foreground">جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }} className="admin-shell min-h-screen bg-background">
      <header className="admin-topbar sticky top-0 z-40 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="فريق القديس جيروم" className="admin-logo" />
            <div>
              <p className="admin-kicker">لوحة التحكم</p>
              <h1 className="admin-title">الأدمن</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-logout-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-black">إدارة الأنبياء</h1>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-5">
          <div className="admin-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <button
                onClick={addProphet}
                className="admin-primary-button w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
              >
                <PlusCircle size={16} />
                إضافة نبي
              </button>
            </div>
            {rows.length === 0 && <div className="p-4 text-sm text-muted-foreground">لا توجد بيانات حالياً.</div>}
            {rows.map(row => (
              <button
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className={`w-full flex items-center gap-3 p-4 text-right border-b border-border last:border-0 transition-colors ${
                  selected.id === row.id ? "bg-green-50" : "hover:bg-muted"
                }`}
              >
                <img src={row.imagePath} alt={row.name} onError={applyImageFallback} className="w-12 h-12 rounded-xl object-cover" />
                <span className="font-bold text-sm">{row.name}</span>
              </button>
            ))}
          </div>

          <section className="admin-card rounded-2xl p-5 space-y-6">
            {selected && (
            <>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">اسم النبي</label>
                <input
                  value={selected.name}
                  onChange={event => updateSelected({ name: event.target.value })}
                  className="admin-input"
                  placeholder="اسم النبي"
                />
              </div>
              <div>
                <label className="admin-label">الشاهد</label>
                <input
                  value={selected.bibleReference}
                  onChange={event => updateSelected({ bibleReference: event.target.value })}
                  className="admin-input"
                  placeholder="مثال: تكوين 6-9"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">الصورة</label>
                <label className="admin-upload-box">
                  <Image size={18} />
                  <span>{selected.imageName || "ارفع صورة للنبي"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={event => uploadSelectedImage(event.target.files?.[0])}
                  />
                </label>
              </div>
              <div>
                <label className="admin-label">الفيديو</label>
                <label className="admin-upload-box">
                  <Upload size={18} />
                  <span>{selected.videoName || "ارفع فيديو القصة"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={event => uploadSelectedVideo(event.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            {selected.bibleReference.trim() && (
              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground flex items-center gap-2">
                <BookOpen size={18} className="text-green-700" />
                <span className="font-bold text-foreground">الشاهد:</span>
                <span>{selected.bibleReference}</span>
              </div>
            )}

            <div>
              <label className="admin-label">وصف النبي</label>
              <textarea
                value={selected.description}
                onChange={event => updateSelected({ description: event.target.value })}
                className="admin-input admin-textarea"
                placeholder="اكتب وصفاً مختصراً عن النبي والقصة..."
              />
            </div>

            <div className="rounded-2xl border border-border overflow-hidden bg-muted/20">
              <div className="relative aspect-video bg-black flex items-center justify-center text-white">
                {selected.videoPath ? (
                  <video
                    key={selected.videoPath}
                    src={selected.videoPath}
                    poster={selected.imagePath}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <>
                    {selected.imagePath && <img src={selected.imagePath} alt={selected.name} onError={applyImageFallback} className="absolute inset-0 w-full h-full object-cover opacity-55" />}
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="relative z-10 flex items-center gap-2 text-sm">
                      <Video size={18} />
                      {selected.videoName || "لا يوجد فيديو مرفوع"}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-lg">الأسئلة</h2>
                <button
                  onClick={addQuestion}
                  className="admin-primary-button inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90"
                >
                  <PlusCircle size={16} />
                  إضافة سؤال
                </button>
              </div>

              {selected.questions.map((question, questionIndex) => (
                <div key={question.id} className="rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="admin-label mb-0">السؤال {questionIndex + 1}</label>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                  <input
                    value={question.question}
                    onChange={event => updateQuestion(question.id, { question: event.target.value })}
                    className="admin-input"
                    placeholder="نص السؤال"
                  />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        value={option}
                        onChange={event => updateOption(question.id, optionIndex, event.target.value)}
                        className="admin-input"
                        placeholder={`الاختيار ${optionIndex + 1}`}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="admin-label">الإجابة الصحيحة</label>
                    <select
                      value={question.answerIndex}
                      onChange={event => updateQuestion(question.id, { answerIndex: Number(event.target.value) })}
                      className="admin-input"
                    >
                      {question.options.map((_, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>الاختيار {optionIndex + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button onClick={deleteSelectedProphet} className="p-2 rounded-xl hover:bg-red-50 transition-colors ml-3">
                <Trash2 size={16} className="text-red-500" />
              </button>
              <button onClick={saveSelected} disabled={saving} className="admin-warning-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90">
                <Save size={16} />
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </div>
            </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
