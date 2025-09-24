// import Comments from "./comments/pages/Comments"

import { Container } from "@mui/material"
import Header from "./main/components/Header"
// import MainPage from "./main/pages/MainPage"
import AdminTabs from "./admin/pages/AdminTabs"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import BoardPage from "./admin/pages/BoardPage"
import AdminLayout from "./admin/components/AdminLayout"
import VisitorsAdmin from "./admin/pages/VisitorsAdmin"
import { useEffect } from "react"

export default function App() {

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/visit`, { credentials: "include" });
  }, []);

  return (
    <>
    <BrowserRouter>
    {/* main */}
      {/* <CssBaseline /> */}
      <Header />
      {/* <Container maxWidth="lg">
        <MainPage />
      </Container> */}
    {/* comment */}
      {/* <Comments boardId={1} loggedInUser={{ id: 1 }} /> */}
    {/* admin */}

      <Container maxWidth="lg">
        <Routes>
          {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="overview" element={<AdminTabs />} />
            {/* <Route path="deleted" element={<DeletedAdmin />} /> */}
            <Route path="visitors" element={<VisitorsAdmin />} />
            {/* <Route path="files" element={<FilesAdmin />} /> */}

          </Route>
          {/* 게시판 상세 (임시) */}
          <Route path="/board/:boardId" element={<BoardPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
    </>
  );
};

