import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { getAuthToken } from "../api/loginApi";
import type { User } from "../../type";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  //   const [toastOpen, setToastOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const [user, setUser] = useState<User>({
    loginId: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    getAuthToken(user)
      .then((token) => {
        if (token != null) {
          // 1. JWT 토큰을 sessionStorage에 저장
          sessionStorage.setItem("jwt", token);

          const decoded = jwtDecode<{ sub: string }>(token);
          const loginId = decoded.sub;

          // 2. 로그인 아이디(loginId)도 sessionStorage에 함께 저장 ✅
          sessionStorage.setItem("loginId", loginId);

          login(loginId); // ✅ 인자 넘김
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setToastMessage(
          err.response?.data || "로그인에 실패했습니다. 실패! 실패! 실패!"
        );
      });
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // 뷰포트 전체 높이를 사용해 화면 중앙에 위치시킴
      >
        <Stack spacing={2} mt={2} alignItems="center">
          {toastMessage && (
            <Box
              border="1px solid red"
              borderRadius={1}
              padding={1}
              bgcolor="#ffe6e6"
              color="red"
              fontWeight="bold"
              width="100%"
              textAlign="center"
            >
              {toastMessage}
            </Box>
          )}
          <TextField label="ID" name="loginId" onChange={handleChange} />
          <TextField
            label="PW"
            name="password"
            onChange={handleChange}
            type="password"
          />
          <Button color="primary" onClick={handleLogin}>
            로그인
          </Button>
          {/* <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={() => setToastOpen(false)}
            message="로그인을 하지 못하였습니다~~~"
          /> */}
          <Button onClick={() => window.history.back()}>취소</Button>
        </Stack>
      </Box>
    </>
  );
}
