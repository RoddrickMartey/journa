"use client";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPublicProfile } from "@/api/userApiCall";
import CountryFlag from "@/components/CountryFlag";
import { countryFlagMap } from "@/data/countriesWithFlags";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getInitials } from "@/lib/getInitials";
import { format } from "date-fns";
import { CalendarDays, MapPin, Globe, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { FollowButton } from "./components/FollowButton";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { GithubIcon } from "@/components/ui/github";
import { FacebookIcon } from "@/components/ui/facebook";
import { InstagramIcon } from "@/components/ui/instagram";
import { TwitterIcon } from "@/components/ui/twitter";
import ReportButton from "./components/ReportButton";

const SocialIcon = ({ media }: { media: string }) => {
  const m = media.toLowerCase();
  const iconProps = {
    size: 16,
    strokeWidth: 2,
    className: "shrink-0",
  };

  if (m.includes("github")) return <GithubIcon {...iconProps} />;
  if (m.includes("twitter") || m.includes("x"))
    return <TwitterIcon {...iconProps} />;
  if (m.includes("linkedin")) return <LinkedinIcon {...iconProps} />;
  if (m.includes("facebook")) return <FacebookIcon {...iconProps} />;
  if (m.includes("instagram")) return <InstagramIcon {...iconProps} />;
  if (m.includes("youtube")) return <Globe {...iconProps} />;

  return <LinkIcon {...iconProps} />;
};

function UserPublicProfileViewPage() {
  const { username } = useParams<{ username: string }>();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: () => fetchUserPublicProfile(username!),
    enabled: !!username,
    // BUG FIX: Add a staleTime so the UI doesn't flicker on back/forth navigation
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );

  if (isError || !user)
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-muted-foreground">
          User not found
        </h2>
        <Button variant="link" asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  console.log(user);

  const { profile, stats, latestPosts, createdAt } = user;
  const flagCode =
    countryFlagMap.find((c) => c.name === profile?.nationality)?.code || "";

  return (
    <section className="mx-auto max-w-5xl p-4 md:p-8 bg-background my-0 md:my-10 rounded-2xl border">
      {/* Cover Image - FIX: Updated gradient class */}
      {/* 1. Remove 'overflow-hidden' from this main wrapper */}
      <div className="relative mb-20 h-48 w-full md:h-64">
        {/* 2. Create a specific sub-container for the Cover Image and its rounded/overflow logic */}
        <div className="h-full w-full rounded-2xl bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden shadow-inner">
          {profile?.coverImageUrl && (
            <img
              src={profile.coverImageUrl}
              alt="Cover"
              className="h-full w-full object-cover transition-opacity duration-500"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
            />
          )}
        </div>

        {/* 3. The Avatar is now a sibling to the 'overflow-hidden' box, so it won't be clipped */}
        <div className="absolute -bottom-16 left-8 z-10">
          <Avatar className="h-32 w-32 border-4 border-background shadow-2xl md:h-40 md:w-40 bg-background">
            <AvatarImage src={profile?.avatarUrl || ""} alt={user.username} />
            <AvatarFallback className="text-3xl bg-muted">
              {getInitials(profile?.displayName || user.username)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {profile?.displayName}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground font-medium">
                @{user.username}
              </p>
              {profile?.nationality && (
                <CountryFlag
                  name={profile.nationality}
                  code={flagCode}
                  showName={false}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <FollowButton
              authorId={user.id}
              isFollowing={user.isFollowing}
              invalidateKeys={[["public-profile", username]]}
            />
            {/* TODO: Add copy-to-clipboard logic here */}
            <ReportButton reportedUserId={user.id} />
          </div>

          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {profile?.bio || "No bio provided."}
          </p>

          {/* SOCIALS SECTION - FIX: Using social.link as key */}
          {profile?.socials && profile.socials.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {profile.socials.map((social) => (
                <a
                  key={social.link}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-border bg-muted/40 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  title={social.media}
                >
                  <SocialIcon media={social.media} />
                </a>
              ))}
            </div>
          )}

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {/* BUG FIX: Ensure new Date() is used */}
              Joined {format(new Date(createdAt), "MMMM yyyy")}
            </div>
            {profile?.nationality && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {profile.nationality}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between text-center bg-muted/20 p-4 rounded-xl">
            <div>
              <p className="text-xl font-bold text-foreground">{stats.posts}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Posts
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {stats.subscribers}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Followers
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {stats.subscribing}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Following
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Latest Stories
          </h2>
          <div className="space-y-4">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/read/${post.slug}`}
                  className="block group"
                >
                  <Card className="border-none bg-transparent shadow-none hover:bg-muted/40 transition-all duration-200 p-4 rounded-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                          {post.summary}
                        </p>
                        <span className="text-xs text-muted-foreground block pt-1">
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      {post.coverImageUrl && (
                        <div className="h-24 w-full md:w-40 shrink-0">
                          <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="h-full w-full rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed rounded-2xl">
                <p className="text-muted-foreground">
                  No stories published yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserPublicProfileViewPage;
