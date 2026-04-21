import { Link, useNavigate } from "react-router-dom";
import { clearAuthStorage, getToken, getUserRole } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Votezy
        </Link>

        <div className="flex items-center gap-4 text-sm md:text-base">
          <Link to="/">Home</Link>
          <Link to="/active-election">Active Election</Link>

          {token && role === "VOTER" && (
            <>
              <Link to="/candidates">Candidates</Link>
              <Link to="/vote">Vote</Link>
              <Link to="/my-profile">My Profile</Link>
            </>
          )}

          {token && role === "ADMIN" && (
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          )}

          {!token ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium hover:bg-red-600"
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
