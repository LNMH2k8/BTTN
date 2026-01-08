
import { QuizType } from './types';

export const LOCAL_STORAGE_KEY = 'quiz_platform_state';

export const SCORING = {
  MULTIPLE_CHOICE: 0.25,
  TF_MAP: {
    0: 0,
    1: 0.1,
    2: 0.25,
    3: 0.5,
    4: 1.0
  } as Record<number, number>,
  SHORT_ANSWER: (type: QuizType) => (type === '18_questions' ? 0.25 : 0.5)
};

export const INITIAL_DATA = {
  CATEGORIES: [
    { id: 'math', name: 'TOÁN HỌC' },
    { id: 'physics', name: 'VẬT LÝ' }
  ],
  ADMIN: { id: 'admin-1', username: 'admin', role: 'admin', password: '123' }
};

export const calculateScore = (
  type: QuizType,
  userAnswers: { mc: string[], tf: boolean[][], short: string[] },
  correctAnswers: { mc: string[], tf: boolean[][], short: string[] }
): number => {
  let total = 0;

  // 1. Multiple Choice
  userAnswers.mc.forEach((ans, idx) => {
    if (ans === correctAnswers.mc[idx]) total += SCORING.MULTIPLE_CHOICE;
  });

  // 2. True/False
  userAnswers.tf.forEach((qSet, qIdx) => {
    let correctInSet = 0;
    qSet.forEach((ans, subIdx) => {
      if (ans === correctAnswers.tf[qIdx][subIdx]) correctInSet++;
    });
    total += SCORING.TF_MAP[correctInSet] || 0;
  });

  // 3. Short Answer
  const shortValue = SCORING.SHORT_ANSWER(type);
  userAnswers.short.forEach((ans, idx) => {
    if (ans?.trim().toLowerCase() === correctAnswers.short[idx]?.trim().toLowerCase()) {
      total += shortValue;
    }
  });

  return Math.min(10, Number(total.toFixed(2)));
};
