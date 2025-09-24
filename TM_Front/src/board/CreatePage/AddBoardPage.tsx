import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { CATEGORIES_MAP } from "../../ts/category";
import { useRef, useState } from "react";
import { createBoard } from "../boardApi";
import { useNavigate } from "react-router-dom";
import { QuillEditor, type QuillEditorHandle } from "./QuillEditor";

export default function AddBoardPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const editorRef = useRef<QuillEditorHandle>(null);

  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const navigate = useNavigate();
  // Snackbar 상태
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSubmit = async () => {
    const content = editorRef.current?.getContent() || "";
    setCategoryError(false);
    setTitleError(false);

    let hasError = false;
    if (!category) {
      setCategoryError(true);
      hasError = true;
    }
    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    }
    if (hasError) return;

    const files = editorRef.current?.getFiles() || [];
    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("hashTag", hashtags.join("")); // 해시태그를 문자열 하나로 합쳐서 append

    // 파일 반복 append
    files.forEach((fileItem) => formData.append("boardFile", fileItem.file));

    console.log("FormData 확인:", formData);
    // createBoard(formData);
    try {
      const boardId = await createBoard(formData);
      if (!boardId) {
        throw new Error("게시글 저장에 실패했습니다."); // 서버에서 ID 안보내면 실패 처리
      }
      setSnackbarMessage("게시글이 성공적으로 저장되었습니다!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // 필요시 저장 후 이동
      navigate(`/board/${boardId}`);
    } catch (error) {
      console.error(error);
      // 저장 실패 시 이동하지 않고 오류 메시지 표시
      setSnackbarMessage("게시글 저장에 실패했습니다.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" p={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        게시글 작성
      </Typography>
      <Stack spacing={3}>
        {/* 1. 카테고리 */}
        <FormControl fullWidth error={categoryError}>
          <InputLabel id="category-label">카테고리를 선택해주세요</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={category}
            label="카테고리"
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.entries(CATEGORIES_MAP).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 2. 제목 입력 */}
        <TextField
          fullWidth
          label="제목을 입력해주세요."
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          helperText={titleError ? "제목을 입력해주세요." : ""}
        />

        {/* 3. 내용 입력 (Quill 에디터) */}
        {/* 4. 파일 첨부 */}
        <QuillEditor
          ref={editorRef}
          page="new"
          onSubmit={(content, files) => {
            console.log("content:", content);
            console.log("files:", files);
          }}
        />

        {/* 5. 해시태그 입력 */}
        <Box>
          <TextField
            fullWidth
            label="해시태그를 입력해주세요."
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              // 스페이바나 엔터 치면 추가.
              if (
                (e.key === " " || e.key === "Enter") &&
                inputValue.trim() !== ""
              ) {
                e.preventDefault();
                let newTag = inputValue.trim();
                if (!newTag.startsWith("#")) {
                  newTag = "#" + newTag;
                }
                // 중복 안되게
                if (!hashtags.includes(newTag)) {
                  setHashtags([...hashtags, newTag]);
                }
                setInputValue("");
              }
            }}
          />

          {/* 해시태그 추가되면 */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {hashtags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                onDelete={() => {
                  setHashtags(hashtags.filter((_, i) => i !== idx));
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        {/* 6. 저장 */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>
            저장
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            취소
          </Button>
        </Stack>
      </Stack>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
