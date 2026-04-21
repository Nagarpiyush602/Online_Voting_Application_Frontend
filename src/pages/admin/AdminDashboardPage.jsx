import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { getAdminDashboard } from "../../api/adminApi";

const quickActions = [
  {
    title: "Manage Candidates",
    description: "Add and delete candidates for the active election.",
    path: "/admin/candidates",
  },
  {
    title: "Manage Elections",
    description: "Create elections and manage election lifecycle.",
    path: "/admin/elections",
  },
  {
    title: "Declare Result",
    description: "Declare completed election results from result page.",
    path: "/result",
  },
];

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      setDashboard(response.data || null);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch admin dashboard";
      toast.error(message);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Admin yahan system summary, active election details, aur quick actions dekh sakta hai."
      />

      {loading ? (
        <Loader text="Admin dashboard load ho raha hai..." />
      ) : !dashboard ? (
        <SectionCard>
          <EmptyState
            title="Dashboard Not Available"
            message="Dashboard data available nahi hai."
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          </div>

          <SectionCard className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Active Election Summary
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current live election information for admin
                </p>
              </div>

              {dashboard.activeElectionStatus ? (
                <StatusBadge status={dashboard.activeElectionStatus} />
              ) : null}
            </div>

            {!dashboard.activeElectionName ? (
              <EmptyState
                title="No Active Election"
                message="Abhi system me koi active election available nahi hai."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Election ID</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {dashboard.activeElectionId ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Election Name</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {dashboard.activeElectionName}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="mt-2">
                    <StatusBadge status={dashboard.activeElectionStatus} />
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Common admin tasks ke liye fast navigation
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-800">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {action.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-slate-900">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
