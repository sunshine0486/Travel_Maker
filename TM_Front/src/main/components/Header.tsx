import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <AppBar
      position="static"
      // sx={{ background: "linear-gradient(90deg, #4f46e5, #3b82f6)", width: "100vw", }}
      sx={{ background: "#151B54", width: "100vw" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // ✅ 수직 가운데 정렬
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")} // 메인 페이지로 이동하는 로직 추가
        >
          <img
            src="/travel_maker_miniwhite.png"
            alt="Travel Maker Logo"
            style={{ height: "40px" }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            홈
          </Button>
          <Button color="inherit" onClick={() => navigate("/categories")}>
            카테고리
          </Button>
          <Button color="inherit" onClick={() => navigate("/hot-posts")}>
            인기글
          </Button>
          <Button color="inherit" onClick={() => navigate("/community")}>
            커뮤니티
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/login")}
          >
            로그인
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "white", color: "#3b82f6" }}
            onClick={() => navigate("/signup")}
          >
            회원가입
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
