import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import type { FileSettingDto } from "../../board/type";
import { getFileSetting, updateFileSetting } from "../api/AdminApi";

export default function FileSettingPage() {
  const [maxFiles, setMaxFiles] = useState<number>();
  const [maxFileSize, setMaxFileSize] = useState<number>();
  const [allowedExtensions, setAllowedExtensions] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openToast, setOpenToast] = useState(false);
  const [extensionError, setExtensionError] = useState<string>("");

  useEffect(() => {
    const fetchSetting = async () => {
      const data: FileSettingDto | null = await getFileSetting();
      console.log(data);
      if (data) {
        setMaxFiles(data.maxUploadCnt);
        setMaxFileSize(data.fileMaxUploadSize / (1024 * 1024)); // byte → MB
        setAllowedExtensions(data.allowedExtension);
      }
      setLoading(false);
    };
    fetchSetting();
  }, []);

  const handleSave = async () => {
    const body: FileSettingDto = {
      maxUploadCnt: maxFiles ?? 0,
      fileMaxUploadSize: (maxFileSize ?? 0) * 1024 * 1024, // 바이트로 변환하여 전송
      allowedExtension: allowedExtensions ?? "",
    };
    const success = await updateFileSetting(body);
    if (success) {
      setOpenToast(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3, margin: "0 auto", maxWidth: 600 }}>
      <Typography variant="h5" align="center" gutterBottom>
        <h4>첨부파일 설정 관리</h4>
      </Typography>
      <Divider></Divider>
      <br></br>
      {/* 첨부파일 최대 업로드 개수 */}
      <Box
        sx={{ marginBottom: 2, display: "flex", justifyContent: "flex-start" }}
      >
        <TextField
          label="첨부파일 최대 업로드 개수"
          value={maxFiles ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              // 숫자만 허용
              setMaxFiles(Number(val));
            }
          }}
          variant="outlined"
          sx={{ minWidth: "200px" }}
        />
      </Box>

      {/* 파일별 최대 용량 */}
      <Box
        sx={{ marginBottom: 2, display: "flex", justifyContent: "flex-start" }}
      >
        <TextField
          label="파일별 최대 용량 (MB)"
          value={maxFileSize ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) {
              // 숫자 및 소수점 허용
              setMaxFileSize(Number(val));
            }
          }}
          variant="outlined"
          sx={{ minWidth: "200px" }}
        />
      </Box>

      {/* 업로드 허용 파일 확장자 */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="업로드 허용 파일 확장자"
          placeholder="확장자 사이를 쉼표로 입력해주세요"
          value={allowedExtensions ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            setAllowedExtensions(val);

            if (/\s/.test(val)) {
              setExtensionError("공백 없이 쉼표로 구분해주세요.");
            } else {
              setExtensionError("");
            }
          }}
          variant="outlined"
          error={!!extensionError}
          helperText={
            extensionError || "쉼표로 구분하여 입력하세요. 예: jpg,png,gif"
          }
          sx={{
            width: `${Math.max(10, (allowedExtensions?.length ?? 0) + 1)}ch`,
            minWidth: "200px",
          }}
        />
      </Box>

      {/* 저장 버튼 */}
      <Box>
        <Button variant="contained" color="primary" onClick={handleSave}>
          저장
        </Button>
      </Box>

      {/* ✅ 초록색 토스트 알림 */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          저장되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}
