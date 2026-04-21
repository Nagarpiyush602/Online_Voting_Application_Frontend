import axiosInstance from "./axiosInstance";

export const getAdminDashboard = async () => {
  const response = await axiosInstance.get("/api/dashboard/admin");
  return response.data;
};
