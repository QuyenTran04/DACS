export interface AuthResponse {
  success: boolean;
  message?: string;
}

export const authenticateUser = (
  email: string,
  password: string
): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "q" && password === "1") {
        resolve({ success: true });
      } else {
        reject({ success: false, message: "Vui lòng nhập chính xác!" });
      }
    }, 1000);
  });
};
