import React, { useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
  FileText,
  FileSpreadsheet,
  Square,
  Sparkles,
  Cpu,
  GraduationCap,
  BookOpen,
  Code2,
  Loader2,
} from "lucide-react";
import { ModeType, SyllabusType } from "../types";

interface InputBarProps {
  onSendMessage: (text: string) => void;
  onFilesSelected: (files: FileList | File[]) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  currentMode: ModeType;
  onSelectMode: (mode: ModeType) => void;
  currentSyllabus: SyllabusType;
  hasInputs: boolean;
  isDarkTheme: boolean;
}

export function InputBar({
  onSendMessage,
  onFilesSelected,
  isStreaming,
  onStopStreaming,
  currentMode,
  onSelectMode,
  currentSyllabus,
  hasInputs,
  isDarkTheme,
}: InputBarProps) {
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((inputText.trim().length === 0 && !hasInputs) || isStreaming) return;
    onSendMessage(inputText);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = ""; // reset for re-selection
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
  };

  const quickPrompts: { label: string; mode: ModeType; prompt: string }[] = [
    {
      label: "Explain like Teacher (Paper Tips)",
      mode: "teacher",
      prompt: "Explain this topic like a real teacher with concrete examples, exam paper info, and common traps.",
    },
    {
      label: "Summarize Docs / Slides",
      mode: "summarise",
      prompt: "Please provide a comprehensive, structured summary with slide/section breakdown and key revision points.",
    },
    {
      label: "ESP32 / Arduino Microcontroller Code",
      mode: "microcontroller",
      prompt: "Write complete microcontroller code with hardware pinout wiring diagram and component list.",
    },
    {
      label: "Solve Homework Step-by-Step",
      mode: "homework",
      prompt: "Solve this homework problem step-by-step with all formulas, substitutions, and final units.",
    },
  ];

  return (
    <div
      id="app-input-bar-container"
      className={`border-t transition-colors sticky bottom-0 z-20 backdrop-blur-md ${
        isDarkTheme
          ? "border-zinc-800 bg-[#0a0a0c]/90 text-zinc-100"
          : "border-slate-200/80 bg-white/95 text-slate-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <span className="text-[11px] text-zinc-500 shrink-0 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => {
                onSelectMode(qp.mode);
                setInputText(qp.prompt);
                textareaRef.current?.focus();
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-all"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Main Input Box */}
        <div
          className={`flex items-end gap-2 p-2 rounded-2xl border shadow-sm transition-all focus-within:ring-1 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/60 ${
            isDarkTheme
              ? "bg-zinc-900/90 border-zinc-800"
              : "bg-slate-50/90 border-slate-300"
          }`}
        >
          {/* Hidden File Input (supports multiple file selection for unlimited uploads!) */}
          <input
            id="multi-file-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.docx,.pptx,.txt,.md,.py,.ino,.cpp,.c,.js,.ts,.json,.csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Attach Button */}
          <button
            id="attach-file-button"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 transition-all shrink-0"
            title="Attach unlimited files (Word, PowerPoint, PDF, Images, Videos, Text)"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea Input */}
          <textarea
            id="user-chat-textarea"
            ref={textareaRef}
            value={inputText}
            onChange={handleInputResize}
            onKeyDown={handleKeyDown}
            placeholder={
              hasInputs
                ? "Ask anything about the attached files (e.g. 'Summarize slides', 'Explain like an IGCSE teacher', 'Write code')..."
                : `Ask worktorrney or attach docs, PowerPoint, images, or videos (Enter to send)...`
            }
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm focus:outline-none placeholder:text-zinc-500 text-zinc-100 py-1.5 max-h-[180px] leading-relaxed"
          />

          {/* Send or Stop Button */}
          {isStreaming ? (
            <button
              id="stop-streaming-button"
              type="button"
              onClick={onStopStreaming}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shrink-0 shadow-md transition-all flex items-center gap-1 text-xs"
              title="Stop response generation"
            >
              <Square className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              id="send-message-button"
              type="button"
              disabled={inputText.trim().length === 0 && !hasInputs}
              onClick={handleSubmit}
              className={`p-2 rounded-xl text-white shrink-0 shadow-md transition-all flex items-center justify-center ${
                inputText.trim().length > 0 || hasInputs
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 cursor-pointer"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
              title="Send to worktorrney (Fast Response)"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer info: Unlimited inputs & drag-drop hint */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
          <span className="truncate">
            Drag & drop unlimited Word (.docx), PowerPoint (.pptx), PDFs, videos, images, or text files
          </span>
          <span className="font-mono shrink-0 hidden sm:inline">
            ⚡ Powered by Gemini 3.8 Flash
          </span>
        </div>
      </div>
    </div>
  );
}
