import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  createElection,
  deleteElection,
  getAllElections,
} from "../../api/electionApi";
import { getApiData, getApiMessage, handleApiError } from "../../utils/api";
import { showSuccessToast, showWarningToast } from "../../utils/toast";

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
  const [confirmState, setConfirmState] = useState({
    open: false,
    electionId: null,
  });

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await getAllElections();
      setElections(getApiData(response) || []);
    } catch (error) {
      handleApiError(error, "Failed to fetch elections");
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
      showWarningToast("Election name is required");
      return false;
    }

    if (!formData.startTime) {
      showWarningToast("Start time is required");
      return false;
    }

    if (!formData.endTime) {
      showWarningToast("End time is required");
      return false;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      showWarningToast("End time must be greater than start time");
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
      showSuccessToast(
        getApiMessage(response, "Election created successfully"),
      );
      setFormData(initialForm);
      fetchElections();
    } catch (error) {
      handleApiError(error, "Failed to create election");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    try {
      setDeleteLoadingId(confirmState.electionId);
      const response = await deleteElection(confirmState.electionId);
      showSuccessToast(
        getApiMessage(response, "Election deleted successfully"),
      );
      setConfirmState({ open: false, electionId: null });
      fetchElections();
    } catch (error) {
      handleApiError(error, "Failed to delete election");
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

      <SectionCard
        title="Create Election"
        subtitle="New election create karne ke liye basic scheduling details bharo."
      >
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
              {createLoading ? (
                <Loader inline size="sm" text="Creating..." />
              ) : (
                "Create Election"
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Election List"
        subtitle="All elections with live status and delete action."
        action={
          <button
            onClick={fetchElections}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Refresh
          </button>
        }
      >
        {loading ? (
          <Loader text="Elections load ho rahe hain..." />
        ) : elections.length === 0 ? (
          <EmptyState
            title="No Elections Available"
            message="Abhi tak koi election create nahi hua."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {elections.map((election) => (
              <div
                key={election.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {election.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Start: {new Date(election.startTime).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      End: {new Date(election.endTime).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={election.status} />
                </div>

                <button
                  onClick={() =>
                    setConfirmState({ open: true, electionId: election.id })
                  }
                  disabled={deleteLoadingId === election.id}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoadingId === election.id ? (
                    <Loader inline size="sm" text="Deleting..." />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <ConfirmDialog
        open={confirmState.open}
        title="Delete Election"
        message="Are you sure you want to delete this election? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={Boolean(deleteLoadingId)}
        onClose={() => setConfirmState({ open: false, electionId: null })}
        onConfirm={handleDeleteElection}
      />
    </div>
  );
};

export default AdminElectionPage;
