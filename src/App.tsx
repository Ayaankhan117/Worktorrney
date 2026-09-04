/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { WelcomeHero } from "./components/WelcomeHero";
import { ChatMessage } from "./components/ChatMessage";
import { InputBar } from "./components/InputBar";
import { InputTray } from "./components/InputTray";
import { SettingsModal } from "./components/SettingsModal";
import { SyllabusModal } from "./components/SyllabusModal";
import { AppSettings, InputItem, Message, ModeType, SyllabusType } from "./types";
import { processUploadedFile } from "./utils/fileExtractor";
import { SYLLABUS_CATALOG } from "./utils/syllabusData";
import {
  UploadCloud,
  FileSpreadsheet,
  Cpu,
  Code2,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";

// Helper to determine if a background color is dark or light
function isColorDark(hex: string): boolean {
  if (!hex) return true;
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  }
  return true;
}

const DEFAULT_SETTINGS: AppSettings = {
  backgroundColor: "#0a0a0c",
  themePreset: "elegant-dark",
  fontSize: "md",
  autoAskSyllabus: true,
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachedInputs, setAttachedInputs] = useState<InputItem[]>([]);
  const [currentMode, setCurrentMode] = useState<ModeType>("teacher");
  const [currentSyllabus, setCurrentSyllabus] = useState<SyllabusType>("unspecified");
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("worktorrney_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isDarkTheme = isColorDark(settings.backgroundColor);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("worktorrney_settings", JSON.stringify(settings));
  }, [settings]);

  // Scroll to bottom when new messages or streams arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Handle Drag & Drop of multiple files anywhere on window
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const processed: InputItem[] = [];

    for (const file of fileArray) {
      try {
        const item = await processUploadedFile(file);
        processed.push(item);
      } catch (err) {
        console.error("Error parsing file:", file.name, err);
      }
    }

    setAttachedInputs((prev) => [...prev, ...processed]);
  };

  const handleRemoveInput = (id: string) => {
    setAttachedInputs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllInputs = () => {
    setAttachedInputs([]);
  };

  const handleNewChat = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setAttachedInputs([]);
    setIsStreaming(false);
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...last, isStreaming: false, text: last.text + "\n\n*(Generation stopped by user)*" },
        ];
      }
      return prev;
    });
  };

  const handleSendMessage = async (userText: string) => {
    if (isStreaming) return;

    const currentInputs = [...attachedInputs];

    // Create user message
    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      text: userText || "Please analyze and explain the attached files.",
      timestamp: Date.now(),
      mode: currentMode,
      syllabus: currentSyllabus,
      inputs: currentInputs,
    };

    // Create assistant placeholder message
    const assistantMessageId = `msg_asst_${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      text: "",
      timestamp: Date.now() + 1,
      mode: currentMode,
      syllabus: currentSyllabus,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setAttachedInputs([]); // Clear active tray after sending
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userText,
          mode: currentMode,
          syllabus: currentSyllabus,
          inputs: currentInputs.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            mimeType: item.mimeType,
            data: item.data,
            textContent: item.textContent,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.replace(/^data: /, "");
            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                accumulatedText += `\n\n> ⚠️ **Notice**: ${parsed.error}`;
              } else if (parsed.text) {
                accumulatedText += parsed.text;
              }

              // Update assistant message state
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, text: accumulatedText, isStreaming: true }
                    : msg
                )
              );
            } catch (err) {
              console.warn("Could not parse SSE chunk:", dataStr);
            }
          }
        }
      }

      // Finalize assistant message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, text: accumulatedText, isStreaming: false }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user.");
      } else {
        console.error("Streaming error:", err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  isStreaming: false,
                  error: err?.message || "Failed to generate response.",
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <div
      id="worktorrney-app-root"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-screen flex font-sans transition-colors duration-300 relative ${getFontSizeClass()} ${
        isDarkTheme ? "text-zinc-100" : "text-slate-900"
      }`}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Global Drag-and-Drop Overlay */}
      {isDraggingOver && (
        <div
          id="drag-drop-overlay"
          className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 border-4 border-dashed border-indigo-400 animate-in fade-in duration-150"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4 animate-bounce">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-mono text-white text-center">
            Drop Unlimited Files for worktorrney
          </h2>
          <p className="text-sm text-indigo-200 mt-2 text-center max-w-md">
            Word documents (.docx), PowerPoint (.pptx), PDFs, videos, images, or code files.
          </p>
        </div>
      )}

      {/* Desktop Elegant Dark Sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0 w-64 bg-[#111114] border-r border-zinc-800 h-screen sticky top-0 z-30">
        <div className="p-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white font-mono">WORKTORRNEY</h1>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Unified AI Studio</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 px-3 py-1.5 uppercase tracking-wider font-mono">
            Main Tools
          </div>
          {[
            { id: "teacher" as ModeType, label: "Teacher Explainer", icon: GraduationCap },
            { id: "summarise" as ModeType, label: "Document Analysis", icon: FileSpreadsheet },
            { id: "microcontroller" as ModeType, label: "Microcontroller Hub", icon: Cpu },
            { id: "software" as ModeType, label: "Code & Software", icon: Code2 },
            { id: "homework" as ModeType, label: "Homework Solver", icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentMode(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer: User Settings & Quick Color Switcher */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div
            onClick={() => setIsSyllabusModalOpen(true)}
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-zinc-800/60 transition-colors"
            title="Configure Syllabus"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 text-xs font-bold font-mono">
              WT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">Academic Profile</p>
              <p className="text-[10px] text-zinc-500 truncate">
                {currentSyllabus === "unspecified"
                  ? "Choose Syllabus"
                  : SYLLABUS_CATALOG[currentSyllabus]?.badge || "Cambridge"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-zinc-500 font-mono">Theme Canvas</span>
            <div className="flex items-center space-x-1.5">
              {[
                { hex: "#0a0a0c", label: "Elegant Dark" },
                { hex: "#0f172a", label: "Slate Dark" },
                { hex: "#18181b", label: "Zinc Dark" },
                { hex: "#064e3b", label: "Emerald Dark" },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSettings((s) => ({ ...s, backgroundColor: c.hex }))}
                  title={c.label}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    settings.backgroundColor.toLowerCase() === c.hex.toLowerCase()
                      ? "border-indigo-400 scale-125"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Window */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          currentSyllabus={currentSyllabus}
          onOpenSyllabusModal={() => setIsSyllabusModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsOpen(true)}
          onNewChat={handleNewChat}
          isDarkTheme={isDarkTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeHero
              currentSyllabus={currentSyllabus}
              onSelectSyllabus={(s) => {
                setCurrentSyllabus(s);
              }}
              onSelectMode={setCurrentMode}
              onSamplePrompt={(prompt, mode) => {
                setCurrentMode(mode);
                handleSendMessage(prompt);
              }}
              isDarkTheme={isDarkTheme}
            />
          ) : (
            <div className="flex-1 divide-y divide-zinc-800/60 pb-8">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isDarkTheme={isDarkTheme}
                />
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}
        </main>

        {/* Unlimited Inputs Tray */}
        <InputTray
          items={attachedInputs}
          onRemoveItem={handleRemoveInput}
          onClearAll={handleClearAllInputs}
          isDarkTheme={isDarkTheme}
        />

        {/* Bottom Input Bar */}
        <InputBar
          onSendMessage={handleSendMessage}
          onFilesSelected={handleFilesSelected}
          isStreaming={isStreaming}
          onStopStreaming={handleStopStreaming}
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          currentSyllabus={currentSyllabus}
          hasInputs={attachedInputs.length > 0}
          isDarkTheme={isDarkTheme}
        />
      </div>

      {/* Settings Modal (Background Color, Speed, Typography) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        isDarkTheme={isDarkTheme}
      />

      {/* Syllabus Selector Modal (IGCSE, Cambridge Lower Secondary, NECTA, etc.) */}
      <SyllabusModal
        isOpen={isSyllabusModalOpen}
        onClose={() => setIsSyllabusModalOpen(false)}
        currentSyllabus={currentSyllabus}
        onSelectSyllabus={setCurrentSyllabus}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}
