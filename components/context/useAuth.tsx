// tokenHolder.ts
let token = "";
let refreshToken = "";

export const UseAuth = {
  getToken: () => token,
  setToken: (val: string) => (token = val),
  getRefreshToken: () => refreshToken,
  setRefreshToken: (val: string) => (refreshToken = val),
  clear: () => {
    token = "";
    refreshToken = "";
  },
};
