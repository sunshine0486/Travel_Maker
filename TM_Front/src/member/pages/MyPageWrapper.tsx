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

const BASE_URL = import.meta.env.VITE_API_URL;

export default function MyPageWrapper() {
  const { loginId } = useAuthStore(); // 전역 상태에서 loginId 꺼냄
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      // 요청 본문(body)에 데이터 객체를 직접 전달합니다.
      // URL 파라미터 방식을 제거합니다.
      await axios.post(`${BASE_URL}/mypage/verify-password`, {
        loginId,
        password,
      });
      setVerified(true);
    } catch (err) {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  //   const handleVerify = async () => {
  //     try {
  //       await axios.post(`${BASE_URL}/mypage/verify-password`, null, {
  //         params: { loginId, password },
  //       });
  //       setVerified(true);
  //     } catch (err) {
  //       setError("비밀번호가 틀렸습니다.");
  //     }
  //   };

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
        </DialogActions>
      </Dialog>
    );
  }

  return <MyPage />;
}
