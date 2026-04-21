import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { getActiveElectionCandidates } from "../../api/candidateApi";

const ActiveCandidatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await getActiveElectionCandidates();
        setCandidates(response.data || []);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch candidates";
        toast.error(message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Active election ke candidates backend se fetch ho rahe hain."
      />

      {loading ? (
        <Loader text="Candidates load ho rahe hain..." />
      ) : candidates.length === 0 ? (
        <SectionCard>
          <EmptyState
            title="No Candidates Available"
            message="Active election ke liye abhi koi candidate available nahi hai."
          />
        </SectionCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((candidate) => (
            <SectionCard key={candidate.id} className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-800">
                {candidate.name}
              </h2>

              <div className="space-y-1 text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Party:</span>{" "}
                  {candidate.party || "N/A"}
                </p>

                {"voteCount" in candidate && (
                  <p>
                    <span className="font-medium text-slate-700">
                      Vote Count:
                    </span>{" "}
                    {candidate.voteCount}
                  </p>
                )}
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveCandidatesPage;
