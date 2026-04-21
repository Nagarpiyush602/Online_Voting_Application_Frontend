import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getToken, getUserRole } from "../../utils/auth";
import { logoutUser } from "../../firebase/authService";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 transition ${
    isActive
      ? "bg-white text-slate-900 font-semibold"
      : "text-white hover:bg-slate-800"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <NavLink to="/" className="text-xl font-bold tracking-wide">
          Votezy
        </NavLink>

        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
          {!token && (
            <>
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/active-election" className={linkClass}>
                Active Election
              </NavLink>
              <NavLink to="/result" className={linkClass}>
                Result
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            </>
          )}

          {token && role === "VOTER" && (
            <>
              <NavLink to="/voter/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/active-election" className={linkClass}>
                Active Election
              </NavLink>
              <NavLink to="/candidates" className={linkClass}>
                Candidates
              </NavLink>
              <NavLink to="/vote" className={linkClass}>
                Vote
              </NavLink>
              <NavLink to="/result" className={linkClass}>
                Result
              </NavLink>
              <NavLink to="/my-profile" className={linkClass}>
                My Profile
              </NavLink>
            </>
          )}

          {token && role === "ADMIN" && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>
                Admin Dashboard
              </NavLink>
              <NavLink to="/admin/candidates" className={linkClass}>
                Manage Candidates
              </NavLink>
              <NavLink to="/admin/elections" className={linkClass}>
                Manage Elections
              </NavLink>
              <NavLink to="/active-election" className={linkClass}>
                Active Election
              </NavLink>
              <NavLink to="/result" className={linkClass}>
                Result
              </NavLink>
            </>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
