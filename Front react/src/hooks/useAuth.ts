import { useCallback, useState } from "react";
import { toast } from "sonner";
import * as authService from "../services/authService";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/api";
import { clearAuthStorage, getStoredUser, getToken } from "../utils/storage";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const isAuthenticated = Boolean(getToken());

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const auth = await authService.login(payload);
      setUser(auth.user);
      toast.success("تم تسجيل الدخول بنجاح");
      return auth;
    } catch (error) {
      toast.error("فشل تسجيل الدخول. تأكد من البريد وكلمة المرور.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    try {
      const auth = await authService.register(payload);
      setUser(auth.user);
      toast.success("تم إنشاء الحساب بنجاح");
      return auth;
    } catch (error) {
      toast.error("تعذر إنشاء الحساب. حاول مرة أخرى.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  return { user, loading, isAuthenticated, login, register, logout };
}
