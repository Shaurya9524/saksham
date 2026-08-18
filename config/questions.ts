import type { PaletteStatus, Question } from "@/types"

export const EXAM_NAME = "General Science"

export const QUESTIONS: Question[] = [
  { q: "What is the chemical formula of water?", opts: ["H2O2", "H2O", "CO2", "NaCl"], answer: 1 },
  {
    q: "Which gas do plants absorb from the air for photosynthesis?",
    opts: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: 2,
  },
  { q: "What force pulls objects toward the Earth?", opts: ["Magnetism", "Gravity", "Friction", "Tension"], answer: 1 },
  { q: "How many bones are in the adult human body?", opts: ["186", "206", "226", "246"], answer: 1 },
]

export const PALETTE_SIZE = 12

export const INITIAL_PALETTE_STATUSES: PaletteStatus[] = [
  "done",
  "done",
  "done",
  "review",
  "left",
  "left",
  "left",
  "left",
  "left",
  "left",
  "left",
  "left",
]

export const INITIAL_QUESTION_INDEX = 3

export const INITIAL_TIMER_SECONDS = 44 * 60 + 12
