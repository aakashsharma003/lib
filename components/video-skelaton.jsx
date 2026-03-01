export function VideoSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex flex-col h-full bg-card rounded-xl overflow-hidden border border-border/50">
          <div className="relative aspect-video w-full bg-secondary/60 animate-pulse"></div>
          <div className="p-4 flex flex-col flex-grow space-y-3">
            <div className="h-4 bg-secondary/80 rounded w-[90%] animate-pulse"></div>
            <div className="h-4 bg-secondary/80 rounded w-[60%] animate-pulse"></div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <div className="h-3 bg-secondary/60 rounded w-[45%] animate-pulse"></div>
              <div className="h-4 w-12 bg-secondary/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecommendedVideoSkeleton({ count = 8 }) {
  return (
    <div className="flex flex-col">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-start p-1.5 -mx-1.5 rounded-lg mb-2">
          <div className="relative flex-shrink-0 mr-2.5 w-[160px] h-[90px] rounded-lg bg-secondary/60 animate-pulse"></div>
          <div className="flex-grow min-w-0 pt-0.5 space-y-2.5">
            <div className="h-3.5 bg-secondary/80 rounded w-full animate-pulse"></div>
            <div className="h-3.5 bg-secondary/80 rounded w-[80%] animate-pulse"></div>
            <div className="pt-1.5 flex justify-between items-center">
              <div className="h-3 bg-secondary/60 rounded w-[40%] animate-pulse"></div>
              <div className="h-4 w-10 bg-secondary/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}