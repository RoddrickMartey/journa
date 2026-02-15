import { useUserStore } from "@/store/userStore";
import UserDetails from "../Forms/UserDetails";
import ProfileDetails from "../Forms/ProfileDetails";
import PasswordChange from "../Forms/PasswordChange";

function ProfilePage() {
  const { profile } = useUserStore();
  return (
    <section className="flex min-h-screen flex-col items-center mx-auto w-full max-w-[95%] md:max-w-4xl px-4 py-10 space-y-6 md:space-y-10 bg-background my-4 rounded-md">
      <div className="w-full text-center md:text-left px-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground">
          {profile?.displayName
            ? `${profile.displayName}'s Profile`
            : "Profile Settings"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your public presence and account security.
        </p>
      </div>

      {/* Wrapper to ensure children stay centered and responsive */}
      <div className="flex flex-col w-full items-center space-y-10">
        <ProfileDetails />
        <UserDetails />
        <PasswordChange />
      </div>
    </section>
  );
}

export default ProfilePage;
