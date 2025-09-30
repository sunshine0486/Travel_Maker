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
  InputAdornment,
  IconButton,
} from "@mui/material";
import DaumPostcode, { type Address } from "react-daum-postcode";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
  const [isLoginIdChecked, setIsLoginIdChecked] = useState(false); // 아이디 중복검사 완료 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복검사 완료 여부
  // 👁️‍🗨️ 비밀번호 표시 토글 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const encodeBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

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

    if (form.birth.length != 6) {
      alert("생년월일은 주민번호 앞자리로 입력해주세요.");
      return;
    }

    if (form.phoneNumber.length != 11) {
      alert("전화번호는 '-' 없이 11자리로 입력해주세요.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 16) {
      alert("비밀번호는 8자 이상, 16자 이하로 입력해주세요.");
      return;
    }

    const encodedForm = {
      ...form,
      birth: encodeBase64(form.birth),
      phoneNumber: encodeBase64(form.phoneNumber),
      zipcode: encodeBase64(form.zipcode),
      address: encodeBase64(form.address),
      addressDetail: encodeBase64(form.addressDetail),
    };

    // 2. 서버 요청
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encodedForm),
    });

    console.log(encodedForm);

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
      const res = await axios.get(`${BASE_URL}/signup/check_loginid`, {
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
      const res = await axios.get(`${BASE_URL}/signup/check_nickname`, {
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
            label={
              <span>
                아이디<span style={{ color: "red" }}>*</span>
              </span>
            }
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
          />
          <Button
            onClick={checkDuplicateId}
            variant="outlined"
            sx={{ flex: 1.5, whiteSpace: "nowrap" }}
          >
            중복 확인
          </Button>
        </Stack>

        <TextField
          label={
            <span>
              비밀번호<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
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
        <TextField
          label={
            <span>
              비밀번호 확인<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="passwordConfirm"
          type={showPasswordConfirm ? "text" : "password"}
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  edge="end"
                >
                  {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label={
              <span>
                닉네임<span style={{ color: "red" }}>*</span>
              </span>
            }
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
          <Button
            onClick={checkDuplicateNickname}
            variant="outlined"
            sx={{ flex: 1.5, whiteSpace: "nowrap" }} // 버튼 길게 + 줄바꿈 방지
          >
            중복 확인
          </Button>
        </Stack>

        <TextField
          label={
            <span>
              e-mail<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label={
            <span>
              생년월일<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="birth"
          value={form.birth}
          onChange={handleChange}
          helperText={
            <span style={{ color: "red" }}>ex) 990101 - 6자리로 입력</span>
          }
        />
        <TextField
          label={
            <span>
              전화번호<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          helperText={<span style={{ color: "red" }}>'-'제외 11자리 입력</span>}
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label={
              <span>
                우편번호<span style={{ color: "red" }}>*</span>
              </span>
            }
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            disabled // 사용자가 직접 입력하지 못하도록 비활성화
          />
          <Button onClick={() => setIsPostcodeOpen(true)} variant="outlined">
            검색
          </Button>
        </Stack>

        <TextField
          label={
            <span>
              주소<span style={{ color: "red" }}>*</span>
            </span>
          }
          name="address"
          value={form.address}
          onChange={handleChange}
          disabled
        />
        <TextField
          label={
            <span>
              상세주소<span style={{ color: "red" }}>*</span>
            </span>
          }
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
