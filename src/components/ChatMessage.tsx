import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Bot,
  User,
  GraduationCap,
  FileText,
  Cpu,
  Code2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Message } from "../types";
import { SYLLABUS_CATALOG } from "../utils/syllabusData";

interface ChatMessageProps {
  message: Message;
  isDarkTheme: boolean;
}

export function ChatMessage({ message, isDarkTheme }: ChatMessageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isAssistant = message.role === "assistant";
  const syllabusInfo = SYLLABUS_CATALOG[message.syllabus] || SYLLABUS_CATALOG.unspecified;

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadCode = (code: string, language: string) => {
    const extMap: Record<string, string> = {
      cpp: "cpp",
      c: "c",
      arduino: "ino",
      ino: "ino",
      python: "py",
      py: "py",
      javascript: "js",
      js: "js",
      typescript: "ts",
      ts: "ts",
      tsx: "tsx",
      html: "html",
      css: "css",
      json: "json",
    };
    const ext = extMap[language.toLowerCase()] || "txt";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `worktorrney_code_${Date.now()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleanText = message.text
        .replace(/[`*_#>-]/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "")
        .substring(0, 1500); // Read up to first section cleanly

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getModeIcon = () => {
    switch (message.mode) {
      case "teacher":
        return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />;
      case "summarise":
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case "microcontroller":
        return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case "software":
        return <Code2 className="w-3.5 h-3.5 text-purple-400" />;
      case "homework":
        return <BookOpen className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div
      id={`chat-message-${message.id}`}
      className={`py-5 px-4 sm:px-6 transition-colors ${
        isAssistant
          ? isDarkTheme
            ? "bg-[#111114]/60 border-y border-zinc-800/60"
            : "bg-slate-50/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            isAssistant
              ? "bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 text-white shadow-indigo-500/20"
              : "bg-zinc-800 text-zinc-200 border border-zinc-700"
          }`}
        >
          {isAssistant ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>

        {/* Message Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row: Author, Syllabus tag, Mode badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm font-mono tracking-tight text-zinc-100">
                {isAssistant ? "worktorrney AI" : "You"}
              </span>

              {/* Mode badge */}
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                {getModeIcon()}
                <span className="capitalize">{message.mode}</span>
              </span>

              {/* Syllabus badge */}
              {isAssistant && message.syllabus !== "unspecified" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {syllabusInfo.badge}
                </span>
              )}
            </div>

            {/* Read Aloud button for AI explanation */}
            {isAssistant && (
              <button
                onClick={toggleSpeech}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 transition-all"
                title={isSpeaking ? "Stop Voice Explanation" : "Listen to Teacher Read Aloud"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Read Aloud</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Attached inputs pills for user message */}
          {message.inputs && message.inputs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {message.inputs.map((inp) => (
                <span
                  key={inp.id}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center gap-1"
                >
                  <span className="uppercase text-indigo-400 font-semibold">{inp.type}</span>: {inp.name}
                </span>
              ))}
            </div>
          )}

          {/* Render Content */}
          <div className="markdown-body text-xs sm:text-sm leading-relaxed space-y-3 pt-1 text-zinc-200">
            <Markdown
              components={{
                // Custom Code Block with copy, language tag & download
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  const codeString = String(children).replace(/\n$/, "");

                  if (!inline && codeString.includes("\n")) {
                    const blockIndex = Math.random();
                    return (
                      <div className="rounded-xl overflow-hidden border border-zinc-800 my-3 shadow-lg bg-[#0e0e11] text-zinc-100">
                        {/* Header bar for code block */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#141418] border-b border-zinc-800 text-[11px] font-mono">
                          <span className="text-indigo-400 font-bold uppercase tracking-wider">
                            {language || "code"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyCode(codeString, blockIndex as any)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="Copy code to clipboard"
                            >
                              {copiedIndex === (blockIndex as any) ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-[10px] text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="text-[10px]">Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDownloadCode(codeString, language)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="Download code file"
                            >
                              <Download className="w-3 h-3" />
                              <span className="text-[10px]">Save File</span>
                            </button>
                          </div>
                        </div>

                        {/* Fenced Code */}
                        <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0a0a0c]">
                          <code>{codeString}</code>
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded text-[12px] font-mono bg-zinc-900 text-indigo-400 border border-zinc-800"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                // Clean styling for headers
                h1: ({ children }) => (
                  <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-indigo-400 mt-4 mb-2 pb-1 border-b border-zinc-800">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm sm:text-base font-bold font-mono text-indigo-300 mt-3.5 mb-1.5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 mt-2.5 mb-1">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1 my-2 text-zinc-300">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1 my-2 text-zinc-300">{children}</ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-3 py-1 my-2 italic bg-indigo-500/5 text-zinc-300 rounded-r">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.text}
            </Markdown>

            {/* Real-time Streaming cursor */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1 align-middle" />
            )}
          </div>

          {/* Error notice if present */}
          {message.error && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs mt-2">
              <strong>Generation Notice:</strong> {message.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
