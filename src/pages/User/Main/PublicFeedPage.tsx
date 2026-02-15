import { api } from "@/lib/axios";
import HeroSection from "./components/HeroSection";
import { useQuery } from "@tanstack/react-query";
import type { FeedPublic } from "@/types/publicFeed";

function PublicFeedPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-feed"],
    queryFn: async () => {
      const res = await api.get<FeedPublic>("/feed/public");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  return (
    <section className="w-full min-h-screen flex flex-col items-center">
      <HeroSection />
      <div className="h-px w-3/4 bg-primary/60" />

      <section className="w-full max-w-6xl p-6">
        {isLoading && <p>Loading feed...</p>}

        {isError && (
          <div>
            <p className="text-red-500">
              {(error as Error)?.message || "Failed to load feed"}
            </p>
            <p>Refresh Page</p>
          </div>
        )}
      </section>
    </section>
  );
}

export default PublicFeedPage;
