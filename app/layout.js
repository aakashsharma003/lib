import { Header } from "@/components/header";
import ClerkProviderWrapper from "@/components/clerk-provider-wrapper";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "library",
  description:
    "A collaborative learning platform to filter, share, and engage with educational YouTube content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProviderWrapper>
          {children}
        </ClerkProviderWrapper>

        <Script 
          src="https://www.webtracky.com/analytics.js"
          data-tracker="036ac35e-9bb5-4253-938b-fc0742846433"
          data-hosts="join-library.vercel.app"
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
