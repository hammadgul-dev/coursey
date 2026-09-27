import type {Metadata} from "next"
import {Poppins} from "next/font/google"
import "./globals.css"
import {Toaster} from "react-hot-toast"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Coursey - Learn Anything, One Lesson at a Time",
  description:
    "Free, text-based courses built by instructors and powered by AI",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-white`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
