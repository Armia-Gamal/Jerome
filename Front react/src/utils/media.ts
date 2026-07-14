import type { SyntheticEvent } from "react";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const configuredApiOrigin = import.meta.env.VITE_API_ORIGIN as string | undefined;
const DEFAULT_API_ORIGIN = "https://jeromee.runasp.net";

export const API_BASE_URL = configuredApiBaseUrl
  ? normalizeBaseUrl(configuredApiBaseUrl)
  : "/api";

export const API_ORIGIN = normalizeBaseUrl(
  configuredApiOrigin ??
    (configuredApiBaseUrl?.replace(/\/api\/?$/i, "") || DEFAULT_API_ORIGIN),
);

const IMAGE_PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNGQ0Y5RkMiLz48cGF0aCBkPSJNMzAgNzZsMTUtMTUgMTAgMTAgMTUtMTVMMTAwIDg2SDIwWiIgZmlsbD0iI0Q0Q0VEMCIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjExIiBmaWxsPSIjRFdEIi8+PC9zdmc+';

const MEDIA_PATH_KEYS = new Set(["imagePath", "videoPath", "ImagePath", "VideoPath"]);
const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//i;
const isPlainObject = (value: unknown) => Object.prototype.toString.call(value) === "[object Object]";

export function getFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;
  if (ABSOLUTE_HTTP_URL_PATTERN.test(path)) {
    return path.replace(/^http:\/\/jeromee\.runasp\.net/i, DEFAULT_API_ORIGIN);
  }
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalizeApiMediaPaths<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => normalizeApiMediaPaths(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const normalized = Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, item]) => {
    acc[key] = MEDIA_PATH_KEYS.has(key) && typeof item === "string"
      ? getFileUrl(item)
      : normalizeApiMediaPaths(item);

    return acc;
  }, {});

  return normalized as T;
}

export function applyImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.placeholderApplied === "true") return;
  image.dataset.placeholderApplied = "true";
  image.src = IMAGE_PLACEHOLDER_SRC;
}
