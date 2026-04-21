import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getActiveElection } from "../../api/electionApi";

const ActiveElectionPage = () => {
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchActiveElection = async () => {
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

    fetchActiveElection();
  }, []);

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
    <div>
      <PageHeader
        title="Active Election"
        subtitle="Backend API se real active election data."
      />

      {!election ? (
        <SectionCard>
          <p className="text-slate-600">
            Abhi koi active election available nahi hai.
          </p>
        </SectionCard>
      ) : (
        <SectionCard className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {election.name}
            </h2>
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
              <p className="mt-1 font-semibold text-emerald-600">
                {election.status}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ActiveElectionPage;
