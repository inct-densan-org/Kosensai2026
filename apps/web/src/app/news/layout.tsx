import TopBar from '@/components/common/TopBar'
import type { ReactNode } from 'react'

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar current="NEWS" />
      {children}
    </>
  )
}
