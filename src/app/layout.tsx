import type React from "react"
import dynamic from 'next/dynamic';
const DynamicGlobalChatBot = dynamic(() => import('@/components/global-chatbot'), { ssr: false });
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "go-pay - Gateway de Pagamento",
  description: "Sistema de gateway de pagamento go-pay",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
            <DynamicGlobalChatBot />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
