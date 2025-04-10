const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  providerId: { type: Number, ref: "Account", required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true },
  images: [{ type: String }],
  availableDates: [{ type: Date }],
  maxGuests: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tour", tourSchema);
