const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// Middleware kiểm tra role
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};
// API chỉ cho admin xem danh sách user
router.get("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = { authMiddleware, checkRole };
