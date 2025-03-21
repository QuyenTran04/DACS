import sql from "mssql";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

const config: sql.config = {
  server: process.env.DB_SERVER || "TRANAQUYEN",
  database: process.env.DB_NAME || "travel",
  driver: "ODBC Driver 17 for SQL Server",

  authentication: {
    type: "ntlm", // Bật NTLM authentication (Windows Auth)
    options: {
      domain: "", // Nếu không có domain, để trống
      userName: process.env.DB_USER || "", // Nếu cần truyền user
      password: process.env.DB_PASSWORD || "", // Nếu cần truyền password
    },
  },

  options: {
    enableArithAbort: true,
    encrypt: false,
    trustServerCertificate: true,
  },
};


export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Kết nối thành công tới SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối SQL Server:", err);
  });
