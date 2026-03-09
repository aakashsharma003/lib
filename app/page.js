import LandingPageContent from "./landing/page";

export default async function Page() {
  // Middleware handles redirecting logged-in users to /home
  return (
    <main className="min-h-screen">
      <LandingPageContent />
    </main>
  );
}
