import { Header } from "@/components/header";
import { ClientTour } from "@/components/client-tour";

export default async function MainLayout({ children }) {
  // Middleware ensures only authenticated users reach this layout
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ClientTour />
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
