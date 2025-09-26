import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
// import { getAuthToken } from "../api/loginApi";
import type { User } from "../../type";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  // 👁️‍🗨️ 비밀번호 표시 토글 상태
  const [showPassword, setShowPassword] = useState(false);

  //   const [toastOpen, setToastOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const [user, setUser] = useState<User>({
    loginId: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      // ✅ getAuthToken 대신 axios.post를 직접 사용
      const res = await axios.post(`${BASE_URL}/login`, user);

      // ✅ 응답 본문(response.data)에서 토큰과 admin 정보를 모두 추출
      const { jwtToken, admin } = res.data;
      console.log("admin", admin);

      // ✅ 여기에 아래 코드를 추가하세요.
      console.log("백엔드에서 받은 admin 값:", admin);

      if (jwtToken != null) {
        // 1. JWT 토큰을 sessionStorage에 저장
        sessionStorage.setItem("jwt", jwtToken);

        const decoded = jwtDecode<{ sub: string }>(jwtToken);
        const loginId = decoded.sub;

        // 2. 로그인 아이디(loginId)도 sessionStorage에 함께 저장
        sessionStorage.setItem("loginId", loginId);

        // ✅ 여기에도 아래 코드를 추가하세요.
        console.log("Zustand에 전달하는 admin 값:", admin);

        // 3. zustand의 login 함수에 loginId와 admin을 모두 넘겨줌
        login(loginId, admin); // ✅ admin 인자 추가

        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setToastMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  //   getAuthToken(user)
  //     .then((token) => {
  //       if (token != null) {
  //         // 1. JWT 토큰을 sessionStorage에 저장
  //         sessionStorage.setItem("jwt", token);

  //         const decoded = jwtDecode<{ sub: string }>(token);
  //         const loginId = decoded.sub;

  //         // 2. 로그인 아이디(loginId)도 sessionStorage에 함께 저장 ✅
  //         sessionStorage.setItem("loginId", loginId);

  //         login(loginId); // ✅ 인자 넘김
  //         navigate("/");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setToastMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
  //     });
  // };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        height="100vh" // 뷰포트 전체 높이를 사용해 화면 중앙에 위치시킴
        pt={40} // 상단 여백 추가
      >
        {/* Stack 대신 Box를 사용한 레이아웃 */}
        {/* <Box sx={{ width: 300 }}> */}
        {/* 로고를 위한 별도의 Box */}
        {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#151B54",
              paddingY: 3,
              
              marginBottom: 10,
              borderRadius: 2,
              width: "100%", // 부모 Stack의 너비를 따릅니다.
            }}
          >
            <img
              src="/travel_maker_miniwhite.png"
              alt="Travel Maker Logo"
              style={{ height: "100px", paddingLeft: "345px", margin: "7px" }} // ✅ 로고 크기 키움
            />
          </Box> */}

        <Stack spacing={2} sx={{ width: 300 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="primary"
          >
            로그인
          </Typography>

          {toastMessage && (
            <Box
              sx={{
                border: "1px solid #f44336",
                borderRadius: 2,
                padding: "8px 12px",
                bgcolor: "#fff0f0",
                color: "#d32f2f",
                fontSize: "0.9rem",
                fontWeight: 500,
                textAlign: "center",
                whiteSpace: "normal", // 줄바꿈 허용
                wordBreak: "keep-all", // 단어 단위로 줄바꿈
              }}
            >
              {toastMessage}
            </Box>
          )}
          <TextField label="ID" name="loginId" onChange={handleChange} />
          <TextField
            label="PW"
            name="password"
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
      {/* </Box> */}
    </>
  );
}
