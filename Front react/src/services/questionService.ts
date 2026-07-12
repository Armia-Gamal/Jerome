import api from "../api/axios";
import type { Question, QuestionPayload } from "../types/api";

function normalizeQuestion(data: any): Question {
  const choices = data?.choices ?? data?.Choices ?? [];
  return {
    id: Number(data?.id ?? data?.Id ?? 0),
    prophetId: Number(data?.prophetId ?? data?.ProphetId ?? 0),
    questionText: data?.questionText ?? data?.QuestionText ?? data?.question ?? data?.Question ?? "",
    order: Number(data?.order ?? data?.Order ?? 0),
    choices: choices.map((choice: any) => ({
      id: choice?.id ?? choice?.Id,
      choiceText: choice?.choiceText ?? choice?.ChoiceText ?? "",
      isCorrect: Boolean(choice?.isCorrect ?? choice?.IsCorrect),
    })),
  };
}

export async function getQuestions(prophetId: number) {
  const { data } = await api.get(`/Question/${prophetId}`);
  const items = Array.isArray(data) ? data : data?.items ?? data?.Items ?? [];
  return items.map(normalizeQuestion);
}

export async function createQuestion(payload: QuestionPayload) {
  const { data } = await api.post("/Question", payload);
  return normalizeQuestion(data);
}

export async function updateQuestion(id: number, payload: QuestionPayload) {
  const { data } = await api.put(`/Question/${id}`, payload);
  return normalizeQuestion(data);
}

export async function deleteQuestion(id: number) {
  await api.delete(`/Question/${id}`);
}
