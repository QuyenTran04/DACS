const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/account");
const jwt = require("jsonwebtoken");
const account = require("../models/account");

const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
});
//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role},
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});
//Lay danh sach
router.get("../models/account", async (res, req) => {
  try {
    const users = await User.find().select("-password"); // Không gửi password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});


//Sua
router.put("../models/account", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const account = await account.findById(req.params._id)
    if (!account)
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    account.username = username || account.username;
    account.email = email || account.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      account.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});
//Xoa
router.delete("../models/account", async (req, res) => {
  try {
    const account = await User.findById(req.params._id);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }
    account.username = username || account.username;
    account.email = email || account.email;
    if()
  }
});
module.exports = router;
