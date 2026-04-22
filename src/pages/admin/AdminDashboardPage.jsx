import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import InfoBanner from "../../components/ui/InfoBanner";
import { getAdminDashboard } from "../../api/adminApi";
import { handleApiError } from "../../utils/api";

const quickActions = [
  {
    title: "Manage Candidates",
    description: "Active election ke candidates add aur delete karo.",
    path: "/admin/candidates",
  },
  {
    title: "Manage Elections",
    description: "Election create karo aur lifecycle manage karo.",
    path: "/admin/elections",
  },
  {
    title: "Check Results",
    description: "Completed election ka result review ya declare karo.",
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
      handleApiError(error, "Failed to fetch admin dashboard");
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
        subtitle="System summary, active election insight, aur quick admin actions ek jagah."
      />

      {loading ? (
        <Loader text="Admin dashboard load ho raha hai..." />
      ) : !dashboard ? (
        <SectionCard>
          <EmptyState
            title="Dashboard Not Available"
            message="Dashboard data abhi available nahi hai."
          />
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Voters"
              value={dashboard.totalVoters}
              extra="Registered voters in system"
            />
            <StatCard
              title="Total Candidates"
              value={dashboard.totalCandidates}
              extra="All candidates count"
            />
            <StatCard
              title="Total Votes"
              value={dashboard.totalVotes}
              extra="Votes cast so far"
            />
            <StatCard
              title="Total Elections"
              value={dashboard.totalElections}
              extra="All created elections"
            />
          </div>

          <SectionCard
            title="Active Election Summary"
            subtitle="Current live election information"
          >
            {!dashboard.activeElectionName ? (
              <EmptyState
                title="No Active Election"
                message="Abhi system me koi active election available nahi hai."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Election ID</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {dashboard.activeElectionId ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Election Name</p>
                  <p className="mt-1 text-lg font-semibold text-slate-800">
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

          <SectionCard
            title="Quick Actions"
            subtitle="Daily admin operations ke liye fast navigation cards"
          >
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

          <InfoBanner
            variant="info"
            title="Dashboard Design Improvement"
            message="Stats, election summary, aur actions ko separate reusable sections me divide kiya gaya hai taaki UI clean aur interview-friendly lage."
          />
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;