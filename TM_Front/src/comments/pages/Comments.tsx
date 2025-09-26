import { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { getComment, deleteComment } from "../api/CommentApi";
import type { Comment } from "../../type";

interface CommentProps {
  boardId: number;
  isAuthenticated: boolean;
}

export default function Comments({ boardId, isAuthenticated  }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const data = await getComment(boardId);
      setComments(data);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id);
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  if (!isAuthenticated ) {
    return (
      <Box mt={1}>
        <Divider sx={{ mb: 3 }} />
        <Typography color="textSecondary">
          로그인 후 댓글을 작성할 수 있습니다.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box mt={4}>
      {/* <Typography variant="h5" gutterBottom>
        댓글
      </Typography>
      <Divider sx={{ mb: 2 }} /> */}

      {/* 댓글 입력 */}
      <CommentInput
        boardId={boardId}
        onSuccess={fetchComments}
      />

      {/* 댓글 목록 */}
      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        onRefresh={fetchComments}
        boardId={boardId}
      />
    </Box>
  );
}
