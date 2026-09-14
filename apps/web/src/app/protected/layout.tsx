import type { ReactNode } from 'react'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return children
}
