import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useState } from "react";

interface SearchOption {
  value: string;
  label: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (field: string, keywords: string[]) => void; // 키워드 배열 전달
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
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") {
      e.preventDefault();
      let newTag = inputValue.trim();
      if (!newTag.startsWith("#")) newTag = "#" + newTag;

      if (!keywords.includes(newTag)) {
        setKeywords([...keywords, newTag]);
      }
      setInputValue("");
    }
  };

  const handleSearch = () => {
    // 일반 텍스트 검색이면 단일 keyword 배열로 전달
    const finalKeywords =
      field === "hashtags" ? keywords : inputValue ? [inputValue] : [];
    onSearch(field, finalKeywords);
    onClose();
  };

  const handleCancel = () => {
    setInputValue("");
    setKeywords([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: 400 } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <div style={{ height: "1px" }}></div>
        <TextField
          select
          label="검색 조건"
          value={field}
          onChange={(e) => {
            setField(e.target.value);
            setInputValue("");
            setKeywords([]);
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        {field === "hashtags" ? (
          <>
            <TextField
              label="해시태그 입력 후 스페이스 또는 엔터"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddKeyword}
            />
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              {keywords.map((kw, idx) => (
                <Chip
                  key={idx}
                  label={kw}
                  onDelete={() =>
                    setKeywords(keywords.filter((_, i) => i !== idx))
                  }
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
          </>
        ) : (
          <TextField
            label="검색어"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
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
