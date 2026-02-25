import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react"; // Added useEffect and useRef
import { getPost, incrementView } from "@/api/postApi"; // Import incrementView
import { PostDetailSkeleton } from "@/components/SkeletonComponent";
import DisplayPost from "@/components/DisplayPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ViewsCount, ReadTime } from "@/components/PostItemCounts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CategoryBadge from "@/components/CategoryIcon";
import { PostComments } from "./components/PostComments";
import { BigLikeButton } from "./components/BigLikeButton";
import { FollowButton } from "./components/FollowButton";
import { useUserStore } from "@/store/userStore";
import ReportButton from "./components/ReportButton";

function ReadPostPage() {
  const { slug } = useParams();
  const viewCounted = useRef(false);

  const navigate = useNavigate();
  const { isAuthorized } = useUserStore();
  const whereToNavigate = (username: string) => {
    if (isAuthorized) {
      navigate(`/view/user/${username}`);
    } else {
      navigate("/auth/login");
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["post-detail", slug],
    queryFn: () => getPost(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    // Create a controller to allow request cancellation
    const controller = new AbortController();

    if (slug && !viewCounted.current) {
      // Pass the signal to your API helper
      incrementView(slug, { signal: controller.signal })
        .then(() => {
          viewCounted.current = true;
        })
        .catch((err) => {
          // Ignore errors caused by intentional cancellation
          if (err.name === "AbortError" || err.name === "CanceledError") return;
          console.error("Failed to track view:", err);
        });
    }

    return () => {
      // Cancel the request if the component unmounts or slug changes
      controller.abort();
      // Only reset if navigating to a different post
      viewCounted.current = false;
    };
  }, [slug]);

  if (isLoading) return <PostDetailSkeleton />;
  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-semibold">
          Error loading the article.
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <div className="bg-card border shadow-lg rounded-2xl overflow-hidden flex flex-col">
        {/* Cover Image */}
        {data.coverImageUrl && (
          <div className="w-full h-80 md:h-112.5 overflow-hidden">
            <img
              src={data.coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 md:px-16 py-10">
          <header className="space-y-6 mb-12">
            <CategoryBadge category={data.category} />

            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">
              {data.title}
            </h1>

            {data.summary && (
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {data.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={data.author.profile?.avatarUrl ?? ""} />
                  <AvatarFallback>
                    {data.author.profile?.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span
                    className="font-bold cursor-pointer hover:underline"
                    onClick={() => whereToNavigate(data.author.username)}
                  >
                    {data.author.profile?.displayName}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <ViewsCount count={data.views} />
                    <span>•</span>
                    <ReadTime count={data.readTime} />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FollowButton
                  authorId={data.author.id}
                  isFollowing={data.author.isFollowing}
                  invalidateKeys={[["post-detail", data.slug]]}
                />
                <ReportButton
                  reportedUserId={data.author.id}
                  postId={data.id}
                />
              </div>
            </div>
          </header>

          <div className="flex justify-center mb-20">
            <DisplayPost content={data.content} />
          </div>

          <section className="flex flex-col items-center justify-center py-12 border-y my-12  ">
            <div className="text-center max-w-md mb-6 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                Did you find this helpful?
              </p>

              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                If you enjoyed this post, show your appreciation. Your feedback
                helps highlight content that matters to the community.
              </p>
            </div>

            <BigLikeButton
              isLiked={data.isLiked}
              count={data._count.likes}
              postId={data.id}
              slug={data.slug}
            />
          </section>

          <footer className="mb-16">
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, id) => (
                <Badge key={id} variant="outline" className="px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          </footer>

          <Separator />

          <PostComments
            comments={data.comments}
            commentCount={data._count.comments}
            postId={data.id}
            slug={data.slug}
          />
        </div>
      </div>
    </div>
  );
}

export default ReadPostPage;
