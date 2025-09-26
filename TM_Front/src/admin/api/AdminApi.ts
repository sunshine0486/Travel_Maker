import axios from "axios";
import type { Member, Board, Comment, PagedResponse } from "../../type";
import type { FileSettingDto } from "../../board/type";
import { getAxiosConfig } from "../../member/api/loginApi";

export const BASE_URL = import.meta.env.VITE_API_URL;

// ===== Member API =====
export const getMembers = async (page = 1): Promise<PagedResponse<Member>> => {
  const res = await axios.get<PagedResponse<Member>>(
    `${BASE_URL}/admin/members?page=${page - 1}`,
    getAxiosConfig()
  );
  return res.data;
};

// ===== Board API =====
export const getBoards = async (page = 1): Promise<PagedResponse<Board>> => {
  const res = await axios.get<PagedResponse<Board>>(
    `${BASE_URL}/admin/boards?page=${page - 1}`,
    getAxiosConfig()
  );
  console.log(res.data)
  return res.data;
};

export const deleteBoard = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/admin/boards/${id}`, getAxiosConfig());
};

// ===== Comment API =====
export const getComments = async (
  page = 1
): Promise<PagedResponse<Comment>> => {
  const res = await axios.get<PagedResponse<Comment>>(
    `${BASE_URL}/admin/comments?page=${page - 1}`,
    getAxiosConfig()
  );
  return res.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await axios.patch(
    `${BASE_URL}/admin/comments/${id}/delete`, null,
    getAxiosConfig()
  );
};

// 파일 설정 불러오기
export const getFileSetting = async (): Promise<FileSettingDto> => {
  try {
    const response = await axios.get<FileSettingDto>(
      `${BASE_URL}/admin/filesetting`,
      getAxiosConfig()
    );
    return response.data;
  } catch (err) {
    console.error("설정 파일을 불러오는데 실패했습니다.", err);
    throw err;
  }
};

// 파일 설정 수정하기
export const updateFileSetting = async (
  body: FileSettingDto
): Promise<boolean> => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/admin/filesetting`,
      body,
      getAxiosConfig()
    );
    console.log("파일 설정 저장 성공:", res.data);
    return true;
  } catch (err) {
    console.error("파일 설정 저장 실패:", err);
    return false;
  }
};
