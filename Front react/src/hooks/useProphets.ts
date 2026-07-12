import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as prophetService from "../services/prophetService";
import type { Prophet } from "../types/api";

export function useProphets(autoLoad = true) {
  const [prophets, setProphets] = useState<Prophet[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await prophetService.getProphets();
      setProphets(data);
      return data;
    } catch (err) {
      setError("تعذر تحميل قصص الأنبياء");
      toast.error("تعذر تحميل قصص الأنبياء");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      refresh().catch(() => undefined);
    }
  }, [autoLoad, refresh]);

  return { prophets, setProphets, loading, error, refresh };
}

export function useProphet(id?: number) {
  const [prophet, setProphet] = useState<Prophet | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    prophetService.getProphet(id)
      .then(setProphet)
      .catch(() => {
        setError("تعذر تحميل القصة");
        toast.error("تعذر تحميل القصة");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { prophet, loading, error };
}
