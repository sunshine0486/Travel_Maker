import { Box, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "80vh" }}>
      {/* 왼쪽 사이드바 */}
      <Paper
        elevation={3}
        sx={{
          width: 220,
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #ddd",
        }}
      >
        <List>
          <ListItemButton
            component={NavLink}
            to="/admin/overview"
            sx={{
              "&.active": {
                backgroundColor: "#e0e7ff", // 선택된 메뉴 배경색
                color: "#1e3a8a", // 글씨 색
              },
            }}
          >
            <ListItemText primary="전체 데이터 조회" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/admin/deleted"
            sx={{
              "&.active": {
                backgroundColor: "#e0e7ff",
                color: "#1e3a8a",
              },
            }}
          >
            <ListItemText primary="게시글 삭제 이력" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/admin/visitors"
            sx={{
              "&.active": {
                backgroundColor: "#e0e7ff",
                color: "#1e3a8a",
              },
            }}
          >
            <ListItemText primary="방문자수 조회" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/admin/filesetting"
            sx={{
              "&.active": {
                backgroundColor: "#e0e7ff",
                color: "#1e3a8a",
              },
            }}
          >
            <ListItemText primary="첨부파일 설정관리" />
          </ListItemButton>
        </List>
      </Paper>

      {/* 오른쪽 컨텐츠 */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
