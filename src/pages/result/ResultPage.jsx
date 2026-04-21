import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import { getAllElections } from "../../api/electionApi";
import { declareElectionResult } from "../../api/resultApi";
import { getUserRole } from "../../utils/auth";

const ResultPage = () => {
  const role = getUserRole();
  const isAdmin = role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [elections, setElections] = useState([]);
  const [selectedElectionName, setSelectedElectionName] = useState("");
  const [result, setResult] = useState(null);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await getAllElections();
      const allElections = response.data || [];
      setElections(allElections);

      if (allElections.length > 0) {
        const completedElection =
          allElections.find((item) => item.status === "COMPLETED") ||
          allElections[0];

        setSelectedElectionName(completedElection.name);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch elections";
      toast.error(message);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const selectedElection = useMemo(() => {
    return elections.find((item) => item.name === selectedElectionName) || null;
  }, [elections, selectedElectionName]);

  const handleDeclareOrViewResult = async () => {
    if (!selectedElectionName) {
      toast.error("Please select an election");
      return;
    }

    try {
      setResultLoading(true);
      const response = await declareElectionResult(selectedElectionName);
      setResult(response.data);
      toast.success(response.message || "Result loaded successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load result";
      toast.error(message);
      setResult(null);
    } finally {
      setResultLoading(false);
    }
  };

  const isDeclareDisabled =
    !selectedElection || selectedElection.status !== "COMPLETED";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Election Result"
        subtitle="Election select karke result dekh sakte ho. Admin completed election ka result declare bhi kar sakta hai."
      />

      {loading ? (
        <Loader text="Result page load ho rahi hai..." />
      ) : (
        <>
          <SectionCard className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Select Election
            </h2>

            {elections.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                No elections available
              </div>
            ) : (
              <>
                <select
                  value={selectedElectionName}
                  onChange={(e) => {
                    setSelectedElectionName(e.target.value);
                    setResult(null);
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                >
                  {elections.map((election) => (
                    <option key={election.id} value={election.name}>
                      {election.name} ({election.status})
                    </option>
                  ))}
                </select>

                {selectedElection && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Start Time</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {new Date(selectedElection.startTime).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">End Time</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {new Date(selectedElection.endTime).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedElection.status}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDeclareOrViewResult}
                    disabled={resultLoading || !selectedElectionName}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resultLoading
                      ? "Loading..."
                      : isAdmin
                        ? "Declare Result"
                        : "View Result"}
                  </button>

                  {isAdmin && isDeclareDisabled && (
                    <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      Declare button completed election ke liye hi use karna
                      chahiye.
                    </div>
                  )}
                </div>
              </>
            )}
          </SectionCard>

          <SectionCard className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Result Details
            </h2>

            {!result ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
                Result not declared yet
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Election Name</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {result.electionName || "N/A"}
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
                      {result.resultStatus || "N/A"}
                    </p>
                  </div>
                </div>

                {result.resultStatus === "DECLARED" && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                    <p className="text-sm font-medium text-emerald-700">
                      Winner
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-emerald-800">
                      {result.winnerName || "N/A"}
                    </h3>
                    <p className="mt-2 text-emerald-700">
                      Winner Vote Count: {result.winnerVotes ?? 0}
                    </p>
                  </div>
                )}

                {result.resultStatus === "TIE" && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <h3 className="text-xl font-bold text-amber-800">
                      Result is a Tie
                    </h3>
                    <p className="mt-2 text-amber-700">
                      Multiple candidates ke votes same hain.
                    </p>

                    {Array.isArray(result.tiedCandidates) &&
                      result.tiedCandidates.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.tiedCandidates.map((candidate, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-amber-700"
                            >
                              {candidate}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {result.resultStatus === "NO_VOTES" && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      No Votes Found
                    </h3>
                    <p className="mt-2 text-slate-600">
                      Is election me abhi koi valid vote record nahi mila.
                    </p>
                  </div>
                )}
              </>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default ResultPage;
