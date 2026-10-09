import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Flame,
  Award,
  HelpCircle,
} from 'lucide-react';
import { StudentLevel, SessionStep } from '../types';

interface HeaderProps {
  topic: string;
  studentLevel: StudentLevel;
  currentStep: SessionStep;
  questionCount: number;
  streak: number;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenNotebook: () => void;
  onResetSession: () => void;
  onOpenHintModal: () => void;
  notesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  topic,
  studentLevel,
  currentStep,
  questionCount,
  streak,
  audioEnabled,
  onToggleAudio,
  onOpenNotebook,
  onResetSession,
  onOpenHintModal,
  notesCount,
}) => {
  const getLevelBadge = (level: StudentLevel) => {
    switch (level) {
      case 'ADVANCED':
        return {
          label: 'Advanced',
          badge: 'Scholar',
          bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
        };
      case 'INTERMEDIATE':
        return {
          label: 'Intermediate',
          badge: 'Practitioner',
          bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
        };
      default:
        return {
          label: 'Beginner',
          badge: 'Explorer',
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        };
    }
  };

  const levelInfo = getLevelBadge(studentLevel);

  const stepLabels: Record<SessionStep, { label: string; step: number }> = {
    DIAGNOSE: { label: 'Diagnose', step: 1 },
    TEACH: { label: 'Teach Concept', step: 2 },
    CHECK: { label: 'Check Mastery', step: 3 },
    RESPOND: { label: 'Guiding Feedback', step: 4 },
    RECAP: { label: 'Recap & Next', step: 5 },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Topic */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  StudyBuddy
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  Socratic Tutor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Guiding curiosity with questions, not just answers
              </p>
            </div>
          </div>

          {topic && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 max-w-xs truncate">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{topic}</span>
            </div>
          )}
        </div>

        {/* Center: Socratic Flow & Level Pill */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
          {/* Level Tracker Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${levelInfo.bg}`}
            title="Difficulty adapts automatically: 2 correct answers to level up, 2 wrong to re-explain"
          >
            {levelInfo.icon}
            <span>{levelInfo.label}</span>
            <span className="opacity-60 text-[10px]">({levelInfo.badge})</span>
          </div>

          {/* Socratic Step Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
              {stepLabels[currentStep]?.step || 1}
            </span>
            <span className="font-medium">{stepLabels[currentStep]?.label || 'Active Session'}</span>
          </div>

          {/* Streak count */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-300/40 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
          {/* Hint Ladder Quick Action */}
          <button
            onClick={onOpenHintModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
            title="Explore Socratic Hint Ladder"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Hint Ladder</span>
          </button>

          {/* Audio read-aloud toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              audioEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={audioEnabled ? 'Voice Readout On' : 'Voice Readout Off'}
            aria-label="Toggle speech audio"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notebook & Scratchpad */}
          <button
            onClick={onOpenNotebook}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Open Notes & Scratchpad"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Notes</span>
            {notesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                {notesCount}
              </span>
            )}
          </button>

          {/* Reset / New Session */}
          <button
            onClick={onResetSession}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title="Start New Topic / Reset Session"
            aria-label="Reset session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
