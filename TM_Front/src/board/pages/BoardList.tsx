import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BoardList } from "../type";
import { formatDateTime } from "../../ts/format";
import { CATEGORIES_MAP } from "../../ts/category";
import { getBoardList } from "../api/boardApi";
import { useAuthStore } from "../../store";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../admin/api/AdminApi";

export default function BoardList() {
  const [data, setData] = useState<BoardList[]>([]);
  const params = useParams();
  const category = params.category ?? "";
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const columns: GridColDef[] = [
    { field: "id", headerName: "글번호", width: 150 },
    {
      field: "title",
      headerName: "제목",
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const title = params.value as string;
        const commentCount = (params.row.commentCount ?? 0) as number;
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              paddingLeft: "8px",
            }}
            onClick={async () => {
              try {
                // 조회수 증가 API 호출
                await axios.post(
                  `${BASE_URL}/board/show/view/${params.row.id}`
                );

                // 상세 페이지 이동
                navigate(`/board/show/dtl/${params.row.id}`);
              } catch (err) {
                console.error("조회수 증가 실패:", err);
                // 그래도 페이지는 이동
                navigate(`/board/show/dtl/${params.row.id}`);
              }
            }}
          >
            {title} {commentCount > 0 && `[${commentCount}]`}
          </div>
        );
      },
    },
    { field: "nickname", headerName: "작성자", width: 150 },
    { field: "viewCount", headerName: "조회수", width: 100, type: "number" },
    { field: "likeCount", headerName: "좋아요수", width: 100, type: "number" },

    {
      field: "regTime",
      headerName: "작성일",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{formatDateTime(params.value as string)}</div>
      ),
    },
  ];

  const loadBoardData = async () => {
    if (!category) return;
    try {
      const boards = await getBoardList(category);
      setData(boards);
      console.log(boards);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    console.log("category:", category);
    loadBoardData();
  }, [category]);

  // 한글 라벨 찾기
  const categoryLabel =
    CATEGORIES_MAP[category?.toUpperCase() ?? ""] || category;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h2>{categoryLabel}</h2>
        {isAuthenticated && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/board/new`)}
          >
            글쓰기
          </Button>
        )}
      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick={true}
        showToolbar
        initialState={{
          sorting: {
            sortModel: [{ field: "id", sort: "desc" }],
          },
        }}
      />
    </Box>
  );
}
