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
import { formatDateTime } from "../../ts/format";
import type { JSX } from "@emotion/react/jsx-runtime";
interface CommentListProps {
  comments: Comment[];
  onDelete: (id: number) => void;
  onRefresh: () => void;
  boardId: number;
  loginId: string; // 현재 로그인한 사용자 ID
  loginRole: string; // 현재 로그인한 사용자 역할 ("ADMIN" 등)
}

export default function CommentList({
  comments,
  onDelete,
  onRefresh,
  boardId,
  loginId,
  loginRole,
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
      await updateComment(commentId, editText.trim());
      onRefresh();
      setEditingId(null);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      const confirmed = window.confirm("해당 댓글을 삭제하시겠습니까?");
      if (!confirmed) return;

      onDelete(selectedId);
      handleClose();
    }
  };

  const renderComment = (
    comment: Comment,
    isReply = false
  ): JSX.Element | null => {
    if (comment.delYn === "Y") {
      const activeReplies = comment.replies.filter((r) => r.delYn === "N");
      if (activeReplies.length === 0) return null;
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
          <Typography color="textSecondary">삭제된 댓글입니다.</Typography>
          <Box mt={2} ml={2}>
            {activeReplies.map((reply) => renderComment(reply, true))}
          </Box>
        </Paper>
      );
    }

    const canEdit = comment.loginId === loginId;
    const canDelete = comment.loginId === loginId || loginRole === "ADMIN";
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
              {formatDateTime(comment.createdAt)}
            </Typography>
          </Box>
          {(canEdit || canDelete) && (
            <IconButton onClick={(e) => handleMenuClick(e, comment.id)}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

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

        {!isReply && (
          <Box mt={1}>
            <Button
              size="small"
              onClick={() =>
                setReplyingToId(replyingToId === comment.id ? null : comment.id)
              }
            >
              {replyingToId === comment.id ? "접기" : "답글쓰기"}
            </Button>
          </Box>
        )}

        {replyingToId === comment.id && (
          <Box mt={1} ml={2}>
            <CommentInput
              boardId={boardId}
              parentCommentId={comment.id}
              onSuccess={() => {
                onRefresh();
                setReplyingToId(null);
              }}
            />
          </Box>
        )}

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
      {comments.length === 0 ? (
        <Typography color="textSecondary">작성된 댓글이 없습니다.</Typography>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {selectedId != null &&
          (() => {
            const allComments = [
              ...comments,
              ...comments.flatMap((c) => c.replies),
            ];
            const target = allComments.find((c) => c.id === selectedId);
            if (!target) return null;
            const canEdit = target.loginId === loginId;
            const canDelete =
              target.loginId === loginId || loginRole === "ADMIN";

            return (
              <>
                {canEdit && (
                  <MenuItem onClick={() => handleEdit(target)}>수정</MenuItem>
                )}
                {canDelete && <MenuItem onClick={handleDelete}>삭제</MenuItem>}
              </>
            );
          })()}
      </Menu>
    </Box>
  );
}
