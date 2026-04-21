import axiosInstance from "./axiosInstance";

export const getActiveElection = async () => {
  const response = await axiosInstance.get("/api/elections/active");
  return response.data;
};
