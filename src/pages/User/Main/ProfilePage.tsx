import { useUserStore } from "@/store/userStore";
import UserDetails from "../Forms/UserDetails";
import ProfileDetails from "../Forms/ProfileDetails";
import PasswordChange from "../Forms/PasswordChange";

function ProfilePage() {
  const { profile } = useUserStore();
  return (
    <section className="flex min-h-screen flex-col items-center px-4 py-10 space-y-10 bg-accent/80 my-4 rounded-md">
      <div>
        <h1 className="text-2xl font-semibold">
          {profile?.displayName} Profile
        </h1>
      </div>

      <ProfileDetails />
      <UserDetails />
      <PasswordChange />
    </section>
  );
}

export default ProfilePage;
