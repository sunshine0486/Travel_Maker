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
} from "@mui/material";
import { getComments, softDeleteComment } from "../api/adminApi";
import type { Comment } from "../../type";

export default function CommentAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // TODO: 관리자 페이지에서는 특정 boardId만? 전체? 
  // 지금은 임시로 1번 게시판 기준
  const boardId = 1;

  const fetchComments = async (p: number) => {
    const data = await getComments(boardId, p);
    setComments(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await softDeleteComment(id);
    await fetchComments(page);   // ✅ 삭제 후 목록 새로고침
  };

  return (
    <Box p={2}>
      <Typography color="black" variant="h5" gutterBottom>
        댓글 관리
      </Typography>
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
            <TableRow sx={{backgroundColor: 'lightgrey'}}>
            <TableCell>작성자</TableCell>
            <TableCell>본문</TableCell>
            <TableCell>작성일</TableCell>
            <TableCell>삭제</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {comments.map((c) => (
                <TableRow key={c.id}>
                <TableCell>{c.author}</TableCell>
                <TableCell>{c.content}</TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(c.id)}
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
