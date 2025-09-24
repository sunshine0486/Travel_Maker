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
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { getMembers } from "../api/adminApi";
import type { Member } from "../../type";
import SearchModal from "../components/SearchModal";

export default function MemberAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);

  // ✅ 정렬 상태 (true=오름차순, false=내림차순)
  const [sortAsc, setSortAsc] = useState(true);

  // ✅ 정렬 함수
  const sortByLoginId = (arr: Member[], asc: boolean) =>
    [...arr].sort((a, b) =>
      asc ? a.loginId.localeCompare(b.loginId) : b.loginId.localeCompare(a.loginId)
    );

  const fetchMembers = async (p: number) => {
    const data = await getMembers(p);
    setMembers(sortByLoginId(data.content, sortAsc)); // 정렬 적용
    setTotalPages(data.totalPages);
    setFiltered(null); // 검색 초기화
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  // ✅ 정렬 버튼 클릭 핸들러
  const handleSort = () => {
    setSortAsc((prev) => !prev);
    const target = filtered ?? members;
    setFiltered(sortByLoginId(target, !sortAsc));
  };

  const handleSearch = (field: string, keyword: string) => {
    const result = members.filter((m) => {
      if (field === "loginId") return m.loginId.includes(keyword);
      if (field === "email") return m.email.includes(keyword);
      if (field === "nickname") return m.nickname.includes(keyword);
      return true;
    });
    setFiltered(sortByLoginId(result, sortAsc));
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          회원 관리
        </Typography>
        <IconButton onClick={handleSort}>
          <SortIcon />
        </IconButton>
        <IconButton onClick={() => setOpen(true)}>
          <SearchIcon />
        </IconButton>
      </Box>

      <SearchModal
        open={open}
        onClose={() => setOpen(false)}
        onSearch={handleSearch}
        title="회원 검색"
        options={[
          { value: "loginId", label: "아이디" },
          { value: "email", label: "이메일" },
          { value: "nickname", label: "닉네임" },
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
            <TableCell>
              아이디 {sortAsc ? "(오름차순)" : "(내림차순)"}
            </TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>생년월일</TableCell>
            <TableCell>전화번호</TableCell>
            <TableCell>주소</TableCell>
            <TableCell>닉네임</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(filtered ?? members).map((m) => (
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
