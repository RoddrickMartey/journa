export type FeaturedPost = {
  title: string;
  slug: string;
  coverImageUrl: string | null;
  views: number;
  readTime: number;
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
      avatarUrl: string | null;
    } | null;
  };
  _count: {
    likes: number;
  };
};

export type PopularCategories = {
  id: string;
  slug: string;
  _count: {
    posts: number;
  };
  name: string;
  colorLight: string;
  colorDark: string;
};

export type FeedPublic = {
  featuredPosts: FeaturedPost[];
  popularCategories: PopularCategories[];
};
