import axios from "axios";
import type { Board, SiteStatsData } from "../../type";
import { BASE_URL } from "../../admin/api/AdminApi";

export const getCurrentBoard = async (): Promise<Board[]> => {
  const res = await axios.get<Board[]>(`${BASE_URL}/main/current`);
  console.log('getCurrentBoard',res.data);
  return res.data;
};

export const getHotBoard = async (): Promise<Board[]> => {
  const res = await axios.get<Board[]>(`${BASE_URL}/main/hot`);
  console.log('getHotBoard',res.data);
  return res.data;
};

export const getTotalCnt = async (): Promise<SiteStatsData> => {
  const res = await axios.get<SiteStatsData>(`${BASE_URL}/main/totalcnt`);
  console.log(res.data);
  return res.data;
};
