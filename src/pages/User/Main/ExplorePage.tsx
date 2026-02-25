import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useDebounce } from "@/hooks/use-debounce";
import FeedPostCard from "./components/FeedPostCard";
import { UserCard } from "./components/UserCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Sparkles, Users } from "lucide-react";
import type { UserCardType } from "@/types/user";
import type { FeedPost } from "@/types/privateFeed";

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest, popular
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["explore", debouncedSearch, sortBy],
    queryFn: async () => {
      const res = await api.get("/feed/explore", {
        params: {
          q: debouncedSearch,
          sort: sortBy,
        },
      });
      return res.data; // Expecting { posts: [], users: [] }
    },
  });

  return (
    <section className="max-w-3/4 mx-auto p-4 space-y-8 bg-background rounded-lg shadow-sm my-10 border ">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Explore
            </h1>
            <p className="text-muted-foreground text-sm">
              Discover trending stories and new creators across the platform.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, tags, or people..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32.5">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full max-w-100 grid-cols-2 mb-8">
          <TabsTrigger value="posts" className="gap-2">
            Posts
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground animate-pulse">
              Finding fresh content...
            </p>
          </div>
        ) : (
          <>
            <TabsContent value="posts" className="space-y-6">
              {data?.posts?.length > 0 ? (
                <div className="grid grid-cols-1  gap-6">
                  {data.posts.map((post: FeedPost) => (
                    <FeedPostCard post={post} key={post.id} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No posts found matching your discovery criteria." />
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {data?.users?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.users.map((user: UserCardType) => (
                    <UserCard user={user} key={user.id} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No creators found matching your search." />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-xl">
      <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default ExplorePage;
