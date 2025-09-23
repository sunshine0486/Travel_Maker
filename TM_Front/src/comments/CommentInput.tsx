import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { addComment, updateComment } from "../api/CommentApi";
import type { CreateCommentRequest } from "../type";

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

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      if (isEdit && commentId) {
        // 수정 모드
        await updateComment(commentId, text.trim(), memberId);
      } else {
        // 작성 모드 (댓글 or 대댓글)
        const payload: CreateCommentRequest = {
          content: text.trim(),
          memberId,
          boardId,
          parentCommentId, // ✅ 최상위 댓글일 경우 undefined로 전달
        };
        await addComment(payload);
      }
      setText("");
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
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="textSecondary">
          {text.length}자
        </Typography>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? "수정" : "저장"}
        </Button>
      </Box>
    </Box>
  );
}
