import TopBar from '@/components/common/TopBar'
import type { ReactNode } from 'react'
import Footer from '@/components/common/Footer'

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar current="NEWS" />
      {children}
      <Footer />
    </>
  )
}
