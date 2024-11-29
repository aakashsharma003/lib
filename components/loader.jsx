import { Loader2 } from "lucide-react";

export function DialogLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
