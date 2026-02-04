import { Outlet } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";
import NotFound from "@/pages/NotFound";

function ProtectAdmin() {
  const { isAuthorized } = useAdminStore();
  if (!isAuthorized) {
    return <NotFound />;
  }
  return <Outlet />;
}

export default ProtectAdmin;
