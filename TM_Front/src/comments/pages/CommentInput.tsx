import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createComment, updateComment } from "../api/CommentApi";
import { getCommentMaxLength } from "../api/ConfigApi"; 
import type { CreateCommentRequest } from "../../type";

interface CommentInputProps {
  memberId: number;
  boardId: number;
  parentCommentId?: number; // ✅ 대댓글일 때만 필요
  onSuccess: () => void;
  initialContent?: string;  // ✅ 수정 시 기존 내용
  isEdit?: boolean;         // ✅ 수정 모드 여부
  commentId?: number;       // ✅ 수정할 댓글 ID
}

export default function CommentInput({
  memberId,
  boardId,
  parentCommentId,
  onSuccess,
  initialContent = "",
  isEdit = false,
  commentId,
}: CommentInputProps) {
  const [text, setText] = useState(initialContent);
  const [error, setError] = useState("");
  const [maxLength, setMaxLength] = useState<number>(300); // ✅ 기본값 300

  // ✅ 최초 로드 시 백엔드에서 최대 글자수 가져오기
  useEffect(() => {
    getCommentMaxLength()
      .then(setMaxLength)
      .catch(() => setMaxLength(300)); // 실패 시 기본값
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
        await updateComment(commentId, text.trim(), memberId);
      } else {
        const payload: CreateCommentRequest = {
          content: text.trim(),
          memberId,
          boardId,
          parentCommentId, // ✅ 최상위 댓글일 경우 undefined로 전달
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

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <TextField
        label={isEdit ? "댓글 수정" : "댓글을 입력하세요"}
        multiline
        rows={3}
        value={text}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        error={!!error} // ✅ 빨간 테두리
        helperText={error || ""} // ✅ 빨간 글씨 에러 메시지
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
          disabled={!!error} // ✅ 에러 있으면 버튼 비활성화
        >
          {isEdit ? "수정" : "저장"}
        </Button>
      </Box>
    </Box>
  );
}
