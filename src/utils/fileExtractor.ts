import JSZip from "jszip";
import { InputItem } from "../types";

export async function processUploadedFile(file: File): Promise<InputItem> {
  const id = `input_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const name = file.name;
  const size = file.size;

  // Determine type
  if (file.type.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) {
    const base64 = await fileToBase64(file);
    const mimeType = file.type || getMimeFromExt(ext);
    const previewUrl = URL.createObjectURL(file);
    return {
      id,
      name,
      size,
      type: "image",
      mimeType,
      previewUrl,
      data: cleanBase64(base64),
    };
  }

  if (file.type.startsWith("video/") || ["mp4", "webm", "mov", "m4v", "mkv"].includes(ext)) {
    const base64 = await fileToBase64(file);
    const mimeType = file.type || `video/${ext === "mov" ? "mp4" : ext}`;
    const previewUrl = URL.createObjectURL(file);
    return {
      id,
      name,
      size,
      type: "video",
      mimeType,
      previewUrl,
      data: cleanBase64(base64),
    };
  }

  if (file.type === "application/pdf" || ext === "pdf") {
    const base64 = await fileToBase64(file);
    const previewUrl = URL.createObjectURL(file);
    return {
      id,
      name,
      size,
      type: "pdf",
      mimeType: "application/pdf",
      previewUrl,
      data: cleanBase64(base64),
    };
  }

  // Word Document (.docx)
  if (ext === "docx" || file.type.includes("wordprocessingml")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const docXml = await zip.file("word/document.xml")?.async("string");

      let extractedText = "";
      if (docXml) {
        extractedText = extractTextFromDocXml(docXml);
      } else {
        extractedText = `Word document "${file.name}" uploaded. (Raw content binary)`;
      }

      return {
        id,
        name,
        size,
        type: "word",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        textContent: extractedText,
      };
    } catch (err) {
      console.warn("Could not parse docx XML:", err);
      return {
        id,
        name,
        size,
        type: "word",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        textContent: `Word document "${name}" (${(size / 1024).toFixed(1)} KB).`,
      };
    }
  }

  // PowerPoint (.pptx)
  if (ext === "pptx" || file.type.includes("presentationml")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Look for slide XML files: ppt/slides/slide1.xml, etc.
      const slideFiles: string[] = [];
      zip.forEach((relativePath) => {
        if (/^ppt\/slides\/slide\d+\.xml$/i.test(relativePath)) {
          slideFiles.push(relativePath);
        }
      });

      // Sort slide numbers numerically
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0], 10);
        const numB = parseInt(b.match(/\d+/)![0], 10);
        return numA - numB;
      });

      const slideContents: string[] = [];
      for (const slidePath of slideFiles) {
        const slideXml = await zip.file(slidePath)?.async("string");
        if (slideXml) {
          const slideNum = slidePath.match(/\d+/)![0];
          const text = extractTextFromDocXml(slideXml);
          slideContents.push(`--- [Slide ${slideNum}] ---\n${text.trim()}`);
        }
      }

      const fullPptxText =
        slideContents.length > 0
          ? slideContents.join("\n\n")
          : `PowerPoint Presentation "${file.name}" with ${slideFiles.length} slides.`;

      return {
        id,
        name,
        size,
        type: "presentation",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        textContent: fullPptxText,
      };
    } catch (err) {
      console.warn("Could not parse pptx slides:", err);
      return {
        id,
        name,
        size,
        type: "presentation",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        textContent: `PowerPoint presentation "${name}" (${(size / 1024).toFixed(1)} KB).`,
      };
    }
  }

  // Plain Text / Code / Markdown
  const textExtensions = ["txt", "md", "csv", "json", "js", "ts", "py", "ino", "c", "cpp", "h", "html", "css", "yaml", "xml"];
  if (file.type.startsWith("text/") || textExtensions.includes(ext)) {
    const textContent = await file.text();
    return {
      id,
      name,
      size,
      type: ["ino", "cpp", "py", "c", "js", "ts"].includes(ext) ? "code" : "text",
      mimeType: file.type || "text/plain",
      textContent,
    };
  }

  // Fallback as general document
  const rawText = await file.text().catch(() => "");
  return {
    id,
    name,
    size,
    type: "text",
    mimeType: file.type || "application/octet-stream",
    textContent: rawText || `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
  };
}

function cleanBase64(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(",");
  return commaIndex !== -1 ? dataUrl.substring(commaIndex + 1) : dataUrl;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMimeFromExt(ext: string): string {
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

/**
 * Strips XML tags and preserves clean text and spacing from docx / pptx XML nodes
 */
function extractTextFromDocXml(xml: string): string {
  // Replace paragraph break tags with newlines
  const withNewlines = xml
    .replace(/<\/w:p>/gi, "\n")
    .replace(/<\/a:p>/gi, "\n")
    .replace(/<w:tab\/>/gi, "\t")
    .replace(/<a:tab\/>/gi, "\t")
    .replace(/<w:br\/>/gi, "\n")
    .replace(/<a:br\/>/gi, "\n");

  // Remove XML tags
  const clean = withNewlines.replace(/<[^>]+>/g, " ");

  // Normalize multi-spaces and empty lines
  return clean
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
