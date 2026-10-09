export type StudentLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type SessionStep =
  | 'DIAGNOSE'
  | 'TEACH'
  | 'CHECK'
  | 'RESPOND'
  | 'RECAP';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  parsed?: {
    conceptFeedback?: string;
    hintExample?: string;
    yourTurn?: string;
  };
  levelAtTime?: StudentLevel;
  isHint?: boolean;
  hintLevel?: number;
  isQuizQuestion?: boolean;
}

export interface QuizState {
  isActive: boolean;
  questionIndex: number; // 1 to 5
  totalQuestions: number;
  completed: boolean;
  score?: number;
  strengths?: string[];
  weakAreas?: string[];
  revisionTopics?: string[];
}

export interface SessionStats {
  level: StudentLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  totalQuestionsAsked: number;
  totalCorrect: number;
  hintsUsed: number;
  topic: string;
  currentStep: SessionStep;
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}
