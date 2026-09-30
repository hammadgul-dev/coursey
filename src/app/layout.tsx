import type {Metadata} from "next"
import {Poppins} from "next/font/google"
import "./globals.css"
import {Toaster} from "react-hot-toast"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Coursey - Learn Anything, One Lesson at a Time",
  description:
    "Free, text-based courses built by instructors and powered by AI",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') return;
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-poppins)",
              fontSize: "15px",
              boxShadow: "0 8px 15px rgba(0, 0, 0, 0.12)",
            },
          }}
        />
      </body>
    </html>
  )
}
