import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

interface SearchOption {
  value: string;
  label: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (field: string, keyword: string) => void;
  options: SearchOption[];
  title: string;
}

export default function SearchModal({
  open,
  onClose,
  onSearch,
  options,
  title,
}: SearchModalProps) {
  const [field, setField] = useState(options[0]?.value ?? "");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(field, keyword);
    onClose();
  };

  const handleCancel = () => {
    setKeyword("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          select
          label="검색 조건"
          value={field}
          onChange={(e) => setField(e.target.value)}
          sx={{mt:1}}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleSearch} variant="contained">
          검색
        </Button>
      </DialogActions>
    </Dialog>
  );
}
