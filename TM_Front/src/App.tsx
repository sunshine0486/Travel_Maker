// import './App.css'
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import MyPageWrapper from "./pages/MyPageWrapper";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/mypage" element={<MyPageWrapper></MyPageWrapper>}></Route>
      </Routes>
    </>
  );
}

export default App;
