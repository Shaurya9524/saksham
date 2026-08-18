"use client"

import { useCallback, useEffect } from "react"
import { ExamTopBar } from "@/components/ExamTopBar"
import { QuestionPalette } from "@/components/QuestionPalette"
import { QuestionPanel } from "@/components/QuestionPanel"
import { MediaPanel } from "@/components/MediaPanel"
import { VoiceControls } from "@/components/VoiceControls"
import { CaptionBar } from "@/components/CaptionBar"
import { LiveRegion } from "@/components/ui/LiveRegion"
import { useExamState } from "@/hooks/useExamState"
import { useTimer } from "@/hooks/useTimer"
import { useTextToSpeech } from "@/hooks/useTextToSpeech"
import { INITIAL_TIMER_SECONDS } from "@/config/questions"
import styles from "./exam.module.css"
import { AccessibilityBar } from "@/components/AccessibilityBar"

export default function ExamPage() {
  const exam = useExamState()
  const timer = useTimer(INITIAL_TIMER_SECONDS)
  const tts = useTextToSpeech()

  const handleListen = useCallback(() => {
    tts.readQuestion(exam.question)
  }, [tts, exam.question])

  const handleReread = useCallback(() => {
    exam.reread()
    tts.readQuestion(exam.question)
  }, [exam, tts])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (event.key >= "1" && event.key <= "4") {
        const index = Number(event.key) - 1
        if (index < exam.question.opts.length) exam.selectOption(index)
        return
      }
      switch (event.key) {
        case "ArrowRight":
          exam.goNext()
          break
        case "ArrowLeft":
          exam.goPrev()
          break
        case "m":
        case "M":
          exam.markReview()
          break
        case "r":
        case "R":
          handleReread()
          break
        default:
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [exam, handleReread])

  return (
    <>
      <AccessibilityBar />
      <div className={styles.page}>
        <ExamTopBar questionNumber={exam.questionNumber} formattedTime={timer.formatted} timerStatus={timer.status} />
        <LiveRegion message={exam.captionText} />
        <div className={styles.body}>
          <QuestionPalette statuses={exam.statuses} current={exam.current} onJump={exam.jumpTo} />
          <main id="main" className={styles.main}>
            <p className={styles.hint}>
              Shortcuts: <kbd>1</kbd>-<kbd>4</kbd> select option, <kbd>&#8592;</kbd>/<kbd>&#8594;</kbd> navigate,{" "}
              <kbd>M</kbd> mark for review, <kbd>R</kbd> read again.
            </p>
            <QuestionPanel
              question={exam.question}
              questionNumber={exam.questionNumber}
              selected={exam.selected}
              mode={exam.mode}
              onSelectOption={exam.selectOption}
              onModeChange={exam.setMode}
              onNext={exam.goNext}
              onPrev={exam.goPrev}
              onMarkReview={exam.markReview}
              onReread={handleReread}
            />
            {exam.mode === "voice" && (
              <VoiceControls
                question={exam.question}
                selected={exam.selected}
                onListen={handleListen}
                onSelectOption={exam.selectOption}
              />
            )}
          </main>
          <MediaPanel islCaption={exam.islCaption} onGestureConfirmed={exam.goNext} />
        </div>
        <CaptionBar text={exam.captionText} active={exam.mode !== "key"} />
      </div>
    </>
  )
}
