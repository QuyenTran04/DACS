export const API_URL = "http://192.168.3.34/api/users"; // Đổi thành IP thật nếu chạy trên thiết bị thật

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "Lỗi kết nối API" };
  }
};
