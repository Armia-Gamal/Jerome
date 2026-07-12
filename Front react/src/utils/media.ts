import type { SyntheticEvent } from "react";

const BACKEND_BASE_URL = "https://localhost:7150";

const IMAGE_PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNGQ0Y5RkMiLz48cGF0aCBkPSJNMzAgNzZsMTUtMTUgMTAgMTAgMTUtMTVMMTAwIDg2SDIwWiIgZmlsbD0iI0Q0Q0VEMCIvPjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjExIiBmaWxsPSIjRFdEIi8+PC9zdmc+';

export function getFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function applyImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.placeholderApplied === "true") return;
  image.dataset.placeholderApplied = "true";
  image.src = IMAGE_PLACEHOLDER_SRC;
}