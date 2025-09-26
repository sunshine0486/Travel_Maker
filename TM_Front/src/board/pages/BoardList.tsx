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
import { Box, Button, IconButton, Pagination } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../admin/api/AdminApi";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import SearchModal from "../../admin/components/SearchModal";

export default function BoardList() {
  const [data, setData] = useState<BoardList[]>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const params = useParams();
  const category = params.category ?? "";
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // 현재 페이지에 맞는 데이터 계산
  const displayedRows = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "글번호",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
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
                await axios.post(
                  `${BASE_URL}/board/show/view/${params.row.id}`
                );
              } catch (err) {
                console.error("조회수 증가 실패:", err);
              } finally {
                navigate(`/board/show/dtl/${params.row.id}`);
              }
            }}
          >
            {title} {commentCount > 0 && `[${commentCount}]`}
          </div>
        );
      },
    },
    {
      field: "nickname",
      headerName: "작성자",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "views",
      headerName: "조회수",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "likeCount",
      headerName: "좋아요수",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "regTime",
      headerName: "작성일",
      width: 150,
      headerAlign: "center",
      align: "center",
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
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    loadBoardData();
  }, [category]);

  const categoryLabel =
    CATEGORIES_MAP[category?.toUpperCase() ?? ""] || category;

  // 정렬 버튼 클릭
  const handleSort = () => {
    setSortNewestFirst((prev) => !prev);
    const sorted = [...data].sort((a, b) => {
      const timeA = new Date(a.regTime).getTime();
      const timeB = new Date(b.regTime).getTime();
      return sortNewestFirst ? timeA - timeB : timeB - timeA;
    });
    setData(sorted);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 카테고리 라벨 */}
      <h2>{categoryLabel}</h2>
      {/* 버튼 줄: 정렬, 검색 (왼쪽) + 글쓰기 (오른쪽) */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        {/* 왼쪽: 정렬, 검색 버튼 */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={handleSort}>
            <SortIcon />
          </IconButton>
          <IconButton size="small" onClick={() => setOpenSearch(true)}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* 오른쪽: 글쓰기 버튼 */}
        {isAuthenticated && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/board/new")}
          >
            글쓰기
          </Button>
        )}
      </Box>
      {/* 검색 모달 */}
      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={(field, keyword) => {
          const filtered = data.filter((b) =>
            (b[field as keyof BoardList] as string)
              ?.toString()
              .includes(keyword)
          );
          setData(filtered);
        }}
        title="게시판 검색"
        options={[
          { value: "title", label: "제목" },
          { value: "content", label: "본문" },
          { value: "nickname", label: "작성자" },
          { value: "hastag", label: "해시태그" },
        ]}
      />
      {/* DataGrid */}
      <DataGrid
        rows={displayedRows}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        hideFooter
        initialState={{
          sorting: {
            sortModel: [{ field: "id", sort: "desc" }],
          },
        }}
      />
      {/* 페이징 */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.min(5, Math.ceil(data.length / rowsPerPage))} // 최대 5페이지
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Box>
    </Box>
  );
}
