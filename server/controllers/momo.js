const axios = require("axios");
const crypto = require("crypto");
const Booking = require("../models/booking");
const momoConfig = require("../config/momo");

exports.createMomoPayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("tourId");
    if (!booking)
      return res.status(404).json({ message: "Booking không tồn tại" });

    const amount = booking.totalPrice;
    const orderId = `${booking._id}-${Date.now()}`;
    const requestId = orderId;
    const orderInfo = `Thanh toán tour ${booking.tourId.title}`;
    const extraData = "";

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode: momoConfig.partnerCode,
      accessKey: momoConfig.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData,
      requestType: "captureWallet",
      signature,
      lang: "vi",
    };

    const response = await axios.post(momoConfig.endpoint, body, {
      headers: { "Content-Type": "application/json" },
    });

    res.status(200).json({ payUrl: response.data.payUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo thanh toán Momo thất bại" });
  }
};

exports.momoIpn = async (req, res) => {
  const { resultCode, orderId, transId } = req.body;
  const bookingId = orderId.split("-")[0];

  try {
    if (resultCode === 0) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: "confirmed",
        "payment.method": "momo",
        "payment.status": "paid",
        "payment.transactionId": transId,
      });
    } else {
      await Booking.findByIdAndUpdate(bookingId, {
        "payment.method": "momo",
        "payment.status": "failed",
      });
    }

    res.status(200).json({ message: "Đã nhận IPN từ Momo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi xử lý IPN" });
  }
};
