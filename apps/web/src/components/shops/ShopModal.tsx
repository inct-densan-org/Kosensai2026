'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Pin, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { postersData } from '@/posters.data'
import RichText from '@/components/common/RichText'
import type { ShopAnnouncement } from '@/lib/shops'

type ShopModalProps = {
  index: number
  onClose?: () => void
  latestAnnouncement?: ShopAnnouncement
}

const CLOSE_DURATION_MS = 300

export default function ShopModal({ index, onClose, latestAnnouncement }: ShopModalProps) {
  const router = useRouter()
  const selectedShop = postersData[index]
  const groupedShops = selectedShop
  ? postersData.filter((poster) => poster.mapId === selectedShop.mapId)
  : []
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

  if (!selectedShop || isDesktop === null) {
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

  return createPortal((
    <div
      role="presentation"
      aria-hidden={!isOpen}
      onClick={() => setIsOpen(false)}
      className={`fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-md transition-opacity duration-150 ease-out md:items-stretch md:justify-end ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 delay-150'}`}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${selectedShop.title}の詳細`}
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

        <header className="flex w-full shrink-0 items-center justify-end px-5 py-4 md:px-8">
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
      className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 pb-8 md:px-8"
      >
      <div className="space-y-8">
      {groupedShops.map((poster, posterIndex) => {
      const posterOriginalIndex = postersData.indexOf(poster)

      return (
        <article
          key={`${poster.mapId}-${posterOriginalIndex}`}
          className="border-b border-slate-200 pb-8 last:border-b-0"
        >
          <h3 className="mb-4 text-xl font-bold text-slate-900">
            {poster.title}
          </h3>

          {poster.cancellationNotice && (
            <p className="mb-5 rounded-xl border-2 border-black px-4 py-5 text-center text-xl font-extrabold text-red-700">
              {poster.cancellationNotice}
            </p>
          )}

          {(poster.images ?? []).map((image, imageIndex) => (
            <div
              key={`${image}-${imageIndex}`}
              className="relative mx-auto mb-4 aspect-[277/392] w-full max-w-md bg-slate-100"
            >
              <Image
                src={image}
                alt={`${poster.title}のポスター ${imageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-contain"
                priority={posterIndex === 0 && imageIndex === 0}
              />
            </div>
          ))}

          {poster.desc && (
            <p className="whitespace-pre-wrap leading-7 text-slate-700">
              {poster.desc}
            </p>
          )}

          <Link
            href={`/shops/${poster.mapId}/detail`}
            className="mt-5 block rounded-full bg-slate-900 px-5 py-3 text-center font-bold text-white"
          >
            詳細情報を見る
          </Link>

          {latestAnnouncement && (
            <section className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-bold tracking-[0.12em] text-slate-500">屋台からのお知らせ</p>
              <h3 className={`mt-2 flex items-center gap-2 text-lg font-bold text-slate-800 ${latestAnnouncement.priority === 'high' ? 'rounded-lg border-2 border-[#287c95] bg-[#e6f4f7] px-3 py-2' : ''}`}>
                {latestAnnouncement.priority === 'high' && (
                  <span
                    aria-label="優先表示のお知らせ"
                    title="優先表示のお知らせ"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#287c95] text-white shadow-sm"
                  >
                    <Pin aria-hidden="true" size={15} className="fill-current" />
                  </span>
                )}
                {latestAnnouncement.title}
              </h3>
              <RichText content={latestAnnouncement.body} className="mt-3 text-sm leading-7 text-slate-700" />
            </section>
          )}
        </article>
      )
      })}
      </div>
      </div>
      </section>
    </div>
  ), document.body)
}
