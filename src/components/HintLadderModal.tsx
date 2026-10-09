import React from 'react';
import { Lightbulb, X, HelpCircle, BookOpen, Footprints, Layers, ArrowRight } from 'lucide-react';

interface HintLadderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHintLevel: number;
  onRequestHint: (level: number, message: string) => void;
}

export const HintLadderModal: React.FC<HintLadderModalProps> = ({
  isOpen,
  onClose,
  currentHintLevel,
  onRequestHint,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      level: 1,
      title: 'Hint 1: Guiding Question',
      desc: 'Prompts you with a thoughtful question to unlock your own intuition.',
      icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
      prompt: "I'm stuck on this step. Can you give me Hint 1 (a guiding question)?",
    },
    {
      level: 2,
      title: 'Hint 2: Relevant Concept or Formula',
      desc: 'Points to the core law, equation, or definition without giving away how to apply it.',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      prompt: "I'm still stuck. Can you give me Hint 2 (point to the relevant concept or formula)?",
    },
    {
      level: 3,
      title: 'Hint 3: First Step Only',
      desc: 'Shows just the very first move to break the problem down, leaving the rest to you.',
      icon: <Footprints className="w-5 h-5 text-emerald-500" />,
      prompt: "I'm still stuck. Can you give me Hint 3 (show the first step only)?",
    },
    {
      level: 4,
      title: 'Hint 4: Worked Example of Similar Problem',
      desc: 'Demonstrates a complete solution to a parallel, similar problem so you can follow the logic.',
      icon: <Layers className="w-5 h-5 text-purple-500" />,
      prompt: "I'm still stuck. Can you give me Hint 4 (a worked example of a similar problem)?",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Socratic Hint Ladder
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stuck? Escalate gradually one step at a time!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info banner */}
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-300">
          <strong>The Socratic Rule:</strong> We never give away the answer directly. Each step gives just enough light for you to take the next step yourself.
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          {steps.map((step) => {
            const isCurrent = currentHintLevel === step.level;
            const isPassed = currentHintLevel > step.level;

            return (
              <div
                key={step.level}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{step.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {step.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRequestHint(step.level, step.prompt);
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                >
                  <span>Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            I'll try on my own first
          </button>
        </div>
      </div>
    </div>
  );
};
