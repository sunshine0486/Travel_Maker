// type PrivateRouteProps = {
//   children: JSX.Element;
// };
// function PrivateRoute({ children }: PrivateRouteProps) {
//   const { isAuthenticated } = useAuthStore();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

import { BrowserRouter, Route, Routes } from "react-router-dom";
import BoardDtlPage from "./board/DtlPage/BoardDtlPage";
import AddBoardPage from "./board/CreatePage/AddBoardPage";
import EditBoardPage from "./board/CreatePage/EditBoardPage";
import FileSettings from "./board/FileSettingPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board/new" element={<AddBoardPage />} />
        <Route path="/board/:id" element={<BoardDtlPage />} />
        <Route path="/board/edit/:id" element={<EditBoardPage />} />
        <Route path="/admin/filesetting" element={<FileSettings />} />
        {/* <Route
        path="/board/category/:category"
        element={
          <PrivateRoute>
            <BoardList />
          </PrivateRoute>
        }
      /> */}
      </Routes>
    </BrowserRouter>
  );
}
