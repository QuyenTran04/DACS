// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc dùng SMTP riêng nếu có
  auth: {
    user: process.env.EMAIL_USER, // Tài khoản Gmail
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App password)
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Tour App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email đã gửi đến ${to}`);
  } catch (err) {
    console.error("Lỗi gửi email:", err);
  }
}

module.exports = sendEmail;
