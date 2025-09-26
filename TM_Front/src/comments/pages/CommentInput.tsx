import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createComment, updateComment } from "../api/CommentApi";
import { getCommentMaxLength } from "../api/ConfigApi"; 
import type { CreateCommentRequest } from "../../type";

interface CommentInputProps {
  boardId: number;
  parentCommentId?: number;
  onSuccess: () => void;
  initialContent?: string;
  isEdit?: boolean;
  commentId?: number;
  isAuthenticated: boolean; // ✅ 추가
}

export default function CommentInput({
  boardId,
  parentCommentId,
  onSuccess,
  initialContent = "",
  isEdit = false,
  commentId,
  isAuthenticated,
}: CommentInputProps) {
  const [text, setText] = useState(initialContent);
  const [error, setError] = useState("");
  const [maxLength, setMaxLength] = useState<number>(300);

  useEffect(() => {
    getCommentMaxLength()
      .then(setMaxLength)
      .catch(() => setMaxLength(300));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    if (value.length > maxLength) {
      setError(`최대 글자수는 ${maxLength}자입니다.`);
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    if (text.length > maxLength) {
      setError(`최대 글자수는 ${maxLength}자입니다.`);
      return;
    }

    try {
      if (isEdit && commentId) {
        await updateComment(commentId, text.trim());
      } else {
        const payload: CreateCommentRequest = {
          content: text.trim(),
          boardId,
          parentCommentId,
        };
        await createComment(payload);
      }
      setText("");
      setError("");
      onSuccess();
    } catch (error) {
      console.error("댓글 저장 실패:", error);
    }
  };

  if (!isAuthenticated) {
    // ✅ 로그인 안 되어 있으면 안내 문구만 표시
    return (
      <Box mt={1}>
        <Typography color="textSecondary">
          로그인 후 댓글을 작성할 수 있습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={1}>
      <TextField
        label={isEdit ? "댓글 수정" : "댓글을 입력하세요"}
        multiline
        rows={3}
        value={text}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        error={!!error}
        helperText={error || ""}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="caption"
          color={text.length > maxLength ? "error" : "textSecondary"}
        >
          {text.length}/{maxLength}자
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!!error}
        >
          {isEdit ? "수정" : "저장"}
        </Button>
      </Box>
    </Box>
  );
}
