const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {

    userId: { type: String, required: true },

    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    numberOfGuests: { type: Number, required: true, min: 1 },
    bookingDate: { type: Date, default: Date.now },
    selectedDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    note: { type: String, default: "" },

    contactInfo: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },


    totalPrice: { type: Number, required: true, min: 0 },
    payment: {
      method: {
        type: String,
        enum: ["momo", "vnpay", "paypal", "cod", "none"],
        default: "none",
      },
      status: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid",
      },
      transactionId: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
