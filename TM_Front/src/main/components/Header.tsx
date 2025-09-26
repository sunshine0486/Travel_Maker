import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import React from "react";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isAdmin } = useAuthStore();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navItems = [
    { name: "여행 Info/Tip", path: "/board/show/INFO_TIP" },
    { name: "여행 Q&A", path: "/board/show/QNA" },
    { name: "여행 Review", path: "/board/show/REVIEW" },
    { name: "Notice", path: "/board/show/NOTICE" },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = (path: string) => {
    if (path === "/logout") {
      handleLogoutClick();
    } else {
      navigate(path);
    }
    handleCloseUserMenu();
  };

  const userMenuItems = isAuthenticated
    ? [
        { name: "마이페이지", path: "/mypage" },
        ...(isAdmin ? [{ name: "Admin", path: "/admin/overview" }] : []),
        { name: "로그아웃", path: "/logout" },
      ]
    : [
        { name: "로그인", path: "/login" },
        { name: "회원가입", path: "/signup" },
      ];

  return (
    <AppBar position="fixed" sx={{ background: "#151B54", width: "100%" }}>
      <Toolbar
        sx={{ position: "relative", width: "100%", minHeight: "64px", px: 2 }}
      >
        {/* 모바일 햄버거 메뉴 (왼쪽) */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            display: { xs: "flex", md: "none" },
          }}
        >
          <IconButton onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.name} onClick={() => navigate(item.path)}>
                <Typography textAlign="center">{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* 로고 (큰 화면에서만 왼쪽 고정) */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            cursor: "pointer",
            pl: 2,
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/travel_maker_miniwhite.png"
            alt="Travel Maker Logo"
            style={{ height: "50px" }}
          />
        </Box>

        {/* Travel Maker 텍스트 (모바일에서만 중앙) */}
        <Typography
          component="span" // ✅ 블록 요소로 바꿔줌
          variant="h6"
          noWrap
          onClick={() => navigate("/")} // ✅ 클릭 시 홈으로 이동
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            display: { xs: "flex", md: "none" },
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer", // ✅ 손가락 커서
          }}
        >
          Travel Maker
        </Typography>

        {/* 데스크탑 메뉴 (정중앙 고정) */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: { xs: "none", md: "flex" },
            gap: 3,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.name}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                fontSize: "1.05rem",
                fontWeight: 600,
              }}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* 사용자 메뉴 (오른쪽 고정) */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            pr: 2,
          }}
        >
          {isAuthenticated ? (
            <>
              <Tooltip title="사용자 메뉴">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    onClick={() => handleUserMenuClick(item.path)}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
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

// import { AppBar, Toolbar, Button, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store";

// export default function Header() {
//   const navigate = useNavigate();

//   // ✅ isAdmin 상태를 함께 가져옵니다.
//   const { isAuthenticated, logout, isAdmin } = useAuthStore();

//   const handleLogoutClick = () => {
//     // sessionStorage.removeItem("jwt"); // "" 대신 완전히 삭제
//     // sessionStorage.removeItem("loginId");
//     logout();
//     navigate("/"); // 로그아웃 후 홈으로 이동 (선택사항)
//   };

//   return (
//     <AppBar position="fixed" sx={{ background: "#151B54", width: "100vw" }}>
//       <Toolbar
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//           onClick={() => navigate("/")} // 메인 페이지로 이동하는 로직 추가
//         >
//           <img
//             src="/travel_maker_miniwhite.png"
//             alt="Travel Maker Logo"
//             style={{ height: "40px" }}
//           />
//         </Box>

//         {/* 메뉴 */}
//         <Box sx={{ display: "flex", gap: 3 }}>
//           <Button
//             color="inherit"
//             onClick={() => navigate("/board/show/INFO_TIP")}
//           >
//             여행 Info/Tip
//           </Button>
//           <Button color="inherit" onClick={() => navigate("/board/show/QNA")}>
//             여행 Q&A
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => navigate("/board/show/REVIEW")}
//           >
//             여행 Review
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => navigate("/board/show/NOTICE")}
//           >
//             Notice
//           </Button>
//         </Box>

//         {/* 로그인 여부에 따라 버튼 다르게 표시 */}
//         <Box sx={{ display: "flex", gap: 1 }}>
//           {isAuthenticated ? (
//             <>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={handleLogoutClick}
//               >
//                 로그아웃
//               </Button>

//               {/* ✅ 관리자 여부에 따라 버튼 렌더링 */}
//               {isAdmin ? (
//                 <Button
//                   variant="outlined"
//                   color="inherit"
//                   onClick={() => navigate("/admin/overview")}
//                 >
//                   Admin
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outlined"
//                   color="inherit"
//                   onClick={() => navigate("/mypage")}
//                 >
//                   마이페이지
//                 </Button>
//               )}
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={() => navigate("/login")}
//               >
//                 로그인
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="inherit"
//                 onClick={() => navigate("/signup")}
//               >
//                 회원가입
//               </Button>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }
