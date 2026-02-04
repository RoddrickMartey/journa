import { Outlet, useNavigate } from "react-router-dom";

import { useAdminStore } from "@/store/adminStore";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, SettingsIcon } from "lucide-react";

function AdminLayout() {
  const { user, logoutUser } = useAdminStore();
  const navigate = useNavigate();
  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      <header className="w-full bg-accent backdrop-blur-md flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 sm:py-0 sm:h-28 border-b border-border gap-4 sm:gap-0">
        <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 shrink-0">
          <img
            src={user?.avatarUrl}
            alt={user?.name}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-primary object-cover"
          />
          <div className="flex flex-col  sm:flex">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              {user?.name}
              <span className="text-xs sm:text-base font-semibold bg-primary text-muted px-1 py-0.5 rounded-md">
                {user?.adminId}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {user?.number}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center sm:hidden text-center gap-1">
          <h2 className="text-lg font-bold">{user?.name}</h2>
          <span className="text-xs font-semibold bg-primary text-muted px-2 py-0.5 rounded-md">
            {user?.adminId}
          </span>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/settings")}
            className="text-xs sm:text-sm"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Settings</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={logoutUser}
            className="text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </div>
      </header>
      <Outlet />
    </main>
  );
}

export default AdminLayout;
