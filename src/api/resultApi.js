import axiosInstance from "./axiosInstance";

export const getElectionResult = async (electionName) => {
  const response = await axiosInstance.get(
    `/api/election-results/${encodeURIComponent(electionName)}`,
  );

  return response.data;
};
