import { Container } from "@mui/material";
import Header from "./main/components/Header";
import MainPage from "./main/pages/MainPage";
import AdminTabs from "./admin/pages/AdminTabs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BoardPage from "./admin/pages/BoardPage";
import AdminLayout from "./admin/components/AdminLayout";
import VisitorsAdmin from "./admin/pages/VisitorsAdmin";
import { useEffect } from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MyPageWrapper from "./pages/MyPageWrapper";

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
          <Route path="/board/:boardId" element={<BoardPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
