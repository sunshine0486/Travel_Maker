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
  category: "INFO_TIP" | "REVIEW" | "QNA" | "NOTICE";
  title: string;
  author: string;
  regTime: string;
  updateTime: string;

  // 최신글/상세글 전용
  content?: string;             // 본문
  boardFileDtoList?: BoardFile[]; // 첨부 파일 목록
  hashTag?: string;             // 해시태그

  // 상세글 전용
  views?: number;               // 조회수
  isLiked?: boolean;            // 현재 회원이 좋아요 눌렀는지 여부
  likeCount?: number;           // 좋아요 개수
  delYn?: "Y" | "N";            // 삭제 여부

  // 인기글 전용
  rank?: number;                // 인기글 순위
}

export interface BoardFile {
  id: number;
  fileName: string;
  fileUrl: string;
  oriFileName: string;
  fileSize: number;
  downloadCount: number;
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

export interface SiteStatsData {
  boardCnt: number;
  memberCnt: number;
  todayVisitor: number;
}
