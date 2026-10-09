// Types for the Asisten Kaji Kitab application

import type { AiProviderStatus } from './ai-provider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string; // Base64 image data
  imagePreview?: string; // Thumbnail preview URL
  arabicText?: string; // OCR result or Arabic text
  sources?: KitabSource[];
  isOcr?: boolean;
  isLoading?: boolean;
}

export interface KitabSource {
  kitabName: string;
  bab: string;
  halaman: string;
  snippet?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'txt';
  size: string;
  uploadedAt: Date;
  status: 'indexing' | 'indexed' | 'error';
  pages?: number;
  category?: string;
}

export interface QuranVerse {
  surah: number;
  surahName: string;
  surahNameAr: string;
  ayah: number;
  textAr: string;
  textId: string;
  juz?: number;
}

export interface HafalanQuestion {
  id: string;
  type: 'sambung-ayat' | 'tebak-surah' | 'isi-lanjutan';
  questionAr: string;
  questionId: string;
  options?: string[];
  correctAnswer: string;
  correctAnswerAr?: string;
  surahName: string;
  ayahRange: string;
  explanation?: string;
}

export interface HafalanSession {
  id: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  currentQuestion: HafalanQuestion | null;
  isActive: boolean;
  startedAt: Date;
}

export interface ChatApiRequest {
  message: string;
  image?: string; // Base64
  conversationHistory?: { role: string; content: string }[];
}

export interface ChatApiResponse {
  reply: string;
  arabicText?: string;
  sources?: KitabSource[];
  isOcr?: boolean;
  aiStatus?: AiProviderStatus;
}

export type ActiveModule = 'kaji-kitab' | 'hafalan' | 'upload';

// ─── RAG Types ───────────────────────────────────────────────────────────────
export interface RagDocument {
  docId: string;
  name: string;
  uploadedAt: string;
  nChunks: number;
}
