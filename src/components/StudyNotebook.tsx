import React, { useState } from 'react';
import {
  FileText,
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  BookOpen,
  Edit3,
} from 'lucide-react';
import { SavedNote } from '../types';

interface StudyNotebookProps {
  isOpen: boolean;
  onClose: () => void;
  notes: SavedNote[];
  scratchpadText: string;
  onChangeScratchpad: (text: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: (title: string, content: string) => void;
}

export const StudyNotebook: React.FC<StudyNotebookProps> = ({
  isOpen,
  onClose,
  notes,
  scratchpadText,
  onChangeScratchpad,
  onDeleteNote,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'scratchpad'>('scratchpad');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const fullNotesContent = [
      '# StudyBuddy Socratic Session Notes',
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      '## Scratchpad & Rough Work',
      scratchpadText || '(Empty)',
      '',
      '## Saved Concepts & Takeaways',
      ...notes.map((n) => `### ${n.title}\n${n.content}\n`),
    ].join('\n');

    const blob = new Blob([fullNotesContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyBuddy-Notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddNote(newTitle.trim() || 'My Note', newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-slate-900 dark:text-white text-base">
            Study Notebook & Scratchpad
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Export Notes as Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1">
        <button
          onClick={() => setActiveTab('scratchpad')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'scratchpad'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Scratchpad / Rough Work</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Saved Concepts ({notes.length})</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'scratchpad' ? (
          <div className="h-full flex flex-col space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Work out your math equations, partial steps, or draft your answers here before sending to StudyBuddy.
            </div>
            <textarea
              value={scratchpadText}
              onChange={(e) => onChangeScratchpad(e.target.value)}
              placeholder="e.g.:
Step 1: Given m = 5kg, a = 3 m/s²
Formula: F = m * a
Calculation: 5 * 3 = 15 N"
              className="w-full flex-1 min-h-[300px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Add note toggle */}
            {!isAdding ? (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-2 px-3 border border-dashed border-indigo-300 dark:border-indigo-800/80 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Concept Note</span>
              </button>
            ) : (
              <form onSubmit={handleCreateCustomNote} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Note title (e.g. Newton's 2nd Law)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <textarea
                  placeholder="Concept summary or formula..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={3}
                  className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}

            {/* Note items */}
            {notes.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-400 text-xs">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No saved concepts yet.</p>
                <p className="text-[11px] mt-1 text-slate-500">
                  Click the bookmark icon on any StudyBuddy message to save key takeaways here!
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                      {note.title}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(note.id, note.content)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy note"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-500"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
                    {note.content}
                  </p>
                  <span className="text-[10px] text-slate-400 block text-right">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
