import api from "../api/axios";
import type { UploadResponse } from "../types/api";

async function upload(path: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<UploadResponse>(path, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export function uploadImage(file: File) {
  return upload("/Upload/image", file);
}

export function uploadVideo(file: File) {
  return upload("/Upload/video", file);
}
