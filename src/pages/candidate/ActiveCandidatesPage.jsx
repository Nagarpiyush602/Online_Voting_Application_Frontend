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
    <div className="space-y-6">
      <PageHeader
        title="Candidates"
        subtitle="Active election ke candidates backend se fetch ho rahe hain with cleaner responsive card layout."
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {candidates.map((candidate) => (
            <SectionCard key={candidate.id} className="h-full">
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Candidate
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-slate-900">
                    {candidate.name}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Party:</span>{" "}
                      {candidate.party || "N/A"}
                    </p>

                    {"voteCount" in candidate ? (
                      <p>
                        <span className="font-medium text-slate-700">
                          Vote Count:
                        </span>{" "}
                        {candidate.voteCount}
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Candidate details active election API se aa rahi hain.
                </p>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveCandidatesPage;
