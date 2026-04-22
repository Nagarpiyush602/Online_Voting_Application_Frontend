import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import InfoBanner from "../../components/ui/InfoBanner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { castVote } from "../../api/voteApi";
import { getActiveElectionCandidates } from "../../api/candidateApi";
import { getActiveElection } from "../../api/electionApi";
import { getApiData, getApiMessage, handleApiError } from "../../utils/api";
import { showSuccessToast, showWarningToast } from "../../utils/toast";

const getCountdownText = (election) => {
  if (!election) return "No active election available right now.";

  const now = new Date();
  const startTime = new Date(election.startTime);
  const endTime = new Date(election.endTime);

  if (election.status === "UPCOMING") {
    const diff = startTime - now;
    if (diff <= 0) return "Election will start soon.";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Election starts in ${hours}h ${minutes}m.`;
  }

  if (election.status === "ACTIVE") {
    const diff = endTime - now;
    if (diff <= 0) return "Election is ending soon.";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Voting closes in ${hours}h ${minutes}m.`;
  }

  return "This election has already completed.";
};

const VotePage = () => {
  const [loading, setLoading] = useState(true);
  const [voteLoadingId, setVoteLoadingId] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [uiMessage, setUiMessage] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    candidateId: null,
    candidateName: "",
  });

  const fetchVotePageData = async () => {
    try {
      setLoading(true);
      const [electionResponse, candidatesResponse] = await Promise.all([
        getActiveElection(),
        getActiveElectionCandidates(),
      ]);

      setActiveElection(getApiData(electionResponse));
      setCandidates(getApiData(candidatesResponse) || []);
    } catch (error) {
      handleApiError(error, "Failed to fetch voting data");
      setActiveElection(null);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotePageData();
  }, []);

  const handleVoteClick = (candidateId, candidateName) => {
    if (!activeElection) {
      showWarningToast("No active election found");
      return;
    }

    if (alreadyVoted) {
      showWarningToast("You have already voted in this election");
      return;
    }

    if (activeElection.status !== "ACTIVE") {
      showWarningToast("Voting is allowed only when election is ACTIVE");
      return;
    }

    setConfirmState({
      open: true,
      candidateId,
      candidateName,
    });
  };

  const handleConfirmVote = async () => {
    const { candidateId } = confirmState;

    if (!candidateId) return;

    try {
      setVoteLoadingId(candidateId);
      const response = await castVote(candidateId);

      setSelectedCandidateId(candidateId);
      setAlreadyVoted(true);
      setUiMessage("Your vote has been submitted successfully.");
      showSuccessToast(getApiMessage(response, "Vote cast successfully"));
      setConfirmState({ open: false, candidateId: null, candidateName: "" });
    } catch (error) {
      const message = handleApiError(error, "Failed to cast vote");
      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("already voted") ||
        normalizedMessage.includes("already cast") ||
        normalizedMessage.includes("one vote") ||
        normalizedMessage.includes("duplicate")
      ) {
        setAlreadyVoted(true);
        setUiMessage("You have already voted in this election.");
      }
    } finally {
      setVoteLoadingId(null);
    }
  };

  const countdownText = getCountdownText(activeElection);
  const votingDisabled =
    !activeElection || activeElection.status !== "ACTIVE" || alreadyVoted;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vote Page"
        subtitle="Yahan voter active election ke candidates ko dekh kar secure vote cast kar sakta hai."
      />

      {loading ? (
        <Loader text="Vote page load ho rahi hai..." fullPage />
      ) : (
        <>
          <SectionCard
            title="Active Election"
            subtitle="Election details and current voting status"
          >
            <div className="space-y-5">
              {activeElection?.status ? (
                <StatusBadge status={activeElection.status} />
              ) : null}

              {!activeElection ? (
                <EmptyState
                  title="No Active Election"
                  message="Abhi koi active election available nahi hai."
                />
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Election Name</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {activeElection.name}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Start Time</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {new Date(activeElection.startTime).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">End Time</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {new Date(activeElection.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <InfoBanner variant="info" message={countdownText} />

                  {uiMessage ? (
                    <InfoBanner
                      variant={alreadyVoted ? "success" : "warning"}
                      title={alreadyVoted ? "Vote Status" : "Important"}
                      message={uiMessage}
                    />
                  ) : null}
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Candidates"
            subtitle="Choose one candidate carefully before submitting your vote."
            action={
              <button
                onClick={fetchVotePageData}
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
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidateId === candidate.id;
                  const isButtonLoading = voteLoadingId === candidate.id;

                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
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
                      </div>

                      <button
                        onClick={() =>
                          handleVoteClick(candidate.id, candidate.name)
                        }
                        disabled={votingDisabled || isButtonLoading}
                        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isButtonLoading ? (
                          <Loader inline size="sm" text="Submitting..." />
                        ) : alreadyVoted ? (
                          "Vote Submitted"
                        ) : (
                          "Vote Now"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <ConfirmDialog
            open={confirmState.open}
            title="Confirm Your Vote"
            message={`Are you sure you want to vote for ${confirmState.candidateName}? This action should be treated as final.`}
            confirmText="Confirm Vote"
            cancelText="Cancel"
            loading={Boolean(voteLoadingId)}
            onClose={() =>
              setConfirmState({
                open: false,
                candidateId: null,
                candidateName: "",
              })
            }
            onConfirm={handleConfirmVote}
          />
        </>
      )}
    </div>
  );
};

export default VotePage;
