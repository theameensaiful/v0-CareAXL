import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CareAXL - Caregiver App",
  description: "Intelligent Care Delivery & Scheduling Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F4F5F7]">{children}</body>
    </html>
  )
}



import './globals.css'