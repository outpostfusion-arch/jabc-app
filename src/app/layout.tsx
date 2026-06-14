import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "JABC — Junior Achievement Business Challenge",
  description: "Explore entrepreneurship and run a real business — Grade 6-8 learning platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
