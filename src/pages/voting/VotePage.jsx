import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getActiveElection } from "../../api/electionApi";
import { getActiveElectionCandidates } from "../../api/candidateApi";
import { castVote } from "../../api/voteApi";

const VotePage = () => {
  const [loading, setLoading] = useState(true);
  const [voteLoadingId, setVoteLoadingId] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [candidates, setCandidates] = useState([]);

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

  const handleVote = async (candidateId, candidateName) => {
    if (!activeElection) {
      toast.error("No active election found");
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
      toast.success(response.message || "Vote cast successfully");
      await fetchVotePageData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cast vote";
      toast.error(message);
    } finally {
      setVoteLoadingId(null);
    }
  };

  const votingDisabled = !activeElection || activeElection.status !== "ACTIVE";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vote Page"
        subtitle="Yahan voter active election ke candidates ko dekh kar vote cast kar sakta hai."
      />

      {loading ? (
        <Loader text="Vote page load ho rahi hai..." />
      ) : (
        <>
          <SectionCard className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Active Election
            </h2>

            {!activeElection ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No active election available
              </div>
            ) : (
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

                <div className="rounded-xl bg-slate-50 p-4 md:col-span-3">
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-1 font-semibold text-emerald-600">
                    {activeElection.status}
                  </p>
                </div>
              </div>
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

            {votingDisabled && (
              <div className="rounded-xl bg-amber-50 p-4 text-amber-700">
                Voting button tabhi enabled hoga jab active election available
                ho aur uska status ACTIVE ho.
              </div>
            )}

            {candidates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No candidates available for active election
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
                        onClick={() => handleVote(candidate.id, candidate.name)}
                        disabled={
                          votingDisabled || voteLoadingId === candidate.id
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {voteLoadingId === candidate.id ? "Voting..." : "Vote"}
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

export default VotePage;
