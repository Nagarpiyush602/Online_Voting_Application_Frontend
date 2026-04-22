import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import CandidateForm from "../../components/candidate/CandidateForm";
import EmptyState from "../../components/ui/EmptyState";
import InfoBanner from "../../components/ui/InfoBanner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  addCandidate,
  deleteCandidate,
  getActiveElectionCandidates,
} from "../../api/candidateApi";
import { getActiveElection } from "../../api/electionApi";
import { getApiData, getApiMessage, handleApiError } from "../../utils/api";
import { showSuccessToast, showWarningToast } from "../../utils/toast";

const AdminCandidatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [activeElection, setActiveElection] = useState(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    candidateId: null,
    candidateName: "",
  });

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [electionResponse, candidatesResponse] = await Promise.all([
        getActiveElection(),
        getActiveElectionCandidates(),
      ]);

      setActiveElection(getApiData(electionResponse));
      setCandidates(getApiData(candidatesResponse) || []);
    } catch (error) {
      handleApiError(error, "Failed to fetch candidate data");
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
      showWarningToast("No active election found. Candidate cannot be added.");
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
      showSuccessToast(getApiMessage(response, "Candidate added successfully"));
      await fetchPageData();
      return true;
    } catch (error) {
      handleApiError(error, "Failed to add candidate");
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCandidate = async () => {
    try {
      setDeleteLoadingId(confirmState.candidateId);
      const response = await deleteCandidate(confirmState.candidateId);
      showSuccessToast(
        getApiMessage(response, "Candidate deleted successfully"),
      );
      setConfirmState({ open: false, candidateId: null, candidateName: "" });
      await fetchPageData();
    } catch (error) {
      handleApiError(error, "Failed to delete candidate");
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
        <Loader
          text="Candidates management page load ho rahi hai..."
          fullPage
        />
      ) : (
        <>
          <SectionCard
            title="Active Election"
            subtitle="Candidate sirf active election ke against add kiya jayega."
          >
            <div className="space-y-4">
              {activeElection ? (
                <InfoBanner
                  variant="info"
                  title={activeElection.name}
                  message={`Current status: ${activeElection.status}`}
                />
              ) : (
                <InfoBanner
                  variant="warning"
                  title="No active election available"
                  message="Pehle active election hona chahiye tabhi candidate add kar sakte ho."
                />
              )}

              {activeElection ? (
                <CandidateForm
                  onSubmit={handleAddCandidate}
                  loading={formLoading}
                />
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Active Election Candidates"
            subtitle="Current active election ke saare candidates yahan dikh rahe hain."
            action={
              <button
                onClick={fetchPageData}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            }
          >
            {candidates.length === 0 ? (
              <EmptyState
                title="No Candidates Available"
                message="Active election ke liye abhi koi candidate available nahi hai."
              />
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

                      {"voteCount" in candidate ? (
                        <p className="text-slate-600">
                          <span className="font-medium text-slate-700">
                            Vote Count:
                          </span>{" "}
                          {candidate.voteCount}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() =>
                          setConfirmState({
                            open: true,
                            candidateId: candidate.id,
                            candidateName: candidate.name,
                          })
                        }
                        disabled={deleteLoadingId === candidate.id}
                        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleteLoadingId === candidate.id ? (
                          <Loader inline size="sm" text="Deleting..." />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <ConfirmDialog
            open={confirmState.open}
            title="Delete Candidate"
            message={`Are you sure you want to delete ${confirmState.candidateName}?`}
            confirmText="Delete"
            cancelText="Cancel"
            confirmVariant="danger"
            loading={Boolean(deleteLoadingId)}
            onClose={() =>
              setConfirmState({
                open: false,
                candidateId: null,
                candidateName: "",
              })
            }
            onConfirm={handleDeleteCandidate}
          />
        </>
      )}
    </div>
  );
};

export default AdminCandidatesPage;
