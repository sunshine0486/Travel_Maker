import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt"); // "" 대신 완전히 삭제
    logout();
    navigate("/"); // 로그아웃 후 홈으로 이동 (선택사항)
  };
  return (
    <AppBar position="static" sx={{ background: "#151B54", width: "100vw" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        {/* 메뉴 */}
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
        {/* 로그인 여부에 따라 버튼 다르게 표시 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogoutClick}
              >
                로그아웃
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/mypage")}
              >
                마이페이지
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
