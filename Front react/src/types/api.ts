export type UserRole = "Admin" | "Student" | string;

export interface AuthUser {
  id?: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export interface Prophet {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  videoPath: string;
  bibleReference: string;
  duration: string;
  image?: string;
  video?: string;
}

export interface ProphetFormValues {
  name: string;
  description: string;
  bibleReference: string;
  duration: string;
  image?: File | string | null;
  video?: File | string | null;
}

export interface QuestionChoice {
  id?: number;
  choiceText: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  prophetId: number;
  questionText: string;
  order: number;
  choices: QuestionChoice[];
}

export interface QuestionPayload {
  prophetId: number;
  questionText: string;
  order: number;
  choices: QuestionChoice[];
}

export interface UploadResponse {
  url: string;
}
