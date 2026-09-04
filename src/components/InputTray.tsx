import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  FileCode,
  X,
  Eye,
  File,
  Sparkles,
} from "lucide-react";
import { InputItem } from "../types";

interface InputTrayProps {
  items: InputItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  isDarkTheme: boolean;
}

export function InputTray({
  items,
  onRemoveItem,
  onClearAll,
  isDarkTheme,
}: InputTrayProps) {
  const [inspectingItem, setInspectingItem] = useState<InputItem | null>(null);

  if (!items || items.length === 0) return null;

  const getIconForType = (type: InputItem["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case "video":
        return <Video className="w-4 h-4 text-rose-400" />;
      case "presentation":
        return <FileSpreadsheet className="w-4 h-4 text-orange-400" />;
      case "word":
      case "pdf":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "code":
        return <FileCode className="w-4 h-4 text-amber-400" />;
      default:
        return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      id="unlimited-input-tray"
      className={`px-4 py-2.5 border-t border-b transition-colors ${
        isDarkTheme
          ? "bg-[#111114]/90 border-zinc-800 text-zinc-200"
          : "bg-slate-50/90 border-slate-200/80 text-slate-800"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3" /> Attached Inputs ({items.length})
            </span>
            <span className="text-[11px] text-zinc-500">
              Unlimited images, videos, slides, docs & text
            </span>
          </div>
          {items.length > 1 && (
            <button
              id="clear-all-inputs-button"
              onClick={onClearAll}
              className="text-[11px] text-rose-400 hover:underline transition-all"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Horizontal scrollable flex list of attachments */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {items.map((item) => (
            <div
              key={item.id}
              id={`input-item-chip-${item.id}`}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs shrink-0 transition-all group ${
                isDarkTheme
                  ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              {/* Media Preview thumbnail if image or video */}
              {item.type === "image" && item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-7 h-7 rounded-lg object-cover border border-zinc-700"
                />
              ) : item.type === "video" && item.previewUrl ? (
                <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center border border-zinc-700 relative overflow-hidden">
                  <Video className="w-4 h-4 text-rose-400" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  {getIconForType(item.type)}
                </div>
              )}

              {/* Name & Size */}
              <div className="max-w-[140px] truncate">
                <div className="font-medium truncate text-[11px]" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                  <span className="uppercase">{item.type}</span> • {formatSize(item.size)}
                </div>
              </div>

              {/* Action Buttons: Preview Inspect & Delete */}
              <div className="flex items-center gap-1 pl-1">
                {(item.textContent || item.previewUrl) && (
                  <button
                    onClick={() => setInspectingItem(item)}
                    className="p-1 rounded hover:bg-zinc-800 text-indigo-400 opacity-80 group-hover:opacity-100"
                    title="Inspect extracted content / preview"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                )}
                <button
                  id={`remove-input-${item.id}`}
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Remove file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspecting Item Lightbox Modal */}
      {inspectingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setInspectingItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-5 max-h-[85vh] flex flex-col ${
              isDarkTheme ? "bg-[#111114] border-zinc-800 text-zinc-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                {getIconForType(inspectingItem.type)}
                <h3 className="font-bold text-sm truncate font-mono text-zinc-100">
                  {inspectingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3">
              {inspectingItem.type === "image" && inspectingItem.previewUrl && (
                <div className="flex justify-center bg-black/40 p-2 rounded-xl border border-zinc-800">
                  <img
                    src={inspectingItem.previewUrl}
                    alt={inspectingItem.name}
                    className="max-h-[60vh] object-contain rounded-lg"
                  />
                </div>
              )}

              {inspectingItem.type === "video" && inspectingItem.previewUrl && (
                <div className="flex justify-center bg-black/40 p-2 rounded-xl border border-zinc-800">
                  <video
                    src={inspectingItem.previewUrl}
                    controls
                    className="max-h-[60vh] rounded-lg w-full"
                  />
                </div>
              )}

              {inspectingItem.textContent && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-indigo-400">
                    Extracted Text & Slide Content:
                  </span>
                  <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono whitespace-pre-wrap break-words max-h-[50vh] overflow-y-auto text-zinc-300">
                    {inspectingItem.textContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
