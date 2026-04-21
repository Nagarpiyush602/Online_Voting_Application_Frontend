import axiosInstance from "./axiosInstance";

export const getActiveElection = async () => {
  const response = await axiosInstance.get("/api/elections/active");
  return response.data;
};

export const getAllElections = async () => {
  const response = await axiosInstance.get("/api/elections");
  return response.data;
};

export const createElection = async (electionData) => {
  const response = await axiosInstance.post("/api/elections/add", electionData);
  return response.data;
};

export const deleteElection = async (electionId) => {
  const response = await axiosInstance.delete(
    `/api/elections/delete/${electionId}`,
  );
  return response.data;
};
