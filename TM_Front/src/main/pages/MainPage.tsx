import { Box, Grid, Typography, Paper } from "@mui/material";
import CategoryCard from "../components/CategoryCard";
import PostCard from "../components/PostCard";
import PopularPostList from "../components/PopularPostList";
import SiteStats from "../components/SiteStats";
<<<<<<< Updated upstream

export default function MainPage() {
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Info/Tip" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Q&A" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="여행 Review" />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <CategoryCard title="Notice" />
=======
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
>>>>>>> Stashed changes
          </Grid>
        </Grid>
      </Box>
      {/* 게시글 섹션 */}
      <Grid container spacing={4} sx={{ mt: 5 }}>
        {/* 최신 게시글 */}
<<<<<<< Updated upstream
        <Grid size={{ xs: 12, md: 8 }}>
=======
        <Grid size={{ xs: 12, md: 8 }} width={500}>
>>>>>>> Stashed changes
          <Typography variant="h6" gutterBottom>
            최신 게시글
          </Typography>
          <PostCard
            title="부산 해운대 맛집 베스트 10"
            content="현지인이 추천하는 숨은 맛집까지!"
            imageUrl="/img1.jpg"
          />
          <PostCard
            title="제주도 렌터카 vs 대중교통"
            content="여행 준비 필수 고민 해결!"
          />
          <PostCard
            title="도쿄 5일 자유여행 완전 정복 후기"
            content="처음 일본 여행자를 위한 가이드"
            imageUrl="/img2.jpg"
          />
        </Grid>
        {/* 인기 게시글 + 사이트 통계 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" gutterBottom>
            인기 게시글
          </Typography>
          <PopularPostList
<<<<<<< Updated upstream
            posts={[
              { title: "제주도 숨은 명소 베스트 10", views: "3.2K" },
              { title: "부산 주차장 완벽 가이드", views: "2.8K" },
              { title: "서울 핫플레이스 예약 꿀팁", views: "2.1K" },
              { title: "오사카 자유여행 정복 후기", views: "1.9K" },
              { title: "강릉 렌터카 vs 대중교통", views: "1.5K" },
            ]}
=======
            posts={hotBoards.map((post, index) => ({
              rank: post.rank ?? index + 1, // 백엔드에서 내려주면 그대로, 없으면 index
              title: post.title,
            }))}
>>>>>>> Stashed changes
          />
          <SiteStats totalPosts={1234} totalMembers={567} todayVisitors={899} />
        </Grid>
      </Grid>
    </Box>
  );
}
