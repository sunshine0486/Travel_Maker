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
  hashTag?: string; // ["태그1", "태그2"]
  likeCount: number;
  isLiked: boolean;
  // 댓글 타입 추가
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

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_COUNT = 5;
export const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "pdf",
  "doc",
  "docx",
  "hwp",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "zip",
];

export type FileSettingDto = {
  maxUploadCnt: number;
  fileMaxUploadSize: number; // byte 단위
  allowedExtension: string;
};
