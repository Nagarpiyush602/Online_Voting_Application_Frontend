import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl">
      <SectionCard className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="text-center">
          <p className="text-6xl font-bold tracking-tight text-white/90 sm:text-7xl">
            404
          </p>

          <div className="mt-4">
            <PageHeader
              title="Page not found"
              subtitle="The page you are looking for does not exist or may have been moved to another route."
              align="center"
            />
          </div>

          <p className="mx-auto max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Navbar ya direct URL ke through sahi page par wapas jao. Unknown
            routes ko ab clean NotFound page handle karega.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Go Home
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Go Back
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default NotFoundPage;
