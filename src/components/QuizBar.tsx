import React from 'react';
import { Target, CheckCircle2, Circle, Trophy, ArrowRight, X } from 'lucide-react';
import { QuizState } from '../types';

interface QuizBarProps {
  quizState: QuizState;
  onExitQuiz: () => void;
}

export const QuizBar: React.FC<QuizBarProps> = ({ quizState, onExitQuiz }) => {
  if (!quizState.isActive && !quizState.completed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-indigo-200 dark:border-indigo-900/50 px-4 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            {quizState.completed ? <Trophy className="w-4 h-4 text-amber-300" /> : <Target className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {quizState.completed ? 'Mini Quiz Completed!' : 'Socratic Mini Quiz'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                {quizState.completed ? 'Finished' : `Question ${quizState.questionIndex} of 5`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {quizState.completed
                ? 'Review your strengths, weaknesses, and revision topics below'
                : '1 question at a time. Answers evaluated as you reply!'}
            </p>
          </div>
        </div>

        {/* Center: 5 Question tracker dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((qNum) => {
            const isDone = qNum < quizState.questionIndex || quizState.completed;
            const isCurrent = qNum === quizState.questionIndex && !quizState.completed;

            return (
              <div
                key={qNum}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 dark:ring-indigo-800 scale-110'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
                title={`Question ${qNum}`}
              >
                {isDone ? '✓' : qNum}
              </div>
            );
          })}
        </div>

        {/* Right: Exit / Close */}
        <button
          onClick={onExitQuiz}
          className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Exit Quiz Mode"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </div>
  );
};
