// Retrieve auth token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};
import { toast } from "react-toastify";

export const notifySuccess = (message) => {
  toast.success(message || "Success!", {
    position: "bottom-right",
    autoClose: 3000
  });
};

export const notifyError = (error) => {
  const details = error?.data?.details;
  const detailsMessage = Array.isArray(details) && details.length > 0 ? details.join(" ") : null;
  const message =
    detailsMessage ||
    error?.data?.message ||
    error?.message ||
    "An error occurred";
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000
  });
};

export const notifyInfo = (message) => {
  toast.info(message, {
    position: "bottom-right",
    autoClose: 3000
  });
};
