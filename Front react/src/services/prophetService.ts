import api from "../api/axios";
import type { Prophet, ProphetFormValues } from "../types/api";
import { getFileUrl } from "../utils/media";

function normalizeProphet(data: any): Prophet {
  const imagePath = getFileUrl(data?.imagePath ?? data?.ImagePath ?? data?.image ?? data?.Image ?? data?.imageUrl ?? data?.ImageUrl ?? "");
  const videoPath = getFileUrl(data?.videoPath ?? data?.VideoPath ?? data?.video ?? data?.Video ?? data?.videoUrl ?? data?.VideoUrl ?? "");

  return {
    id: Number(data?.id ?? data?.Id ?? 0),
    name: data?.name ?? data?.Name ?? "",
    description: data?.description ?? data?.Description ?? "",
    imagePath,
    videoPath,
    image: imagePath,
    video: videoPath,
    bibleReference: data?.bibleReference ?? data?.BibleReference ?? "",
    duration: String(data?.duration ?? data?.Duration ?? ""),
  };
}

function toProphetFormData(values: ProphetFormValues) {
  const formData = new FormData();
  formData.append("Name", values.name);
  formData.append("Description", values.description);
  formData.append("BibleReference", values.bibleReference);
  formData.append("Duration", String(values.duration ?? ""));

  if (values.image instanceof File) formData.append("Image", values.image);

  if (values.video instanceof File) formData.append("Video", values.video);

  return formData;
}

export async function getProphets() {
  const { data } = await api.get("/Prophet");
  const items = Array.isArray(data) ? data : data?.items ?? data?.Items ?? [];
  return items.map(normalizeProphet);
}

export async function getProphet(id: number) {
  const { data } = await api.get(`/Prophet/${id}`);
  return normalizeProphet(data);
}

export async function createProphet(values: ProphetFormValues) {
  const { data } = await api.post("/Prophet", toProphetFormData(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeProphet(data);
}

export async function updateProphet(id: number, values: ProphetFormValues) {
  const { data } = await api.put(`/Prophet/${id}`, toProphetFormData(values), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeProphet(data);
}

export async function deleteProphet(id: number) {
  await api.delete(`/Prophet/${id}`);
}
