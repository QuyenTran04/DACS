const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const momoConfig = require("../config/momo");
const crypto = require("crypto");
const axios = require("axios");

exports.createBookingWithMomo = async (req, res) => {
  try {
    const { tourId, userId, numberOfGuests, selectedDate, note } = req.body;
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
      status: "pending",
      payment: {
        method: "momo",
        status: "unpaid",
      },
    });
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

    res.status(200).json({
      message: "Tạo booking thành công",
      bookingId: booking._id,
      payUrl: momoRes.data.payUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi tạo booking hoặc thanh toán" });
  }
};
