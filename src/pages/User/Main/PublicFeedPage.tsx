import { api } from "@/lib/axios";
import HeroSection from "./components/HeroSection";
import { useQuery } from "@tanstack/react-query";
import type { FeedPublic } from "@/types/publicFeed";
import FeaturedPostItem from "./components/FeaturedPostItem";
import PopularCategoryItem from "./components/PopularCategoryItem";

function PublicFeedPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-feed"],
    queryFn: async () => {
      const res = await api.get<FeedPublic>("/feed/public");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  const featuredPost = data?.featuredPosts;
  const popularCategories = data?.popularCategories;

  return (
    <main className="w-full min-h-screen flex flex-col items-center ">
      {/* --- Hero Section --- */}
      <HeroSection />
      <div className="h-px w-3/4 bg-primary/60 my-6" />

      {/* --- Feed Loading / Error --- */}
      <section className="w-full max-w-6xl px-4 sm:px-6 mb-8">
        {isLoading && <p className="text-center py-10">Loading feed...</p>}

        {isError && !data && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">
              {(error as Error)?.message || "Failed to load feed"}
            </p>
            <p className="text-muted-foreground">Please refresh the page</p>
          </div>
        )}
      </section>

      {/* --- Featured Posts --- */}
      {featuredPost && featuredPost.length > 0 && (
        <section
          className="w-full max-w-6xl px-4 sm:px-6 mb-10 grid gap-4
                            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featuredPost.map((post, i) => (
            <FeaturedPostItem key={i} post={post} />
          ))}
        </section>
      )}

      {/* --- Popular Categories --- */}
      {popularCategories && popularCategories.length > 0 && (
        <section className="w-full max-w-6xl px-4 sm:px-6 mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularCategories.map((cat) => (
              <PopularCategoryItem key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default PublicFeedPage;
