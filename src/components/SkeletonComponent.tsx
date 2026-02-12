export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-pulse p-4">
      {/* 1. Cover Image */}
      <div className="w-full aspect-video bg-muted rounded-xl" />

      {/* 2. Metadata & Title */}
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md w-3/4" /> {/* Title */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted" /> {/* Avatar */}
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-32" />
          </div>
        </div>
      </div>

      {/* 3. Content Section (Bottom) */}
      <div className="space-y-3 pt-6 border-t">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-[92%]" />
        <div className="h-4 bg-muted rounded w-[95%]" />
        <div className="h-4 bg-muted rounded w-[40%]" />

        <div className="h-4 bg-muted rounded w-full mt-6" />
        <div className="h-4 bg-muted rounded w-[88%]" />
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4 animate-pulse w-full">
      <div className="w-full bg-card p-4 rounded-lg border shadow-md flex flex-col space-y-4">
        {/* Top section: Title, Summary, Tags, Cover */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Content: Title, summary, tags */}
          <div className="flex flex-col space-y-2 flex-1">
            {/* Title skeleton */}
            <div className="h-6 md:h-8 bg-muted rounded w-3/4" />
            <div className="h-6 md:h-8 bg-muted rounded w-1/2" />

            {/* Separator */}
            <div className="h-1px bg-muted my-1" />

            {/* Summary skeleton */}
            <div className="space-y-1">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>

            {/* Category & Tags skeleton */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="h-5 w-20 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-muted rounded-full" />
                <div className="h-4 w-10 bg-muted rounded-full" />
                <div className="h-4 w-14 bg-muted rounded-full" />
              </div>
            </div>
          </div>

          {/* Right/Top: Cover image skeleton */}
          <div className="w-full md:w-40 shrink-0">
            <div className="bg-muted rounded-lg w-full h-48 md:h-auto aspect-video" />
          </div>
        </div>

        {/* Bottom section: Stats & Date skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
          {/* Stats skeleton */}
          <div className="flex items-center gap-4 h-5 overflow-x-auto no-scrollbar">
            <div className="h-3 w-8 bg-muted rounded" />
            <div className="h-3 w-8 bg-muted rounded" />
            <div className="h-3 w-0.5 bg-muted rounded" />
            <div className="h-3 w-8 bg-muted rounded" />
            <div className="h-3 w-12 bg-muted rounded" />
          </div>

          {/* Right date skeleton */}
          <div className="h-3 w-20 bg-muted rounded mt-2 sm:mt-0" />
        </div>
      </div>
    </div>
  );
}
