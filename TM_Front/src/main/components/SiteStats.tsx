import { Paper, Typography } from "@mui/material";

interface Props {
  totalPosts: number;
  totalMembers: number;
  todayVisitors: number;
}

export default function SiteStats({ totalPosts, totalMembers, todayVisitors }: Props) {
  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3, borderRadius: 3 }}>
      <Typography variant="body2">총 게시글: {totalPosts}</Typography>
      <Typography variant="body2">총 회원수: {totalMembers}</Typography>
      <Typography variant="body2">오늘 방문자: {todayVisitors}</Typography>
    </Paper>
  );
}
