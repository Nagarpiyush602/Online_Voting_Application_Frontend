import axiosInstance from "./axiosInstance";

export const declareElectionResult = async (electionName) => {
  const response = await axiosInstance.get(
    `/api/election-results/declare/${encodeURIComponent(electionName)}`,
  );

  return response.data;
};
