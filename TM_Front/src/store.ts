import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  loginId: string;
  // ✅ isAdmin 상태 추가
  isAdmin: boolean;
  // ✅ login 함수에 isAdmin 파라미터 추가
  login: (id: string, isAdmin: boolean) => void;
  logout: () => void;
};

// sessionStorage에서 초기 상태를 불러오는 함수
const getInitialState = () => {
  const jwt = sessionStorage.getItem("jwt");
  const storedLoginId = sessionStorage.getItem("loginId");
  // ✅ isAdmin 정보도 함께 불러옵니다.
  const storedIsAdmin = sessionStorage.getItem("isAdmin") === "true";

  return {
    isAuthenticated: !!jwt,
    loginId: storedLoginId || "", // loginId가 없으면 빈 문자열로 초기화
    isAdmin: storedIsAdmin,
  };
};
export const useAuthStore = create<AuthStore>((set) => ({
  ...getInitialState(), // 초기 상태를 여기서 설정합니다.

  // ✅ login 함수 수정
  login: (id: string, isAdmin: boolean) => {
    // 로그인 시 JWT와 loginId, isAdmin을 함께 저장합니다.
    sessionStorage.setItem("loginId", id);
    // ✅ isAdmin 정보를 문자열로 변환하여 저장
    sessionStorage.setItem("isAdmin", String(isAdmin));
    set({
      isAuthenticated: true,
      loginId: id,
      isAdmin: isAdmin,
    });
  },

  // ✅ logout 함수 수정
  logout: () => {
    // 로그아웃 시 모든 정보를 삭제합니다.
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("loginId");
    sessionStorage.removeItem("isAdmin"); // ✅ isAdmin도 삭제
    set({
      isAuthenticated: false,
      loginId: "",
      isAdmin: false,
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
