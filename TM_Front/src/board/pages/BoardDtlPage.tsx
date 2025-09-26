import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Avatar,
  Button,
  IconButton,
  Chip,
  Skeleton,
} from "@mui/material";
import { Comment, Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { Board } from "../type";
import {
  deleteBoard,
  getBoardDtl,
  increaseDownloadCount,
  likeBoard,
  restoreBoard,
} from "../api/boardApi";
import { formatDateTime, formatSize } from "../../ts/format";
import { CATEGORIES_MAP } from "../../ts/category";
import { useAuthStore } from "../../store";
import Comments from "../../comments/pages/Comments";

export default function BoardDtlPage() {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore.getState(); // store 상태 가져오기

  const [data, setData] = useState<Board>({
    category: "",
    nickname: "",
    regTime: "",
    updateTime: "",
    views: 0,
    title: "",
    content: "",
    boardFileDtoList: [],
    likeCount: 0,
    isLiked: false,
    canEdit: false,
    canDel: false,
    delYn: "N",
    commentCount: 0,
  });

  const loadBoardData = () => {
    setLoading(true);
    getBoardDtl(boardId)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBoardData();
  }, [boardId]);

  // 좋아요 클릭
  const handleLikeClick = async () => {
    // 비회원 처리: 좋아요 불가, 로그인 페이지 이동
    if (!isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    try {
      await likeBoard(boardId);
      setData((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };

  const deleteBoardData = (id: number) => {
    if (confirm(`${id}번 데이터를 삭제하시겠습니까?`)) {
      deleteBoard(id)
        .then(() => {
          navigate(`/board/show/${data.category}`);
        })
        .catch((err) => console.log(err));
    }
  };

  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <Box sx={{ p: 3, width: 900, mx: "auto" }}>
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="circular" width={45} height={45} sx={{ mt: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }

  if (!data) return <Typography>데이터를 불러올 수 없습니다.</Typography>;

  return (
    <Box sx={{ mx: "auto", p: 3, width: "1000px" }}>
      <Stack spacing={2}>
        <Stack spacing={2} alignItems="flex-start">
          {/* 카테고리 */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "left" }}
          >
            <a
              href={`/board/show/${data.category}`}
              style={{ textDecoration: "none" }}
            >
              {CATEGORIES_MAP[data.category?.toUpperCase()] || data.category}{" "}
              &gt;
            </a>
          </Typography>

          {/* 제목 */}
          <Typography variant="h5" fontWeight={700} sx={{ textAlign: "left" }}>
            {data.title}
          </Typography>

          {/* 작성자, 작성일, 수정일, 조회수 + 버튼 */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            {/* 왼쪽: 아바타 + 작성자 정보 */}
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Avatar
                src="/profile.png"
                alt={data.nickname}
                sx={{ width: 45, height: 45 }}
              />
              <Stack spacing={0.5} sx={{ textAlign: "left" }}>
                <Typography variant="body1" fontWeight={500}>
                  {data.nickname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  작성일: {formatDateTime(data.regTime)}
                  {data.updateTime !== data.regTime &&
                    ` |  수정일: ${formatDateTime(data.updateTime)}`}{" "}
                  &nbsp;&nbsp;&nbsp;
                  {/* <RemoveRedEyeOutlinedIcon
                    fontSize="small"
                    sx={{ verticalAlign: "middle" }} // ← 텍스트 중앙 맞춤
                  /> */}
                  &nbsp;조회수: {data.views}회
                </Typography>
              </Stack>
            </Stack>

            {/* 오른쪽: 수정 / 삭제 버튼 */}
            {/* 작성자만 수정 가능 */}
            {/* 작성자 및 관리자만 삭제 가능*/}
            {/* 게시글 삭제여부 삭제일경우 복원버튼 */}
            {/* 오른쪽: 수정 / 삭제 / 복원 버튼 */}
            <Stack direction="row" spacing={1} mt={1}>
              {data.delYn === "Y" ? (
                // ✅ 복원 버튼만 표시
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  onClick={async () => {
                    try {
                      await restoreBoard(boardId);
                      alert("게시글이 복원되었습니다.");
                      // 최신 데이터 다시 불러오기
                      loadBoardData();
                    } catch (err) {
                      console.error("복원 실패", err);
                      alert("복원 중 오류가 발생했습니다.");
                    }
                  }}
                >
                  복원
                </Button>
              ) : (
                <>
                  {data.canEdit && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        navigate(`/board/edit/${boardId}`, {
                          state: { boardData: data },
                        });
                      }}
                    >
                      수정
                    </Button>
                  )}
                  {data.canDel && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={async () => {
                        try {
                          await deleteBoardData(boardId);
                          navigate(`/board/show/${data.category}`);
                        } catch (error) {
                          console.error(error);
                          alert("삭제 중 오류가 발생했습니다.");
                        }
                      }}
                    >
                      삭제
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* 3. 본문 내용 */}
      <Paper variant="outlined" sx={{ p: 5, mx: "auto" }}>
        <Box
          sx={{ mb: 2 }}
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
          className="content-container"
        />

        {/* 이미지 스타일 적용 */}
        <style>
          {`
            .content-container {
              text-align: left; /* 기본은 왼쪽 */
            }
            .content-container .ql-align-center {
              text-align: center;
            }
 
            .content-container .ql-align-right {
              text-align: right;
            }

            .content-container .ql-align-left {
              text-align: left;
            }

            /* 이미지는 여전히 최대 100% */
            .content-container img {
              max-width: 100%;
              height: auto;
            }
          `}
        </style>
        {/* 첨부파일 다운로드 */}
        {data.boardFileDtoList && data.boardFileDtoList.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1} sx={{ mt: 2 }}>
              {data.boardFileDtoList.map((file) => (
                <Button
                  key={file.id}
                  variant="outlined"
                  component="a"
                  href={`/api${file.fileUrl}`}
                  download
                  sx={{
                    textTransform: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={async () => {
                    try {
                      await increaseDownloadCount(file.id);
                      setData((prev) => ({
                        ...prev,
                        boardFileDtoList: prev.boardFileDtoList.map((f) =>
                          f.id === file.id
                            ? {
                                ...f,
                                downloadCount: (f.downloadCount ?? 0) + 1,
                              }
                            : f
                        ),
                      }));
                    } catch (err) {
                      console.error("다운로드 카운트 증가 실패", err);
                    }
                  }}
                >
                  <span>
                    {file.oriFileName} &nbsp;&nbsp;({formatSize(file.fileSize)})
                  </span>
                  <Typography variant="body2" color="text.secondary">
                    다운로드 횟수 : {file.downloadCount ?? 0}회
                  </Typography>
                </Button>
              ))}
            </Stack>
          </>
        )}

        {/* 해시태그 */}
        <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
          {data.hashtags?.map((tag, idx) => (
            <Chip key={idx} label={tag} color="primary" variant="outlined" />
          ))}
        </Stack>
      </Paper>

      {/* 좋아요 */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
        <IconButton
          color="primary"
          onClick={handleLikeClick}
          sx={{ color: data.isLiked ? "red" : "inherit" }}
        >
          {data.isLiked ? <Favorite /> : <FavoriteBorderOutlined />}
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: "center" }}>
          좋아요 {data.likeCount || 0}
        </Typography>
      </Box>

      {/* 댓글 */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 3, gap: 2 }}>
        <IconButton color="primary">
          <Comment />
        </IconButton>
        <Typography variant="body2">댓글 {data.commentCount}</Typography>
      </Box>

      {/* 댓글 영역 */}
      <Box sx={{}}>
        <Comments boardId={boardId} />
      </Box>
    </Box>
  );
}
