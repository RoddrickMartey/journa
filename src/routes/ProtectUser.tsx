import { useUserStore } from "@/store/userStore";
import { Outlet, Navigate } from "react-router-dom";

function ProtectUser() {
  const { isAuthorized } = useUserStore();

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectUser;
