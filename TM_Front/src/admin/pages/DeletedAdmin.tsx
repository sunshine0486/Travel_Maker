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
import type { Board } from "../../type";
import { restoreBoard } from "../../board/api/boardApi";
import { getAllDeletedBoards, getDeletedBoards } from "../api/AdminApi";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DeletedBoardAdmin() {
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDeletedBoards = async (p: number) => {
    const data = await getDeletedBoards(p); // 삭제된 게시글 목록 가져오기
    setBoards(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchDeletedBoards(page);
  }, [page]);

  const handleRestore = async (id: number) => {
    if (!window.confirm("정말 복원하시겠습니까?")) return;
    await restoreBoard(id); // 게시글 복원 API 호출
    await fetchDeletedBoards(page); // 복원 후 목록 갱신
  };

  const downloadExcel = async () => {
    try {
      const boards = await getAllDeletedBoards(); // 전체 데이터 가져오기

      if (boards.length === 0) return;

      const data = boards.map((b) => ({
        글번호: b.id,
        제목: b.title,
        작성자: b.nickname,
        조회수: b.views,
        좋아요수: b.likeCount,
        작성일: new Date(b.regTime).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "삭제이력");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "deleted_boards.xlsx");
    } catch (err) {
      console.error("Excel 다운로드 실패:", err);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          <h4>삭제 이력 조회</h4>
        </Typography>
        <Button variant="contained" onClick={downloadExcel}>
          EXCEL 다운로드
        </Button>
      </Box>

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
            <TableCell>글번호</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell>조회수</TableCell>
            <TableCell>좋아요수</TableCell>
            <TableCell>복원</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {boards.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.id}</TableCell>
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
              <TableCell>{b.views}</TableCell>
              <TableCell>{b.likeCount}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRestore(b.id)}
                >
                  복원
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
