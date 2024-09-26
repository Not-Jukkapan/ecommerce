import axios from "axios";

const API_URL = "http://192.168.1.63:3000/api";

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, data);

    return { data: response.data, status: response.status };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("err", error);

    return {
      error: error.response?.data.message || "Unknown error occoured",
      status: error.response?.status || 500,
      errorCode: error.response?.data.errorCode,
      errorStatusText: error.response?.statusText,
    };
  }
};
