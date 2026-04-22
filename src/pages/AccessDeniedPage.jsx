import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import InfoBanner from "../components/ui/InfoBanner";
import { getUserRole } from "../utils/auth";

const AccessDeniedPage = () => {
  const role = getUserRole();

  const dashboardPath =
    role === "ADMIN" ? "/admin/dashboard" : "/voter/dashboard";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Access Denied"
        subtitle="Aapne jo page open kiya hai wo aapke current role ke liye allowed nahi hai."
      />

      <SectionCard>
        <InfoBanner
          variant="error"
          title="Unauthorized Route Access"
          message="Aap logged in hain, lekin is route ko access karne ki permission nahi hai."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Current Role</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {role || "Unknown"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Suggested Action</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              Go back to your dashboard
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={dashboardPath}
            className="rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Go to Home
          </Link>
        </div>
      </SectionCard>
    </div>
  );
};

export default AccessDeniedPage;
