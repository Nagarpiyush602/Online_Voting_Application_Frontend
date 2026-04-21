import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { getActiveElection } from "../../api/electionApi";
import { getActiveElectionCandidates } from "../../api/candidateApi";
import { castVote } from "../../api/voteApi";

const VotePage = () => {
  const [loading, setLoading] = useState(true);
  const [voteLoadingId, setVoteLoadingId] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [uiMessage, setUiMessage] = useState("");

  const fetchVotePageData = async () => {
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
        error.response?.data?.message || "Failed to load vote page data";
      toast.error(message);
      setActiveElection(null);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotePageData();
  }, []);

  useEffect(() => {
    if (!activeElection) return;

    if (activeElection.status === "COMPLETED") {
      setUiMessage("This election is completed. Voting is closed.");
    } else if (activeElection.status === "UPCOMING") {
      setUiMessage("This election has not started yet.");
    } else if (!alreadyVoted) {
      setUiMessage("");
    }
  }, [activeElection, alreadyVoted]);

  const countdownText = useMemo(() => {
    if (!activeElection) return "";

    const now = new Date();
    const start = new Date(activeElection.startTime);
    const end = new Date(activeElection.endTime);

    let diff = 0;
    let label = "";

    if (activeElection.status === "UPCOMING") {
      diff = start - now;
      label = "Starts in";
    } else if (activeElection.status === "ACTIVE") {
      diff = end - now;
      label = "Ends in";
    } else {
      return "Election has ended";
    }

    if (diff <= 0) return "Updating status...";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${label}: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [activeElection, loading]);

  useEffect(() => {
    if (!activeElection) return;

    const interval = setInterval(() => {
      // force re-render for countdown
      setActiveElection((prev) => (prev ? { ...prev } : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeElection]);

  const handleVote = async (candidateId, candidateName) => {
    if (!activeElection) {
      toast.error("No active election found");
      return;
    }

    if (alreadyVoted) {
      toast.error("You have already voted");
      return;
    }

    if (activeElection.status !== "ACTIVE") {
      toast.error("Voting is allowed only when election is ACTIVE");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to vote for ${candidateName}?`,
    );

    if (!confirmed) return;

    try {
      setVoteLoadingId(candidateId);

      const response = await castVote(candidateId);

      setSelectedCandidateId(candidateId);
      setAlreadyVoted(true);
      setUiMessage("Your vote has been submitted successfully.");
      toast.success(response.message || "Vote cast successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cast vote";
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

      toast.error(message);
    } finally {
      setVoteLoadingId(null);
    }
  };

  const votingDisabled =
    !activeElection || activeElection.status !== "ACTIVE" || alreadyVoted;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vote Page"
        subtitle="Yahan voter active election ke candidates ko dekh kar secure vote cast kar sakta hai."
      />

      {loading ? (
        <Loader text="Vote page load ho rahi hai..." />
      ) : (
        <>
          <SectionCard className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Active Election
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Election details and current voting status
                </p>
              </div>

              {activeElection?.status && (
                <StatusBadge status={activeElection.status} />
              )}
            </div>

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

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-700">
                    {countdownText}
                  </p>
                </div>

                {uiMessage && (
                  <div
                    className={`rounded-2xl p-4 text-sm font-medium ${
                      alreadyVoted
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {uiMessage}
                  </div>
                )}
              </>
            )}
          </SectionCard>

          <SectionCard className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                Candidates
              </h2>
              <button
                onClick={fetchVotePageData}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            {candidates.length === 0 ? (
              <EmptyState
                title="No Candidates Available"
                message="Active election ke liye abhi koi candidate available nahi hai."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidateId === candidate.id;

                  return (
                    <div
                      key={candidate.id}
                      className={`rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {candidate.name}
                          </h3>

                          {isSelected && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Selected
                            </span>
                          )}
                        </div>

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
                            handleVote(candidate.id, candidate.name)
                          }
                          disabled={
                            votingDisabled || voteLoadingId === candidate.id
                          }
                          className={`rounded-lg px-4 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isSelected
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-slate-900 hover:bg-slate-800"
                          }`}
                        >
                          {voteLoadingId === candidate.id
                            ? "Voting..."
                            : alreadyVoted
                              ? "Vote Submitted"
                              : "Vote"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default VotePage;
