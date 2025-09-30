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
import SearchModal from "../../admin/components/SearchModal";
import Sorter from "../../admin/components/Sorter"; // ✅ 추가
import type { SortOption } from "../../admin/components/Sorter"; // ✅ 추가

export default function BoardList() {
  const [data, setData] = useState<BoardList[]>([]);
  const [originalData, setOriginalData] = useState<BoardList[]>([]);
  const [openSearch, setOpenSearch] = useState(false);

  const params = useParams();
  const category = params.category ?? "";
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

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
      sortable: false,
    },
    {
      field: "title",
      headerName: "제목",
      flex: 1,
      sortable: false,
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
      sortable: false,
    },
    {
      field: "views",
      headerName: "조회수",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "likeCount",
      headerName: "좋아요수",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "regTime",
      headerName: "작성일",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div>{formatDateTime(params.value as string)}</div>
      ),
    },
  ];

  const loadBoardData = async () => {
    if (!category) return;
    try {
      // const boards = await getBoardList(category);
      // setData(boards);
      // setOriginalData(boards);
      // console.log("boards loaded:", boards);
      const boards = await getBoardList(category);
      // ✅ id desc 정렬 후 상태 저장
      const sortedBoards = [...boards].sort((a, b) => b.id! - a.id!);
      setData(sortedBoards);
      setOriginalData(sortedBoards);
      console.log("boards loaded:", sortedBoards);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    loadBoardData();
  }, [category]);

  const categoryLabel =
    CATEGORIES_MAP[category?.toUpperCase() ?? ""] || category;

  /** 게시글 정렬 옵션 */
  const sortOptions: SortOption<BoardList>[] = [
    {
      key: "regTime",
      label: "작성일순",
      sortFn: (a, b) =>
        new Date(b.regTime).getTime() - new Date(a.regTime).getTime(),
    },
    {
      key: "views",
      label: "조회수순",
      sortFn: (a, b) => b.views - a.views,
    },
    {
      key: "likeCount",
      label: "좋아요순",
      sortFn: (a, b) => b.likeCount - a.likeCount,
    },
  ];

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
          <Sorter items={data} sortOptions={sortOptions} onSorted={setData} />
          <IconButton size="small" onClick={() => setOpenSearch(true)}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* 오른쪽: 글쓰기 버튼 */}
        {
          // notice 카테고리일 경우: 관리자만 가능
          ((category === "NOTICE" && isAdmin) ||
            // notice가 아닐 경우: 로그인한 유저 또는 관리자 가능
            (category !== "NOTICE" && (isAuthenticated || isAdmin))) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/board/new", { state: { category } })}
            >
              글쓰기
            </Button>
          )
        }
      </Box>

      {/* 검색 모달 */}
      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={(field, keywords) => {
          const filtered = originalData.filter((b) => {
            if (field === "hashtags") {
              const tags = b.hashtags.map((t) => t.toLowerCase());
              return keywords.every((kw) =>
                tags.some((tag) =>
                  tag.includes(kw.replace(/^#/, "").toLowerCase())
                )
              );
            } else {
              return keywords.every((kw) =>
                (b[field as keyof BoardList] as string)
                  ?.toLowerCase()
                  .includes(kw.toLowerCase())
              );
            }
          });
          setData(filtered);
          setPage(1);
        }}
        title="게시판 검색"
        options={[
          { value: "title", label: "제목" },
          { value: "content", label: "본문" },
          { value: "nickname", label: "작성자" },
          { value: "hashtags", label: "해시태그" },
        ]}
      />

      {/* DataGrid */}
      <DataGrid
        rows={displayedRows}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        hideFooter
        initialState={
          {
            // sorting: {
            //   sortModel: [{ field: "id", sort: "desc" }],
            // },
          }
        }
      />

      {/* 페이징 */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.min(5, Math.ceil(data.length / rowsPerPage))}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Box>
    </Box>
  );
}
