import axiosInstance from '../api/axiosInstance';
import { AUTH_LOGIN } from '../common/constants/apiUrls';

export async function login(username, password) {
  const res = await axiosInstance.post(
    AUTH_LOGIN,
    { username, password }, // body (already content)
    {
      headers: {
        "ark-plugin-secret-key": import.meta.env.VITE_ARK_PLUGIN_SECRET_KEY || "b29c957d8fd7dbfbae08fd8d9c143e3716f9af9b33e80b44deb7deaf41289e04",
      },
    }
  );
  return res.data;
}

export default {};
