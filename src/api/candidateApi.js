import axiosInstance from "./axiosInstance";

export const getActiveElectionCandidates = async () => {
  const response = await axiosInstance.get("/api/candidates/active-election");
  return response.data;
};
