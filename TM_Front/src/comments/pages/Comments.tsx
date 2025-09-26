import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { getComment, deleteComment } from "../api/CommentApi";
import type { Comment } from "../../type";

interface CommentProps {
  boardId: number;
  isAuthenticated: boolean;
}

export default function Comments({ boardId, isAuthenticated }: CommentProps) {
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

  return (
    <Box mt={4}>
      {/* 댓글 입력 */}
      <CommentInput
        boardId={boardId}
        onSuccess={fetchComments}
        isAuthenticated={isAuthenticated} 
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
