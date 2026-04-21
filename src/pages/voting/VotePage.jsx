import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getActiveElectionCandidates } from "../../api/candidateApi";
import { castVote } from "../../api/voteApi";

const VotePage = () => {
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getActiveElectionCandidates();
      setCandidates(response.data || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch candidates";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    try {
      setSubmittingId(candidateId);
      const response = await castVote(candidateId);
      toast.success(response.message || "Vote cast successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cast vote";
      toast.error(message);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Cast Vote"
        subtitle="Candidate choose karke backend me real vote cast karo."
      />

      {loading ? (
        <Loader text="Candidates load ho rahe hain..." />
      ) : candidates.length === 0 ? (
        <SectionCard>
          <p className="text-slate-600">
            Vote cast karne ke liye koi candidate available nahi hai.
          </p>
        </SectionCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((candidate) => (
            <SectionCard key={candidate.id} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {candidate.name}
                </h2>
                <p className="mt-1 text-slate-600">
                  Party: {candidate.party || "N/A"}
                </p>
              </div>

              <button
                onClick={() => handleVote(candidate.id)}
                disabled={submittingId === candidate.id}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingId === candidate.id ? "Submitting..." : "Vote Now"}
              </button>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotePage;
