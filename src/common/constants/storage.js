// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password length (min 6 chars)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const APP_LOGIN_TOKEN = 'app-x-token';

export const getUserToken = async () => {
  const token = localStorage.getItem(APP_LOGIN_TOKEN);
  window._token = token;
};
