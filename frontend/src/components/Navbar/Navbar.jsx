import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import "./Navbar.css";
import { useRouter } from "next/router";

function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <>
      <div className="navWrapper">
        <nav>
          <div id="logo" style={{ cursor: "pointer" }}>
            <Link href="/dashboard" passHref legacyBehavior>
              <img src="/favicon.ico" alt="Icon" />
            </Link>
            <Link href="/dashboard" passHref legacyBehavior>
              <h3>FinanceFriends</h3>
            </Link>
          </div>

          <div id="color">
            <div id="navbar">
              <div className="navbarElement">
                <Link href="/dashboard" legacyBehavior>
                  <a>DASHBOARD</a>
                </Link>
              </div>
              <div className="navbarElement">
                <Link href="/leaderboard" legacyBehavior>
                  <a>LEADERBOARD</a>
                </Link>
              </div>
              <div className="navbarElement">
                <Link href="/profile" legacyBehavior>
                  <a>PROFILE</a>
                </Link>
              </div>
              <div id="logout" className="navbarElement logout">
                <div onClick={handleLogout} style={{ cursor: "pointer" }}>
                  <a>LOG OUT</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
