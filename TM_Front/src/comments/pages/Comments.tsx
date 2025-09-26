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

export default function Comments({ boardId, isAuthenticated }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { isAuthenticated, loginId, isAdmin } = useAuthStore(); // ✅ 로그인 정보 가져오기

  const fetchComments = async () => {
    try {
      const data = await getComment(boardId);
      setComments(data);
      console.log(data);
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
        loginId={loginId} // ✅ zustand에서 가져온 loginId
        loginRole={isAdmin ? "ADMIN" : "USER"} // ✅ isAdmin 상태로 role 구분
      />
    </Box>
  );
}
