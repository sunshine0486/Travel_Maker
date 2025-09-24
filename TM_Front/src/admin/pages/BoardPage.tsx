// src/pages/BoardPage.tsx
import { useParams } from "react-router-dom";

export default function BoardPage() {
  const { boardId } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h1>게시판 상세 페이지</h1>
      <p>여기는 boardId = {boardId} 의 게시판 상세 화면입니다.</p>
    </div>
  );
}
