const Booking = require("../models/booking");
const momoConfig = require("../config/momo");
const crypto = require("crypto");

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
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ message: "Không tìm thấy booking" });
      }

      booking.payment.status = "paid";
      booking.status = "confirmed";
      await booking.save();
        return res.status(200).json({ message: "Cập nhật trạng thái thành công" });

    } else {
      return res.status(400).json({ message: "Thanh toán thất bại" });
    }
  } catch (error) {
    console.error("Lỗi IPN:", error);
    return res.status(500).json({ message: "Lỗi xử lý IPN từ Momo" });
  }
};
