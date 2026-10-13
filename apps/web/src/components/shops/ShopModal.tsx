'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { postersData } from '@/posters.data'

type ShopModalProps = {
  index: number
  onClose?: () => void
}

const CLOSE_DURATION_MS = 300

export default function ShopModal({ index, onClose }: ShopModalProps) {
  const router = useRouter()
  const shop = postersData[index]
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [stretch, setStretch] = useState(0)
  const dragStartY = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateLayout = () => setIsDesktop(mediaQuery.matches)

    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      mediaQuery.removeEventListener('change', updateLayout)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    if (isDesktop === null || hasOpened) return

    const frame = requestAnimationFrame(() => {
      setHasOpened(true)
      setIsOpen(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [hasOpened, isDesktop])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (!hasOpened || isOpen) return

    const timer = window.setTimeout(() => {
      if (onClose) {
        onClose()
      } else {
        router.back()
      }
    }, CLOSE_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [hasOpened, isOpen, onClose, router])

  if (!shop || isDesktop === null) {
    return null
  }

  const startDragging = (event: PointerEvent<HTMLElement>) => {
    if (isDesktop) return
    if ((event.target as HTMLElement).closest('[data-sheet-scroll]')) return

    dragStartY.current = event.clientY
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveSheet = (event: PointerEvent<HTMLElement>) => {
    if (!isDragging || isDesktop) return

    const distance = event.clientY - dragStartY.current

    if (distance < 0) {
      // 下端を固定したまま、上方向へ引いた量だけシートを伸ばす。
      setStretch(Math.min(-distance, window.innerHeight * 0.1))
      setDragOffset(0)
      return
    }

    setStretch(0)
    setDragOffset(distance)
  }

  const finishDragging = (event: PointerEvent<HTMLElement>) => {
    if (!isDragging || isDesktop) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setIsDragging(false)

    if (dragOffset >= window.innerHeight * 0.2) {
      setIsOpen(false)
      return
    }

    setDragOffset(0)
    setStretch(0)
  }

  const cancelDragging = () => {
    setIsDragging(false)
    setDragOffset(0)
    setStretch(0)
  }

  const panelTransform = isDesktop
    ? `translateX(${isOpen ? '0' : '100%'})`
    : `translateY(${isOpen ? `${dragOffset}px` : '100%'})`

  return (
    <div
      role="presentation"
      aria-hidden={!isOpen}
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-md transition-opacity duration-150 ease-out md:items-stretch md:justify-end ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 delay-150'}`}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`shop-modal-title-${index}`}
        onPointerDown={startDragging}
        onPointerMove={moveSheet}
        onPointerUp={finishDragging}
        onPointerCancel={cancelDragging}
        onLostPointerCapture={cancelDragging}
        onClick={(event) => event.stopPropagation()}
        className={`pointer-events-auto flex w-full touch-none select-none flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl will-change-transform md:h-dvh md:w-[min(640px,50vw)] md:rounded-none ${isDragging ? 'cursor-grabbing transition-none' : 'transition-[transform,height] duration-300 ease-[cubic-bezier(.22,1,.36,1)]'}`}
        style={{
          height: isDesktop ? '100dvh' : `calc(90dvh + ${stretch}px)`,
          maxHeight: '100dvh',
          transform: panelTransform,
        }}
      >
        <div className="flex min-h-6 w-full shrink-0 cursor-grab items-center justify-center md:hidden">
          <span className="h-1 w-12 rounded-full bg-slate-200" />
        </div>

        <header className="flex w-full shrink-0 items-center justify-between gap-4 px-5 py-6 md:px-8">
          <h2 id={`shop-modal-title-${index}`} className="text-3xl font-bold text-slate-800">
            {shop.title}
          </h2>
          <button
            type="button"
            aria-label="屋台概要を閉じる"
            onClick={() => setIsOpen(false)}
            className="grid min-h-12 min-w-12 place-items-center rounded-full bg-transparent p-0 text-slate-700 hover:bg-slate-100"
          >
            <X aria-hidden="true" size={32} />
          </button>
        </header>

        <div
          data-sheet-scroll
          className="min-h-0 flex-1 touch-pan-y overflow-y-auto px-5 pb-5 md:px-8 md:pb-8"
        >
          {shop.images?.[0] && (
            <div className="relative mx-auto aspect-[277/392] w-full max-w-md bg-slate-100">
              <Image
                src={shop.images[0]}
                alt={`${shop.title}のポスター`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-contain"
                priority
              />
            </div>
          )}

          <Link
            href={`/shops/${index}/detail`}
            className="mt-5 block rounded-full bg-slate-900 px-5 py-3 text-center font-bold text-white"
          >
            詳細情報を見る
          </Link>
        </div>
      </section>
    </div>
  )
}
