import { api } from "@/lib/axios";
import type { DetailedPost } from "@/types/post";
import type { OutputData } from "@editorjs/editorjs";

type CreatePost = {
  title: string;
  categoryId: string;
  tags: string[];
  coverImageBase64: string | null;
  summary?: string | undefined;
};

export type UpdatePostPayload = Partial<Omit<CreatePost, "summaryǵsummary">> & {
  summary?: string | null;
  coverImageBase64?: string | null;
};

export type UserPosts = {
  id: string;
  title: string;
  summary: string | null;
  tags: string[];
  slug: string;
  coverImageUrl: string | null;
  views: number;
  readTime: number;
  published: boolean;
  updatedAt: Date;
  isDeleted: boolean;
  category: {
    id: string;
    slug: string;
    name: string;
    colorLight: string;
    colorDark: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}[];

export type PostForEdit = {
  title: string;
  summary: string | null;
  tags: string[];
  content: OutputData | null;
  slug: string;
  coverImageUrl: string | null;
  coverImagePath: string | null;
  published: boolean;
  category: {
    id: string;
    name: string;
    description: string | null;
  };
};

export type PostRead = {
  title: string;
  summary: string | null;
  tags: string[];
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    _count: {
      likes: number;
    };
    user: {
      id: string;
      suspended: boolean;
      profile: {
        displayName: string;
        avatarUrl: string;
      };
    };
    isEdited: boolean;
  }[];
  slug: string;
  content: OutputData;
  coverImageUrl: string | null;
  views: number;
  readTime: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  category: {
    id: string;
    slug: string;
    name: string;
    colorLight: string;
    colorDark: string;
  };
  author: {
    id: string;
    profile: {
      displayName: string;
      avatarUrl: string;
    };
  };
  _count: {
    comments: number;
    likes: number;
  };
};

export const getPostForEditCall = async (id: string) => {
  const { data } = await api.get<PostForEdit>(`/posts/post-edit/${id}`);
  return data;
};

export const updateContentCall = async (
  content: OutputData,
  postId: string,
) => {
  const res = await api.put<{
    success: string;
  }>(`/posts/post-update-content/${postId}`, content);
  return res.data;
};

export const createPostCall = (payload: CreatePost) =>
  api.post<{
    id: string;
  }>("/posts/create-post", payload);

export const updatePostDetailsCall = (
  payload: UpdatePostPayload,
  postId: string,
) => api.put(`/posts/post-update-details/${postId}`, payload);

export const getUserPostsCall = async () => {
  const { data } = await api.get<UserPosts>("/posts/mine");
  return data;
};

export const getPostForAuthorView = async (slug: string) => {
  const { data } = await api.get<PostRead>(`/posts/author-view/${slug}`);
  return data;
};
export const getPost = async (slug: string) => {
  const { data } = await api.get<DetailedPost>(`/posts/${slug}`);
  return data;
};

// Example api/postApi.ts
export const incrementView = async (
  slug: string,
  options?: { signal?: AbortSignal },
) => {
  const response = await api.post(`/posts/${slug}/view`, {}, options);
  return response.data;
};
