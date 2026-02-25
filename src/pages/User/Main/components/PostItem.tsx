import { Separator } from "@/components/ui/separator";
import {
  ViewsCount,
  ReadTime,
  LikesCount,
  CommentsCount,
} from "@/components/PostItemCounts";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PostItemBottom from "./PostItemBottom";
import { toast } from "sonner";
import CategoryBadge from "@/components/CategoryIcon";

type PostItem = {
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
};

function UserPostCard({ post }: { post: PostItem }) {
  const navigate = useNavigate();
  const category = post.category;
  const count = post._count;
  const tags = post.tags;
  const formattedDate = format(new Date(post.updatedAt), "MMM d, yyyy");

  const readPost = () => {
    if (post.isDeleted) {
      toast.warning("You cannot view trashed posts");
    } else {
      navigate(`/author/read/${post.slug}`);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full bg-card p-4 rounded-lg border shadow-md flex flex-col space-y-4 ">
        {/* Top section: Title, Summary, Tags, Cover */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Content: Title, summary, tags */}
          <div className="flex flex-col space-y-2 flex-1">
            <h1
              className="text-xl md:text-2xl font-semibold leading-tight hover:underline cursor-pointer"
              onClick={readPost}
            >
              {post.title}
            </h1>
            <Separator />
            {post.summary && (
              <p className="italic text-muted-foreground text-sm md:text-base line-clamp-3">
                {post.summary}
              </p>
            )}

            {/* Category & Tags - Wraps on small screens */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <CategoryBadge category={category} />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="transition-colors rounded-full bg-accent px-2 py-0.5 cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right/Top: Cover image */}
          {post.coverImageUrl && (
            <div className="w-full md:w-40 shrink-0">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="rounded-lg object-cover w-full h-48 md:h-auto aspect-video "
              />
            </div>
          )}
        </div>

        {/* Bottom section: Stats & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
          {/* Stats - Scrollable if they overflow on tiny screens */}
          <div className="flex items-center gap-4 h-5 overflow-x-auto no-scrollbar">
            <CommentsCount count={count.comments} />
            <LikesCount count={count.likes} />
            <Separator orientation="vertical" />
            <ViewsCount count={post.views} />
            <ReadTime count={post.readTime} />
          </div>

          {/* Right date */}
          <div className="text-xs md:text-sm text-muted-foreground">
            <span className="hidden xs:inline">Published on: </span>
            {formattedDate}
          </div>
        </div>
      </div>
      <PostItemBottom
        id={post.id}
        slug={post.slug}
        isDeleted={post.isDeleted}
        published={post.published}
      />
    </div>
  );
}

export default UserPostCard;
