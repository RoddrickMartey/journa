import { useUserStore } from "@/store/userStore";
import PrivateFeedPage from "./PrivateFeedPage";
import PublicFeedPage from "./PublicFeedPage";

function HomePage() {
  const { isAuthorized } = useUserStore();
  return (
    <main className="w-full  min-h-screen ">
      {isAuthorized ? <PrivateFeedPage /> : <PublicFeedPage />}
    </main>
  );
}

export default HomePage;
