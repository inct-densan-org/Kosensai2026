import Link from 'next/link'

export default function NotFound() {
  return <main className="page"><h1>屋台が見つかりません</h1><Link href="/map">マップへ戻る</Link></main>
}
