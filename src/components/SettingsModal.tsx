import React, { useState } from "react";
import { X, Palette, Check, Zap, Type, Sparkles } from "lucide-react";
import { AppSettings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  isDarkTheme: boolean;
}

interface ColorPreset {
  id: AppSettings["themePreset"];
  name: string;
  hex: string;
  isDark: boolean;
  borderClass?: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "elegant-dark", name: "Elegant Dark (Default)", hex: "#0a0a0c", isDark: true },
  { id: "dark-slate", name: "Slate Studio", hex: "#0f172a", isDark: true },
  { id: "oled-black", name: "OLED Pitch Black", hex: "#000000", isDark: true },
  { id: "navy-blue", name: "Cambridge Navy", hex: "#0a192f", isDark: true },
  { id: "emerald-forest", name: "Emerald Academy", hex: "#06281e", isDark: true },
  { id: "light-minimal", name: "Minimalist Light", hex: "#f8fafc", isDark: false, borderClass: "border-slate-300" },
  { id: "sepia-warm", name: "Warm Parchment", hex: "#fdf6e2", isDark: false, borderClass: "border-amber-300" },
];

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  isDarkTheme,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const [currentColor, setCurrentColor] = useState(settings.backgroundColor);
  const [currentPreset, setCurrentPreset] = useState(settings.themePreset);
  const [fontSize, setFontSize] = useState(settings.fontSize);

  const handleSelectPreset = (preset: ColorPreset) => {
    setCurrentPreset(preset.id);
    setCurrentColor(preset.hex);
    onSaveSettings({
      ...settings,
      themePreset: preset.id,
      backgroundColor: preset.hex,
    });
  };

  const handleCustomColorChange = (hex: string) => {
    setCurrentColor(hex);
    setCurrentPreset("custom");
    onSaveSettings({
      ...settings,
      themePreset: "custom",
      backgroundColor: hex,
    });
  };

  const handleFontSizeChange = (size: "sm" | "md" | "lg") => {
    setFontSize(size);
    onSaveSettings({
      ...settings,
      fontSize: size,
    });
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 overflow-y-auto max-h-[90vh] transition-colors ${
          isDarkTheme
            ? "bg-[#111114] border-zinc-800 text-zinc-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono tracking-tight text-white">
                Appearance & Settings
              </h2>
              <p className="text-xs text-zinc-400">
                Customize background color, speed, and typography
              </p>
            </div>
          </div>
          <button
            id="close-settings-button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Background Color */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold flex items-center gap-2 text-zinc-200">
              <Palette className="w-4 h-4 text-indigo-400" />
              Background Color
            </label>
            <span className="text-xs font-mono text-zinc-400 uppercase">
              {currentColor}
            </span>
          </div>

          {/* Preset Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = currentPreset === preset.id || currentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "ring-2 ring-indigo-500 border-indigo-500 bg-zinc-800/80 shadow-md"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg shadow-inner shrink-0 flex items-center justify-center border ${
                      preset.borderClass || "border-black/20"
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          preset.isDark ? "text-white" : "text-black"
                        }`}
                      />
                    )}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium truncate text-zinc-200">
                      {preset.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      {preset.hex}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Color Picker input */}
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2.5">
            <span className="text-xs font-semibold block text-zinc-300">
              Custom Hex Color Picker
            </span>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  id="custom-color-native-input"
                  type="color"
                  value={currentColor.startsWith("#") ? currentColor : "#0a0a0c"}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-transparent p-0"
                />
              </div>
              <input
                id="custom-color-hex-input"
                type="text"
                placeholder="#0a0a0c"
                value={currentColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Pick any shade. worktorrney will automatically adjust interface contrast.
            </p>
          </div>
        </div>

        {/* Section 2: Font Size */}
        <div className="mt-6 space-y-3 pt-4 border-t border-zinc-800">
          <label className="text-sm font-semibold flex items-center gap-2 text-zinc-200">
            <Type className="w-4 h-4 text-emerald-400" />
            Display Font Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["sm", "md", "lg"] as const).map((sz) => (
              <button
                key={sz}
                id={`font-size-${sz}`}
                onClick={() => handleFontSizeChange(sz)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                  fontSize === sz
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {sz === "sm" ? "Compact (Small)" : sz === "md" ? "Normal (Default)" : "Comfort (Large)"}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Response Engine Speed */}
        <div className="mt-6 space-y-2 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Zap className="w-4 h-4 text-amber-400" />
              Response Speed Engine
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
              ⚡ Ultra-Fast Streaming Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Powered by <strong>Gemini 3.8 Flash</strong> with real-time SSE streaming.
            Responses stream token-by-token immediately without latency.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="mt-7 pt-4 border-t border-zinc-800 flex justify-end gap-2">
          <button
            id="save-settings-done-button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-500/20 transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
