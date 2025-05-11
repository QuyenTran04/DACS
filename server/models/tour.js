const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true },
  images: [{ data: Buffer, contentType: String }],
  availableDates: [{ type: Date }],
  maxGuests: { type: Number, required: true },
  itinerary: [
    {
      time: { type: String, required: true },
      activity: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Tour || mongoose.model("Tour", tourSchema);
