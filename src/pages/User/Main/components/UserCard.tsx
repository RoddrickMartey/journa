import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { UserCardType } from "@/types/user";

interface UserCardProps {
  user: UserCardType;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Link to={`/view/user/${user.username}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer overflow-hidden border-none bg-background/50 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-muted">
            <AvatarImage
              src={user.profile?.avatarUrl || ""}
              alt={user.username}
            />
            <AvatarFallback>
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold truncate text-sm sm:text-base">
                {user.profile?.displayName || user.username}
              </h3>
              <Badge
                variant="secondary"
                className="text-[10px] font-medium h-5"
              >
                @{user.username}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {user.profile?.bio || "No bio available"}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {user._count.posts}{" "}
                  {user._count.posts === 1 ? "post" : "posts"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
