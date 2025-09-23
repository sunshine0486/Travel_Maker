export interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  boardId: number | null;
  memberId: number | null;
  replies: Comment[];
}

export interface CreateCommentRequest {
  content: string;
  memberId: number;
  boardId: number;
  parentCommentId?: number;
}
