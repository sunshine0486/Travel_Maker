export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  boardId: number | null;
  memberId: number | null;
  replies: Comment[];
  delYn: "Y" | "N";
}

export interface Member {
  id: number;
  loginId: string;
  nickname: string;
  email: string;
  birth: string;
  phoneNumber: string;
  address: string;
}

export interface Board {
  id: number;
  category: "TIP" | "REVIEW" | "QNA" | "NOTICE";
  title: string;
  author: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  memberId: number;
  boardId: number;
  parentCommentId?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

export type User = { loginId: string; password: string };
