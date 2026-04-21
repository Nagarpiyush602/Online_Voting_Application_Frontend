import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import {
  createElection,
  deleteElection,
  getAllElections,
} from "../../api/electionApi";

const initialForm = {
  name: "",
  startTime: "",
  endTime: "",
};

const AdminElectionPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Election name is required");
      return false;
    }

    if (!formData.startTime) {
      toast.error("Start time is required");
      return false;
    }

    if (!formData.endTime) {
      toast.error("End time is required");
      return false;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      toast.error("End time must be greater than start time");
      return false;
    }

    return true;
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setCreateLoading(true);

      const payload = {
        name: formData.name.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const response = await createElection(payload);

      toast.success(response.message || "Election created successfully");
      setFormData(initialForm);
      fetchElections();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create election";
      toast.error(message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteElection = async (electionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this election?",
    );

    if (!confirmed) return;

    try {
      setDeleteLoadingId(electionId);
      const response = await deleteElection(electionId);
      toast.success(response.message || "Election deleted successfully");
      fetchElections();
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
        title="Manage Elections"
        subtitle="Admin yahan new election create kar sakta hai aur existing elections manage kar sakta hai."
      />

      <SectionCard>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">
          Create Election
        </h2>

        <form
          onSubmit={handleCreateElection}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Election Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter election name"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createLoading}
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createLoading ? "Creating..." : "Create Election"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Election List
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
          <EmptyState
            title="No Elections Available"
            message="Abhi tak koi election create nahi hua hai."
          />
        ) : (
          <div className="grid gap-4">
            {elections.map((election) => (
              <div
                key={election.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {election.name}
                    </h3>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">ID:</span>{" "}
                      {election.id}
                    </p>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">
                        Start Time:
                      </span>{" "}
                      {election.startTime
                        ? new Date(election.startTime).toLocaleString()
                        : "N/A"}
                    </p>

                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-700">
                        End Time:
                      </span>{" "}
                      {election.endTime
                        ? new Date(election.endTime).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <StatusBadge status={election.status} />

                    <button
                      onClick={() => handleDeleteElection(election.id)}
                      disabled={deleteLoadingId === election.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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

export default AdminElectionPage;
