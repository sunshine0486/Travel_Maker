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
import type { Member } from "../../type";
import SearchModal from "../components/SearchModal";
import Sorter from "../components/Sorter";
import type { SortOption } from "../components/Sorter";
import { getMembers } from "../api/AdminApi";

export default function MemberAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchMembers = async (p: number) => {
    const data = await getMembers(p);
    setMembers(data.content);
    setTotalPages(data.totalPages);
    setFiltered(null);
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  const handleSearch = (field: string, keywords: string[]) => {
    const result = members.filter((m) => {
      if (field === "loginId") return keywords.some((kw) => m.loginId.includes(kw));
      if (field === "email") return keywords.some((kw) => m.email.includes(kw));
      if (field === "nickname") return keywords.some((kw) => m.nickname.includes(kw));
      return true;
    });
    setFiltered(result);
  };

  /** 회원 정렬 옵션 */
  const sortOptions: SortOption<Member>[] = [
    {
      key: "loginId",
      label: "아이디순",
      sortFn: (a, b) => a.loginId.localeCompare(b.loginId),
    },
  ];

  return (
    <Box p={2}>
      {/* 제목 + 검색/정렬 버튼 */}
      <Box display="flex" alignItems="center" mb={1}>
        <Typography color="black" variant="h5" sx={{ flexGrow: 1 }}>
          회원 관리
        </Typography>
        <Sorter
          items={filtered ?? members}
          sortOptions={sortOptions}
          onSorted={setFiltered}
        />
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
            <TableCell>아이디</TableCell>
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
