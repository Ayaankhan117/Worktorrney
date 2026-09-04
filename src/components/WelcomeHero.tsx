import React from "react";
import {
  GraduationCap,
  FileSpreadsheet,
  Cpu,
  Code2,
  BookOpen,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { ModeType, SyllabusType } from "../types";
import { SYLLABUS_CATALOG } from "../utils/syllabusData";

interface WelcomeHeroProps {
  currentSyllabus: SyllabusType;
  onSelectSyllabus: (syllabus: SyllabusType) => void;
  onSelectMode: (mode: ModeType) => void;
  onSamplePrompt: (prompt: string, mode: ModeType) => void;
  isDarkTheme: boolean;
}

export function WelcomeHero({
  currentSyllabus,
  onSelectSyllabus,
  onSelectMode,
  onSamplePrompt,
  isDarkTheme,
}: WelcomeHeroProps) {
  const currentSyllabusInfo = SYLLABUS_CATALOG[currentSyllabus];

  const quickSyllabusOptions: { id: SyllabusType; label: string; sub: string }[] = [
    { id: "igcse", label: "Cambridge IGCSE", sub: "Years 10-11 / 0625, 0620, 0580" },
    { id: "cambridge_lower", label: "Cambridge Lower Secondary", sub: "Stages 7-9 Checkpoint" },
    { id: "necta", label: "NECTA (Tanzania)", sub: "CSEE Form 1-4 & ACSEE Form 5-6" },
    { id: "a_level", label: "Cambridge A-Level", sub: "Years 12-13 / AS & A2" },
  ];

  const capabilityCards = [
    {
      mode: "teacher" as ModeType,
      title: "Real Teacher Explainer",
      icon: GraduationCap,
      desc: "Explains concepts like a real teacher with concrete examples, exam paper info, and mark schemes.",
      sample: "Explain Newton's Laws and momentum with real-world examples and typical Paper 4 / Section B exam questions.",
    },
    {
      mode: "summarise" as ModeType,
      title: "Multi-Doc & Media Summariser",
      icon: FileSpreadsheet,
      desc: "Summarises Word, PowerPoint slides, PDFs, plain text, diagrams, images, and video clips.",
      sample: "Summarize this lecture PowerPoint slide-by-slide highlighting key takeaways and revision points.",
    },
    {
      mode: "microcontroller" as ModeType,
      title: "Microcontroller Code & Wiring",
      icon: Cpu,
      desc: "Arduino, ESP32 (WiFi/BLE), Raspberry Pi Pico, STM32 code, circuit pinouts & component BOM.",
      sample: "Write complete ESP32 code to read a DHT22 sensor and publish temperature over MQTT with circuit wiring diagram.",
    },
    {
      mode: "software" as ModeType,
      title: "Apps & Software Creator",
      icon: Code2,
      desc: "Full software apps in React, Python, Node.js, CLI tools, and automation scripts.",
      sample: "Create a complete Python desktop study planner application with SQLite database and streak tracking.",
    },
    {
      mode: "homework" as ModeType,
      title: "Step-by-Step Homework Solver",
      icon: BookOpen,
      desc: "Solves questions from photos or text with full formula derivations, substitutions, and exact units.",
      sample: "Calculate the acceleration and tension for an Atwood machine with step-by-step working and free body diagram.",
    },
  ];

  const handleTriggerUpload = () => {
    const input = document.getElementById("multi-file-input") as HTMLInputElement | null;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Live AI Status Bar */}
      <div
        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-colors ${
          isDarkTheme ? "bg-[#111114] border-zinc-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Live AI Terminal • Ultra Speed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400 font-mono hidden sm:inline">
            Active Syllabus: {currentSyllabusInfo.title}
          </span>
          <span className="text-xs text-zinc-500 font-mono bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
            Gemini 3.8 Flash
          </span>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Unified Academic & Engineering Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100">
          Worktorrney Multi-Modal Studio
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Summarise multi-media documents, PowerPoints, and video lectures. Generate embedded microcontroller code,
          solve homework with step-by-step working, and learn with exam paper insights.
        </p>
      </div>

      {/* Top Media & Microcontroller Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Media Dropzone Card */}
        <div
          onClick={handleTriggerUpload}
          className={`md:col-span-2 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center border-dashed border transition-all cursor-pointer group ${
            isDarkTheme
              ? "bg-[#111114] border-zinc-700 hover:border-indigo-500/60 hover:bg-[#141419]"
              : "bg-white border-slate-300 hover:border-indigo-500 hover:bg-slate-50 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Drop Multi-Media & Documents
          </h3>
          <p className="text-xs text-zinc-400 mt-1 text-center">
            Unlimited Images, Video clips, PowerPoint slides (.pptx) & Word files (.docx)
          </p>
          <span className="mt-3 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            Click to Browse or Drag & Drop
          </span>
        </div>

        {/* Side Microcontroller Card */}
        <div
          className={`rounded-2xl p-5 flex flex-col justify-between border ${
            isDarkTheme
              ? "bg-gradient-to-br from-indigo-950/40 via-[#111114] to-purple-950/30 border-indigo-500/20"
              : "bg-indigo-50/70 border-indigo-200 shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Microcontroller Lab</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hardware code & wiring diagrams ready for immediate flash.
            </p>
          </div>
          <div className="space-y-1.5 mt-4">
            {[
              { chip: "ESP32 (WiFi / BLE)", prompt: "ESP32 WiFi HTTP server code and pinout" },
              { chip: "Raspberry Pi Pico", prompt: "Pi Pico MicroPython ADC sensor reading" },
              { chip: "Arduino Uno / Mega", prompt: "Arduino Uno PWM motor controller code with schematic" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectMode("microcontroller");
                  onSamplePrompt(item.prompt, "microcontroller");
                }}
                className="w-full flex items-center justify-between text-[11px] bg-zinc-900/80 hover:bg-zinc-800 p-2 rounded-lg border border-zinc-800 font-mono text-zinc-300 transition-colors text-left"
              >
                <span>{item.chip}</span>
                <span className="text-indigo-400 text-[10px]">Load →</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Teacher Assistant & Syllabus Inquiry Card */}
      <div
        id="syllabus-inquiry-box"
        className={`p-5 rounded-2xl border transition-all ${
          isDarkTheme ? "bg-[#111114] border-zinc-800 text-zinc-100" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-mono">Teacher Assistant Configuration</h4>
            <p className="text-[10px] text-zinc-500">Syllabus Alignment & Exam Paper Adaptation</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          Select your target syllabus so worktorrney structures its teaching, exam question tips, and marking scheme references accordingly:
        </p>

        {/* Syllabus Quick Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickSyllabusOptions.map((opt) => {
            const isSelected = currentSyllabus === opt.id;
            return (
              <button
                key={opt.id}
                id={`welcome-syllabus-${opt.id}`}
                onClick={() => onSelectSyllabus(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "ring-1 ring-indigo-500 border-indigo-500 bg-indigo-500/15"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs font-mono text-zinc-100">{opt.label}</div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="text-[10px] text-zinc-500 truncate mt-1">
                  {opt.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Capability Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400">
            Explore Capabilities & Fast Prompts
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Click any card to start immediately
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilityCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                id={`capability-card-${card.mode}`}
                onClick={() => {
                  onSelectMode(card.mode);
                  onSamplePrompt(card.sample, card.mode);
                }}
                className={`p-4 rounded-xl border cursor-pointer group transition-all hover:border-indigo-500/50 hover:bg-[#15151b] ${
                  isDarkTheme ? "bg-[#111114] border-zinc-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-sm font-mono tracking-tight text-zinc-100">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {card.desc}
                </p>
                <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 italic line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  "{card.sample}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
