export interface AuthorProfile {
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Author {
  id: string;
  username: string;
  profile: AuthorProfile | null;
}

export interface Category {
  id: string;
  name: string;
  colorDark: string;
  colorLight: string;
  slug: string;
}

export interface FeedPost {
  id: string;
  title: string;
  summary: string;
  slug: string;
  tags: string[];
  coverImageUrl: string | null;
  views: number;
  readTime: number;
  published: boolean;
  updatedAt: Date | string;
  isDeleted: boolean;
  category: Category;
  author: Author;
  _count: {
    likes: number;
    comments: number;
  };
  // Processed fields from the backend
  isLiked: boolean;
  isSubscribedAuthor: boolean;
  source: "subscribed" | "featured" | "popular";
}

export interface PopularUser {
  id: string;
  username: string;
  displayName: string | undefined;
  avatarUrl: string | undefined;
  postsCount: number;
  score: number;
}

export interface FeedResponse {
  feed: FeedPost[];
  popularUsers: PopularUser[];
}
