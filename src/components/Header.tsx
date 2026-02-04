import { useUserStore } from "@/store/userStore";
import LogoDisplay from "./LogoDisplay";
import ThemeToggle from "./theme-toggle";
import AvatarMenu from "./AvatarMenu";
import { Button } from "./ui/button";
import { SquarePenIcon, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Header() {
  const { isAuthorized } = useUserStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-4 md:px-6 h-16">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        {/* Left: Logo */}
        <LogoDisplay type="header" />

        {/* Right: Actions */}
        <div className="flex items-center gap-x-2 md:gap-x-4">
          <ThemeToggle />

          {/* Create Post Button - Always visible, icon only on mobile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" asChild>
                  <Link to={isAuthorized ? "/posts/new" : "/auth/login"}>
                    <SquarePenIcon className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new Post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="hidden md:block h-6 w-px bg-border mx-1" />

          {isAuthorized ? (
            <AvatarMenu />
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-x-2">
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button size="sm" className="rounded-full px-5" asChild>
                  <Link to="/auth/signup">Sign up</Link>
                </Button>
              </div>

              {/* Mobile Auth Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-62.5">
                    <SheetHeader className="text-left">
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                      <Button
                        variant="outline"
                        className="justify-start"
                        asChild
                      >
                        <Link to="/auth/login">Login</Link>
                      </Button>
                      <Button className="justify-start" asChild>
                        <Link to="/auth/signup">Sign up</Link>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
