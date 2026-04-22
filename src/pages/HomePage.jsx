import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import { getToken, getUserRole } from "../utils/auth";

const features = [
  {
    title: "Secure Authentication",
    description:
      "Firebase based login flow with token handling and protected routing.",
  },
  {
    title: "Role-based Access",
    description:
      "ADMIN aur VOTER ke liye separate navigation, pages, aur access control.",
  },
  {
    title: "Election Management",
    description:
      "Admin elections create, manage, aur lifecycle track kar sakta hai.",
  },
  {
    title: "Voting & Results",
    description:
      "Voter candidates dekh kar vote cast karta hai aur declared result view kar sakta hai.",
  },
];

const HomePage = () => {
  const token = getToken();
  const role = getUserRole();
  const dashboardPath =
    role === "ADMIN" ? "/admin/dashboard" : "/voter/dashboard";

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
        <div className="grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.3fr_0.9fr] lg:px-10 lg:py-16">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Online Voting System
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Secure, role-based, and interview-ready voting platform.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Ye frontend React + Tailwind CSS me build kiya gaya hai aur Spring
              Boot backend ke saath connected hai. Isme secure authentication,
              role-based dashboard, election flow, candidate management, voting,
              aur results sab ek clean structure me cover kiye gaye hain.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {!token ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link
                  to={dashboardPath}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Go to Dashboard
                </Link>
              )}

              <Link
                to="/active-election"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                View Active Election
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-slate-200">
                Project Highlights
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-300">
                <li>• Firebase auth + token-based request flow</li>
                <li>• Role-based ADMIN / VOTER UI separation</li>
                <li>• Active election, vote casting, and result flow</li>
                <li>• Reusable components and cleaner structure</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm font-semibold text-emerald-200">
                Demo Ready
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                Ye homepage project intro, key features, aur CTA buttons ke
                saath demo aur interview dono ke liye strong first impression
                deta hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PageHeader
        title="Why this frontend looks complete"
        subtitle="Day 10 ka goal sirf new page banana nahi hai, balki poore project ko polished, consistent, responsive, aur demo-friendly feel dena hai."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <SectionCard key={feature.title} className="h-full">
            <h2 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Project Introduction"
        subtitle="Interview ya project demo me aap is frontend ko is tarah explain kar sakte ho."
      >
        <p className="text-sm leading-7 text-slate-700 sm:text-base">
          Is application me user pehle authenticate hota hai, uske baad role ke
          hisab se UI aur routes control hote hain. Voter active election dekh
          sakta hai, candidates fetch kar sakta hai, vote cast kar sakta hai,
          aur results dekh sakta hai. Admin dashboard se elections aur
          candidates manage karta hai aur completed election ka result declare
          karta hai. Frontend ko reusable components, standardized API handling,
          protected routes, loaders, empty states, aur polished layout ke saath
          structure kiya gaya hai.
        </p>
      </SectionCard>
    </div>
  );
};

export default HomePage;
