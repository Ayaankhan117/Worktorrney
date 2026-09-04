import { useState } from "react";
import {
  GraduationCap,
  Settings,
  PlusCircle,
  Cpu,
  FileText,
  Code2,
  BookOpen,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { ModeType, SyllabusType } from "../types";
import { SYLLABUS_CATALOG } from "../utils/syllabusData";

interface HeaderProps {
  currentMode: ModeType;
  onSelectMode: (mode: ModeType) => void;
  currentSyllabus: SyllabusType;
  onOpenSyllabusModal: () => void;
  onOpenSettingsModal: () => void;
  onNewChat: () => void;
  isDarkTheme: boolean;
}

export function Header({
  currentMode,
  onSelectMode,
  currentSyllabus,
  onOpenSyllabusModal,
  onOpenSettingsModal,
  onNewChat,
  isDarkTheme,
}: HeaderProps) {
  const [showModesDropdown, setShowModesDropdown] = useState(false);
  const syllabusInfo = SYLLABUS_CATALOG[currentSyllabus] || SYLLABUS_CATALOG.unspecified;

  const modes: { id: ModeType; label: string; icon: any; desc: string }[] = [
    { id: "teacher", label: "Teacher Explainer", icon: GraduationCap, desc: "Real teacher intuition, paper info & examples" },
    { id: "summarise", label: "Summarise Media", icon: FileText, desc: "Docs, PPTX, Word, Images, Videos" },
    { id: "microcontroller", label: "Microcontroller Code", icon: Cpu, desc: "Arduino, ESP32, Pico, STM32 & wiring" },
    { id: "software", label: "Apps & Software", icon: Code2, desc: "Full web apps, Python, scripts & tools" },
    { id: "homework", label: "Homework Solver", icon: BookOpen, desc: "Step-by-step working, units & proof" },
  ];

  const activeModeItem = modes.find((m) => m.id === currentMode) || modes[0];
  const ActiveIcon = activeModeItem.icon;

  return (
    <header
      id="app-header"
      className={`border-b sticky top-0 z-30 transition-colors backdrop-blur-md ${
        isDarkTheme
          ? "border-zinc-800 bg-[#0a0a0c]/85 text-zinc-100"
          : "border-slate-200/80 bg-white/85 text-slate-900"
      }`}
    >
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Ultra Speed Badge */}
        <div className="flex items-center gap-3">
          <button
            id="brand-home-button"
            onClick={onNewChat}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="worktorrney - New Chat"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-lg sm:text-xl font-mono text-white">
                  worktorrney
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI Studio
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:block">
                Unified AI Intelligence
              </p>
            </div>
          </button>

          {/* Ultra Speed badge from Elegant Dark design */}
          <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-zinc-800">
            <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-tighter">
              Ultra Speed Mode
            </span>
            <span className="text-zinc-500 text-xs font-mono">
              Response time: 0.2ms
            </span>
          </div>
        </div>

        {/* Center: Mode Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`mode-tab-${mode.id}`}
                onClick={() => onSelectMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Mode dropdown trigger */}
        <div className="relative lg:hidden">
          <button
            id="mobile-mode-dropdown-button"
            onClick={() => setShowModesDropdown(!showModesDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900/80 text-zinc-200"
          >
            <ActiveIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[110px] truncate">{activeModeItem.label}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {showModesDropdown && (
            <div
              id="mobile-mode-menu"
              className={`absolute left-0 mt-1.5 w-60 rounded-xl border shadow-xl z-50 p-1.5 ${
                isDarkTheme ? "bg-[#111114] border-zinc-800 text-zinc-100" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {modes.map((mode) => {
                const Icon = mode.icon;
                const isCurrent = currentMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onSelectMode(mode.id);
                      setShowModesDropdown(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                      isCurrent
                        ? "bg-zinc-800 text-white border border-zinc-700/50"
                        : "text-zinc-300 hover:bg-zinc-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                    <div>
                      <div className="font-semibold">{mode.label}</div>
                      <div className="text-[10px] text-zinc-400">{mode.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Controls: Syllabus Pill, New Chat, Settings */}
        <div className="flex items-center gap-2">
          {/* Syllabus Selector Pill */}
          <button
            id="header-syllabus-selector-button"
            onClick={onOpenSyllabusModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentSyllabus === "unspecified"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
            }`}
            title="Click to change Syllabus (IGCSE, Cambridge Lower Secondary, NECTA, etc.)"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline text-zinc-400">Syllabus:</span>
            <span className="font-bold text-[11px] max-w-[120px] truncate">
              {syllabusInfo.badge}
            </span>
          </button>

          {/* New Chat Button */}
          <button
            id="header-new-chat-button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Start a new session"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">New</span>
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-button"
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl text-xs border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Settings (Background color & appearance)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
