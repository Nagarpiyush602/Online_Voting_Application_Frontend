import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getActiveElection } from "../../api/electionApi";
import { getElectionResult } from "../../api/resultApi";

const ResultPage = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [electionName, setElectionName] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);

        const electionResponse = await getActiveElection();
        const activeElection = electionResponse.data;

        if (!activeElection?.name) {
          toast.error("Active election not found");
          return;
        }

        setElectionName(activeElection.name);

        const resultResponse = await getElectionResult(activeElection.name);
        setResult(resultResponse.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch result";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return (
    <div>
      <PageHeader
        title="Election Result"
        subtitle="Active election ka result backend se fetch ho raha hai."
      />

      {loading ? (
        <Loader text="Result load ho raha hai..." />
      ) : !result ? (
        <SectionCard>
          <p className="text-slate-600">
            Result available nahi hai for: {electionName || "current election"}.
          </p>
        </SectionCard>
      ) : (
        <SectionCard className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {result.electionName || electionName}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Winner</p>
              <p className="mt-1 font-semibold text-slate-800">
                {result.winnerName || "Not Declared"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total Votes</p>
              <p className="mt-1 font-semibold text-slate-800">
                {result.totalVotes ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Result Status</p>
              <p className="mt-1 font-semibold text-slate-800">
                {result.resultStatus || "PENDING"}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ResultPage;
