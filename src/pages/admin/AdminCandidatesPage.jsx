import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import CandidateForm from "../../components/candidate/CandidateForm";
import {
  addCandidate,
  deleteCandidate,
  getActiveElectionCandidates,
} from "../../api/candidateApi";
import { getActiveElection } from "../../api/electionApi";

const AdminCandidatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeElection, setActiveElection] = useState(null);

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [electionResponse, candidatesResponse] = await Promise.all([
        getActiveElection(),
        getActiveElectionCandidates(),
      ]);

      setActiveElection(electionResponse.data || null);
      setCandidates(candidatesResponse.data || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch candidate data";
      toast.error(message);
      setActiveElection(null);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleAddCandidate = async (formData) => {
    if (!activeElection?.id) {
      toast.error("No active election found. Candidate cannot be added.");
      return false;
    }

    try {
      setFormLoading(true);

      const payload = {
        name: formData.name,
        party: formData.party,
        electionId: activeElection.id,
      };

      const response = await addCandidate(payload);
      toast.success(response.message || "Candidate added successfully");

      await fetchPageData();
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add candidate";
      toast.error(message);
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${candidateName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoadingId(candidateId);
      const response = await deleteCandidate(candidateId);
      toast.success(response.message || "Candidate deleted successfully");
      await fetchPageData();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete candidate";
      toast.error(message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Candidate Management"
        subtitle="Admin active election ke candidates ko add aur delete kar sakta hai."
      />

      {loading ? (
        <Loader text="Candidates management page load ho rahi hai..." />
      ) : (
        <>
          <SectionCard className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Active Election
              </h2>
              <p className="mt-2 text-slate-600">
                {activeElection
                  ? `${activeElection.name} (${activeElection.status})`
                  : "No active election available"}
              </p>
            </div>

            {activeElection ? (
              <CandidateForm
                onSubmit={handleAddCandidate}
                loading={formLoading}
              />
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 text-amber-700">
                Pehle active election hona chahiye tabhi candidate add kar sakte
                ho.
              </div>
            )}
          </SectionCard>

          <SectionCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Active Election Candidates
              </h2>
              <button
                onClick={fetchPageData}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            {candidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No candidates available
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {candidate.name}
                      </h3>

                      <p className="text-slate-600">
                        <span className="font-medium text-slate-700">
                          Party:
                        </span>{" "}
                        {candidate.party || "N/A"}
                      </p>

                      {"voteCount" in candidate && (
                        <p className="text-slate-600">
                          <span className="font-medium text-slate-700">
                            Vote Count:
                          </span>{" "}
                          {candidate.voteCount}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleDeleteCandidate(candidate.id, candidate.name)
                        }
                        disabled={deleteLoadingId === candidate.id}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleteLoadingId === candidate.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default AdminCandidatesPage;
