import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import InfoBanner from "../../components/ui/InfoBanner";
import { getActiveElection } from "../../api/electionApi";
import { handleApiError } from "../../utils/api";

const actionCardClass =
  "rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-sm";

const VoterDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getActiveElection();
        setElection(response.data || null);
      } catch (error) {
        handleApiError(error, "Failed to fetch active election");
        setElection(null);
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
        subtitle="Yahan se voter active election dekh sakta hai aur next actions quickly perform kar sakta hai."
      />

      {loading ? (
        <Loader text="Dashboard load ho raha hai..." />
      ) : !election ? (
        <SectionCard>
          <EmptyState
            title="No Active Election"
            message="Abhi koi active election available nahi hai."
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard
            title="Active Election Overview"
            subtitle="Current election ki summary information"
          >
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
                <div className="mt-2">
                  <StatusBadge status={election.status} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Quick Actions"
            subtitle="Important voter actions ke liye direct navigation"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Link to="/candidates" className={actionCardClass}>
                <h3 className="text-lg font-semibold text-slate-800">
                  View Candidates
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Active election ke candidates dekhne ke liye.
                </p>
              </Link>

              <Link to="/vote" className={actionCardClass}>
                <h3 className="text-lg font-semibold text-slate-800">
                  Cast Vote
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Apna vote securely cast karne ke liye.
                </p>
              </Link>

              <Link to="/result" className={actionCardClass}>
                <h3 className="text-lg font-semibold text-slate-800">
                  View Results
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Election result aur winner details dekhne ke liye.
                </p>
              </Link>
            </div>
          </SectionCard>

          <InfoBanner
            variant="success"
            title="Voter Experience Improved"
            message="Dashboard ko active election summary + quick actions ke saath cleaner aur more useful banaya gaya hai."
          />
        </>
      )}
    </div>
  );
};

export default VoterDashboardPage;
