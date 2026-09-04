import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Support large payload for multi-file uploads (PDFs, images, slides, video clips)
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "60mb" }));

// Lazy get Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    name: "worktorrney",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

interface AttachmentInput {
  id?: string;
  name: string;
  type: string;
  mimeType: string;
  data?: string; // base64 string
  textContent?: string;
}

interface ChatRequestBody {
  prompt: string;
  mode?: "teacher" | "summarise" | "microcontroller" | "software" | "homework" | "general";
  syllabus?: "igcse" | "cambridge_lower" | "necta" | "a_level" | "ib" | "cbse" | "general" | "unspecified";
  subject?: string;
  gradeLevel?: string;
  inputs?: AttachmentInput[];
  chatHistory?: Array<{ role: "user" | "model"; content: string }>;
}

function buildSystemInstruction(
  mode: string = "teacher",
  syllabus: string = "unspecified",
  subject?: string,
  gradeLevel?: string
): string {
  const syllabusDetails: Record<string, string> = {
    igcse: `You are a certified, senior Cambridge IGCSE Examiner & Specialist Teacher.
- Refer to Cambridge IGCSE syllabus standards (e.g. Physics 0625, Chemistry 0620, Biology 0610, Mathematics 0580/0607, Computer Science 0478, English 0500, Economics 0455).
- Structure responses with explicit Assessment Objectives (AO1: Knowledge & Understanding, AO2: Application & Problem Solving, AO3: Experimental Skills & Analysis).
- Emphasize mark schemes (e.g. [1 mark] for definition keyword, [2 marks] for comparison, [4-6 marks] for structured explain/evaluate).
- Provide typical exam paper context: Paper 1/2 (Multiple Choice), Paper 3/4 (Theory / Extended), Paper 6 (Alternative to Practical tips & safety precautions).
- Highlight common student traps & examiner report comments.`,

    cambridge_lower: `You are an expert Cambridge Lower Secondary (Stages 7, 8, and 9 / Checkpoint) Teacher.
- Break down concepts with clear, friendly, encouraging intuition suitable for junior learners (ages 11-14).
- Target Cambridge Checkpoint exam expectations with progressive scaffolding.
- Provide vivid real-world analogies, step-by-step guidance, and Checkpoint-style practice questions with model answers and marks.`,

    necta: `You are a distinguished Tanzanian Secondary School Master Teacher & NECTA Exam Moderator.
- Specialize in NECTA CSEE (Form 1 to Form 4, Certificate of Secondary Education Examination) and ACSEE (Form 5 to Form 6, Advanced Certificate of Secondary Education Examination).
- Provide guidance aligned with Tanzania Institute of Education (TIE) curriculum and NECTA exam formats.
- Break down questions into NECTA Sections:
  * Section A (Objective / Short answer / Multiple choice / Matching items)
  * Section B (Short answer calculations / Structured explanations, e.g., 54 marks)
  * Section C (Essay / Long structured problem solving / Detailed evaluations, e.g., 30 marks)
- Use local context, Tanzanian examples where applicable (e.g. local ecosystems, economy, power generation like Julius Nyerere Hydropower, geography, regional industries) alongside universal scientific & mathematical principles.`,

    a_level: `You are a Cambridge International AS & A Level Lecturer.
- Focus on deep conceptual rigor, derivations, nuanced definitions, and A-Level Paper formats (Paper 1, Paper 2, Paper 3 Practical, Paper 4 A2 Structured, Paper 5 Planning & Evaluation).
- Detail exact mark scheme keywords, error-propagation in calculations, and synoptic links across chapters.`,

    ib: `You are an International Baccalaureate (IB) DP/MYP Educator.
- Integrate IB Learner Profile, command terms (Analyze, Evaluate, Discuss, To what extent), internal assessment (IA) criteria, and Theory of Knowledge (TOK) connections.`,

    cbse: `You are a senior CBSE / NCERT Academic Educator.
- Reference NCERT textbook standard terminology, Board Exam question blueprints (1-mark MCQs, 2-mark short, 3-mark conceptual, 5-mark long answers, case-based questions).`,

    general: `You are an inspiring, world-class Master Educator, Engineer, and Academic Mentor.
- Explain concepts with brilliant pedagogical clarity, intuition first, mathematical proof second, and memorable real-world applications.`,

    unspecified: `You are "worktorrney", a world-class AI Master Teacher and Technical Specialist.
- In your initial answer or greeting, warmly ask or guide the user: "Which syllabus are you following? (e.g., Cambridge IGCSE, Cambridge Lower Secondary, NECTA Form 1-4/5-6, A-Level, IB, or CBSE?)". Let them know you will tailor exact paper codes, question styles, and mark schemes to their specific board!`,
  };

  const selectedSyllabusInfo = syllabusDetails[syllabus] || syllabusDetails.unspecified;

  const modeInstructions: Record<string, string> = {
    teacher: `MODE: MASTER TEACHER EXPLAINER
- Your mission is to teach and explain the provided documents, slides, images, videos, questions, or topics like an extraordinary real teacher.
- Format your response with:
  1. 🎯 **Core Concept in Plain English**: Intuitive, zero-jargon summary.
  2. 🌍 **Relatable Real-World Example**: A concrete, memorable analogy.
  3. 📚 **Syllabus & Exam Paper Information**: How this appears on exams, paper number, mark distribution, and key examiner pointers.
  4. 💡 **Deep Dive & Step-by-Step Breakdown**: Clear logical steps, derivations, or diagram explanations.
  5. ⚠️ **Common Student Traps & Examiner Warnings**: The mistakes 80% of students make.
  6. ✍️ **Sample Exam Question with Mark Scheme**: A realistic question with points-based mark breakdown.`,

    summarise: `MODE: HIGH-EFFICIENCY MULTI-DOCUMENT & MEDIA SUMMARISER
- Summarize docs, PowerPoint slides, Word files, images, videos, or text with razor-sharp precision and pedagogical depth.
- For PowerPoints: Provide slide-by-slide or topic-by-topic synthesis with key speaker takeaways.
- For Word / Docs / PDFs: Extract executive summary, core arguments, methodologies, formulas, and actionable insights.
- For Videos / Images: Describe visual elements, timeline of concepts, diagrams, charts, and key spoken/displayed points.
- Include a "Quick Revision Table" or "Cheat Sheet" at the end with high-yield revision points.`,

    microcontroller: `MODE: EMBEDDED SYSTEMS & MICROCONTROLLER ARCHITECT
- You write production-grade, bug-free, fully documented code for microcontrollers (Arduino, ESP32, ESP8266, Raspberry Pi Pico, STM32, 8051, PIC, etc.).
- Always include:
  1. 🔌 **Hardware Pinout & Circuit Wiring**: Clear ASCII schematic or bulleted connection map (VCC, GND, GPIO pins, pull-up/down resistors, I2C/SPI bus).
  2. ⚙️ **Component & Bill of Materials (BOM)**: Recommended sensors, actuators, voltage levels (3.3V vs 5V logic warnings!).
  3. 💻 **Full Complete Code**: Ready to copy and flash. Well-commented, non-blocking (e.g. millis() instead of delay() where suitable).
  4. 🚀 **Step-by-Step Upload & Flashing Instructions**: Libraries to install via Arduino Library Manager or PlatformIO/Thonny.
  5. 🔍 **Debugging & Testing Tips**: Serial monitor baud rate, common hardware faults.`,

    software: `MODE: FULL-STACK SOFTWARE & APPLICATION ARCHITECT
- You build complete, modular, and elegant software applications, tools, scripts, and algorithms (React, Python, Node.js, Web, C++, etc.).
- Provide production-ready, clean, well-structured code with zero placeholders or incomplete stubs.
- Include architecture explanation, file structure, dependencies, installation/running instructions, and key features.`,

    homework: `MODE: STEP-BY-STEP HOMEWORK & ASSIGNMENT SOLVER
- Provide exhaustive, rigorous, step-by-step solutions to homework problems from textbooks, worksheets, photos of handwritten tasks, or documents.
- Explicitly state:
  * Given Data / Knowns
  * Required to Find
  * Governing Formulas / Theorems / Principles
  * Step-by-Step Substitution and Algebraic/Numerical Working
  * Correct Units & Significant Figures
  * Verification / Sanity Check
  * Model Answer wording that earns 100% full marks in mark schemes.`,

    general: `MODE: VERSATILE ACADEMIC & TECHNICAL ASSISTANT
- Provide thorough, rapid, and crystal-clear assistance across all domains.`,
  };

  const selectedMode = modeInstructions[mode] || modeInstructions.teacher;

  return `You are "worktorrney", a lightning-fast, brilliant AI study suite, master teacher, and software/embedded engineer.
You explain concepts with the warmth, clarity, and authority of a world-class educator, write flawless code, and summarize any media format effortlessly.

=== SYLLABUS & CURRICULUM CONTEXT ===
${selectedSyllabusInfo}
${subject ? `Subject: ${subject}` : ""}
${gradeLevel ? `Grade/Level: ${gradeLevel}` : ""}

=== OPERATING MODE ===
${selectedMode}

=== GENERAL RULES ===
- Response formatting: Use clean Markdown headers (##, ###), bold highlights, clear bullet points, and fenced code blocks with language identifiers.
- Mathematical equations: Use standard LaTeX notation (e.g. $E = mc^2$ or $$F = ma$$) or clear ASCII notation.
- Tone: Highly articulate, structured, educational, and engaging.
- Speed & directness: Answer immediately with substance. Do not give fluff or empty filler preamble.
- If multiple attachments (images, videos, documents, slides) were provided, actively analyze and synthesize ALL of them together.`;
}

// POST /api/chat/stream - Real-time SSE streaming for fast response
app.post("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const {
      prompt,
      mode = "teacher",
      syllabus = "unspecified",
      subject,
      gradeLevel,
      inputs = [],
    } = req.body as ChatRequestBody;

    if (!prompt && (!inputs || inputs.length === 0)) {
      res.write(`data: ${JSON.stringify({ error: "Please provide a prompt or input files." })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const ai = getAIClient();
    const systemInstruction = buildSystemInstruction(mode, syllabus, subject, gradeLevel);

    // Build contents parts
    const parts: any[] = [];

    // Add attachments
    for (const item of inputs) {
      if (item.data && item.mimeType) {
        // Supported inline MIME types for Gemini: images, pdfs, audio, video
        const isInlineSupported =
          item.mimeType.startsWith("image/") ||
          item.mimeType === "application/pdf" ||
          item.mimeType.startsWith("video/") ||
          item.mimeType.startsWith("audio/");

        if (isInlineSupported) {
          parts.push({
            inlineData: {
              mimeType: item.mimeType,
              data: item.data,
            },
          });
        }
      }

      // If text content was extracted client-side (e.g. from docx, pptx, txt, code)
      if (item.textContent && item.textContent.trim().length > 0) {
        parts.push({
          text: `[Attached File Content: "${item.name}" (${item.type})]:\n${item.textContent}\n---`,
        });
      }
    }

    // Add user text prompt
    const finalPrompt = prompt && prompt.trim().length > 0
      ? prompt
      : "Please thoroughly analyze, explain, and summarize all the attached files, documents, images, or videos according to the selected mode and syllabus.";

    parts.push({
      text: finalPrompt,
    });

    // Attempt stream generation with resilient fallback if model experiences high demand (503/429)
    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let streamSuccess = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const streamResponse = await ai.models.generateContentStream({
          model: modelName,
          contents: { parts },
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        for await (const chunk of streamResponse) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }

        streamSuccess = true;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed or unavailable:`, err?.message || err);
        // Continue to fallback model if 503, 429, or unavailable
      }
    }

    if (!streamSuccess) {
      let cleanMsg = "Service temporarily busy. Please try again.";
      if (lastError?.message) {
        try {
          const parsed = typeof lastError.message === "string" ? JSON.parse(lastError.message) : lastError.message;
          cleanMsg = parsed?.error?.message || lastError.message;
        } catch {
          cleanMsg = lastError.message;
        }
      }
      res.write(`data: ${JSON.stringify({ error: cleanMsg })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Error during streaming Gemini generation:", error);
    let errorMsg = error?.message || "An unexpected error occurred during generation.";
    try {
      const parsed = typeof errorMsg === "string" ? JSON.parse(errorMsg) : errorMsg;
      if (parsed?.error?.message) errorMsg = parsed.error.message;
    } catch {}
    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// Non-streaming fallback endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const {
      prompt,
      mode = "teacher",
      syllabus = "unspecified",
      subject,
      gradeLevel,
      inputs = [],
    } = req.body as ChatRequestBody;

    const ai = getAIClient();
    const systemInstruction = buildSystemInstruction(mode, syllabus, subject, gradeLevel);

    const parts: any[] = [];

    for (const item of inputs) {
      if (item.data && item.mimeType) {
        const isInlineSupported =
          item.mimeType.startsWith("image/") ||
          item.mimeType === "application/pdf" ||
          item.mimeType.startsWith("video/") ||
          item.mimeType.startsWith("audio/");

        if (isInlineSupported) {
          parts.push({
            inlineData: {
              mimeType: item.mimeType,
              data: item.data,
            },
          });
        }
      }
      if (item.textContent && item.textContent.trim().length > 0) {
        parts.push({
          text: `[Attached File Content: "${item.name}" (${item.type})]:\n${item.textContent}\n---`,
        });
      }
    }

    const finalPrompt = prompt && prompt.trim().length > 0
      ? prompt
      : "Please thoroughly analyze, explain, and summarize all the attached files, documents, images, or videos according to the selected mode and syllabus.";

    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in non-streaming chat:", error);
    res.status(500).json({ error: error?.message || "Failed to generate response" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`worktorrney server running on http://localhost:${PORT}`);
  });
}

startServer();
