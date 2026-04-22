import { showErrorToast } from "./toast";

export const getApiData = (response) => response?.data ?? null;

export const getApiMessage = (response, fallback = "Request completed") => {
  return response?.message || fallback;
};

export const extractApiErrorMessage = (
  error,
  fallback = "Something went wrong",
) => {
  return error?.response?.data?.message || fallback;
};

export const handleApiError = (error, fallback = "Something went wrong") => {
  const message = extractApiErrorMessage(error, fallback);

  if (!error?.__handled) {
    showErrorToast(message);
    error.__handled = true;
  }

  return message;
};