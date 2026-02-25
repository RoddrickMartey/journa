export type UserPublicProfile = {
  id: string;
  username: string;
  createdAt: Date;
  profile: {
    displayName: string;
    bio: string | null;
    nationality: string | null;
    avatarUrl: string | null;
    coverImageUrl: string | null;
    socials: {
      media: string;
      link: string;
    }[];
  } | null;
  isFollowing: boolean;
  isBlocked: boolean;
  stats: {
    posts: number;
    subscribers: number;
    subscribing: number;
  };
  latestPosts: {
    id: string;
    createdAt: Date;
    coverImageUrl: string | null;
    title: string;
    slug: string;
    summary: string | null;
  }[];
};

export type UserCardType = {
  id: string;
  username: string;
  profile: {
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
  _count: {
    posts: number;
  };
};
