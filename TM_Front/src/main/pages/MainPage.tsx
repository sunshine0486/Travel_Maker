import { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import PostCard from "../components/PostCard";
import PopularPostList from "../components/PopularPostList";
import SiteStats from "../components/SiteStats";
import { getCurrentBoard, getHotBoard, getTotalCnt } from "../api/MainPageApi";
import type { Board, SiteStatsData } from "../../type";
export default function MainPage() {
  const [currentBoards, setCurrentBoards] = useState<Board[]>([]);
  const [hotBoards, setHotBoards] = useState<Board[]>([]);
  const [stats, setStats] = useState<SiteStatsData | null>(null);
  useEffect(() => {
    getCurrentBoard().then(setCurrentBoards);
    getHotBoard().then(setHotBoards);
    getTotalCnt().then(setStats);
  }, []);
  return (
    <Box sx={{ my: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      {/* 소개 영역 */}
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          :비행기: 당신의 여행 이야기를 들려주세요
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          전 세계 여행자들과 소중한 경험을 나누고, 새로운 여행지를 발견해보세요
        </Typography>
      </Paper>
      {/* 카테고리 */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          카테고리
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Info/Tip" path="/board/show/INFO_TIP" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Q&A" path="/board/show/QNA" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Review" path="/board/show/REVIEW" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="Notice" path="/board/show/NOTICE" />
          </Grid>
        </Grid>
      </Box>
      {/* 게시글 섹션 */}
      <Grid container spacing={4} sx={{ mt: 5 }}>
        {/* 최신 게시글 */}
        <Grid size={{ xs: 12, md: 8 }} width={500}>
          <Typography variant="h6" gutterBottom>
            최신 게시글
          </Typography>
          {currentBoards.map((post) => (
            <PostCard
              id={post.id}
              key={post.id}
              title={post.title}
              content={post.content ?? ""} // 최신글은 본문 있음
              imageUrl={post.boardFileDtoList?.[0]?.fileUrl} // 필요 시 첫 번째 첨부파일 썸네일 사용 가능
            />
          ))}
        </Grid>
        {/* 인기 게시글 + 사이트 통계 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" gutterBottom>
            인기 게시글
          </Typography>
          <PopularPostList
            posts={hotBoards.map((post, index) => ({
              id: post.id,
              rank: post.rank ?? index + 1, // 백엔드에서 내려주면 그대로, 없으면 index
              title: post.title,
            }))}
          />
          {stats && (
            <SiteStats
              totalPosts={stats.boardCnt}
              totalMembers={stats.memberCnt}
              todayVisitors={stats.todayVisitor}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
