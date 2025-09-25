import { create } from "zustand";
type AuthStore = {
  isAuthenticated: boolean;
  loginId: string;
  login: (id: string) => void;
  logout: () => void;
};
// sessionStorage에서 초기 상태를 불러오는 함수
const getInitialState = () => {
  const jwt = sessionStorage.getItem("jwt");
  const storedLoginId = sessionStorage.getItem("loginId");
  return {
    isAuthenticated: !!jwt,
    loginId: storedLoginId || "", // loginId가 없으면 빈 문자열로 초기화
  };
};
export const useAuthStore = create<AuthStore>((set) => ({
  ...getInitialState(), // 초기 상태를 여기서 설정합니다.
  login: (id: string) => {
    // 로그인 시 JWT와 loginId를 함께 저장합니다.
    // JWT는 이미 로그인 로직에서 저장했다고 가정합니다.
    sessionStorage.setItem("loginId", id);
    set({
      isAuthenticated: true,
      loginId: id,
    });
  },
  logout: () => {
    // 로그아웃 시 JWT와 loginId를 모두 삭제합니다.
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("loginId");
    set({
      isAuthenticated: false,
      loginId: "",
    });
  },
}));
// export const useAuthStore = create<AuthStore>((set) => ({
//   isAuthenticated: !!sessionStorage.getItem("jwt"),
//   loginId: "",
//   login: (id: string) =>
//     set({
//       isAuthenticated: true,
//       loginId: id,
//     }),
//   logout: () =>
//     set({
//       isAuthenticated: false,
//       loginId: "",
//     }),
// }));