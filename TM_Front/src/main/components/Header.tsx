import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #4f46e5, #3b82f6)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          여행 게시판
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button color="inherit">홈</Button>
          <Button color="inherit">카테고리</Button>
          <Button color="inherit">인기글</Button>
          <Button color="inherit">커뮤니티</Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" color="inherit">로그인</Button>
          <Button variant="contained" sx={{ backgroundColor: "white", color: "#3b82f6" }}>
            회원가입
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
