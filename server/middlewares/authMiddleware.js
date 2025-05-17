const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const admin = require("../config/firebaseAdmin");

dotenv.config();

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Thông tin user (uid, email, v.v)
    next();
  } catch (error) {
    console.error("Firebase token error:", error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

exports.authorizeRole = (role) => (req, res, next) => {
  if (!req.user || !role.includes(req.user.role)) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};
