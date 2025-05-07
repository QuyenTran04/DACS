const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, 
  country: { type: String, default: "Vietnam" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Location", locationSchema);
