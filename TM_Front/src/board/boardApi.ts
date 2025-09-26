import axios from "axios";
import type { Board } from "./type";
import { getAxiosConfig } from "../member/api/loginApi";
import { BASE_URL } from "../admin/api/AdminApi";

// 이미지를 서버로 넘겨 url 받아오기
export const getImgUrl = async (file: File) => {
  const formData = new FormData();
  formData.append("boardImgFile", file); //key 이름은 서버 @RequestParam("boardImgFile") 과 일치해야 함

  const response = await axios.post(`${BASE_URL}/board/image`, formData, {
    ...getAxiosConfig(),
    headers: {
      ...getAxiosConfig().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("사진 전송 완료");
  return response.data;
};

// 게시글 작성
export const createBoard = async (formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/board/new`, formData, {
      ...getAxiosConfig(),
      headers: {
        ...getAxiosConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("게시글 저장 성공:", res.data);
    return res.data;
  } catch (err) {
    console.error("게시글 저장 실패:", err);
  }
};

// 게시글 수정
export const updateBoard = async (boardId: number, formData: FormData) => {
  const response = await axios.put(`${BASE_URL}/board/${boardId}`, formData, {
    ...getAxiosConfig(),
    headers: {
      ...getAxiosConfig().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response.data);
  return response.data;
};

// 게시글 상세 조회
export const getBoardDtl = async (boardId: number): Promise<Board> => {
  const response = await axios.get(`${BASE_URL}/board/show/${boardId}`);
  console.log(response.data);
  return response.data;
};

// 파일 다운로드 횟수 증가
export const increaseDownloadCount = async (boardFileId: number) => {
  return axios.post(`${BASE_URL}/board/show/${boardFileId}/downCnt`);
};

// 좋아요 up down
export const likeBoard = async (boardId: number) => {
  try {
    await axios.post(`${BASE_URL}/board/${boardId}/like`, getAxiosConfig());
  } catch (err) {
    console.error("좋아요 처리 실패:", err);
    throw err;
  }
};

export const deleteBoard = async (boardId: number): Promise<number> => {
  const response = await axios.delete(
    `${BASE_URL}/board/${boardId}`,
    getAxiosConfig()
  );
  console.log(response.data);
  return response.data;
};
