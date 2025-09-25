import axios from "axios";
import type { Member, Board, Comment, PagedResponse } from "../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

// ===== Member API =====
export const getMembers = async (page = 1): Promise<PagedResponse<Member>> => {
  const res = await axios.get<PagedResponse<Member>>(
    `${BASE_URL}/admin/members?page=${page - 1}`
  );
  return res.data;
};

// ===== Board API =====
export const getBoards = async (page = 1): Promise<PagedResponse<Board>> => {
  const res = await axios.get<PagedResponse<Board>>(
    `${BASE_URL}/admin/boards?page=${page - 1}`
  );
  return res.data;
};

export const deleteBoard = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/admin/boards/${id}`);
};

// ===== Comment API =====
export const getComments = async (page = 1): Promise<PagedResponse<Comment>> => {
  const res = await axios.get<PagedResponse<Comment>>(
    `${BASE_URL}/admin/comments?page=${page - 1}`
  );
  return res.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await axios.patch(`${BASE_URL}/admin/comments/${id}/delete`);
};
