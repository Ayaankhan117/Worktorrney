import React from "react";
import { X, GraduationCap, Check, BookOpen, FileCheck, AlertCircle } from "lucide-react";
import { SyllabusType } from "../types";
import { SYLLABUS_CATALOG } from "../utils/syllabusData";

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSyllabus: SyllabusType;
  onSelectSyllabus: (syllabus: SyllabusType) => void;
  isDarkTheme: boolean;
}

export function SyllabusModal({
  isOpen,
  onClose,
  currentSyllabus,
  onSelectSyllabus,
  isDarkTheme,
}: SyllabusModalProps) {
  if (!isOpen) return null;

  const syllabusKeys: SyllabusType[] = [
    "igcse",
    "cambridge_lower",
    "necta",
    "a_level",
    "ib",
    "cbse",
    "general",
  ];

  return (
    <div
      id="syllabus-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="syllabus-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl p-6 overflow-y-auto max-h-[90vh] transition-colors ${
          isDarkTheme
            ? "bg-[#111114] border-zinc-800 text-zinc-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-tight text-white">
                Select Your School Syllabus & Curriculum
              </h2>
              <p className="text-xs text-zinc-400">
                worktorrney customizes exam paper tips, question formats, and mark schemes to your exact board.
              </p>
            </div>
          </div>
          <button
            id="close-syllabus-modal-button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-4 p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-indigo-300">Why specify your syllabus?</strong> The AI Teacher explains topics using official syllabus codes
            (e.g., IGCSE 0625/0580 or NECTA CSEE Section A, B, C breakdown), actual paper question styles, and exact mark scheme keywords!
          </p>
        </div>

        {/* Syllabus Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {syllabusKeys.map((key) => {
            const info = SYLLABUS_CATALOG[key];
            const isSelected = currentSyllabus === key;

            return (
              <div
                key={key}
                id={`syllabus-card-${key}`}
                onClick={() => {
                  onSelectSyllabus(key);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                  isSelected
                    ? "ring-2 ring-indigo-500 border-indigo-500 bg-zinc-800/80"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {info.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono text-right">
                    {info.level}
                  </span>
                </div>

                <h3 className="text-sm font-bold mt-2 font-mono text-zinc-100">{info.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {info.description}
                </p>

                {/* Papers Preview */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[11px] space-y-1 text-zinc-400">
                  <div className="font-semibold text-indigo-400 flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> Exam Papers Covered:
                  </div>
                  <div className="truncate">{info.paperInfo[0]}</div>
                  {info.paperInfo[1] && <div className="truncate">{info.paperInfo[1]}</div>}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {info.popularSubjects.length} subjects
                  </span>
                  <button
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {isSelected ? "Active" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => {
              onSelectSyllabus("unspecified");
              onClose();
            }}
            className="text-xs text-zinc-400 hover:text-white underline transition-opacity"
          >
            I want the AI to ask or adapt generally
          </button>
          <button
            id="done-syllabus-modal-button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
