const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");

exports.listUser = async (req, res) => {
    try {
        const users = await Account.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
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
};

exports.deleteUser = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account)
            return res.status(404).json({ message: "Người dùng không tồn tại!" });

        await account.deleteOne();
        res.json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};

