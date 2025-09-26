import { Box, Container } from "@mui/material";
import Header from "./main/components/Header";
import MainPage from "./main/pages/MainPage";
import AdminTabs from "./admin/pages/AdminTabs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./admin/components/AdminLayout";
import VisitorsAdmin from "./admin/pages/VisitorsAdmin";
import { useEffect } from "react";
import SignUp from "./member/pages/SignUp";
import Login from "./member/pages/Login";
import MyPageWrapper from "./member/pages/MyPageWrapper";
import AddBoardPage from "./board/pages/AddBoardPage";
import BoardDtlPage from "./board/pages/BoardDtlPage";
import EditBoardPage from "./board/pages/EditBoardPage";
import FileSettingPage from "./admin/pages/FileSettingPage";
import BoardList from "./board/pages/BoardList";
import DeletedBoardAdmin from "./admin/pages/DeletedAdmin";

export default function App() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/visit`, { credentials: "include" });
  }, []);

  return (
    <BrowserRouter>
      <Header /> {/* ✅ Header는 Routes 밖에 배치 */}
      {/* ✅ <Box>를 추가하고 Flexbox 속성으로 중앙 정렬 */}
      <Container maxWidth="lg" sx={{ paddingTop: "64px" }}>
        <Routes>
          {/* 로그인 */}
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route
            path="/mypage"
            element={<MyPageWrapper></MyPageWrapper>}
          ></Route>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

          {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="overview" element={<AdminTabs />} />
            <Route path="visitors" element={<VisitorsAdmin />} />
            <Route path="/admin/deleted" element={<DeletedBoardAdmin />} />
            <Route path="/admin/filesetting" element={<FileSettingPage />} />
          </Route>

          {/* 게시판 상세 */}
          <Route path="/board/new" element={<AddBoardPage />} />
          <Route path="/board/show/dtl/:id" element={<BoardDtlPage />} />
          <Route path="/board/edit/:id" element={<EditBoardPage />} />

          {/* 게시판 리스트 */}
          <Route path="/board/show/:category" element={<BoardList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
