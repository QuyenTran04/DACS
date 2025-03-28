const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/account");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");

const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await Account.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Account({
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
    const user = await Account.findOne({ email });
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
router.get("/accounts", async (req, res) => {
  try {
    const users = await Account.find().select("-password"); // Không gửi password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});


//Sua
router.put("/accounts/:id", async (req, res) => {
  const {id} = req.params;
  const { username, email, password } = req.body;

  try {
    if (!username && !email && !password) {
      return res.status(400).json({ message: "Không có dữ liệu" });
    }
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }
    if (username) account.username = username;
    if (email) account.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      account.password = await bcrypt.hash(password, salt);
    }

    await account.save();
    res.json({ message: "Cập nhật thông tin thành công!", account });
  } catch (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;

//Xoa
router.delete("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account)
      return res.status(404).json({ message: "Người dùng không tồn tại!" });

    await account.deleteOne();
    res.json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});
module.exports = router;
