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
import { getBoards, deleteBoard } from "../api/adminApi";
import type { Board } from "../../type";

export default function BoardAdmin() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBoards = async (p: number) => {
    const data = await getBoards(p);
    setBoards(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchBoards(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteBoard(id);
    await fetchBoards(page);
  };

  return (
    <Box p={2}>
      <Typography color="black" variant="h5" gutterBottom>
        게시판 관리
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
            <TableCell>카테고리</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>작성일</TableCell>
            <TableCell>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.category}</TableCell>
              <TableCell>{b.title}</TableCell>
              <TableCell>{b.author}</TableCell>
              <TableCell>
                {new Date(b.createdAt).toLocaleDateString()}
              </TableCell>
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
