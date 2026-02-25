import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostForAuthorView } from "@/api/postApi";
import { PostDetailSkeleton } from "@/components/SkeletonComponent";
import DisplayPost from "@/components/DisplayPost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ViewsCount,
  ReadTime,
  LikesCount,
  CommentsCount,
} from "@/components/PostItemCounts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CategoryBadge from "@/components/CategoryIcon";
function AuthorViewPostPage() {
  const { slug } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["author-post", slug],
    queryFn: () => getPostForAuthorView(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PostDetailSkeleton />;
  if (isError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground space-y-5">
        <p className="text-destructive bg-accent border px-3 py-0.5 font-semibold rounded-lg">
          Error loading post. please refresh the page{" "}
        </p>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
    );

  const author = data?.author;
  const tags = data?.tags;
  const category = data!.category;
  const count = data?._count;

  return (
    <div className="max-w-5xl min-h-screen my-10 mx-auto bg-card border shadow-lg rounded-2xl overflow-hidden flex flex-col">
      {/* 1. Cover Image - Full Width of container */}
      {data?.coverImageUrl && (
        <div className="w-full h-100 md:h-125 overflow-hidden">
          <img
            src={data.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-6 md:px-16 py-10">
        {/* 2. Category & Title Section */}
        <header className="space-y-6 mb-12 text-center md:text-left">
          {category && <CategoryBadge category={category} />}

          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground leading-tight">
            {data?.title}
          </h1>

          {data?.summary && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {data.summary}
            </p>
          )}

          <Separator className="my-8" />

          {/* 3. Author & Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={author?.profile?.avatarUrl} />
                <AvatarFallback>
                  {author?.profile?.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-bold text-foreground">
                  {author?.profile.displayName}
                </span>
                <span className="text-xs text-muted-foreground">Author</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground bg-muted/30 px-6 py-3 rounded-full border border-border/50">
              <div className="flex items-center gap-4">
                <LikesCount count={count?.likes || 0} />
                <CommentsCount count={count?.comments || 0} />
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-4">
                <ViewsCount count={data?.views || 0} />
                <ReadTime count={data?.readTime || 0} />
              </div>
            </div>
          </div>
        </header>

        {/* 4. Main Content */}
        <div className="flex justify-center">
          <DisplayPost content={data!.content} />
        </div>

        {/* 5. Footer Tags */}
        <footer className="mt-20 pt-10 border-t">
          <div className="flex flex-wrap gap-2">
            {tags &&
              tags.length > 0 &&
              tags.map((tag, id) => (
                <Badge
                  key={id}
                  variant="outline"
                  className="text-muted-foreground"
                >
                  #{tag}
                </Badge>
              ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AuthorViewPostPage;
