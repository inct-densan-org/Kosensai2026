'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Dialog.module.css'

export default function Dialog({ children, labelledBy, onClose }: {
  children: ReactNode
  labelledBy: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.documentElement.style.overflow

    dialog.showModal()

    document.documentElement.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.documentElement.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      data-closing={closing}
      aria-labelledby={labelledBy}
      aria-modal="true"
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const items = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement?.getAttribute('tabindex') === '-1')) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onCancel={event => { event.preventDefault(); setClosing(true) }}
      onClick={event => { if (event.target === event.currentTarget) setClosing(true) }}
    >
      <div
        className={styles.panel}
        tabIndex={-1}
        autoFocus
        onAnimationEnd={event => {
          if (closing && event.target === event.currentTarget) onClose()
        }}
      >
        <button className={styles.close} onClick={() => setClosing(true)} aria-label="閉じる">×</button>
        {children}
      </div>
    </dialog>
  )
}
