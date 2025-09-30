import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import type { Board } from "../../type";
import SearchModal from "../components/SearchModal";
import { getBoards } from "../api/AdminApi";
import { deleteBoard } from "../../board/api/boardApi";
import Sorter from "../components/Sorter";
import type { SortOption } from "../components/Sorter";

export default function BoardAdmin() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [filtered, setFiltered] = useState<Board[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();

  const fetchBoards = async (p: number) => {
    const data = await getBoards(p);
    setBoards(data.content);
    setTotalPages(data.totalPages);
    setFiltered(null); // 검색 초기화
  };

  useEffect(() => {
    fetchBoards(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteBoard(id);
    await fetchBoards(page);
  };

  const handleSearch = (field: string, keywords: string[]) => {
    const result = boards.filter((b) => {
      if (field === "category")
        return keywords.some((kw) => b.category.includes(kw));
      if (field === "title") return keywords.some((kw) => b.title.includes(kw));
      if (field === "nickname")
        return keywords.some((kw) => b.nickname.includes(kw));
      return true;
    });
    setFiltered(result);
  };

  /** 게시판 정렬 옵션 */
  const sortOptions: SortOption<Board>[] = [
    {
      key: "regTime",
      label: "작성일순",
      sortFn: (a, b) =>
        new Date(b.regTime).getTime() - new Date(a.regTime).getTime(),
    },
  ];

  return (
    <Box p={2}>
      {/* 제목 + 검색/정렬 버튼 */}
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          게시글 관리
        </Typography>
        <Sorter
          items={filtered ?? boards}
          sortOptions={sortOptions}
          onSorted={setFiltered}
        />
        <IconButton onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </IconButton>
      </Box>

      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={handleSearch}
        title="게시글 검색"
        options={[
          { value: "category", label: "카테고리" },
          { value: "title", label: "제목" },
          { value: "nickname", label: "작성자" },
        ]}
      />

      {/* 테이블 */}
      <Table
        sx={{
          border: "1px solid black",
          borderCollapse: "collapse",
          "& th, & td": {
            border: "1px solid black",
            padding: "8px",
            textAlign: "center",
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "lightgrey" }}>
            <TableCell>카테고리</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>작성일</TableCell>
            <TableCell>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(filtered ?? boards).map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.category}</TableCell>
              <TableCell
                onClick={() => navigate(`/board/show/dtl/${b.id}`)}
                sx={{
                  cursor: "pointer",
                  color: "black",
                  textDecoration: "underline",
                }}
              >
                {b.title}
              </TableCell>
              <TableCell>{b.nickname}</TableCell>
              <TableCell>{new Date(b.regTime).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(b.id)}
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Box>
    </Box>
  );
}
