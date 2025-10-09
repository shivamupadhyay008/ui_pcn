import { COLORS } from "./constants/colors";

export const loginModalStyles = {
  backdrop: "fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-cover bg-center",

  container: "bg-white rounded-2xl shadow-xl p-6 w-[94%] max-w-lg animate-fadeIn relative",

  logo: "h-14 object-contain",

  header: "text-center text-2xl mb-4",

  emailInput: `mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2`,

  submitButton: `py-2 px-6 rounded-lg disabled:opacity-50 ${COLORS.primary}`,

  registerButton: `text-sm ${COLORS.textLink}`,

  closeButton: "absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl",
};
