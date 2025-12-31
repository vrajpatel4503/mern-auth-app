import { toast } from "react-toastify";
// import { MdCheckCircle, MdError } from "react-toastify/md";

// Toast for success
export const showSuccessToast = (message) => {
  toast.success(message || "Success", {
    autoClose: 1000,
  });
};

// Toast for error
export const showErrorToast = (message) => {
  toast.error(message || "Something went wrong", {
    autoClose: 1500,
  });
};
