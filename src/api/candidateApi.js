import axiosInstance from "./axiosInstance";

export const getActiveElectionCandidates = async () => {
  const response = await axiosInstance.get("/api/candidates/active-election");
  return response.data;
};

export const addCandidate = async (candidateData) => {
  const response = await axiosInstance.post(
    "/api/candidates/add",
    candidateData,
  );
  return response.data;
};

export const deleteCandidate = async (candidateId) => {
  const response = await axiosInstance.delete(
    `/api/candidates/delete/${candidateId}`,
  );
  return response.data;
};
