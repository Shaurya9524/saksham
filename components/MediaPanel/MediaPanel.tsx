"use client"

import { useState } from "react"
import { VideoIcon, CameraIcon, SignLanguageIcon } from "@/components/ui/icons"
import { useGestureDemo } from "@/hooks/useGestureDemo"
import type { MediaTab } from "@/types"
import styles from "./MediaPanel.module.css"

interface MediaPanelProps {
  islCaption: string
  onGestureConfirmed: () => void
}

const TABS: { id: MediaTab; label: string; Icon: typeof VideoIcon }[] = [
  { id: "isl", label: "ISL video", Icon: VideoIcon },
  { id: "cam", label: "Webcam", Icon: CameraIcon },
]

export function MediaPanel({ islCaption, onGestureConfirmed }: MediaPanelProps) {
  const [tab, setTab] = useState<MediaTab>("isl")
  const gesture = useGestureDemo()

  function handleStart() {
    gesture.start()
  }

  function handleDetectedConfirm() {
    onGestureConfirmed()
    gesture.reset()
  }

  return (
    <aside className={styles.wrap} aria-label="Interpreter and gesture panel">
      <div className={styles.tabs} role="tablist" aria-label="Media mode">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = tab === id
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => setTab(id)}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      {tab === "isl" ? (
        <div className={styles.panelBody} role="tabpanel">
          <div className={styles.islScreen}>
            <SignLanguageIcon size={44} aria-hidden="true" />
            <p className={styles.islHint}>ISL interpreter clip</p>
          </div>
          <p className={styles.caption}>{islCaption}</p>
        </div>
      ) : (
        <div className={styles.panelBody} role="tabpanel">
          <div className={styles.camScreen}>
            <CameraIcon size={40} aria-hidden="true" />
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: `${gesture.progress}%` }} />
            </div>
          </div>
          <p className={styles.pillText} role="status">
            {gesture.pillText}
          </p>
          <div className={styles.camActions}>
            {!gesture.detected ? (
              <button type="button" className={styles.camBtn} onClick={handleStart}>
                Simulate hand sign
              </button>
            ) : (
              <button type="button" className={styles.camBtnConfirm} onClick={handleDetectedConfirm}>
                Confirm answer &amp; continue
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
