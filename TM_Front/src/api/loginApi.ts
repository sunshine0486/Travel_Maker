import axios, { type AxiosRequestConfig } from "axios";
import type { User } from "../type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAuthToken = async (loginId: User) => {
  const response = await axios.post(`${BASE_URL}/login`, loginId);
  return response.headers.authorization;
};
export const getAxiosConfig = (): AxiosRequestConfig => {
  const token = sessionStorage.getItem("jwt");
  return {
    headers: {
      Authorization: token,
    },
  };
};
