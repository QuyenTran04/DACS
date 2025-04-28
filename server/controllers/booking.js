const Booking = require("../models/booking");
const Tour = require("../models/Tour");
const momoConfig = require("../config/momo");
const crypto = require("crypto");
const axios = require("axios");

exports.createBooking = async (req, res) => {
  try {
    const { tourId, numberOfGuests, selectedDate, note, paymentMethod } = req.body;
    if (!tourId || !numberOfGuests || !selectedDate || !paymentMethod) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour không tồn tại" });

    const totalPrice = numberOfGuests * tour.price;
    const booking = await Booking.create({
      tourId,
      userId: req.user.id,
      numberOfGuests,
      selectedDate,
      note,
      totalPrice,
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      payment: {
        method: paymentMethod,
        status: paymentMethod === "cod" ? "unpaid" : "unpaid",
      },
    });

    if (paymentMethod === "momo") {
      const orderId = `${booking._id}-${Date.now()}`;
      const requestId = orderId;
      const orderInfo = `Thanh toán tour ${tour.title}`;
      const amount = totalPrice;
      const extraData = "";

      const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

      const signature = crypto
        .createHmac("sha256", momoConfig.secretKey)
        .update(rawSignature)
        .digest("hex");

      const momoRequest = {
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

      const momoRes = await axios.post(momoConfig.endpoint, momoRequest, {
        headers: { "Content-Type": "application/json" },
      });

      return res.status(200).json({
        message: "Đặt tour thành công",
        bookingId: booking._id,
        payUrl: momoRes.data.payUrl,
      });
    }

    return res.status(200).json({
      message: "Đặt tour thành công",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi tạo booking hoặc thanh toán" });
  }
};

//hủy booking
