import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import ElectionForm from "../../components/election/ElectionForm";
import {
  createElection,
  deleteElection,
  getAllElections,
} from "../../api/electionApi";

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "UPCOMING":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const AdminElectionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await getAllElections();
      setElections(response.data || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch elections";
      toast.error(message);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleCreateElection = async (formData) => {
    try {
      setFormLoading(true);
      const response = await createElection(formData);
      toast.success(response.message || "Election created successfully");
      await fetchElections();
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create election";
      toast.error(message);
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteElection = async (electionId, electionName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${electionName}?`,
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(electionId);
      const response = await deleteElection(electionId);
      toast.success(response.message || "Election deleted successfully");
      await fetchElections();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete election";
      toast.error(message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Election Management"
        subtitle="Admin yahan elections create karega aur sabhi elections ko manage karega."
      />

      <SectionCard className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Create Election
        </h2>
        <ElectionForm onSubmit={handleCreateElection} loading={formLoading} />
      </SectionCard>

      <SectionCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            All Elections
          </h2>
          <button
            onClick={fetchElections}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <Loader text="Elections load ho rahe hain..." />
        ) : elections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
            No elections available
          </div>
        ) : (
          <div className="grid gap-4">
            {elections.map((election) => (
              <div
                key={election.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {election.name}
                    </h3>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">Start:</span>{" "}
                      {new Date(election.startTime).toLocaleString()}
                    </p>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">End:</span>{" "}
                      {new Date(election.endTime).toLocaleString()}
                    </p>

                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        election.status,
                      )}`}
                    >
                      {election.status}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={() =>
                        handleDeleteElection(election.id, election.name)
                      }
                      disabled={deleteLoadingId === election.id}
                      className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleteLoadingId === election.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminElectionsPage;
