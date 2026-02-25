import { Separator } from "@/components/ui/separator";
import {
  ViewsCount,
  ReadTime,
  LikesCount,
  CommentsCount,
} from "@/components/PostItemCounts";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CategoryBadge from "@/components/CategoryIcon";
import type { FeedPost } from "@/types/privateFeed"; // Using the type we created
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/userStore";

interface FeedPostCardProps {
  post: FeedPost;
}

function FeedPostCard({ post }: FeedPostCardProps) {
  const navigate = useNavigate();
  const { isAuthorized } = useUserStore();
  const formattedDate = format(new Date(post.updatedAt), "MMM d, yyyy");

  // Improved Navigation: Prevents bubble-up if clicking buttons/tags
  const handleNavigation = (e: React.MouseEvent) => {
    // If user clicked a button, a tag, or an icon specifically, don't navigate the whole card
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".stop-propagation")) {
      return;
    }

    if (post.isDeleted) {
      toast.warning("You cannot view trashed posts");
    } else {
      navigate(`/read/${post.slug}`);
    }
  };

  const whereToNavigate = (username: string) => {
    if (isAuthorized) {
      navigate(`/view/user/${username}`);
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div
      onClick={handleNavigation}
      className="group w-full bg-card p-5 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col space-y-4"
    >
      {/* Top Header: Author Info & Source Tag */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 stop-propagation">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.profile?.avatarUrl ?? ""} />
            <AvatarFallback>
              {post.author.profile?.displayName?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div
            className="flex flex-col"
            onClick={() => {
              whereToNavigate(post.author.username);
            }}
          >
            <span className="text-sm font-medium hover:underline">
              {post.author.profile?.displayName || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Source Badge (Subscribed, Featured, Popular) */}
        <span
          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
            post.source === "featured"
              ? "border-yellow-500 text-yellow-600 bg-yellow-50"
              : post.source === "subscribed"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-300 text-gray-500"
          }`}
        >
          {post.source}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col-reverse md:flex-row gap-5">
        <div className="flex flex-col space-y-3 flex-1">
          <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {post.summary && (
            <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 stop-propagation">
            <CategoryBadge category={post.category} />
            <div className="flex flex-wrap gap-2 text-xs">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md hover:bg-secondary/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {post.coverImageUrl && (
          <div className="w-full md:w-48 shrink-0 overflow-hidden rounded-lg">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="object-cover w-full h-40 md:h-32 aspect-video group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Bottom Footer: Stats & Date */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4 text-muted-foreground stop-propagation">
          <div className="flex items-center gap-1">
            <LikesCount count={post._count.likes} />
          </div>
          <CommentsCount count={post._count.comments} />
          <Separator orientation="vertical" className="h-4" />
          <div className="hidden sm:flex items-center gap-3">
            <ViewsCount count={post.views} />
            <ReadTime count={post.readTime} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          {formattedDate}
        </div>
      </div>
    </div>
  );
}

export default FeedPostCard;
