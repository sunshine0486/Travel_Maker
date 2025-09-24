import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import DaumPostcode, { type Address } from "react-daum-postcode";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function SignUp() {
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    email: "",
    birth: "",
    phoneNumber: "",
    zipcode: "",
    address: "",
    addressDetail: "",
  });

  const navigate = useNavigate();

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  /** const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; **/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // form 상태 업데이트
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    // 입력값이 바뀌면 중복검사 상태 초기화
    if (name === "loginId") setIsLoginIdChecked(false);
    if (name === "nickname") setIsNicknameChecked(false);
  };

  // 주소 검색이 완료되었을 때 실행되는 함수
  const handleComplete = (data: Address) => {
    setForm((prevForm) => ({
      ...prevForm,
      zipcode: data.zonecode, // 우편번호
      address: data.address, // 전체 주소
    }));
    setIsPostcodeOpen(false); // 주소 검색 창 닫기
  };

  const [isLoginIdChecked, setIsLoginIdChecked] = useState(false); // 아이디 중복검사 완료 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복검사 완료 여부

  const handleSubmit = async () => {
    // 0. 중복검사 여부 확인
    if (!isLoginIdChecked) {
      alert("아이디 중복검사를 진행해주세요.");
      return;
    }
    if (!isNicknameChecked) {
      alert("닉네임 중복검사를 진행해주세요.");
      return;
    }

    // 1. 유효성 검사
    if (
      !form.loginId ||
      !form.password ||
      !form.passwordConfirm ||
      !form.nickname ||
      !form.email ||
      !form.birth ||
      !form.phoneNumber ||
      !form.zipcode ||
      !form.address ||
      !form.addressDetail
    ) {
      alert("모든 항목을 빠짐없이 입력해주세요.");
      return;
    }

    if (!form.email.includes("@")) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 16) {
      alert("비밀번호는 8자 이상, 16자 이하로 입력해주세요.");
      return;
    }

    // 2. 서버 요청
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.status === 409) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }
    if (res.ok) {
      alert("회원가입 성공!");
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    } else {
      const msg = await res.text();
      alert(`오류: ${msg}`);
    }
  };
  // fetch말고 axios 하시고 get아니고 postmapping임 파라미터 말고 그냥 보내기.... check-nic말고 check_nick
  //   const checkDuplicateId = async () => {
  //   const res = await fetch(`${BASE_URL}/check-id`);
  //   if (res.ok) {
  //     const result = await res.json();
  //     if (result.exists) {
  //       alert("이미 사용 중인 아이디입니다.");
  //     } else {
  //       alert("사용 가능한 아이디입니다.");
  //     }
  //   } else {
  //     alert("아이디 중복 확인 중 오류가 발생했습니다.");
  //   }
  // };

  // const checkDuplicateNickname = async () => {
  //   const res = await fetch(`${BASE_URL}/check-nickname?nickname=${form.nickname}`);
  //   if (res.ok) {
  //     const result = await res.json();
  //     if (result.exists) {
  //       alert("이미 사용 중인 닉네임입니다.");
  //     } else {
  //       alert("사용 가능한 닉네임입니다.");
  //     }
  //   } else {
  //     alert("닉네임 중복 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const checkDuplicateId = async () => {
    if (!form.loginId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/check_loginid`, {
        params: { loginId: form.loginId },
      });
      if (res.data.exists) {
        alert("이미 사용 중인 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsLoginIdChecked(true); // 검사 완료
      }
    } catch (err) {
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const checkDuplicateNickname = async () => {
    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const res = await axios.get(`${BASE_URL}/check_nickname`, {
        params: { nickname: form.nickname },
      });
      if (res.data.exists) {
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      }
    } catch (err) {
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // 화면 전체 높이
      }}
    >
      <Stack spacing={2} sx={{ width: 300 }}>
        <Typography variant="h5">회원가입</Typography>

        <Stack direction="row" spacing={1}>
          <TextField
            label="아이디"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
          />
          <Button onClick={checkDuplicateId}>
            중복 <br></br>확인{" "}
          </Button>
        </Stack>

        <TextField
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <TextField
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          value={form.passwordConfirm}
          onChange={handleChange}
          error={
            form.passwordConfirm.length > 0 &&
            form.password !== form.passwordConfirm
          }
          helperText={
            form.passwordConfirm.length > 0 &&
            form.password !== form.passwordConfirm
              ? "비밀번호가 일치하지 않습니다"
              : ""
          }
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label="닉네임"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
          <Button onClick={checkDuplicateNickname}>
            중복 <br></br>확인
          </Button>
        </Stack>

        <TextField
          label="e-mail"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="생년월일"
          name="birth"
          value={form.birth}
          onChange={handleChange}
        />
        <TextField
          label="전화번호"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label="우편번호"
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            disabled // 사용자가 직접 입력하지 못하도록 비활성화
          />
          <Button onClick={() => setIsPostcodeOpen(true)}>검색</Button>
        </Stack>

        <TextField
          label="주소"
          name="address"
          value={form.address}
          onChange={handleChange}
          disabled
        />
        <TextField
          label="상세 주소"
          name="addressDetail"
          value={form.addressDetail}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit}>
          회원가입
        </Button>
        <Button onClick={() => window.history.back()}>취소</Button>
      </Stack>

      {/* isPostcodeOpen 상태에 따라 주소 검색 창을 렌더링 */}
      <Dialog
        open={isPostcodeOpen}
        onClose={() => setIsPostcodeOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>주소 검색</DialogTitle>
        <DialogContent dividers>
          <DaumPostcode
            onComplete={handleComplete}
            autoClose={false}
            style={{ height: "500px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPostcodeOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
