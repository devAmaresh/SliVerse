import axios from "axios";
import { backend_url } from "../utils/backend";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${backend_url}/login/`, {
      username: email,
      password: password,
    });
    return response.data;
  } catch (err) {
    throw new Error("Failed to login");
  }
};
