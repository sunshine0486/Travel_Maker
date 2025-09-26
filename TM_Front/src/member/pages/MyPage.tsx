import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DaumPostcode, { type Address } from "react-daum-postcode";
import axios from "axios";
import { useAuthStore } from "../../store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const BASE_URL = import.meta.env.VITE_API_URL;

interface MyPageForm {
  loginId: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  email: string;
  birth: string;
  phoneNumber: string;
  zipcode: string;
  address: string;
  addressDetail: string;
}

export default function MyPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<MyPageForm>({
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

  const [originalForm, setOriginalForm] = useState<MyPageForm>({ ...form });
  const [isEditing, setIsEditing] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const { loginId } = useAuthStore();
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  // 👁️‍🗨️ 비밀번호 표시 토글 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 페이지 접근 시 유저 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("jwt");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${BASE_URL}/mypage`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setForm({ ...data, password: "", passwordConfirm: "" });
        setOriginalForm({ ...data, password: "", passwordConfirm: "" });
        setIsNicknameChecked(true);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const msg =
            (err.response?.data as string) ??
            "회원 정보를 불러오는 중 오류가 발생했습니다.";
          alert(msg);
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      }
    };

    if (loginId) {
      fetchUser();
    }
  }, [loginId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "nickname") {
      setIsNicknameChecked(false);
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
        setIsNicknameChecked(false);
      } else {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as string) ??
          "닉네임 중복 확인 중 오류가 발생했습니다.";
        alert(msg);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
      setIsNicknameChecked(false);
    }
  };

  const handleComplete = (data: Address) => {
    setForm((prevForm) => ({
      ...prevForm,
      zipcode: data.zonecode,
      address: data.address,
    }));
    setIsPostcodeOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...originalForm });
    setIsEditing(false);
    setIsNicknameChecked(true);
  };

  const handleSave = async () => {
    if (form.nickname !== originalForm.nickname) {
      if (!isNicknameChecked) {
        alert("닉네임 중복검사를 진행해주세요.");
        return;
      }
    }

    if (form.password) {
      if (form.password.length < 8 || form.password.length > 16) {
        alert("비밀번호는 8자 이상, 16자 이하로 입력해주세요.");
        return;
      }
      if (form.password !== form.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    try {
      const token = sessionStorage.getItem("jwt");
      await axios.put(`${BASE_URL}/mypage/${form.loginId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("회원 정보가 업데이트 되었습니다.");
      setOriginalForm({ ...form });
      setIsEditing(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as string) ?? "업데이트 중 오류가 발생했습니다.";
        alert(msg);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      <Stack spacing={2} sx={{ width: 300 }}>
        <Typography variant="h5">마이페이지</Typography>
        <TextField
          label="아이디"
          name="loginId"
          value={form.loginId}
          disabled
        />
        <TextField
          label="비밀번호"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          disabled={!isEditing}
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
          label="비밀번호 확인"
          name="passwordConfirm"
          type={showPasswordConfirm ? "text" : "password"}
          value={form.passwordConfirm}
          onChange={handleChange}
          disabled={!isEditing}
          error={Boolean(
            form.passwordConfirm && form.password !== form.passwordConfirm
          )}
          helperText={
            form.passwordConfirm && form.password !== form.passwordConfirm
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
            label="닉네임"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {isEditing && (
            <Button onClick={checkDuplicateNickname}>
              중복 <br /> 확인
            </Button>
          )}
        </Stack>
        <TextField
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <TextField
          label="생년월일"
          name="birth"
          value={form.birth}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <TextField
          label="전화번호"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <Stack direction="row" spacing={1}>
          <TextField
            label="우편번호"
            name="zipcode"
            value={form.zipcode}
            disabled
          />
          {isEditing && (
            <Button onClick={() => setIsPostcodeOpen(true)}>검색</Button>
          )}
        </Stack>
        <TextField label="주소" name="address" value={form.address} disabled />
        <TextField
          label="상세주소"
          name="addressDetail"
          value={form.addressDetail}
          onChange={handleChange}
          disabled={!isEditing}
        />
        {!isEditing ? (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleEditToggle}>
              수정
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              취소
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSave}>
              저장
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              취소
            </Button>
          </Stack>
        )}
      </Stack>
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
