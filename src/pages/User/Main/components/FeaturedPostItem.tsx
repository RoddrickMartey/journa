import type { FeaturedPost } from "@/types/publicFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/getInitials";
import { LikesCount, ReadTime, ViewsCount } from "@/components/PostItemCounts";
import { useTheme } from "@/context/theme-context";
import { useNavigate } from "react-router-dom";

function FeaturedPostItem({ post }: { post: FeaturedPost }) {
  const navigate = useNavigate();
  const profile = post.author.profile;
  const { theme } = useTheme();

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const catTheme =
    resolvedTheme === "dark"
      ? post.category.colorDark || "#333"
      : post.category.colorLight || "#eee";

  const textColor = resolvedTheme === "dark" ? "#000" : "#fff";

  return (
    <div className="bg-card border shadow-md animate-in fade-in duration-300 rounded-xl p-3 flex flex-col w-full space-y-2 justify-between">
      <div className="flex flex-col space-y-2 ">
        {/* Author */}
        <div className="flex items-center space-x-2 cursor-pointer hover:text-accent-foreground">
          <Avatar className=" w-8 h-8">
            {profile?.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(profile!.displayName)}
              </AvatarFallback>
            )}
          </Avatar>
          <p className="font-medium text-sm truncate">{profile?.displayName}</p>
        </div>

        {/* Title + Cover */}
        <div className="flex items-start justify-between space-x-2">
          <p
            className="font-semibold text-sm md:text-lg line-clamp-2 flex-1 hover:underline cursor-pointer"
            title={post.title}
            onClick={() => navigate("/auth/login")}
          >
            {post.title}
          </p>
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-20 h-16 object-cover rounded-md shrink-0"
            />
          )}
        </div>
      </div>

      {/* Stats + Category */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center space-x-2">
          <LikesCount count={post._count.likes} />
          <ViewsCount count={post.views} />
          <ReadTime count={post.readTime} />
        </div>
        <p
          className="px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
          style={{ backgroundColor: catTheme, color: textColor }}
        >
          {post.category.name}
        </p>
      </div>
    </div>
  );
}

export default FeaturedPostItem;
