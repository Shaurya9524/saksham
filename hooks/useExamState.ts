"use client"

import { useCallback, useReducer } from "react"
import { INITIAL_PALETTE_STATUSES, INITIAL_QUESTION_INDEX, PALETTE_SIZE, QUESTIONS } from "@/config/questions"
import type { ExamMode, PaletteStatus, Question } from "@/types"

interface ExamState {
  current: number
  statuses: PaletteStatus[]
  selected: number
  mode: ExamMode
  captionText: string
  islCaption: string
}

type ExamAction =
  | { type: "SELECT_OPTION"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "MARK_REVIEW" }
  | { type: "JUMP"; paletteIndex: number }
  | { type: "SET_MODE"; mode: ExamMode }
  | { type: "REREAD" }

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index)
}

function currentQuestion(current: number): Question {
  return QUESTIONS[current % QUESTIONS.length]
}

function renderCaptions(current: number) {
  const data = currentQuestion(current)
  const displayNumber = (current % PALETTE_SIZE) + 1
  return {
    selected: data.answer,
    captionText: `Question ${displayNumber}: ${data.q} Option ${optionLetter(data.answer)}: ${data.opts[data.answer]}, selected.`,
    islCaption: `Signing: "${data.q}"`,
  }
}

function createInitialState(): ExamState {
  const captions = renderCaptions(INITIAL_QUESTION_INDEX)
  return {
    current: INITIAL_QUESTION_INDEX,
    statuses: [...INITIAL_PALETTE_STATUSES],
    selected: captions.selected,
    mode: "sign",
    captionText: captions.captionText,
    islCaption: captions.islCaption,
  }
}

function reducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "SELECT_OPTION": {
      const data = currentQuestion(state.current)
      return {
        ...state,
        selected: action.index,
        captionText: `Option ${optionLetter(action.index)}: ${data.opts[action.index]}, selected.`,
      }
    }
    case "NEXT": {
      const statuses = [...state.statuses]
      statuses[state.current] = "done"
      const nextCurrent = (state.current + 1) % QUESTIONS.length
      return { ...state, statuses, current: nextCurrent, ...renderCaptions(nextCurrent) }
    }
    case "PREV": {
      const prevCurrent = (state.current - 1 + QUESTIONS.length) % QUESTIONS.length
      return { ...state, current: prevCurrent, ...renderCaptions(prevCurrent) }
    }
    case "MARK_REVIEW": {
      const statuses = [...state.statuses]
      statuses[state.current] = "review"
      return { ...state, statuses }
    }
    case "JUMP": {
      const nextCurrent = action.paletteIndex % QUESTIONS.length
      return { ...state, current: nextCurrent, ...renderCaptions(nextCurrent) }
    }
    case "SET_MODE":
      return { ...state, mode: action.mode }
    case "REREAD": {
      const data = currentQuestion(state.current)
      return { ...state, captionText: `Re-reading: ${data.q}` }
    }
    default:
      return state
  }
}

export function useExamState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const selectOption = useCallback((index: number) => dispatch({ type: "SELECT_OPTION", index }), [])
  const goNext = useCallback(() => dispatch({ type: "NEXT" }), [])
  const goPrev = useCallback(() => dispatch({ type: "PREV" }), [])
  const markReview = useCallback(() => dispatch({ type: "MARK_REVIEW" }), [])
  const jumpTo = useCallback((paletteIndex: number) => dispatch({ type: "JUMP", paletteIndex }), [])
  const setMode = useCallback((mode: ExamMode) => dispatch({ type: "SET_MODE", mode }), [])
  const reread = useCallback(() => dispatch({ type: "REREAD" }), [])

  const question = currentQuestion(state.current)
  const questionNumber = (state.current % PALETTE_SIZE) + 1

  return {
    ...state,
    question,
    questionNumber,
    selectOption,
    goNext,
    goPrev,
    markReview,
    jumpTo,
    setMode,
    reread,
  }
}
