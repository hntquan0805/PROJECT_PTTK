import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ACCI – Where Ambition Creates Continuous Improvement',
  description: 'Created with Nhom06',
  generator: 'Nhom06',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
