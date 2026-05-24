import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "B.O.S.S POS — Business Operations & Smart Systems",
  description: "The AI-powered business operating system for modern retail.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
