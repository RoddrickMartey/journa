import type { UserPosts } from "@/api/postApi";

type SortOption = "updated-asc" | "updated-desc" | "title-asc" | "title-desc";

export function sortUserPosts(posts: UserPosts, sort: SortOption): UserPosts {
  const sorted = [...posts];

  switch (sort) {
    case "updated-asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );

    case "updated-desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    default:
      return posts;
  }
}

export function searchUserPosts(posts: UserPosts, query: string): UserPosts {
  // Use spread [...] to ensure a new array reference is returned
  // This tells React "the data has changed" even if it's the same content
  if (!query || !query.trim()) return [...posts];

  const q = query.toLowerCase().trim();

  return posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(q) ?? false;
    const summaryMatch = post.summary?.toLowerCase().includes(q) ?? false;
    const tagsMatch =
      post.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false;

    return titleMatch || summaryMatch || tagsMatch;
  });
}
