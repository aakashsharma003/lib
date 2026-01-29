import { Header } from "@/components/header";
import ClerkProviderWrapper from "@/components/clerk-provider-wrapper";
import "./globals.css";
import { Inter } from "next/font/google";

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
      </body>
    </html>
  );
}
