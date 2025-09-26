import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import MyPage from "./MyPage"; // 기존 마이페이지 컴포넌트
import { useAuthStore } from "../../store"; // zustand에서 loginId 가져오기
// import { getAxiosConfig } from "../api/loginApi";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MyPageWrapper() {
  const { loginId } = useAuthStore(); // 전역 상태에서 loginId 꺼냄
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      const token = sessionStorage.getItem("jwt");

      if (!token) {
        setError("인증 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      await axios.post(
        `${BASE_URL}/mypage/verify-password`,
        {
          loginId,
          password,
        },
        // ✅ 토큰을 헤더에 직접 추가합니다.
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVerified(true);
    } catch (err) {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  // const handleVerify = async () => {
  //   try {
  //     // 요청 본문(body)에 데이터 객체를 직접 전달합니다.
  //     // URL 파라미터 방식을 제거합니다.
  //     await axios.post(
  //       `${BASE_URL}/mypage/verify-password`,
  //       {
  //         loginId,
  //         password,
  //       },
  //       getAxiosConfig()
  //     );
  //     setVerified(true);
  //   } catch (err) {
  //     setError("비밀번호가 틀렸습니다.");
  //   }
  // };

  if (!verified) {
    return (
      <Dialog open fullWidth maxWidth="xs">
        <DialogTitle>비밀번호 확인</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            마이페이지에 접근하려면 비밀번호를 다시 입력해주세요.
          </Typography>
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerify} variant="contained">
            확인
          </Button>
          <Button onClick={() => window.history.back()} variant="contained">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return <MyPage />;
}
