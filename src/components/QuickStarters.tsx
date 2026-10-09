import React from 'react';
import {
  Atom,
  Binary,
  Calculator,
  Compass,
  Dna,
  Landmark,
  TrendingUp,
  FlaskConical,
  Sparkles,
} from 'lucide-react';

interface QuickStartersProps {
  onSelectTopic: (topic: string, promptText: string) => void;
}

export const QuickStarters: React.FC<QuickStartersProps> = ({ onSelectTopic }) => {
  const starterSubjects = [
    {
      subject: 'Physics',
      topic: "Newton's 2nd Law of Motion (F=ma)",
      icon: <Atom className="w-5 h-5 text-indigo-500" />,
      tag: 'STEM',
      question: "I'd like to learn Newton's 2nd Law of Motion (F=ma).",
    },
    {
      subject: 'Math & Algebra',
      topic: 'Solving Quadratic Equations',
      icon: <Calculator className="w-5 h-5 text-blue-500" />,
      tag: 'STEM',
      question: 'Can we study how to solve Quadratic Equations using factoring or the formula?',
    },
    {
      subject: 'Biology',
      topic: 'Photosynthesis & Light Reactions',
      icon: <Dna className="w-5 h-5 text-emerald-500" />,
      tag: 'Life Sciences',
      question: "I'm studying Photosynthesis and how plants convert sunlight to chemical energy.",
    },
    {
      subject: 'Computer Science',
      topic: 'Recursion & Base Cases',
      icon: <Binary className="w-5 h-5 text-purple-500" />,
      tag: 'Coding',
      question: 'Help me understand how recursive functions work and why base cases matter.',
    },
    {
      subject: 'Chemistry',
      topic: 'Balancing Chemical Equations',
      icon: <FlaskConical className="w-5 h-5 text-amber-500" />,
      tag: 'STEM',
      question: 'I want to master balancing chemical equations and conservation of mass.',
    },
    {
      subject: 'Economics',
      topic: 'Supply, Demand & Equilibrium',
      icon: <TrendingUp className="w-5 h-5 text-rose-500" />,
      tag: 'Social Science',
      question: 'Help me understand market equilibrium and what happens when demand shifts.',
    },
  ];

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Socratic Method in Action</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What would you like to explore today?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          StudyBuddy won't just dump answers on you. We'll diagnose what you already know, explain with concrete analogies, and guide you step-by-step.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {starterSubjects.map((item) => (
          <button
            key={item.topic}
            onClick={() => onSelectTopic(item.topic, item.question)}
            className="group text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {item.tag}
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                {item.subject}
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.topic}
              </h3>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span>Start Socratic diagnosis</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-amber-50/80 dark:from-slate-800/60 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
            Have a specific homework question or topic?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Type it in the chat box below! Tell us what you're working on and your current hunch.
          </p>
        </div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          💡 1 concept at a time
        </div>
      </div>
    </div>
  );
};
