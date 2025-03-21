import express from "express";
import { poolPromise } from "../config/database";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", email)
      .input("password", password)
      .query(
        "SELECT * FROM Users WHERE email = @email AND password = @password"
      );

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
});

export default router;
