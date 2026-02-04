import { useUserStore } from "@/store/userStore";
import { Outlet, useNavigate } from "react-router-dom";

function ProtectUser() {
  const { isAuthorized } = useUserStore();
  const navigate = useNavigate();

  if (!isAuthorized) {
    navigate("/");
  }
  return <Outlet />;
}

export default ProtectUser;
