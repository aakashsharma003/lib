import LandingPageContent from "./landing/page";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  // If logged in, redirect to /home (which will be the default homepage)
  if (userId) {
    redirect("/home");
  }

  // If not logged in, show landing page
  return (
    <main className="min-h-screen">
      <LandingPageContent />
    </main>
  );
}
