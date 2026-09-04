export type SyllabusType =
  | "igcse"
  | "cambridge_lower"
  | "necta"
  | "a_level"
  | "ib"
  | "cbse"
  | "general"
  | "unspecified";

export type ModeType =
  | "teacher"
  | "summarise"
  | "microcontroller"
  | "software"
  | "homework";

export interface InputItem {
  id: string;
  name: string;
  size: number;
  type: "image" | "video" | "pdf" | "word" | "presentation" | "text" | "code";
  mimeType: string;
  previewUrl?: string; // object URL or data URL
  data?: string; // base64 string without data prefix
  textContent?: string; // parsed text from docx, pptx, txt, etc.
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  mode: ModeType;
  syllabus: SyllabusType;
  inputs?: InputItem[];
  isStreaming?: boolean;
  error?: string;
}

export interface AppSettings {
  backgroundColor: string;
  themePreset:
    | "elegant-dark"
    | "dark-slate"
    | "light-minimal"
    | "oled-black"
    | "navy-blue"
    | "emerald-forest"
    | "sepia-warm"
    | "custom";
  fontSize: "sm" | "md" | "lg";
  autoAskSyllabus: boolean;
  selectedSubject?: string;
  selectedGrade?: string;
}
