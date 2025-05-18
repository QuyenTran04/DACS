const Booking = require("../models/booking");
const Tour = require("../models/Tour");
const momoConfig = require("../config/momo");
const crypto = require("crypto");
const axios = require("axios");

exports.createBooking = async (req, res) => {
  try {
    const { uid } = req.user;
    const {
      tourId,
      numberOfGuests,
      selectedDate,
      note,
      paymentMethod,
      fullName,
      phoneNumber,
      email,
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (
      !tourId ||
      !numberOfGuests ||
      !selectedDate ||
      !paymentMethod ||
      !fullName ||
      !phoneNumber ||
      !email
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra tour có tồn tại không
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại" });
    }

    const totalPrice = numberOfGuests * tour.price;

    const booking = await Booking.create({
      tourId,
      userId: uid,
      numberOfGuests,
      selectedDate,
      note,
      totalPrice,
      status: paymentMethod === "cod" ? "confirmed" : "pending",
      payment: {
        method: paymentMethod,
        status: "unpaid",
      },
      contactInfo: {
        fullName,
        phoneNumber,
        email,
      },
    });

    // Nếu thanh toán qua Momo
    if (paymentMethod === "momo") {
      const orderId = `${booking._id}-${Date.now()}`;
      const requestId = orderId;
      const orderInfo = `Thanh toán tour ${tour.title}`;
      const amount = String(totalPrice); // Đảm bảo là chuỗi
      const extraData = "";

      const ipnUrl = `${process.env.SERVER_URL}/api/payment/momo-ipn`;
      const redirectUrl = momoConfig.redirectUrl;

      const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

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
        redirectUrl,
        ipnUrl,
        extraData,
        requestType: "captureWallet",
        signature,
        lang: "vi",
      };

      console.log("Yêu cầu gửi đến Momo:", momoRequest);

      try {
        const momoRes = await axios.post(momoConfig.endpoint, momoRequest, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          message: "Đặt tour thành công",
          bookingId: booking._id,
          payUrl: momoRes.data.payUrl,
        });
      } catch (momoErr) {
        console.error(
          "Lỗi từ Momo:",
          momoErr.response?.data || momoErr.message
        );
        return res
          .status(500)
          .json({ message: "Gọi thanh toán Momo thất bại" });
      }
    }

    // Nếu là thanh toán COD
    return res.status(200).json({
      message: "Đặt tour thành công",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Lỗi khi tạo booking:", err);
    res.status(500).json({ message: "Lỗi khi tạo booking hoặc thanh toán" });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const { uid } = req.user;

    // Lấy danh sách booking theo userId
    const bookings = await Booking.find({ userId: uid })
      .populate("tourId", "title price image") // Lấy thêm thông tin tour
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.status(200).json({
      message: "Lấy lịch sử đặt tour thành công",
      bookings,
    });
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử booking:", err);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử đặt tour" });
  }
};