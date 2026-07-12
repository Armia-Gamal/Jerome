import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as questionService from "../services/questionService";
import type { Question } from "../types/api";

export function useQuestions(prophetId?: number, autoLoad = true) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(Boolean(prophetId && autoLoad));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!prophetId) return [];

    setLoading(true);
    setError(null);
    try {
      const data = await questionService.getQuestions(prophetId);
      setQuestions(data);
      return data;
    } catch (err) {
      setError("تعذر تحميل أسئلة الاختبار");
      toast.error("تعذر تحميل أسئلة الاختبار");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [prophetId]);

  useEffect(() => {
    if (autoLoad && prophetId) {
      refresh().catch(() => undefined);
    }
  }, [autoLoad, prophetId, refresh]);

  return { questions, setQuestions, loading, error, refresh };
}
