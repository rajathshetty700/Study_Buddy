import React from 'react';
import {
  GraduationCap,
  Lightbulb,
  Target,
  Sparkles,
  Volume2,
  BookmarkPlus,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { parseSocraticResponse } from '../utils/socraticParser';

interface SocraticMessageProps {
  message: ChatMessage;
  isLatest: boolean;
  onSelectPrompt?: (promptText: string) => void;
  onSaveToNotes?: (title: string, text: string) => void;
  onPlayAudio?: (text: string) => void;
  onTriggerHint?: () => void;
}

export const SocraticMessage: React.FC<SocraticMessageProps> = ({
  message,
  isLatest,
  onSelectPrompt,
  onSaveToNotes,
  onPlayAudio,
  onTriggerHint,
}) => {
  const isModel = message.role === 'model';
  const parsed = parseSocraticResponse(message.content);

  // If user message, render as clean conversational bubble
  if (!isModel) {
    return (
      <div className="flex justify-end my-3">
        <div className="max-w-[85%] md:max-w-[70%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm shadow-indigo-600/20 text-sm md:text-base leading-relaxed break-words">
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="text-right text-[10px] text-indigo-200 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  // Model response
  const fullTextToRead = [
    parsed.conceptFeedback,
    parsed.hintExample,
    parsed.yourTurn,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <div className="flex flex-col gap-2 my-4">
      <div className="flex items-start gap-3 max-w-[95%] md:max-w-[85%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
          <GraduationCap className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-3">
          {/* Header info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <span>StudyBuddy</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                Socratic Guide
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onPlayAudio && (
                <button
                  onClick={() => onPlayAudio(fullTextToRead)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Read aloud"
                  aria-label="Listen to explanation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onSaveToNotes && (
                <button
                  onClick={() =>
                    onSaveToNotes(
                      parsed.conceptFeedback ? parsed.conceptFeedback.slice(0, 30) + '...' : 'Concept Note',
                      message.content
                    )
                  }
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Save concept to Notebook"
                  aria-label="Save to notes"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[10px] ml-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Socratic Card 1: Concept / Feedback */}
          {parsed.conceptFeedback && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Concept / Feedback</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {parsed.conceptFeedback}
              </div>
            </div>
          )}

          {/* Socratic Card 2: Hint or Example (if present) */}
          {parsed.hintExample && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Hint & Real-World Example</span>
              </div>
              <div className="text-amber-950 dark:text-amber-200/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {parsed.hintExample}
              </div>
            </div>
          )}

          {/* Socratic Card 3: Your turn (prominent challenge) */}
          {parsed.yourTurn && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Your Turn</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-300/80 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                  1 question to check understanding
                </span>
              </div>

              <div className="text-slate-900 dark:text-slate-100 font-medium text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {parsed.yourTurn}
              </div>
            </div>
          )}

          {/* Raw text fallback if completely unstructured */}
          {!parsed.isStructured && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          )}

          {/* Contextual Quick Assist for the latest turn */}
          {isLatest && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => onSelectPrompt && onSelectPrompt("I'm not sure, could you give me a hint?")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <HelpCircle className="w-3 h-3 text-amber-500" />
                <span>Give me a hint</span>
              </button>

              <button
                onClick={() => onSelectPrompt && onSelectPrompt("Just tell me the answer")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Test rule 5: StudyBuddy will stay supportive and offer a worked example of a similar problem"
              >
                <span>Just tell me the answer</span>
              </button>

              <button
                onClick={() => onSelectPrompt && onSelectPrompt("Can you give me a real-world analogy?")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Need an analogy</span>
              </button>

              <button
                onClick={() => onSelectPrompt && onSelectPrompt("quiz me")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                <Target className="w-3 h-3 text-indigo-500" />
                <span>Quiz me!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
