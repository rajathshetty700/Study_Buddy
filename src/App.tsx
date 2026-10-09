import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  HelpCircle,
  Target,
  RefreshCw,
  Mic,
  MicOff,
  BookOpen,
  ArrowUp,
  FileQuestion,
  GraduationCap,
  Volume2,
} from 'lucide-react';
import { Header } from './components/Header';
import { SocraticMessage } from './components/SocraticMessage';
import { QuickStarters } from './components/QuickStarters';
import { HintLadderModal } from './components/HintLadderModal';
import { QuizBar } from './components/QuizBar';
import { StudyNotebook } from './components/StudyNotebook';
import {
  ChatMessage,
  StudentLevel,
  SessionStep,
  QuizState,
  SavedNote,
} from './types';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('BEGINNER');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentStep, setCurrentStep] = useState<SessionStep>('DIAGNOSE');
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    questionIndex: 1,
    totalQuestions: 5,
    completed: false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Load saved notes and scratchpad from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('studybuddy_notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      const savedScratch = localStorage.getItem('studybuddy_scratchpad');
      if (savedScratch) {
        setScratchpadText(savedScratch);
      }
    } catch (e) {
      console.error('Error loading stored notes:', e);
    }
  }, []);

  // Save notes to localStorage
  const handleSaveNotes = (updatedNotes: SavedNote[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem('studybuddy_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.error('Error saving notes:', e);
    }
  };

  const handleUpdateScratchpad = (text: string) => {
    setScratchpadText(text);
    try {
      localStorage.setItem('studybuddy_scratchpad', text);
    } catch (e) {
      console.error('Error saving scratchpad:', e);
    }
  };

  const handleAddNote = (title: string, content: string) => {
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      createdAt: Date.now(),
    };
    handleSaveNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    handleSaveNotes(notes.filter((n) => n.id !== id));
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Text-To-Speech helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text) return;

    // Remove markdown symbols for cleaner speech
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  };

  // Socratic Step Tracker update
  const advanceSocraticStep = (reply: string, isQuiz: boolean) => {
    if (isQuiz) {
      return;
    }

    const lower = reply.toLowerCase();
    // After 4-5 questions, offer Step 5 Recap
    if (questionCount >= 4 || lower.includes('recap') || lower.includes('switch topic')) {
      setCurrentStep('RECAP');
    } else if (lower.includes('what do you know') || lower.includes('what have you learned') || lower.includes('familiar with')) {
      setCurrentStep('DIAGNOSE');
    } else if (lower.includes('concept') || lower.includes('imagine') || lower.includes('think of')) {
      setCurrentStep('TEACH');
    } else if (lower.includes('your turn') || lower.includes('can you tell me') || lower.includes('how would you')) {
      setCurrentStep('CHECK');
    } else {
      setCurrentStep('RESPOND');
    }
  };

  // Evaluate student answer signals to adjust internal difficulty level
  const adjustDifficultyFromResponse = (studentInput: string, tutorReply: string) => {
    const lowerReply = tutorReply.toLowerCase();
    const isPraise =
      lowerReply.includes('great job') ||
      lowerReply.includes('exactly') ||
      lowerReply.includes('spot on') ||
      lowerReply.includes('brilliant') ||
      lowerReply.includes('well done') ||
      lowerReply.includes('bingo') ||
      lowerReply.includes('you nailed it') ||
      lowerReply.includes('correct!');

    const isMisunderstanding =
      lowerReply.includes('not quite') ||
      lowerReply.includes('almost') ||
      lowerReply.includes('let\'s rethink') ||
      lowerReply.includes('take another look') ||
      lowerReply.includes('notice that') ||
      lowerReply.includes('close, but');

    if (isPraise) {
      const newConsecutiveCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutiveCorrect);
      setConsecutiveWrong(0);
      setStreak((s) => s + 1);

      // Rule: 2 correct answers in a row -> move up one level
      if (newConsecutiveCorrect >= 2) {
        if (studentLevel === 'BEGINNER') {
          setStudentLevel('INTERMEDIATE');
          setConsecutiveCorrect(0);
        } else if (studentLevel === 'INTERMEDIATE') {
          setStudentLevel('ADVANCED');
          setConsecutiveCorrect(0);
        }
      }
    } else if (isMisunderstanding) {
      const newConsecutiveWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newConsecutiveWrong);
      setConsecutiveCorrect(0);
      setStreak(0);

      // Rule: 2 wrong answers in a row -> move down one level and re-explain with a new analogy
      if (newConsecutiveWrong >= 2) {
        if (studentLevel === 'ADVANCED') {
          setStudentLevel('INTERMEDIATE');
          setConsecutiveWrong(0);
        } else if (studentLevel === 'INTERMEDIATE') {
          setStudentLevel('BEGINNER');
          setConsecutiveWrong(0);
        }
      }
    }
  };

  // Send message to server
  const sendMessage = async (
    textToSend: string,
    overrideHintLevel?: number,
    isExplicitTopic?: string
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const lower = trimmed.toLowerCase();
    const isQuizTrigger = lower === 'quiz me' || lower.includes('quiz me');

    // Update Quiz Mode state
    let updatedQuiz = { ...quizState };
    if (isQuizTrigger) {
      updatedQuiz = {
        isActive: true,
        questionIndex: 1,
        totalQuestions: 5,
        completed: false,
      };
      setQuizState(updatedQuiz);
    } else if (quizState.isActive && !quizState.completed) {
      // Progress quiz question count
      if (quizState.questionIndex < 5) {
        updatedQuiz = {
          ...quizState,
          questionIndex: quizState.questionIndex + 1,
        };
        setQuizState(updatedQuiz);
      } else {
        updatedQuiz = {
          ...quizState,
          completed: true,
          isActive: false,
        };
        setQuizState(updatedQuiz);
      }
    }

    const currentHint = overrideHintLevel !== undefined ? overrideHintLevel : currentHintLevel;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      levelAtTime: studentLevel,
      hintLevel: currentHint > 0 ? currentHint : undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    const activeTopic = isExplicitTopic || topic;
    if (isExplicitTopic && !topic) {
      setTopic(isExplicitTopic);
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          studentLevel,
          consecutiveCorrect,
          consecutiveWrong,
          questionCount: questionCount + 1,
          quizMode: updatedQuiz.isActive,
          quizQuestionIndex: updatedQuiz.questionIndex,
          activeHintLevel: currentHint,
          topic: activeTopic,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || '';

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: Date.now(),
        levelAtTime: studentLevel,
      };

      setMessages((prev) => [...prev, modelMsg]);
      setQuestionCount((c) => c + 1);

      // Adjust difficulty tracking & step progression
      adjustDifficultyFromResponse(trimmed, reply);
      advanceSocraticStep(reply, updatedQuiz.isActive);

      // If audio is enabled, read it aloud
      if (audioEnabled) {
        speakText(reply);
      }

      // Reset hint ladder level after receiving guidance
      if (overrideHintLevel) {
        setCurrentHintLevel(0);
      }
    } catch (err: any) {
      console.error('Error sending message to tutor:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `**Concept / Feedback:** I ran into a temporary connection issue while thinking through your question.\n\n**Hint or Example:** Please check your internet or try asking again in a moment.\n\n**Your turn:** Would you like to repeat your last response or try a simpler question?`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSelectStarter = (selectedTopic: string, promptQuestion: string) => {
    setTopic(selectedTopic);
    sendMessage(promptQuestion, undefined, selectedTopic);
  };

  const handleTriggerHint = (hintLevel: number, hintPrompt: string) => {
    setCurrentHintLevel(hintLevel);
    sendMessage(hintPrompt, hintLevel);
  };

  const handleResetSession = () => {
    if (messages.length > 0) {
      const confirmReset = window.confirm(
        'Start a fresh tutoring session? Your saved notes will remain safe in your Notebook.'
      );
      if (!confirmReset) return;
    }
    setMessages([]);
    setTopic('');
    setQuestionCount(0);
    setConsecutiveCorrect(0);
    setConsecutiveWrong(0);
    setStreak(0);
    setCurrentStep('DIAGNOSE');
    setCurrentHintLevel(0);
    setQuizState({
      isActive: false,
      questionIndex: 1,
      totalQuestions: 5,
      completed: false,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <Header
        topic={topic}
        studentLevel={studentLevel}
        currentStep={currentStep}
        questionCount={questionCount}
        streak={streak}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onResetSession={handleResetSession}
        onOpenHintModal={() => setIsHintModalOpen(true)}
        notesCount={notes.length}
      />

      {/* Active Quiz Banner */}
      <QuizBar
        quizState={quizState}
        onExitQuiz={() =>
          setQuizState({
            isActive: false,
            questionIndex: 1,
            totalQuestions: 5,
            completed: false,
          })
        }
      />

      {/* Main Chat Workspace */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <QuickStarters onSelectTopic={handleSelectStarter} />
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <SocraticMessage
                  key={msg.id}
                  message={msg}
                  isLatest={idx === messages.length - 1 && msg.role === 'model'}
                  onSelectPrompt={(text) => sendMessage(text)}
                  onSaveToNotes={(title, text) => handleAddNote(title, text)}
                  onPlayAudio={(text) => speakText(text)}
                  onTriggerHint={() => setIsHintModalOpen(true)}
                />
              ))}

              {/* Tutor Thinking Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 my-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
                    <span>StudyBuddy is preparing the next guiding question & hint...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Input Area */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Quick Helper Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setIsHintModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Hint Ladder</span>
            </button>

            <button
              onClick={() => sendMessage('quiz me')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0"
            >
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>Quiz Me</span>
            </button>

            <button
              onClick={() => setInputText((prev) => (prev ? `${prev} I already know that ` : 'I already know that '))}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              title="Rule 2: Socratic tutor always builds on what you already know"
            >
              <span>"I already know..."</span>
            </button>

            <button
              onClick={() => sendMessage('Can you explain with a real-world analogy?')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
            >
              <span>Give Analogy</span>
            </button>

            <button
              onClick={() => sendMessage('Can we recap what we learned so far?')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
            >
              <span>Recap So Far</span>
            </button>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputText);
            }}
            className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
              placeholder={
                quizState.isActive
                  ? `Type your answer for Question ${quizState.questionIndex}...`
                  : 'Answer the question above, state your hunch, or ask for a hint...'
              }
              className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-32 leading-relaxed"
            />

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice input (Speak your answer)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl font-semibold transition-all ${
                inputText.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Send answer to StudyBuddy"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </footer>

      {/* Socratic Hint Ladder Modal */}
      <HintLadderModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        currentHintLevel={currentHintLevel}
        onRequestHint={handleTriggerHint}
      />

      {/* Study Notebook & Scratchpad Drawer */}
      <StudyNotebook
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        notes={notes}
        scratchpadText={scratchpadText}
        onChangeScratchpad={handleUpdateScratchpad}
        onDeleteNote={handleDeleteNote}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
