import Image from 'next/image'
import type { Shop } from '@/data/shops'
import styles from './shops.module.css'

export default function ShopPoster({ shop }: { shop: Shop }) {
  return <Image className={styles.poster} src={shop.image} alt={`${shop.name}のポスター（仮画像）`} width={600} height={800} />
}
