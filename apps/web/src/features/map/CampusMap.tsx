'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { shops, type Shop } from '@/data/shops'
import ShopModal from '@/features/shops/ShopModal'
import styles from './map.module.css'
import { maps } from '@/data/maps'
import MapCanvas from './MapCanvas'
import PinOverlay from './PinOverlay'

export default function CampusMap({ initialShopId }: { initialShopId?: string }) {
  const initialShop = initialShopId ? shops.find(s => s.id === initialShopId) : null
  const [activeShop, setActiveShop] = useState<Shop | null>(initialShop || null)
  const selectedPin = useRef<HTMLButtonElement>(null)

  const activeShopId = activeShop?.id

  // URLに合わせて初期スクロールする
  useEffect(() => {
    if (initialShopId) {
      selectedPin.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
      })
      selectedPin.current?.focus({ preventScroll: true })
    }
  }, [initialShopId])

  const copyUrl = useCallback(async () => {
    if (!activeShopId) return
    const url = new URL(window.location.href)
    url.searchParams.set('shopId', activeShopId)
    try {
      await navigator.clipboard.writeText(url.toString())
      alert('URLをコピーしました！')
    } catch (e) {
      alert('URLのコピーに失敗しました。')
    }
  }, [activeShopId])

  return (
    <>
      <div className={styles.controls}>
        <button
          type="button"
          disabled={!activeShopId}
          onClick={copyUrl}
          className={styles.copyButton}
        >
          選択中の屋台のURLをコピー
        </button>
      </div>

      {maps.map(map => (
        <section key={map.id} id={map.id} className={styles.section} aria-labelledby={`${map.id}-title`}>
          <h2 id={`${map.id}-title`}>{map.name}</h2>
          <MapCanvas name={map.name} selectedIndex={activeShopId ? shops.findIndex(s => s.id === activeShopId) : -1}>
            <div className={styles.map}>
              <Image src={map.image} alt={`${map.name}の構内図`} className={styles.image} sizes="(max-width: 832px) calc(100vw - 32px), 800px" draggable={false} />
              <PinOverlay
                mapId={map.id}
                shops={shops}
                activeShopId={activeShopId}
                selectedPinRef={selectedPin}
                onPinClick={setActiveShop}
              />
            </div>
          </MapCanvas>
          <ul className={styles.shops}>
            {shops.map((shop, index) => {
              const hasPinInThisMap = shop.pins.some(p => p.mapId === map.id)
              if (!hasPinInThisMap) return null
              return (
                <li key={shop.id}>
                  <button onClick={() => setActiveShop(shop)} aria-haspopup="dialog" aria-current={shop.id === activeShopId ? 'true' : undefined}>
                    <span className={styles.number}>{index + 1}</span>{shop.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      {activeShop && <p role="status">選択中: {activeShop.name}（{activeShop.location}）</p>}
      {activeShop && <ShopModal shop={activeShop} onClose={() => setActiveShop(null)} />}
    </>
  )
}
