import axios from "axios";
import type { FileSettingDto } from "../ts/type";
export const BASE_URL = import.meta.env.VITE_API_URL;

// 파일 설정 불러오기
export const getFileSetting = async (): Promise<FileSettingDto> => {
  try {
    const response = await axios.get<FileSettingDto>(
      `${BASE_URL}/admin/filesetting`
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
    const res = await axios.patch(`${BASE_URL}/admin/filesetting`, body);
    console.log("파일 설정 저장 성공:", res.data);
    return true;
  } catch (err) {
    console.error("파일 설정 저장 실패:", err);
    return false;
  }
};
