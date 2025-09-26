import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { getComment, deleteComment } from "../api/CommentApi";
import type { Comment } from "../../type";
import { useAuthStore } from "../../store";

interface CommentProps {
  boardId: number;
}

export default function Comments({ boardId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { isAuthenticated, loginId, isAdmin } = useAuthStore();

  const fetchComments = async () => {
    try {
      const data = await getComment(boardId);
      setComments(data);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
      setComments([]);
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

  return (
    <Box mt={4}>
      <CommentInput
        boardId={boardId}
        onSuccess={fetchComments}
        isAuthenticated={isAuthenticated}
      />

      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        onRefresh={fetchComments}
        boardId={boardId}
        loginId={loginId}
        loginRole={isAdmin ? "ADMIN" : "USER"}
        isAuthenticated={isAuthenticated}
      />
    </Box>
  );
}
