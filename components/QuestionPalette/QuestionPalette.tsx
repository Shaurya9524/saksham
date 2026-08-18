import { PALETTE_SIZE } from "@/config/questions"
import type { PaletteStatus } from "@/types"
import styles from "./QuestionPalette.module.css"

interface QuestionPaletteProps {
  statuses: PaletteStatus[]
  current: number
  onJump: (index: number) => void
}

const LEGEND: { status: PaletteStatus; label: string }[] = [
  { status: "done", label: "Answered" },
  { status: "review", label: "Marked for review" },
  { status: "left", label: "Not visited" },
]

export function QuestionPalette({ statuses, current, onJump }: QuestionPaletteProps) {
  return (
    <nav className={styles.wrap} aria-label="Question palette">
      <h2 className={styles.heading}>Questions</h2>
      <div className={styles.grid} role="group" aria-label="Jump to question">
        {Array.from({ length: PALETTE_SIZE }, (_, i) => {
          const status = statuses[i]
          const isCurrent = i === current
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={`${styles.cell} ${styles[status]} ${isCurrent ? styles.current : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`Question ${i + 1}, ${status === "done" ? "answered" : status === "review" ? "marked for review" : "not visited"}${isCurrent ? ", current question" : ""}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <ul className={styles.legend}>
        {LEGEND.map((item) => (
          <li key={item.status} className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles[item.status]}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  )
}
