import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";
import { getAdminDashboard } from "../../api/adminApi";

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        setDashboard(response.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch admin dashboard";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Admin yahan system ki overall summary dekh sakta hai."
      />

      {loading ? (
        <Loader text="Admin dashboard load ho raha hai..." />
      ) : !dashboard ? (
        <SectionCard>
          <p className="text-slate-600">Dashboard data available nahi hai.</p>
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard title="Total Voters" value={dashboard.totalVoters} />
            <StatCard
              title="Total Candidates"
              value={dashboard.totalCandidates}
            />
            <StatCard title="Total Votes" value={dashboard.totalVotes} />
            <StatCard
              title="Total Elections"
              value={dashboard.totalElections}
            />
            <StatCard
              title="Active Election Name"
              value={dashboard.activeElectionName || "No Active Election"}
            />
            <StatCard
              title="Active Election Status"
              value={dashboard.activeElectionStatus || "N/A"}
            />
          </div>

          <SectionCard>
            <h2 className="text-xl font-semibold text-slate-800">
              Current Active Election
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Election ID</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {dashboard.activeElectionId ?? "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Election Name</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {dashboard.activeElectionName || "No Active Election"}
                </p>
              </div>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
