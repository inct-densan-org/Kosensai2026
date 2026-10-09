'use client'

import Link from 'next/link'
import { useId } from 'react'
import Dialog from '@/components/ui/ShopDialog'
import ShopPoster from './ShopPoster'
import type { Shop } from '@/data/shops'
import styles from './shops.module.css'

export default function ShopModal({ shop, onClose }: { shop: Shop; onClose: () => void }) {
  const titleId = useId()
  const href = `/shops/${shop.id}`

  return (
    <Dialog labelledBy={titleId} onClose={onClose}>
      <div className={styles.shop}>
        <h2 id={titleId} className={styles.modalTitle}>{shop.name}</h2>
        <p className={styles.note}>場所: {shop.location}</p>
        <ShopPoster shop={shop} />
        <Link className={styles.linkButton} href={href}>詳しく見る</Link>
      </div>
    </Dialog>
  )
}
