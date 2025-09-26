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
import { useRef, useState, useEffect } from "react";
import { getBoardDtl, updateBoard } from "../api/boardApi";
import { useNavigate, useParams } from "react-router-dom";
import type { Board, FileItem } from "../type";
import { QuillEditor, type QuillEditorHandle } from "../components/QuillEditor";

export default function EditBoardPage() {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [initialFiles, setInitialFiles] = useState<FileItem[]>([]); // 초기 파일 리스트

  const editorRef = useRef<QuillEditorHandle>(null);

  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  // Snackbar 상태
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // 기존 게시글 불러오기
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const data: Board = await getBoardDtl(boardId);
        setCategory(data.category);
        setTitle(data.title);
        setHashtags(data.hashtags || []);
        setContent(data.content);
        setInputValue("");

        const files: FileItem[] = await Promise.all(
          (data.boardFileDtoList || []).map(async (f) => {
            try {
              const res = await fetch(`/api${f.fileUrl}`);
              console.log(res);
              const blob = await res.blob();
              console.log(blob);
              const file = new File([blob], f.oriFileName, { type: blob.type });
              console.log(file);
              return {
                name: f.oriFileName,
                size: f.fileSize,
                type: blob.type,
                file,
              };
            } catch (e) {
              console.error("파일 변환 실패:", f.fileUrl, e);
              return {
                name: f.oriFileName,
                size: f.fileSize,
                type: "",
                file: new File([], f.oriFileName),
              };
            }
          })
        );

        setInitialFiles(files);
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
      }
    };
    loadBoard();
  }, [boardId]);

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
    formData.append("id", boardId.toString());
    formData.append("category", category);
    formData.append("title", title);
    formData.append("content", content);
    hashtags.forEach((tag) => formData.append("hashtags", tag));

    files.forEach((fileItem) => formData.append("boardFile", fileItem.file));

    try {
      console.log(content);
      const updatedId = await updateBoard(boardId, formData);
      setSnackbarMessage("게시글이 성공적으로 수정되었습니다!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate(`/board/show/dtl/${updatedId}`);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("게시글 수정에 실패했습니다.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" p={3}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>
      <br />
      <Stack spacing={3}>
        <FormControl fullWidth error={categoryError}>
          <InputLabel id="category-label">카테고리 선택</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.entries(CATEGORIES_MAP).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          helperText={titleError ? "제목을 입력해주세요." : ""}
        />

        <QuillEditor
          ref={editorRef}
          initialContent={content}
          initialFiles={initialFiles} //기존 파일
          page="edit"
        />

        {/* 해시태그 */}
        <Box>
          <TextField
            fullWidth
            label="해시태그"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (
                (e.key === " " || e.key === "Enter") &&
                inputValue.trim() !== ""
              ) {
                e.preventDefault();
                let newTag = inputValue.trim();
                if (!newTag.startsWith("#")) newTag = "#" + newTag;
                if (!hashtags.includes(newTag))
                  setHashtags([...hashtags, newTag]);
                setInputValue("");
              }
            }}
          />
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {hashtags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                onDelete={() =>
                  setHashtags(hashtags.filter((_, i) => i !== idx))
                }
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>
            수정 완료
          </Button>
          <Button variant="outlined" onClick={() => window.history.back()}>
            취소
          </Button>
        </Stack>
      </Stack>

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
