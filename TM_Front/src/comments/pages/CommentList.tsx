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
import type { JSX } from "@emotion/react/jsx-runtime";

interface CommentListProps {
  comments: Comment[];
  onDelete: (id: number) => void; // 댓글 삭제 API 호출
  onRefresh: () => void; // 댓글 새로고침 (API 다시 불러오기)
  boardId: number; // 게시판 ID (대댓글 등록 시 필요)
}

export default function CommentList({
  comments,
  onDelete,
  onRefresh,
  boardId,
}: CommentListProps) {
  // 메뉴 상태 관리
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 수정 상태 관리
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // 답글 입력창 상태 관리
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  /** ---------- 공통 스타일 ---------- */
  const paperStyle = (isReply: boolean) => ({
    padding: isReply ? 1.5 : 2,
    marginBottom: 2,
    backgroundColor: isReply ? "#f9f9f9" : "white", // 대댓글은 살짝 회색 배경
  });

  /** ---------- 메뉴 관련 ---------- */
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

  /** 댓글 수정 모드로 전환 */
  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
    handleClose();
  };

  /** 댓글 저장 */
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

  /** 댓글 삭제 */
  const handleDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
      handleClose();
    }
  };

  /** ---------- 삭제 댓글 렌더링 ---------- */
  const renderDeletedComment = (comment: Comment, isReply: boolean) => {
    // 자식 중 "살아있는 대댓글"만 필터링
    const activeReplies = comment.replies.filter((r) => r.delYn === "N");

    // 살아있는 대댓글 없으면 → 완전히 숨김
    if (activeReplies.length === 0) return null;

    // 살아있는 대댓글 있으면 → "삭제된 댓글입니다" 표시 후 자식 노출
    return (
      <Paper key={comment.id} elevation={isReply ? 1 : 2} sx={paperStyle(isReply)}>
        <Typography color="textSecondary">삭제된 댓글입니다.</Typography>
        <Box mt={2} ml={2}>
          {activeReplies.map((reply) => renderComment(reply, true))}
        </Box>
      </Paper>
    );
  };

  /** ---------- 일반 댓글 렌더링 ---------- */
  const renderComment = (comment: Comment, isReply = false): JSX.Element | null => {
    // 삭제된 댓글일 경우
    if (comment.delYn === "Y") return renderDeletedComment(comment, isReply);

    return (
      <Paper key={comment.id} elevation={isReply ? 1 : 2} sx={paperStyle(isReply)}>
        {/* 작성자 + 작성일 + 메뉴 */}
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
          // 수정 모드
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
          // 일반 보기 모드
          <Typography mt={1}>{comment.content}</Typography>
        )}

        {/* 답글쓰기 버튼 (최상위 댓글만 가능) */}
        {!isReply && (
          <Box mt={1}>
            <Button
              size="small"
              onClick={() =>
                setReplyingToId(replyingToId === comment.id ? null : comment.id)
              }
            >
              답글쓰기
            </Button>
          </Box>
        )}

        {/* 답글 입력창 */}
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

        {/* 대댓글 리스트 */}
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
      {/* 댓글이 없을 때 */}
      {comments.length === 0 ? (
        <Typography color="textSecondary">작성된 댓글이 없습니다.</Typography>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}

      {/* 옵션 메뉴 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            if (selectedId == null) return;
            // 현재 댓글 + 모든 대댓글에서 찾아오기
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
