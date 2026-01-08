
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
}

export type QuizType = '12_questions' | '18_questions';

export interface Quiz {
  id: string;
  title: string;
  categoryId: string;
  type: QuizType;
  timeLimit: number; // in minutes
  createdAt: number;
  // Part 1: Multiple Choice Answers (A, B, C, D)
  multipleChoiceAnswers: string[]; 
  // Part 2: True/False Answers (Each question has 4 booleans)
  trueFalseAnswers: boolean[][]; 
  // Part 3: Short Answers
  shortAnswers: string[]; 
}

export interface Submission {
  id: string;
  quizId: string;
  userId: string;
  username: string;
  score: number;
  timestamp: number;
  answers: {
    multipleChoice: string[];
    trueFalse: boolean[][];
    short: string[];
  };
}

export interface AppState {
  currentUser: User | null;
  quizzes: Quiz[];
  categories: QuizCategory[];
  submissions: Submission[];
  users: User[];
}
