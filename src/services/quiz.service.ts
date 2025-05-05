// src/services/quiz.service.ts
import apiHelper from './apiHelper';

// --- Kiểu dữ liệu (Ví dụ) ---
interface QuizAttempt {
  AttemptID: number;
  LessonID: number;
  AccountID: number;
  StartedAt: string;
  CompletedAt?: string | null;
  Score?: number | null;
  IsPassed?: boolean | null;
  AttemptNumber: number;
}

interface QuizQuestionPublic {
  // Câu hỏi cho student (ko có đáp án đúng)
  QuestionID: number;
  QuestionText: string;
  QuestionOrder: number;
  options: { OptionID: number; OptionText: string; OptionOrder: number }[];
}

interface StartQuizResponse {
  attempt: QuizAttempt;
  questions: QuizQuestionPublic[];
}

interface SubmitAnswer {
  questionId: number;
  selectedOptionId: number | null;
}

interface QuizAttemptResultDetail {
  AttemptAnswerID: number;
  QuestionID: number;
  QuestionText: string;
  Explanation?: string | null;
  QuestionOrder: number;
  SelectedOptionID: number | null;
  SelectedOptionText?: string | null;
  IsCorrect: boolean | null;
  CorrectOptionID: number;
  CorrectOptionText: string;
}

interface QuizAttemptResultResponse {
  attempt: QuizAttempt;
  details: QuizAttemptResultDetail[];
}

interface AttemptHistory {
  AttemptID: number;
  CompletedAt?: string | null;
  Score?: number | null;
  IsPassed?: boolean | null;
  AttemptNumber: number;
}

interface QuizHistoryResponse {
  history: AttemptHistory[];
}

// --- Student APIs ---

/** Bắt đầu lượt làm quiz */
export const startQuizAttempt = async (
  lessonId: number
): Promise<StartQuizResponse> => {
  return apiHelper.post(`/quizzes/lessons/${lessonId}/start`);
};

/** Nộp bài làm quiz */
export const submitQuizAttempt = async (
  attemptId: number,
  answers: SubmitAnswer[]
): Promise<QuizAttemptResultResponse> => {
  return apiHelper.post(`/quizzes/attempts/${attemptId}/submit`, { answers });
};

/** Xem kết quả chi tiết */
export const getQuizAttemptResult = async (
  attemptId: number
): Promise<QuizAttemptResultResponse> => {
  return apiHelper.get(`/quizzes/attempts/${attemptId}/result`);
};

/** Xem lịch sử làm bài */
export const getQuizAttemptHistory = async (
  lessonId: number
): Promise<QuizHistoryResponse> => {
  return apiHelper.get(`/quizzes/lessons/${lessonId}/history`);
};
