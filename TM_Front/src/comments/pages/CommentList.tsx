import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentInput from "./CommentInput";
import { updateComment } from "../api/CommentApi";
import type { Comment } from "../../type";

interface CommentListProps {
  comments: Comment[];
  onDelete: (id: number, memberId: number) => void;
  onRefresh: () => void;
  memberId: number;
  boardId: number;
}

export default function CommentList({
  comments,
  onDelete,
  onRefresh,
  memberId,
  boardId,
}: CommentListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    handleClose();
  };

  const handleSave = async (commentId: number) => {
    if (!editText.trim()) return;
    try {
      await updateComment(commentId, editText.trim(), memberId);
      onRefresh();
      setEditingId(null);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId, memberId);
      handleClose();
    }
  };

  const toggleReplyInput = (commentId: number) => {
    setReplyingToId((prev) => (prev === commentId ? null : commentId));
  };

  const renderComment = (comment: Comment, isReply = false) => {
    // ✅ 소프트 삭제된 댓글은 숨김
    if (comment.delYn === "Y") {
      return null;
    }

    return (
      <Paper
        key={comment.id}
        elevation={isReply ? 1 : 2}
        sx={{
          padding: isReply ? 1.5 : 2,
          marginBottom: 2,
          backgroundColor: isReply ? "#f9f9f9" : "white",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">{comment.author}</Typography>
            <Typography variant="caption" color="textSecondary">
              {comment.createdAt}
            </Typography>
          </Box>
          <IconButton onClick={(e) => handleMenuClick(e, comment.id)}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* 본문 / 수정 모드 */}
        {editingId === comment.id ? (
          <Box mt={1}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleSave(comment.id)}
              >
                저장
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditingId(null)}
              >
                취소
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography mt={1}>{comment.content}</Typography>
        )}

        {/* 답글쓰기 (최상위 댓글만) */}
        {!isReply && (
          <Box mt={1}>
            <Button size="small" onClick={() => toggleReplyInput(comment.id)}>
              답글쓰기
            </Button>
          </Box>
        )}

        {/* 답글 입력창 */}
        {replyingToId === comment.id && (
          <Box mt={1} ml={2}>
            <CommentInput
              memberId={memberId}
              boardId={boardId}
              parentCommentId={comment.id}
              onSuccess={() => {
                onRefresh();
                setReplyingToId(null);
              }}
            />
          </Box>
        )}

        {/* 대댓글 */}
        {comment.replies.length > 0 && (
          <Box mt={2} ml={2}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        댓글 목록
      </Typography>
      {comments.length === 0 ? (
        <Typography color="textSecondary">작성된 댓글이 없습니다.</Typography>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            if (selectedId == null) return;
            const allComments = [
              ...comments,
              ...comments.flatMap((c) => c.replies),
            ];
            const target = allComments.find((c) => c.id === selectedId);
            if (target) handleEdit(target);
          }}
        >
          수정
        </MenuItem>
        <MenuItem onClick={handleDelete}>삭제</MenuItem>
      </Menu>
    </Box>
  );
}
