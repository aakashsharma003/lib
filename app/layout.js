import { Header } from "@/components/header";
import ClerkProviderWrapper from "@/components/clerk-provider-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Library",
  description:
    "A collaborative learning platform to discover, share, and engage with educational content across YouTube, Udemy, Coursera, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          data-tracker="036ac35e-9bb5-4253-938b-fc0742846433"
          data-domain="join-library.vercel.app"
          data-allow-localhost="false"
          src="https://www.webtracky.com/analytics.js">
        </script>
      </head>
      <body className={inter.className}>
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
