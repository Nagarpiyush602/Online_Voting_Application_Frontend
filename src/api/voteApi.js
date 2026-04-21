import axiosInstance from "./axiosInstance";

export const castVote = async (candidateId) => {
  const response = await axiosInstance.post("/api/votes/cast", {
    candidateId,
  });

  return response.data;
};
