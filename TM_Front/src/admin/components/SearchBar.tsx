import { Box, Button, TextField } from "@mui/material";

interface Props {
  searchField: string;
  setSearchField: (val: string) => void;
  searchText: string;
  setSearchText: (val: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function SearchBar({
  searchField, setSearchField,
  searchText, setSearchText,
  onSearch, loading
}: Props) {
  return (
    <Box display="flex" alignItems="center" mb={2}>
      <TextField
        select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        SelectProps={{ native: true }}
        style={{ marginRight: 8 }}
      >
        <option value="author">작성자</option>
        <option value="content">본문</option>
      </TextField>
      <TextField
        placeholder="검색어 입력"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        style={{ marginRight: 8 }}
      />
      <Button variant="contained" onClick={onSearch} disabled={loading}>
        검색
      </Button>
    </Box>
  );
}
