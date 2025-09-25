import { Container } from "@mui/material";
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

export default function App() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/visit`, { credentials: "include" });
  }, []);

  return (
    <BrowserRouter>
      <Header /> {/* ✅ Header는 Routes 밖에 배치 */}
      <Container maxWidth="lg">
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
          </Route>

          {/* 게시판 상세 */}
          <Route path="/board/new" element={<AddBoardPage />} />
          <Route path="/board/:id" element={<BoardDtlPage />} />
          <Route path="/board/edit/:id" element={<EditBoardPage />} />
          <Route path="/admin/filesetting" element={<FileSettingPage />} />

          {/* 카테고리 */}
          <Route path="/board/:category" element={<BoardDtlPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}