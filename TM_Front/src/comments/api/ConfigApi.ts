import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

export const getCommentMaxLength = async (): Promise<number> => {
  const res = await axios.get(`${BASE_URL}/config/comment-max-length`);
  return res.data;
};