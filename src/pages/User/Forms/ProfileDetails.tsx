import { Separator } from "@/components/ui/separator";
import ChangeAvatarAndCoverImage from "./ChangeAvatarAndCoverImage";
import BioUpdate from "./BioUpdate";
import NationalityUpdate from "./NationalityUpdate";
import DisplayNameUpdate from "./DisplayNameUpdate";
import SocialsUpdate from "./SocialsUpdate";

function ProfileDetails() {
  return (
    <section className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl space-y-8">
      <Separator />

      <header className="space-y-1">
        <h1 className="text-lg font-semibold">Profile Details</h1>
        <p className="text-sm text-muted-foreground">
          View and edit your profile.
        </p>
      </header>
      <ChangeAvatarAndCoverImage />
      <DisplayNameUpdate />
      <BioUpdate />
      <NationalityUpdate />
      <SocialsUpdate />
    </section>
  );
}

export default ProfileDetails;
