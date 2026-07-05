import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'


export const metadata: Metadata = {
  title: "一関工業高等専門学校 高専祭2026",
  description: "一関工業高等専門学校にて開催される第62回高専祭の特設サイトです。10月24日(土)、25日(日)の午前9時から午後5時まで開場しております。一般公開していますので、ぜひご来場ください。",
  authors: {},
  openGraph: {
    type: "website",
    locale: "ja_JP",
    images: [{
      url: "https://kosensai.ichinoseki.ac.jp/ogp/thumbnail.webp",
      width: 512,
      height: 512
    }],
    title: "一関工業高等専門学校 高専祭2026",
    siteName: "一関工業高等専門学校 高専祭2026",
    description: "一関工業高等専門学校にて開催される第62回高専祭の特設サイトです。10月24日(土)、25日(日)の午前9時から午後5時まで開場しております。一般公開していますので、ぜひご来場ください。"
  },
  twitter: {
    card: "summary_large_image",
  },


};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="ja" className={"overflow-x-hidden hidden-scrollbar"}>
      <body>{children}</body>
    </html>
  )
}
