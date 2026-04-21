import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import { getToken, getUserRole } from "../utils/auth";

const HomePage = () => {
  const token = getToken();
  const role = getUserRole();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Online Voting Application"
        subtitle="React + Tailwind frontend connected with your Spring Boot backend."
      />

      <SectionCard>
        <p className="leading-7 text-slate-700">
          Is frontend me voter registration, Firebase login, active election,
          candidate listing, vote casting, result viewing, aur admin dashboard
          sab backend APIs ke hisab se structured way me ban raha hai.
        </p>
      </SectionCard>

      {!token ? (
        <SectionCard>
          <h2 className="text-xl font-semibold text-slate-800">Get Started</h2>
          <p className="mt-2 text-slate-600">
            Register ya login karke role-based dashboard access karo.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </SectionCard>
      ) : (
        <SectionCard>
          <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
          <p className="mt-2 text-slate-600">
            Aap currently <span className="font-semibold">{role}</span> role me
            logged in ho.
          </p>

          <div className="mt-4">
            <Link
              to={role === "ADMIN" ? "/admin/dashboard" : "/voter/dashboard"}
              className="rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default HomePage;
