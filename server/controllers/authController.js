const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");


//Đăng ký user
exports.registerUser = async (req, res) => {
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
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Account.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign(
      { id: user._id, role: user.role },process.env.JWT_SECRET,{
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
