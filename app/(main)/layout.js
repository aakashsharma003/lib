import { Header } from "@/components/header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }) {
  const { userId } = await auth();

  // If user is not logged in, send them back to the landing page
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Library. All rights reserved.
      </footer>
    </div>
  );
}
