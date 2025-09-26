export type Board = {
  id?: number;
  title: string;
  category: string;
  nickname: string;
  regTime: string;
  updateTime?: string;
  views: number;
  content: string;
  boardFileDtoList: BoardFileDto[];
  hashtags?: string[]; // ["태그1", "태그2"]
  likeCount: number;
  isLiked: boolean;
  canEdit: boolean;
  canDel: boolean;
  delYn: "Y" | "N";
};

// 댓글 타입 추가해야함

export type BoardFileDto = {
  id: number;
  fileName: string;
  oriFileName: string;
  fileUrl: string;
  fileSize: number; // 단위:byte
  downloadCount: number;
};

export type FileItem = {
  name: string;
  size: number;
  type: string;
  file: File;
};

export type FileSettingDto = {
  maxUploadCnt: number;
  fileMaxUploadSize: number; // byte 단위
  allowedExtension: string;
};

export type BoardList = {
  id?: number;
  title: string;
  commentCount: number;
  nickname: string;
  views: number;
  likeCount: number;
  regTime: string;
};
