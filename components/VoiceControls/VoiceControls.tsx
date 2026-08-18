"use client"

import { useState } from "react"
import { MicIcon } from "@/components/ui/icons"
import type { Question } from "@/types"
import styles from "./VoiceControls.module.css"

interface VoiceControlsProps {
  question: Question
  selected: number
  onListen: () => void
  onSelectOption: (index: number) => void
}

function optionLetter(index: number) {
  return String.fromCharCode(65 + index)
}

export function VoiceControls({ question, selected, onListen, onSelectOption }: VoiceControlsProps) {
  const [listening, setListening] = useState(false)

  function handleMicClick() {
    setListening(true)
    onListen()
    window.setTimeout(() => setListening(false), 1400)
  }

  return (
    <div className={styles.wrap} role="group" aria-label="Voice answer controls">
      <button
        type="button"
        className={`${styles.micBtn} ${listening ? styles.listening : ""}`}
        onClick={handleMicClick}
      >
        <MicIcon aria-hidden="true" />
        {listening ? "Listening..." : "Read question aloud"}
      </button>
      <p className={styles.hint}>Say an option letter, or select one below to simulate a voice answer.</p>
      <div className={styles.chips} role="group" aria-label="Simulated voice options">
        {question.opts.map((opt, i) => (
          <button
            key={opt}
            type="button"
            className={`${styles.chip} ${selected === i ? styles.chipActive : ""}`}
            onClick={() => onSelectOption(i)}
          >
            {optionLetter(i)}
          </button>
        ))}
      </div>
    </div>
  )
}
