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
import SortIcon from "@mui/icons-material/Sort"; // ✅ 누락된 import
import type { Board } from "../../type";
import SearchModal from "../components/SearchModal";
import { useNavigate } from "react-router-dom";
import { getBoards } from "../api/AdminApi";
import { deleteBoard } from "../../board/api/boardApi";

export default function BoardAdmin() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [filtered, setFiltered] = useState<Board[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true); // ✅ 정렬 상태 (true=최신순, false=오래된순)

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

  const handleSearch = (field: string, keyword: string) => {
    const result = boards.filter((b) => {
      if (field === "category") return b.category.includes(keyword);
      if (field === "title") return b.title.includes(keyword);
      if (field === "nickname") return b.nickname.includes(keyword);
      return true;
    });
    setFiltered(result);
  };

  // ✅ 작성일 기준 정렬 토글
  const handleSort = () => {
    setSortNewestFirst((prev) => !prev);

    const target = filtered ?? boards;
    const sorted = [...target].sort((a, b) => {
      const timeA = new Date(a.regTime).getTime();
      const timeB = new Date(b.regTime).getTime();
      return sortNewestFirst ? timeA - timeB : timeB - timeA;
    });

    setFiltered(sorted);
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          게시판 관리
        </Typography>
        <IconButton onClick={handleSort}>
          <SortIcon />
        </IconButton>
        <IconButton onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </IconButton>
      </Box>

      <SearchModal
        open={openSearch} // ✅ 수정
        onClose={() => setOpenSearch(false)}
        onSearch={handleSearch}
        title="게시판 검색"
        options={[
          { value: "category", label: "카테고리" },
          { value: "title", label: "제목" },
          { value: "nickname", label: "작성자" },
        ]}
      />

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
            <TableCell>
              작성일 {sortNewestFirst ? "(최신순)" : "(오래된순)"}
            </TableCell>
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
