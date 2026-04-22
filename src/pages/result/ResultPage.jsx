import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";
import InfoBanner from "../../components/ui/InfoBanner";
import { getAllElections } from "../../api/electionApi";
import { declareElectionResult } from "../../api/resultApi";
import { getUserRole } from "../../utils/auth";
import { getApiData, getApiMessage, handleApiError } from "../../utils/api";
import { showSuccessToast, showWarningToast } from "../../utils/toast";

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
      const allElections = getApiData(response) || [];

      setElections(allElections);

      if (allElections.length > 0) {
        const completedElection =
          allElections.find((item) => item.status === "COMPLETED") ||
          allElections[0];

        setSelectedElectionName(completedElection.name);
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch elections");
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

  const hasResultData = Boolean(result?.resultStatus);
  const isCompletedElection = selectedElection?.status === "COMPLETED";
  const isAlreadyDeclared = Boolean(result?.declaredAt);

  const handleDeclareOrViewResult = async () => {
    if (!selectedElectionName) {
      showWarningToast("Please select an election first");
      return;
    }

    try {
      setResultLoading(true);
      const response = await declareElectionResult(selectedElectionName);
      const resultData = getApiData(response);

      setResult(resultData);
      showSuccessToast(
        getApiMessage(
          response,
          isAdmin
            ? "Result declared successfully"
            : "Result loaded successfully",
        ),
      );
    } catch (error) {
      handleApiError(error, "Failed to load result");
      setResult(null);
    } finally {
      setResultLoading(false);
    }
  };

  const declareButtonDisabled =
    resultLoading ||
    !selectedElectionName ||
    (isAdmin && (!isCompletedElection || isAlreadyDeclared));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Election Result"
        subtitle="Yahan se admin completed election ka result declare kar sakta hai aur voter declared result dekh sakta hai."
      />

      {loading ? (
        <Loader text="Result page load ho rahi hai..." fullPage />
      ) : (
        <>
          <SectionCard
            title="Select Election"
            subtitle="Completed election choose karke result process start karo."
          >
            {elections.length === 0 ? (
              <EmptyState
                title="No Elections Available"
                message="Abhi system me koi election available nahi hai."
              />
            ) : (
              <div className="space-y-4">
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

                {selectedElection ? (
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
                      <p className="text-sm text-slate-500">Election Status</p>
                      <div className="mt-2">
                        <StatusBadge status={selectedElection.status} />
                      </div>
                    </div>
                  </div>
                ) : null}

                {isAdmin && !isCompletedElection ? (
                  <InfoBanner
                    variant="warning"
                    title="Result declaration blocked"
                    message="Admin sirf COMPLETED election ka result declare kar sakta hai."
                  />
                ) : null}

                {isAdmin && isAlreadyDeclared ? (
                  <InfoBanner
                    variant="info"
                    title="Result already declared"
                    message="Is election ka result already declared hai. Aap neeche declared result dekh sakte ho."
                  />
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDeclareOrViewResult}
                    disabled={declareButtonDisabled}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resultLoading ? (
                      <Loader
                        inline
                        size="sm"
                        text={isAdmin ? "Declaring..." : "Loading..."}
                      />
                    ) : isAdmin ? (
                      "Declare Result"
                    ) : (
                      "View Result"
                    )}
                  </button>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Result Details"
            subtitle="Result state ke hisab se winner, tie, ya no-votes UI dikhaya jayega."
          >
            {!hasResultData ? (
              <EmptyState
                title="No Result Loaded"
                message="Election choose karke result load ya declare karo."
              />
            ) : (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-4">
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
                    <div className="mt-2">
                      <StatusBadge status={result.resultStatus} />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Declared At</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {result.declaredAt
                        ? new Date(result.declaredAt).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                {result.resultStatus === "DECLARED" ? (
                  <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                      Winner
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-emerald-800">
                      {result.winnerName || "N/A"}
                    </h3>
                    <p className="mt-3 text-emerald-700">
                      Winner vote count:{" "}
                      <span className="font-semibold">
                        {result.winnerVotes ?? 0}
                      </span>
                    </p>
                  </div>
                ) : null}

                {result.resultStatus === "TIE" ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
                    <h3 className="text-2xl font-bold text-amber-800">
                      Result is a Tie
                    </h3>
                    <p className="mt-2 text-amber-700">
                      Multiple candidates ke highest votes same hain.
                    </p>

                    {Array.isArray(result.tiedCandidates) &&
                    result.tiedCandidates.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {result.tiedCandidates.map((candidate, index) => (
                          <span
                            key={`${candidate}-${index}`}
                            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-800"
                          >
                            {candidate}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {result.resultStatus === "NO_VOTES" ? (
                  <EmptyState
                    title="No Votes Found"
                    message="Is election me koi valid vote record nahi mila, isliye winner declare nahi hua."
                  />
                ) : null}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default ResultPage;
