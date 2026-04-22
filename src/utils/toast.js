import toast from "react-hot-toast";

const baseOptions = {
  duration: 3000,
};

export const showSuccessToast = (message) => {
  toast.success(message || "Action completed successfully", baseOptions);
};

export const showErrorToast = (message) => {
  toast.error(message || "Something went wrong", {
    ...baseOptions,
    duration: 3500,
  });
};

export const showWarningToast = (message) => {
  toast(message || "Please check this action", {
    ...baseOptions,
    icon: "⚠️",
  });
};
