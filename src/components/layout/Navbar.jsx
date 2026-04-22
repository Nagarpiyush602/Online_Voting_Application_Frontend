import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getToken, getUserRole } from "../../utils/auth";
import { logoutUser } from "../../firebase/authService";

const baseLinkClass =
  "rounded-xl px-3 py-2 text-sm font-medium transition duration-200";

const getLinkClass = ({ isActive }) =>
  `${baseLinkClass} ${
    isActive
      ? "bg-white text-slate-900 shadow-sm"
      : "text-slate-200 hover:bg-slate-800 hover:text-white"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const guestLinks = [
    { label: "Home", path: "/" },
    { label: "Active Election", path: "/active-election" },
    { label: "Results", path: "/result" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];

  const voterLinks = [
    { label: "Dashboard", path: "/voter/dashboard" },
    { label: "Active Election", path: "/active-election" },
    { label: "Candidates", path: "/candidates" },
    { label: "Vote", path: "/vote" },
    { label: "Results", path: "/result" },
    { label: "Profile", path: "/my-profile" },
  ];

  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Manage Elections", path: "/admin/elections" },
    { label: "Manage Candidates", path: "/admin/candidates" },
    { label: "Results", path: "/result" },
    { label: "Profile", path: "/my-profile" },
  ];

  const navLinks = !token
    ? guestLinks
    : role === "ADMIN"
      ? adminLinks
      : voterLinks;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful");
      closeMobileMenu();
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              className="text-2xl font-bold tracking-wide text-white"
            >
              Votezy
            </NavLink>

            {token ? (
              <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 sm:inline-flex">
                {role}
              </span>
            ) : null}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex flex-wrap items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={getLinkClass}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {token ? (
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-800 lg:hidden"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-3 lg:hidden">
            {token ? (
              <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                {role}
              </div>
            ) : null}

            <nav className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={getLinkClass}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {token ? (
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
