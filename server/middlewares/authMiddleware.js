const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};

router.get("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = { authMiddleware, checkRole };
