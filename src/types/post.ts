import type { OutputData } from "@editorjs/editorjs";

export interface Comment {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string | Date;
  isLiked: boolean; // Transformed from likes array
  user: {
    id: string;
    suspended: boolean;
    profile: {
      avatarUrl: string | null;
      displayName: string;
    };
  };
  _count: {
    likes: number;
  };
}

export interface DetailedPost {
  id: string;
  title: string;
  content: OutputData;

  summary: string | null;
  slug: string;
  tags: string[];
  coverImageUrl: string | null;
  publishedAt: string | Date | null;
  isFeatured: boolean;
  views: number;
  readTime: number;
  isLiked: boolean; // Transformed from likes array
  category: {
    id: string;
    name: string;
    colorDark: string;
    colorLight: string;
    slug: string;
  };
  author: {
    id: string;
    username: string;
    profile: {
      avatarUrl: string | null;
      displayName: string;
    } | null;
    isFollowing: boolean;
  };
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}
