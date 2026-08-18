import { ModeSwitcher } from "@/components/ModeSwitcher"
import { CheckIcon, FlagIcon, PrevIcon, NextIcon, ReplayIcon } from "@/components/ui/icons"
import type { ExamMode, Question } from "@/types"
import styles from "./QuestionPanel.module.css"

interface QuestionPanelProps {
  question: Question
  questionNumber: number
  selected: number
  mode: ExamMode
  onSelectOption: (index: number) => void
  onModeChange: (mode: ExamMode) => void
  onNext: () => void
  onPrev: () => void
  onMarkReview: () => void
  onReread: () => void
}

function optionLetter(index: number) {
  return String.fromCharCode(65 + index)
}

export function QuestionPanel({
  question,
  questionNumber,
  selected,
  mode,
  onSelectOption,
  onModeChange,
  onNext,
  onPrev,
  onMarkReview,
  onReread,
}: QuestionPanelProps) {
  return (
    <section className={styles.wrap} aria-labelledby="question-heading">
      <div className={styles.toolbar}>
        <ModeSwitcher mode={mode} onChange={onModeChange} />
        <button type="button" className={styles.rereadBtn} onClick={onReread}>
          <ReplayIcon aria-hidden="true" /> Read again
        </button>
      </div>

      <p className={styles.qNumber}>Question {questionNumber}</p>
      <h2 id="question-heading" className={styles.qText}>
        {question.q}
      </h2>

      <fieldset className={styles.options}>
        <legend className="sr-only">Answer options for question {questionNumber}</legend>
        {question.opts.map((opt, i) => {
          const isSelected = selected === i
          return (
            <label key={opt} className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}>
              <input
                type="radio"
                name="answer"
                value={i}
                checked={isSelected}
                onChange={() => onSelectOption(i)}
                className={styles.radioInput}
              />
              <span className={styles.letter} aria-hidden="true">
                {isSelected ? <CheckIcon /> : optionLetter(i)}
              </span>
              {opt}
            </label>
          )
        })}
      </fieldset>

      <div className={styles.actions}>
        <button type="button" className={styles.navBtn} onClick={onPrev}>
          <PrevIcon aria-hidden="true" /> Previous
        </button>
        <button type="button" className={styles.reviewBtn} onClick={onMarkReview}>
          <FlagIcon aria-hidden="true" /> Mark for review
        </button>
        <button type="button" className={styles.nextBtn} onClick={onNext}>
          Save &amp; next <NextIcon aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
