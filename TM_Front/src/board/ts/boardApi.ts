import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_URL;

// 이미지를 서버로 넘겨 url 받아오기
export const getImgUrl = async (file: File) => {
  const formData = new FormData();
  formData.append("boardImgFile", file); //key 이름은 서버 @RequestParam("boardImgFile") 과 일치해야 함

  const response = await axios.post(`${BASE_URL}/board/image`, formData, {
    //...getAxiosConfig(),
    headers: {
      //...getAxiosConfig().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("formdata 전송 완료");
  return response.data;
};

export const createBoard = async (formData: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/board/new`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("게시글 저장 성공:", res.data);
  } catch (err) {
    console.error("게시글 저장 실패:", err);
  }
};
