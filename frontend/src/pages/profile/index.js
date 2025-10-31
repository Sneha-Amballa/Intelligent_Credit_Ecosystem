import UserProfileStats from "../../components/Profile/Profile";
import Navbar from "@/components/Navbar/Navbar";
function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div>
        <UserProfileStats />
      </div>
    </div>
  );
}

export default ProfilePage;
