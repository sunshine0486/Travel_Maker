import * as React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip"; // 툴팁 추가

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isAdmin } = useAuthStore();

  // ✅ 모바일 메뉴를 위한 상태 관리
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  // ✅ 사용자 메뉴를 위한 상태 관리 (필요시)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  // ✅ 모바일 메뉴 핸들러
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // ✅ 사용자 메뉴 핸들러
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // ✅ 내비게이션 항목들을 배열로 정의
  const navItems = [
    { name: "여행 Info/Tip", path: "/board/show/TIP" },
    { name: "여행 Q&A", path: "/board/show/QNA" },
    { name: "여행 Review", path: "/board/show/REVIEW" },
    { name: "Notice", path: "/board/show/NOTICE" },
  ];

  // ✅ 로그인 상태에 따른 사용자 메뉴 항목 정의
  const loggedInSettings = [
    { name: "마이페이지", path: "/mypage" },
    { name: "로그아웃", path: "/logout" },
  ];
  const loggedOutSettings = [
    { name: "로그인", path: "/login" },
    { name: "회원가입", path: "/signup" },
  ];

  const handleUserMenuClick = (path: string) => {
    if (path === "/logout") {
      handleLogoutClick();
    } else {
      navigate(path);
    }
    handleCloseUserMenu();
  };

  const settings = isAuthenticated ? loggedInSettings : loggedOutSettings;

  return (
    <AppBar position="fixed" sx={{ background: "#151B54", width: "100vw" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/travel_maker_miniwhite.png"
            alt="Travel Maker Logo"
            style={{ height: "40px" }}
          />
        </Box>

        {/* ✅ 데스크탑 메뉴 */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              color="inherit"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        {/* ✅ 모바일 햄버거 메뉴 */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {navItems.map((item) => (
              <MenuItem key={item.name} onClick={() => navigate(item.path)}>
                <Typography textAlign="center">{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* ✅ 로그인/회원가입/로그아웃/마이페이지/어드민 버튼 */}
        {isAuthenticated ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* 아바타 이미지 or 아이콘 */}
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={() => handleUserMenuClick(setting.path)}
                >
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
              {/* ✅ 관리자 버튼 추가 */}
              {isAdmin && (
                <MenuItem onClick={() => navigate("/admin/overview")}>
                  <Typography textAlign="center">Admin</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
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
          </Box>
        )}
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
