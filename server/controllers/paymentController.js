const Booking = require("../models/booking");
const momoConfig = require("../config/momo");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.handleMomoIPN = async (req, res) => {

  try {
    const {
      orderId,
      resultCode,
      signature,
      amount,
      extraData,
      orderInfo,
      partnerCode,
      requestId,
      requestType,
      responseTime,
      transId,
      message, 
      orderType, 
      payType,
    } = req.body;

    // Tạo lại rawSignature để xác minh
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;


    const expectedSignature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Chữ ký không hợp lệ" });
    }

    // Nếu thanh toán thành công
    if (resultCode === 0) {
      const bookingId = orderId.split("-")[0];
      const booking = await Booking.findById(bookingId).populate("tourId");
      if (!booking) {
        return res.status(404).json({ message: "Không tìm thấy booking" });
      }

      booking.payment.status = "Thành công";
      booking.status = "Thành công"; // Cập nhật trạng thái booking
      await booking.save();
      const emailContent = `
      <h2>Hóa đơn đặt tour</h2>
      <p>Chào ${booking.contactInfo.fullName},</p>
      <p>Cảm ơn bạn đã đặt tour. Dưới đây là chi tiết hóa đơn:</p>
      <ul>
        <li><strong>Tour:</strong> ${booking.tourId.title}</li>
        <li><strong>Ngày sử dụng:</strong> ${booking.selectedDate.toLocaleDateString()}</li>
        <li><strong>Số lượng khách:</strong> ${booking.numberOfGuests}</li>
        <li><strong>Tổng tiền:</strong> ${booking.totalPrice.toLocaleString()} VND</li>
        <li><strong>Phương thức thanh toán:</strong> ${
          booking.payment.method
        }</li>
        <li><strong>Trạng thái thanh toán:</strong> ${
          booking.payment.status
        }</li>
      </ul>
      <p>Chúc bạn có một chuyến đi tuyệt vời!</p>
    `;
      await sendEmail(
        booking.contactInfo.email || booking.user?.email,
        "Xác nhận thanh toán tour thành công",
        emailContent,
        console.log("Email đã gửi thành công")
      );
      return res.status(200).json({ message: "Cập nhật trạng thái thành công" });

    } else {
      return res.status(400).json({ message: "Thanh toán thất bại" });
    }
  } catch (error) {
    console.error("Lỗi IPN:", error);
    return res.status(500).json({ message: "Lỗi xử lý IPN từ Momo" });
  }
};
