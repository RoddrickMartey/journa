import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "./ui/home";

export function GoHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const userHoemePath = "/";
  const adminHomePath = "/admin";
  const isAdminPath = location.pathname.startsWith("/admin");

  const homePath = isAdminPath ? adminHomePath : userHoemePath;

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="fixed bottom-4 right-10 z-50">
      <Button onClick={() => navigate(homePath)} size="icon-sm">
        <HomeIcon />
      </Button>
    </div>
  );
}
