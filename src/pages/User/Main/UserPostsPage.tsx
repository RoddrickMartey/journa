import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserPostsCall } from "@/api/postApi";
import { Separator } from "@/components/ui/separator";
import { EmptyPosts } from "./components/EmptyPosts";
import { sortUserPosts, searchUserPosts } from "@/lib/sortAndSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserPostCard from "./components/PostItem";
import { Search, Trash2, LayoutGrid, X } from "lucide-react";
import { PostCardSkeleton } from "@/components/SkeletonComponent";

type SortOption = "updated-asc" | "updated-desc" | "title-asc" | "title-desc";

function UserPostsPage() {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ["user-posts"],
    queryFn: getUserPostsCall,
    staleTime: 1000 * 60 * 5,
  });

  // Local UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("updated-desc");
  const [showTrash, setShowTrash] = useState(false);

  // Memoized filtering and sorting logic
  const { currentPosts, trashedCount } = useMemo(() => {
    if (!data) return { currentPosts: [], trashedCount: 0 };

    // 1. First, search through everything
    const searched = searchUserPosts(data, searchQuery);

    // 2. Sort the searched results
    const sorted = sortUserPosts(searched, sortOption);

    // 3. Filter for current view (Trash vs Active)
    const filtered = sorted.filter((p) => p.isDeleted === showTrash);

    // 4. Calculate trash count for the button label
    const totalTrashed = data.filter((p) => p.isDeleted).length;

    return {
      currentPosts: filtered,
      trashedCount: totalTrashed,
    };
  }, [data, searchQuery, sortOption, showTrash]);

  return (
    <section className="min-h-screen w-[95%] lg:w-3/4 mx-auto my-6 md:my-10 bg-background rounded-lg border shadow-lg p-5 md:p-10">
      {/* Header Section */}
      <div className="w-full mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {showTrash ? (
              <Trash2 className="w-6 h-6 text-destructive" />
            ) : (
              <LayoutGrid className="w-6 h-6" />
            )}
            {showTrash ? "Trash Bin" : "My Posts"}
          </h1>

          <Button
            variant={showTrash ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTrash(!showTrash)}
            className="w-fit"
          >
            {showTrash ? "Back to Posts" : `Trash (${trashedCount})`}
          </Button>
        </div>
        <Separator />
      </div>

      {/* Toolbar Section */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />

          <Input
            placeholder="Search by title, summary or tags..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Clear Search Button - Standard button for instant feedback */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <Select
          value={sortOption}
          onValueChange={(val: SortOption) => setSortOption(val)}
        >
          <SelectTrigger className="w-full md:w-50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Newest First</SelectItem>
            <SelectItem value="updated-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Section */}
      <div className="w-full">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>
            {showTrash
              ? "Trashed items are kept here"
              : "Manage your published and draft posts"}
          </span>
          <span>Results: {currentPosts.length}</span>
        </div>

        <div className="w-full min-h-100">
          {/* 1. Loading State */}
          {!data && isFetching ? (
            <div className="mt-10 flex flex-col items-center gap-2 w-full">
              {[1, 2, 3].map((p, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : /* 2. Error State */
          isError ? (
            <div className="mt-10 text-center">
              <p className="mb-4 text-muted-foreground">Error loading posts.</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : /* 3. Empty State */
          currentPosts.length === 0 ? (
            <div className="mt-10">
              {!searchQuery && <EmptyPosts />}
              {searchQuery && (
                <div className="text-center mt-7">
                  <p className="text-sm text-muted-foreground">
                    No results for "{searchQuery}"
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="text-primary mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* 4. List State */
            <div className="grid grid-cols-1 gap-4 mt-4">
              {currentPosts.map((post) => (
                <div key={post.id}>
                  <UserPostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserPostsPage;
