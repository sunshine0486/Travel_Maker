import axios from "axios";
import type { Comment, CreateCommentRequest } from "../../type";
import { getAxiosConfig } from "../../member/api/loginApi";

const BASE_URL = import.meta.env.VITE_API_URL;

// 서버에서 내려오는 JSON → Comment 변환
const normalizeComment = (raw: unknown): Comment => {
  const x = raw as Partial<Comment> & {
    regTime?: string;
    updateTime?: string;
    reg_time?: string;
    update_time?: string;
    memberNickname?: string;
    member?: { id: number; nickname: string };
    board?: { id: number };
    replies?: unknown[];
    children?: unknown[];
  };

  const map = (c: typeof x): Comment => ({
    id: c.id ?? 0,
    content: c.content ?? "",
    author: c.author ?? c.memberNickname ?? c.member?.nickname ?? "Unknown",
    createdAt:
      c.createdAt ?? c.regTime ?? c.reg_time ?? new Date().toISOString(),
    updatedAt: c.updatedAt ?? c.updateTime ?? c.update_time,
    boardId: c.boardId ?? c.board?.id ?? null,
    loginId: c.loginId ?? null,
    memberId: c.memberId ?? c.member?.id ?? null,
    replies: (c.replies ?? c.children ?? []).map((r) => normalizeComment(r)),
    delYn: c.delYn ?? "N",
  });

  return map(x);
};

// 댓글 목록 조회
export const getComment = async (boardId: number): Promise<Comment[]> => {
  const res = await axios.get<Comment[]>(
    `${BASE_URL}/comment/board/${boardId}`
  );
  const data = res.data ?? [];
  console.log(data);
  return Array.isArray(data) ? data.map(normalizeComment) : [];
};

// 댓글 등록
export const createComment = async (
  comment: CreateCommentRequest
): Promise<Comment> => {
  const res = await axios.post<Comment>(
    `${BASE_URL}/comment/new`,
    comment,
    getAxiosConfig()
  );
  return normalizeComment(res.data);
};

// 댓글 삭제 (권한 검사: memberId 필요)
export const deleteComment = async (commentId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/comment/${commentId}`, getAxiosConfig());
};

// 댓글 수정 (권한 검사: memberId 필요)
export const updateComment = async (
  commentId: number,
  content: string
): Promise<Comment> => {
  const res = await axios.put<Comment>(
    `${BASE_URL}/comment/${commentId}`,
    { content },
    getAxiosConfig()
  );
  return normalizeComment(res.data);
};
