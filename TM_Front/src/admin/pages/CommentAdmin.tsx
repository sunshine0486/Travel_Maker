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
import type { Comment } from "../../type";
import SearchModal from "../components/SearchModal";
import Sorter from "../components/Sorter";
import type { SortOption } from "../components/Sorter";
import { deleteComment, getComments } from "../api/AdminApi";

export default function CommentAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filtered, setFiltered] = useState<Comment[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();

  const fetchComments = async (p: number) => {
    const data = await getComments(p);
    setComments(data.content);
    setTotalPages(data.totalPages);
    setFiltered(null);
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteComment(id);
    await fetchComments(page);
  };

  const handleSearch = (field: string, keywords: string[]) => {
    const result = comments.filter((c) => {
      if (field === "author") return keywords.some((kw) => c.author.includes(kw));
      if (field === "content") return keywords.some((kw) => c.content.includes(kw));
      return true;
    });
    setFiltered(result);
  };

  /** 댓글 정렬 옵션 */
  const sortOptions: SortOption<Comment>[] = [
    {
      key: "createdAt",
      label: "작성일순",
      sortFn: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    },
  ];

  return (
    <Box p={2}>
      {/* 제목 + 검색/정렬 버튼 */}
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          댓글 관리
        </Typography>
        <Sorter
          items={filtered ?? comments}
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
            <TableCell>작성일</TableCell>
            <TableCell>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(filtered ?? comments).map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.author}</TableCell>
              <TableCell
                onClick={() => navigate(`/board/show/dtl/${c.boardId}`)}
                sx={{
                  cursor: "pointer",
                  color: "black",
                  textDecoration: "underline",
                }}
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
