import api from "../api/axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/api";
import { setStoredUser, setToken } from "../utils/storage";

function normalizeAuthResponse(data: any): AuthResponse {
  const token = data?.token ?? data?.Token ?? data?.jwt ?? data?.Jwt ?? "";
  const userSource = data?.user ?? data?.User ?? data;
  const user = {
    id: Number(userSource?.id ?? userSource?.Id ?? 0) || undefined,
    fullName: userSource?.fullName ?? userSource?.FullName ?? "",
    email: userSource?.email ?? userSource?.Email ?? "",
    role: userSource?.role ?? userSource?.Role ?? "Student",
  };

  return { token, user };
}

function persistAuth(data: any) {
  const auth = normalizeAuthResponse(data);
  if (auth.token) setToken(auth.token);
  setStoredUser(auth.user);
  return auth;
}

export async function login(payload: LoginRequest) {
  const { data } = await api.post("/Auth/login", payload);
  return persistAuth(data);
}

export async function register(payload: RegisterRequest) {
  const { data } = await api.post("/Auth/register", payload);
  return persistAuth(data);
}
