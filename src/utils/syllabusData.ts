import { SyllabusType } from "../types";

export interface SyllabusInfo {
  id: SyllabusType;
  title: string;
  badge: string;
  countryOrSystem: string;
  level: string;
  description: string;
  paperInfo: string[];
  popularSubjects: string[];
  markSchemeTips: string[];
}

export const SYLLABUS_CATALOG: Record<SyllabusType, SyllabusInfo> = {
  igcse: {
    id: "igcse",
    title: "Cambridge IGCSE",
    badge: "IGCSE / O-Level",
    countryOrSystem: "Cambridge Assessment International Education (CAIE)",
    level: "Years 10–11 / Grades 9–10 (Ages 14–16)",
    description:
      "Internationally recognized British curriculum focusing on deep conceptual understanding, practical inquiry, and strict command-word mark schemes.",
    paperInfo: [
      "Paper 1 / Paper 2: Multiple Choice Questions (MCQ) - 45 mins (40 marks, testing AO1 & AO2)",
      "Paper 3 / Paper 4: Theory / Extended Structured Questions - 1h 15m to 2h (80 marks, core definitions, derivations, multi-step math/science calculations)",
      "Paper 5 / Paper 6: Practical Test or Alternative to Practical - 1h (40 marks, experimental design, tables, graphs, error evaluation, safety)",
    ],
    popularSubjects: [
      "Mathematics (0580 / 0607)",
      "Physics (0625)",
      "Chemistry (0620)",
      "Biology (0610)",
      "Computer Science (0478)",
      "Economics (0455)",
      "Business Studies (0450)",
      "English First Language (0500)",
    ],
    markSchemeTips: [
      "Target Cambridge command words strictly: 'State' (1 mark brief), 'Describe' (what happens), 'Explain' (how/why with science keywords), 'Evaluate' (pros/cons + conclusion).",
      "Always include correct SI units and 3 significant figures in numerical answers.",
      "In Paper 6 (Alternative to Practical), always quote controlled variables and repeat-and-average recommendations.",
    ],
  },

  cambridge_lower: {
    id: "cambridge_lower",
    title: "Cambridge Lower Secondary",
    badge: "Cambridge Checkpoint",
    countryOrSystem: "Cambridge Assessment International Education (CAIE)",
    level: "Stages 7, 8, 9 / Grades 6–8 (Ages 11–14)",
    description:
      "Builds solid conceptual foundations for young learners preparing for IGCSE, tested via Cambridge Checkpoint assessments with friendly scaffolding.",
    paperInfo: [
      "Checkpoint Paper 1: Core knowledge and structured problem solving (50 marks, 45-60 mins)",
      "Checkpoint Paper 2: Inquiry, data analysis, practical applications, and investigation scenarios (50 marks)",
      "Stage Progression Tests: Diagnostic assessments measuring Stage 7, 8, and 9 mastery",
    ],
    popularSubjects: [
      "Cambridge Lower Secondary Science (Stages 7-9)",
      "Cambridge Lower Secondary Mathematics (Stages 7-9)",
      "Cambridge Lower Secondary English (Stages 7-9)",
      "Cambridge Lower Secondary Computing (Stages 7-9)",
    ],
    markSchemeTips: [
      "Show all working steps for intermediate method marks (M1, A1).",
      "Use clear scientific labels and draw pencil diagrams with clean single lines.",
      "Read data carefully from axes before answering inquiry questions.",
    ],
  },

  necta: {
    id: "necta",
    title: "NECTA (Tanzania)",
    badge: "NECTA CSEE / ACSEE",
    countryOrSystem: "National Examinations Council of Tanzania (NECTA)",
    level: "Form 1–4 (CSEE) & Form 5–6 (ACSEE)",
    description:
      "Tanzanian national curriculum governed by TIE and examined by NECTA. Emphasizes structured problem-solving, local Tanzanian applications, and standard exam format.",
    paperInfo: [
      "Section A: Objective Items (15–20 marks) - Multiple choice, matching items, and quick short questions",
      "Section B: Structured Short-Answer Questions (54 marks) - 6 to 9 compulsory calculation and conceptual questions",
      "Section C: Essay & Long-Structured Questions (30 marks) - Detailed mathematical proofs, essays, or comprehensive problem solutions",
      "Practical Papers (Paper 2 / 3): 2h 30m laboratory sessions (Mechanics, Optics, Titration, Food Tests)",
    ],
    popularSubjects: [
      "Basic Mathematics (Form 1-4)",
      "Physics (Form 1-4 & 5-6 PCM/PCB)",
      "Chemistry (Form 1-4 & 5-6 PCB/CBG)",
      "Biology (Form 1-4)",
      "Kiswahili (Fasihi & Sarufi)",
      "Civics & General Studies",
      "Geography & History",
      "Book Keeping & Commerce",
      "Advanced Mathematics (BAM / Pure Math)",
    ],
    markSchemeTips: [
      "Strict layout for calculation questions: Formula -> Substitution -> Calculation -> Final Answer with Units.",
      "In essays (Section C), always start with a clear definition, provide 4-6 distinct labeled points with explanations, and end with a concise conclusion.",
      "Refer to Tanzanian context where appropriate (e.g. Julius Nyerere Hydropower station, Rift Valley, local ecosystems, mining in Geita/Mwadui).",
    ],
  },

  a_level: {
    id: "a_level",
    title: "Cambridge International A Level",
    badge: "Cambridge A-Level",
    countryOrSystem: "Cambridge Assessment International Education (CAIE)",
    level: "Years 12–13 / Grades 11–12 (Ages 16–19)",
    description:
      "Rigorous university-preparation qualification with deep mathematical and scientific derivations and advanced problem solving.",
    paperInfo: [
      "Paper 1 & Paper 2: AS Level Multiple Choice and AS Structured Questions",
      "Paper 3: Advanced Practical Skills Laboratory",
      "Paper 4: A Level Structured Questions (Extended synoptic topics)",
      "Paper 5: Planning, Analysis and Evaluation",
    ],
    popularSubjects: [
      "Mathematics (9709)",
      "Further Mathematics (9231)",
      "Physics (9702)",
      "Chemistry (9701)",
      "Biology (9700)",
      "Computer Science (9618)",
      "Economics (9708)",
    ],
    markSchemeTips: [
      "Derivations must state every single mathematical identity or physical law used.",
      "Pay strict attention to vector signs, significant figures, and error propagation.",
    ],
  },

  ib: {
    id: "ib",
    title: "International Baccalaureate (IB)",
    badge: "IB DP / MYP",
    countryOrSystem: "International Baccalaureate Organization",
    level: "Middle Years Programme (MYP) & Diploma Programme (DP)",
    description:
      "Holistic inquiry-based curriculum featuring Standard Level (SL) and Higher Level (HL) subjects with Theory of Knowledge and Internal Assessments.",
    paperInfo: [
      "Paper 1: Multiple choice (SL/HL) or text analysis without calculator",
      "Paper 2: Data-based questions and short/long structured questions",
      "Paper 3: Experimental inquiry / options / comprehension",
    ],
    popularSubjects: [
      "Mathematics Analysis & Approaches (AA)",
      "Physics HL/SL",
      "Chemistry HL/SL",
      "Biology HL/SL",
      "Computer Science HL/SL",
      "Economics HL/SL",
    ],
    markSchemeTips: [
      "Address IB Command Terms (Evaluate, Examine, To what extent) with counterarguments and balance.",
      "State explicit assumptions and limitations when modeling real-world data.",
    ],
  },

  cbse: {
    id: "cbse",
    title: "CBSE / NCERT",
    badge: "CBSE Board",
    countryOrSystem: "Central Board of Secondary Education (India)",
    level: "Classes 9–12",
    description:
      "Standard Indian national curriculum based on NCERT books with structured Board Exams and competitive exam foundations.",
    paperInfo: [
      "Section A: 1-mark MCQs & Assertion-Reasoning",
      "Section B: 2-mark Very Short Answer questions",
      "Section C: 3-mark Conceptual Short Answer questions",
      "Section D: 5-mark Long Answer questions",
      "Section E: 4-mark Case Study / Source-based questions",
    ],
    popularSubjects: [
      "Class 10/12 Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science (Python)",
      "Informatics Practices",
    ],
    markSchemeTips: [
      "Follow NCERT textbook wording directly for definitions.",
      "Step-marking is applied strictly—always write intermediate steps.",
    ],
  },

  general: {
    id: "general",
    title: "General / University / Polytechnic",
    badge: "General & College",
    countryOrSystem: "Universal Academic & Engineering",
    level: "Higher Education & Self-Paced Mastery",
    description:
      "Deep foundational explanations, engineering applications, and clear pedagogical guidance for any level or topic.",
    paperInfo: ["Standard academic midterm and final examinations, lab reports, and technical project assessments."],
    popularSubjects: ["Computer Science", "Electrical Engineering", "Applied Calculus", "Data Science", "General Sciences"],
    markSchemeTips: [
      "Structure with clear thesis, evidence, calculations, and real-world implementation notes.",
    ],
  },

  unspecified: {
    id: "unspecified",
    title: "Ask / Choose Syllabus",
    badge: "Select Syllabus",
    countryOrSystem: "Customized to Your School Board",
    level: "All Grades & Levels",
    description:
      "worktorrney adapts specifically to your school curriculum (IGCSE, Cambridge Lower Secondary, NECTA, A-Level, IB, or CBSE) for personalized exam paper guidance.",
    paperInfo: ["Select a syllabus to see exact exam paper codes, mark schemes, and question blueprints."],
    popularSubjects: ["Sciences", "Mathematics", "Coding & Microcontrollers", "Humanities", "Languages"],
    markSchemeTips: ["Select your curriculum in the top menu or click one of the quick options below."],
  },
};
