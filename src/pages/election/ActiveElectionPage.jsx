import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { getActiveElection } from "../../api/electionApi";

const ActiveElectionPage = () => {
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);

  const fetchActiveElection = async () => {
    try {
      setLoading(true);
      const response = await getActiveElection();
      setElection(response.data || null);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch active election";
      toast.error(message);
      setElection(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveElection();
  }, []);

  useEffect(() => {
    if (!election) return;

    const interval = setInterval(() => {
      setElection((prev) => (prev ? { ...prev } : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [election]);

  const countdownText = useMemo(() => {
    if (!election) return "";

    const now = new Date();
    const start = new Date(election.startTime);
    const end = new Date(election.endTime);

    let diff = 0;
    let label = "";

    if (election.status === "UPCOMING") {
      diff = start - now;
      label = "Starts in";
    } else if (election.status === "ACTIVE") {
      diff = end - now;
      label = "Ends in";
    } else {
      return "Election has ended";
    }

    if (diff <= 0) return "Updating status...";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${label}: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [election]);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Active Election"
          subtitle="Current active election backend se fetch ho rahi hai."
        />
        <Loader text="Active election load ho rahi hai..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Election"
        subtitle="Backend API se real active election data."
      />

      {!election ? (
        <SectionCard>
          <EmptyState
            title="No Active Election"
            message="Abhi koi active election available nahi hai."
          />
        </SectionCard>
      ) : (
        <SectionCard className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                {election.name}
              </h2>
              <p className="mt-1 text-slate-500">
                Election summary with live status
              </p>
            </div>

            <StatusBadge status={election.status} />
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-700">{countdownText}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
      )}
    </div>
  );
};

export default ActiveElectionPage;
