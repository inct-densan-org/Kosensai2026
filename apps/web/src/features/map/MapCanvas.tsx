'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import styles from './map.module.css'

export default function MapCanvas({ children, name, selectedIndex }: {
  children: ReactNode
  name: string
  selectedIndex: number
}) {
  const transform = useRef<ReactZoomPanPinchRef>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const dragged = useRef(false)

  // 場所確認で戻ったときは、対象のピンが隠れないよう全体表示に戻す。
  useEffect(() => {
    transform.current?.resetTransform(0)
  }, [selectedIndex])

  return (
    <div ref={viewport} className={styles.viewport} role="region" aria-label={`${name}の地図`}>
      <TransformWrapper
        ref={transform}
        minScale={1}
        maxScale={4}
        onTransform={(_, { scale }) => {
          viewport.current?.style.setProperty('--pin-scale', String(1 / scale))
        }}
        wheel={{ disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        onPanning={() => { dragged.current = true }}
        onPinchStart={() => { dragged.current = true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className={styles.zoomControls} role="group" aria-label="地図の拡大縮小">
              <button type="button" onClick={() => zoomIn(Math.log(1.5), 0)} aria-label="地図を拡大">＋</button>
              <button type="button" onClick={() => zoomOut(Math.log(1.5), 0)} aria-label="地図を縮小">−</button>
              <button type="button" onClick={() => resetTransform(0)} aria-label="地図全体を表示">全体</button>
            </div>
            <div
              onPointerDownCapture={event => { if (event.isPrimary) dragged.current = false }}
              onClickCapture={event => {
                if (dragged.current && event.detail !== 0) {
                  event.preventDefault()
                  event.stopPropagation()
                }
              }}
            >
              <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%' }}>
                {children}
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
