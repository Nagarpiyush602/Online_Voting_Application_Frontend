import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getActiveElection } from "../../api/electionApi";

const actionButtonClass =
  "inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium text-white transition hover:opacity-90";

const VoterDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getActiveElection();
        setElection(response.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch active election";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voter Dashboard"
        subtitle="Yahan se voter active election dekh sakta hai aur next actions perform kar sakta hai."
      />

      {loading ? (
        <Loader text="Dashboard load ho raha hai..." />
      ) : !election ? (
        <SectionCard>
          <p className="text-slate-600">
            Abhi koi active election available nahi hai.
          </p>
        </SectionCard>
      ) : (
        <>
          <SectionCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Election Name</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {election.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Start Time</p>
                <p className="mt-1 font-medium text-slate-800">
                  {new Date(election.startTime).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">End Time</p>
                <p className="mt-1 font-medium text-slate-800">
                  {new Date(election.endTime).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-1 font-semibold text-emerald-600">
                  {election.status}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Quick Actions
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/candidates"
                className={`${actionButtonClass} bg-slate-900`}
              >
                View Candidates
              </Link>

              <Link
                to="/vote"
                className={`${actionButtonClass} bg-emerald-600`}
              >
                Cast Vote
              </Link>

              <Link to="/result" className={`${actionButtonClass} bg-blue-600`}>
                View Result
              </Link>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default VoterDashboardPage;
