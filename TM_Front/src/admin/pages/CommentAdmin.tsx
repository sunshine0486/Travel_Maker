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
import SortIcon from "@mui/icons-material/Sort";
import { getComments, deleteComment } from "../api/adminApi";
import type { Comment } from "../../type";
import SearchModal from "../components/SearchModal";
import { useNavigate } from "react-router-dom";

export default function CommentAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filtered, setFiltered] = useState<Comment[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true); // ✅ 정렬 상태 (true=최신순, false=오래된순)

  // 지금은 임시로 1번 게시판 기준
//   const boardId = 1;
  const navigate = useNavigate();

  const fetchComments = async (p: number) => {
    const data = await getComments(p);
    setComments(data.content);
    setTotalPages(data.totalPages);
    setFiltered(null); // 새로 불러올 때 검색 초기화
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteComment(id);
    await fetchComments(page); // ✅ 삭제 후 목록 새로고침
  };

  const handleSearch = (field: string, keyword: string) => {
    const result = comments.filter((c) => {
      if (field === "author") return c.author.includes(keyword);
      if (field === "content") return c.content.includes(keyword);
      return true;
    });
    setFiltered(result);
  };

  // ✅ 정렬 버튼 클릭 핸들러
  const handleSort = () => {
    setSortNewestFirst((prev) => !prev);

    const target = filtered ?? comments;
    const sorted = [...target].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortNewestFirst ? timeA - timeB : timeB - timeA;
    });

    setFiltered(sorted);
  };

  return (
    <Box p={2}>
      {/* 제목 + 검색/정렬 버튼 */}
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          댓글 관리
        </Typography>
        <IconButton onClick={handleSort}>
          <SortIcon />
        </IconButton>
        <IconButton onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* 검색 모달 */}
      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={handleSearch}
        title="댓글 검색"
        options={[
          { value: "author", label: "작성자" },
          { value: "content", label: "본문" },
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
            <TableCell>작성자</TableCell>
            <TableCell>본문</TableCell>
            <TableCell>
              작성일 {sortNewestFirst ? "(최신순)" : "(오래된순)"}
            </TableCell>
            <TableCell>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(filtered ?? comments).map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.author}</TableCell>
              <TableCell 
                onClick={() => navigate(`/board/${c.boardId}`)}
                sx={{ cursor: "pointer", color: "black", textDecoration: "underline" }}
              >
                {c.content}
              </TableCell>
              <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(c.id)}
                  disabled={c.delYn === "Y"}
                >
                  {c.delYn === "Y" ? "삭제됨" : "삭제"}
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
