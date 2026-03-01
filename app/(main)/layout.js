import { Header } from "@/components/header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClientTour } from "@/components/client-tour";

export default async function MainLayout({ children }) {
  const { userId } = await auth();

  // If user is not logged in, send them back to the landing page
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ClientTour />
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
