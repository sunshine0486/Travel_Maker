// src/pages/MainPage.tsx
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

  // 최신 3개 슬롯, 인기 5개 슬롯 고정
  const latestPosts = Array.from({ length: 3 }, (_, i) => currentBoards[i] ?? null);
  const popularPosts = Array.from({ length: 5 }, (_, i) => hotBoards[i] ?? null);

  return (
    <Box sx={{ my: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      {/* 소개 영역 */}
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          ✈️ 당신의 여행 이야기를 들려주세요
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
        {/* 최신 게시글 (왼쪽) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>
            최신 게시글
          </Typography>

          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {latestPosts.map((post, index) =>
              post ? (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content ?? ""}
                />
              ) : (
                <Paper
                  key={`empty-latest-${index}`}
                  sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
                >
                  게시글이 없습니다.
                </Paper>
              )
            )}
          </Box>
        </Grid>

        {/* 인기 게시글 + 사이트 통계 (오른쪽) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" gutterBottom>
            인기 게시글
          </Typography>

          <Box sx={{ mt: 1 }}>
            {popularPosts.every((p) => !p) ? (
              <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary", mb: 2 }}>
                인기 게시글이 없습니다.
              </Paper>
            ) : (
              <PopularPostList
                posts={popularPosts.map((p, idx) =>
                  p
                    ? { id: p.id, rank: p.rank ?? idx + 1, title: p.title }
                    : { id: -idx - 1, rank: idx + 1, title: "게시글이 없습니다." }
                )}
              />
            )}
          </Box>

          {/* SiteStats는 인기 게시글 밑에 배치 */}
          {stats && (
            <Box sx={{ mt: 3 }}>
              <SiteStats
                totalPosts={stats.boardCnt}
                totalMembers={stats.memberCnt}
                todayVisitors={stats.todayVisitor}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
