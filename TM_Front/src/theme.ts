// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#151B54", // 카푸치노 브라운
//       contrastText: "#ffffff", // 버튼/글자색 흰색
//     },

//     secondary: {
//       main: "#4e342e", // 진한 브라운 (보조 색상)
//     },
//     background: {
//       default: "#f5f5f5", // 페이지 기본 배경 (밝은 회색)
//     },
//   },
//   typography: {
//     fontFamily: `"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif`,
//   },
// });

// export default theme;
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#151B54", // 메인 색상 (네이비)
      light: "#3c4d8a", // hover, 강조용 (밝은 네이비)
      dark: "#0d1336", // 클릭 시, 진한 네이비
      contrastText: "#ffffff", // 대비 글자색
    },
    secondary: {
      main: "#f2b705", // 포인트 색상 (골드/옐로우 계열)
      contrastText: "#000000",
    },
    text: {
      primary: "#151B54", // 본문 기본 글자
      secondary: "#555555", // 보조 글자
    },
  },
  typography: {
    fontFamily: `"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none", // 버튼 대문자 방지
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;