import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { FeedResponse } from "@/types/privateFeed";
import FeedPostCard from "./components/FeedPostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: for better loading states
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

const fetchPrivateFeed = async (): Promise<FeedResponse> => {
  const { data } = await api.get<FeedResponse>("/feed/private");
  return data;
};

function PrivateFeedPage() {
  const navigate = useNavigate();
  const { isAuthorized } = useUserStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["private-feed"],
    queryFn: fetchPrivateFeed,
  });

  const errorMessage = (error: Error) => {
    if (isAxiosError(error)) {
      const res = error.response?.data as { message: string };
      return res.message;
    }
    return "Network Error, Please Refresh the Page";
  };
  const whereToNavigate = (username: string) => {
    if (isAuthorized) {
      navigate(`/view/user/${username}`);
    } else {
      navigate("/auth/login");
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-destructive">
        Error: {errorMessage(error)}
      </div>
    );
  }

  return (
    // Max-width container keeps the feed readable on ultra-wide screens
    <section className="container mx-auto flex flex-col lg:flex-row min-h-screen gap-0 lg:gap-8">
      {/* Main Feed Column */}
      <section className="flex-1 p-4 md:p-6 lg:border-r-2">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {data?.feed.map((post, id) => (
              <FeedPostCard post={post} key={id} />
            ))}
            {data?.feed.length === 0 && (
              <p className="text-muted-foreground text-center py-10">
                No posts found in your feed.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Sidebar - Popular Users */}
      {/* Hidden on mobile, visible from LG breakpoint up */}
      <aside className="hidden lg:block w-full lg:max-w-55 xl:max-w-72 p-6 sticky top-0 h-fit">
        <h2 className="text-xl font-bold mb-6">Suggested Authors</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {data?.popularUsers.map((user, id) => (
              <div key={id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user.avatarUrl ?? ""}
                      alt={user.displayName ?? ""}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p
                      className="font-semibold text-sm leading-none group-hover:underline cursor-pointer"
                      onClick={() => whereToNavigate(user.username)}
                    >
                      {user.displayName || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.postsCount} posts · {user.score} pts
                    </p>
                  </div>
                </div>
                {/* Optional: Add a follow button here later */}
              </div>
            ))}
          </div>
        )}
      </aside>
    </section>
  );
}

export default PrivateFeedPage;
