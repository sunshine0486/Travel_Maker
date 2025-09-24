import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { getMembers } from "../api/adminApi";
import type { Member } from "../../type";

export default function MemberAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMembers = async (p: number) => {
    const data = await getMembers(p);
    setMembers(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  return (
    <Box p={2}>
      <Typography color="black" variant="h5" gutterBottom>
        회원 관리
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
            <TableCell>아이디</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>생년월일</TableCell>
            <TableCell>전화번호</TableCell>
            <TableCell>주소</TableCell>
            <TableCell>닉네임</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.loginId}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell>{m.birth}</TableCell>
              <TableCell>{m.phoneNumber}</TableCell>
              <TableCell>{m.address}</TableCell>
              <TableCell>{m.nickname}</TableCell>
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
