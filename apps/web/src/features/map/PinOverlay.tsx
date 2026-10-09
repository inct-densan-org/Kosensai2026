import type { RefObject } from 'react'
import { type Shop } from '@/data/shops'
import styles from './map.module.css'

export default function PinOverlay({
  mapId,
  shops,
  activeShopId,
  selectedPinRef,
  onPinClick
}: {
  mapId: string
  shops: Shop[]
  activeShopId: string | undefined
  selectedPinRef: RefObject<HTMLButtonElement | null>
  onPinClick: (shop: Shop) => void
}) {
  return (
    <>
      {shops.map((shop, shopIndex) =>
        shop.pins.map((pin, pinIndex) => {
          if (pin.mapId !== mapId) return null
          const isSelected = shop.id === activeShopId
          // 最初のピンだけrefをつける（スクロール用）
          const isFirstPinOfSelectedShop = isSelected && pinIndex === 0
          return (
            <button
              key={`${shop.id}-${pinIndex}`}
              ref={isFirstPinOfSelectedShop ? selectedPinRef : undefined}
              className={styles.pin}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              aria-label={`${shop.name}の概要を開く`}
              aria-haspopup="dialog"
              aria-current={isSelected ? 'location' : undefined}
              onClick={event => {
                event.currentTarget.focus({ preventScroll: true })
                onPinClick(shop)
              }}
            >
              {shopIndex + 1}
            </button>
          )
        })
      )}
    </>
  )
}
