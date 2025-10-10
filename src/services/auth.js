import axiosInstance from '../api/axiosinstance';
import { AUTH_LOGIN } from '../common/constants/apiUrls';

export async function login(username, password) {
  const res = await axiosInstance.post(
    AUTH_LOGIN,
    { username, password }, // body (already content)
    {
      headers: {
        "ark-plugin-secret-key": import.meta.env.VITE_ARK_PLUGIN_SECRET_KEY || "",
      },
    }
  );
  return res.data;
}

export default {};
